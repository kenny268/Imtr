const { Invoice, Payment, InvoiceItem, Student, Program, FeeStructure, Enrollment, ClassSection, Course } = require('../../models');
const { sendSuccess, sendError } = require('../../utils/responses');
const { asyncHandler } = require('../../middleware/errorHandler');
const { Op } = require('sequelize');

/**
 * @swagger
 * /finance/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, overdue, cancelled]
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of invoices
 */
const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, student_id, search } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) whereClause.status = status;
  if (student_id) whereClause.student_id = student_id;
  if (search) {
    whereClause[Op.or] = [
      { invoice_number: { [Op.like]: `%${search}%` } },
      { notes: { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows: invoices } = await Invoice.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Student,
        as: 'student',
        include: [
          {
            model: require('../../models').User,
            as: 'user',
            include: [
              {
                model: require('../../models').Profile,
                as: 'profile',
                attributes: ['first_name', 'last_name', 'phone']
              }
            ]
          }
        ]
      },
      {
        model: InvoiceItem,
        as: 'items'
      },
      {
        model: Payment,
        as: 'payments'
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  const pagination = {
    current_page: parseInt(page),
    total_pages: Math.ceil(count / limit),
    total_items: count,
    items_per_page: parseInt(limit)
  };

  return sendSuccess(res, { invoices, pagination }, 'Invoices retrieved successfully');
});

/**
 * @swagger
 * /finance/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 */
const getInvoiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invoice = await Invoice.findByPk(id, {
    include: [
      {
        model: Student,
        as: 'student',
        include: [
          {
            model: require('../../models').User,
            as: 'user',
            include: [
              {
                model: require('../../models').Profile,
                as: 'profile',
                attributes: ['first_name', 'last_name', 'phone', 'email']
              }
            ]
          }
        ]
      },
      {
        model: InvoiceItem,
        as: 'items'
      },
      {
        model: Payment,
        as: 'payments',
        order: [['paid_at', 'DESC']]
      }
    ]
  });

  if (!invoice) {
    return sendError(res, 'Invoice not found', 404);
  }

  return sendSuccess(res, invoice, 'Invoice retrieved successfully');
});

/**
 * @swagger
 * /finance/invoices:
 *   post:
 *     summary: Create new invoice
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - items
 *               - due_date
 *             properties:
 *               student_id:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: string
 *                     amount_kes:
 *                       type: number
 *                     description:
 *                       type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Validation error
 */
const createInvoice = asyncHandler(async (req, res) => {
  const { student_id, items, due_date, notes } = req.body;

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  // Calculate total
  const total_kes = items.reduce((sum, item) => sum + parseFloat(item.amount_kes), 0);

  // Create invoice
  const invoice = await Invoice.create({
    student_id,
    invoice_number: invoiceNumber,
    total_kes,
    due_date,
    notes,
    status: 'pending'
  });

  // Create invoice items
  const invoiceItems = await Promise.all(
    items.map(item =>
      InvoiceItem.create({
        invoice_id: invoice.id,
        item: item.item,
        amount_kes: item.amount_kes,
        description: item.description
      })
    )
  );

  // Fetch complete invoice with relations
  const completeInvoice = await Invoice.findByPk(invoice.id, {
    include: [
      {
        model: Student,
        as: 'student',
        include: [
          {
            model: require('../../models').User,
            as: 'user',
            include: [
              {
                model: require('../../models').Profile,
                as: 'profile',
                attributes: ['first_name', 'last_name', 'phone']
              }
            ]
          }
        ]
      },
      {
        model: InvoiceItem,
        as: 'items'
      }
    ]
  });

  return sendSuccess(res, completeInvoice, 'Invoice created successfully', 201);
});

/**
 * @swagger
 * /finance/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           enum: [mpesa, card, bank_transfer, cash]
 *     responses:
 *       200:
 *         description: List of payments
 */
const getPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, method, search } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) whereClause.status = status;
  if (method) whereClause.method = method;
  if (search) {
    whereClause[Op.or] = [
      { transaction_id: { [Op.like]: `%${search}%` } },
      { mpesa_ref: { [Op.like]: `%${search}%` } },
      { notes: { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows: payments } = await Payment.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Invoice,
        as: 'invoice',
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: require('../../models').User,
                as: 'user',
                include: [
                  {
                    model: require('../../models').Profile,
                    as: 'profile',
                    attributes: ['first_name', 'last_name', 'phone']
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['paid_at', 'DESC']]
  });

  const pagination = {
    current_page: parseInt(page),
    total_pages: Math.ceil(count / limit),
    total_items: count,
    items_per_page: parseInt(limit)
  };

  return sendSuccess(res, { payments, pagination }, 'Payments retrieved successfully');
});

/**
 * @swagger
 * /finance/payments:
 *   post:
 *     summary: Record new payment
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice_id
 *               - amount_kes
 *               - method
 *               - paid_at
 *             properties:
 *               invoice_id:
 *                 type: integer
 *               amount_kes:
 *                 type: number
 *               method:
 *                 type: string
 *                 enum: [mpesa, card, bank_transfer, cash]
 *               mpesa_ref:
 *                 type: string
 *               transaction_id:
 *                 type: string
 *               paid_at:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *       400:
 *         description: Validation error
 */
const createPayment = asyncHandler(async (req, res) => {
  const { invoice_id, amount_kes, method, mpesa_ref, transaction_id, paid_at, notes } = req.body;

  // Verify invoice exists
  const invoice = await Invoice.findByPk(invoice_id);
  if (!invoice) {
    return sendError(res, 'Invoice not found', 404);
  }

  // Create payment
  const payment = await Payment.create({
    invoice_id,
    amount_kes,
    method,
    mpesa_ref,
    transaction_id,
    paid_at: new Date(paid_at),
    status: 'completed',
    notes
  });

  // Update invoice status if fully paid
  const totalPaid = await Payment.sum('amount_kes', {
    where: { invoice_id, status: 'completed' }
  });

  if (totalPaid >= invoice.total_kes) {
    await invoice.update({ status: 'paid' });
  } else if (new Date() > new Date(invoice.due_date)) {
    await invoice.update({ status: 'overdue' });
  }

  // Fetch complete payment with relations
  const completePayment = await Payment.findByPk(payment.id, {
    include: [
      {
        model: Invoice,
        as: 'invoice',
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: require('../../models').User,
                as: 'user',
                include: [
                  {
                    model: require('../../models').Profile,
                    as: 'profile',
                    attributes: ['first_name', 'last_name', 'phone']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  return sendSuccess(res, completePayment, 'Payment recorded successfully', 201);
});

/**
 * @swagger
 * /finance/statistics:
 *   get:
 *     summary: Get financial statistics
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Financial statistics
 */
const getFinancialStatistics = asyncHandler(async (req, res) => {
  const [
    totalInvoices,
    pendingInvoices,
    paidInvoices,
    overdueInvoices,
    totalRevenue,
    monthlyRevenue,
    paymentMethods
  ] = await Promise.all([
    Invoice.count(),
    Invoice.count({ where: { status: 'pending' } }),
    Invoice.count({ where: { status: 'paid' } }),
    Invoice.count({ where: { status: 'overdue' } }),
    Payment.sum('amount_kes', { where: { status: 'completed' } }),
    Payment.sum('amount_kes', {
      where: {
        status: 'completed',
        paid_at: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    Payment.findAll({
      attributes: [
        'method',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('amount_kes')), 'total']
      ],
      where: { status: 'completed' },
      group: ['method']
    })
  ]);

  const statistics = {
    invoices: {
      total: totalInvoices,
      pending: pendingInvoices,
      paid: paidInvoices,
      overdue: overdueInvoices
    },
    revenue: {
      total: totalRevenue || 0,
      monthly: monthlyRevenue || 0
    },
    payment_methods: paymentMethods
  };

  return sendSuccess(res, statistics, 'Financial statistics retrieved successfully');
});

/**
 * @swagger
 * /finance/fee-structures:
 *   get:
 *     summary: Get fee structures
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: program_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of fee structures
 */
const getFeeStructures = asyncHandler(async (req, res) => {
  const { program_id } = req.query;

  const whereClause = { status: 'active' };
  if (program_id) whereClause.program_id = program_id;

  const feeStructures = await FeeStructure.findAll({
    where: whereClause,
    include: [
      {
        model: Program,
        as: 'program',
        attributes: ['id', 'name', 'code']
      }
    ],
    order: [['program_id', 'ASC'], ['item', 'ASC']]
  });

  return sendSuccess(res, feeStructures, 'Fee structures retrieved successfully');
});

/**
 * @swagger
 * /finance/students/{id}/fee-info:
 *   get:
 *     summary: Get student fee information and program details
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student fee information
 *       404:
 *         description: Student not found
 */
const getStudentFeeInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findByPk(id, {
    include: [
      {
        model: require('../../models').User,
        as: 'user',
        include: [
          {
            model: require('../../models').Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'phone', 'email']
          }
        ]
      },
      {
        model: Program,
        as: 'program',
        attributes: ['id', 'name', 'code', 'level', 'duration_months']
      },
      {
        model: Enrollment,
        as: 'enrollments',
        include: [
          {
            model: ClassSection,
            as: 'classSection',
            include: [
              {
                model: Course,
                as: 'course',
                attributes: ['id', 'name', 'code', 'credits']
              }
            ]
          }
        ]
      },
      {
        model: Invoice,
        as: 'invoices',
        include: [
          {
            model: InvoiceItem,
            as: 'items'
          },
          {
            model: Payment,
            as: 'payments',
            where: { status: 'completed' },
            required: false
          }
        ]
      }
    ]
  });

  if (!student) {
    return sendError(res, 'Student not found', 404);
  }

  // Get program-specific fee structures
  const feeStructures = await FeeStructure.findAll({
    where: {
      program_id: student.program_id,
      status: 'active'
    },
    order: [['is_mandatory', 'DESC'], ['item', 'ASC']]
  });

  // Calculate total paid amount
  const totalPaid = student.invoices?.reduce((total, invoice) => {
    const invoicePaid = invoice.payments?.reduce((sum, payment) => sum + parseFloat(payment.amount_kes), 0) || 0;
    return total + invoicePaid;
  }, 0) || 0;

  // Calculate total outstanding
  const totalOutstanding = student.invoices?.reduce((total, invoice) => {
    const invoicePaid = invoice.payments?.reduce((sum, payment) => sum + parseFloat(payment.amount_kes), 0) || 0;
    const invoiceTotal = parseFloat(invoice.total_kes);
    return total + (invoiceTotal - invoicePaid);
  }, 0) || 0;

  const studentFeeInfo = {
    student: {
      id: student.id,
      user: student.user,
      program: student.program,
      enrollments: student.enrollments,
      student_number: student.student_number,
      admission_date: student.admission_date,
      status: student.status
    },
    feeStructures,
    financialSummary: {
      totalPaid,
      totalOutstanding,
      totalInvoices: student.invoices?.length || 0,
      paidInvoices: student.invoices?.filter(invoice => {
        const paid = invoice.payments?.reduce((sum, payment) => sum + parseFloat(payment.amount_kes), 0) || 0;
        return paid >= parseFloat(invoice.total_kes);
      }).length || 0
    },
    recentInvoices: student.invoices?.slice(0, 5) || []
  };

  return sendSuccess(res, studentFeeInfo, 'Student fee information retrieved successfully');
});

/**
 * @swagger
 * /finance/students/{id}/generate-invoice:
 *   post:
 *     summary: Generate invoice for student based on program and enrolled courses
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fee_type:
 *                 type: string
 *                 enum: [program_fees, course_fees, custom]
 *               due_date:
 *                 type: string
 *                 format: date
 *               custom_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: string
 *                     amount_kes:
 *                       type: number
 *                     description:
 *                       type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice generated successfully
 *       400:
 *         description: Validation error
 */
const generateStudentInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fee_type, due_date, custom_items, notes } = req.body;

  // Get student with program and enrollment info
  const student = await Student.findByPk(id, {
    include: [
      {
        model: Program,
        as: 'program'
      },
      {
        model: Enrollment,
        as: 'enrollments',
        include: [
          {
            model: ClassSection,
            as: 'classSection',
            include: [
              {
                model: Course,
                as: 'course'
              }
            ]
          }
        ]
      }
    ]
  });

  if (!student) {
    return sendError(res, 'Student not found', 404);
  }

  let invoiceItems = [];

  if (fee_type === 'program_fees') {
    // Get program-specific fees
    const feeStructures = await FeeStructure.findAll({
      where: {
        program_id: student.program_id,
        status: 'active',
        is_mandatory: true
      }
    });

    invoiceItems = feeStructures.map(fee => ({
      item: fee.item,
      amount_kes: fee.amount_kes,
      description: fee.description || `Program fee for ${student.program.name}`
    }));
  } else if (fee_type === 'course_fees') {
    // Generate fees based on enrolled courses
    const enrolledCourses = student.enrollments?.map(enrollment => enrollment.classSection.course) || [];
    
    invoiceItems = enrolledCourses.map(course => ({
      item: `${course.name} (${course.code})`,
      amount_kes: course.credits * 1000, // Assuming 1000 KES per credit
      description: `Course fee for ${course.name} - ${course.credits} credits`
    }));
  } else if (fee_type === 'custom' && custom_items) {
    invoiceItems = custom_items;
  }

  if (invoiceItems.length === 0) {
    return sendError(res, 'No items to invoice', 400);
  }

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  // Calculate total
  const total_kes = invoiceItems.reduce((sum, item) => sum + parseFloat(item.amount_kes), 0);

  // Create invoice
  const invoice = await Invoice.create({
    student_id: student.id,
    invoice_number: invoiceNumber,
    total_kes,
    due_date,
    notes: notes || `Generated invoice for ${student.user.profile.first_name} ${student.user.profile.last_name}`,
    status: 'pending'
  });

  // Create invoice items
  const createdItems = await Promise.all(
    invoiceItems.map(item =>
      InvoiceItem.create({
        invoice_id: invoice.id,
        item: item.item,
        amount_kes: item.amount_kes,
        description: item.description
      })
    )
  );

  // Fetch complete invoice with relations
  const completeInvoice = await Invoice.findByPk(invoice.id, {
    include: [
      {
        model: Student,
        as: 'student',
        include: [
          {
            model: require('../../models').User,
            as: 'user',
            include: [
              {
                model: require('../../models').Profile,
                as: 'profile',
                attributes: ['first_name', 'last_name', 'phone']
              }
            ]
          }
        ]
      },
      {
        model: InvoiceItem,
        as: 'items'
      }
    ]
  });

  return sendSuccess(res, completeInvoice, 'Invoice generated successfully', 201);
});

/**
 * @swagger
 * /finance/fee-structures:
 *   post:
 *     summary: Create a new fee structure
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - program_id
 *               - item
 *               - amount_kes
 *             properties:
 *               program_id:
 *                 type: integer
 *               item:
 *                 type: string
 *               amount_kes:
 *                 type: number
 *               description:
 *                 type: string
 *               is_mandatory:
 *                 type: boolean
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Fee structure created successfully
 *       400:
 *         description: Validation error
 */
const createFeeStructure = asyncHandler(async (req, res) => {
  const { program_id, item, amount_kes, description, is_mandatory, due_date, status } = req.body;

  const feeStructure = await FeeStructure.create({
    program_id,
    item,
    amount_kes,
    description,
    is_mandatory: is_mandatory !== undefined ? is_mandatory : true,
    due_date,
    status: status || 'active'
  });

  const completeFeeStructure = await FeeStructure.findByPk(feeStructure.id, {
    include: [
      {
        model: Program,
        as: 'program',
        attributes: ['id', 'name', 'code']
      }
    ]
  });

  return sendSuccess(res, completeFeeStructure, 'Fee structure created successfully', 201);
});

/**
 * @swagger
 * /finance/fee-structures/{id}:
 *   put:
 *     summary: Update a fee structure
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *               amount_kes:
 *                 type: number
 *               description:
 *                 type: string
 *               is_mandatory:
 *                 type: boolean
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Fee structure updated successfully
 *       404:
 *         description: Fee structure not found
 */
const updateFeeStructure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const feeStructure = await FeeStructure.findByPk(id);
  if (!feeStructure) {
    return sendError(res, 'Fee structure not found', 404);
  }

  await feeStructure.update(updateData);

  const updatedFeeStructure = await FeeStructure.findByPk(id, {
    include: [
      {
        model: Program,
        as: 'program',
        attributes: ['id', 'name', 'code']
      }
    ]
  });

  return sendSuccess(res, updatedFeeStructure, 'Fee structure updated successfully');
});

/**
 * @swagger
 * /finance/fee-structures/{id}:
 *   delete:
 *     summary: Delete a fee structure
 *     tags: [Finance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fee structure deleted successfully
 *       404:
 *         description: Fee structure not found
 */
const deleteFeeStructure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feeStructure = await FeeStructure.findByPk(id);
  if (!feeStructure) {
    return sendError(res, 'Fee structure not found', 404);
  }

  await feeStructure.destroy();

  return sendSuccess(res, null, 'Fee structure deleted successfully');
});

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  getPayments,
  createPayment,
  getFinancialStatistics,
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getStudentFeeInfo,
  generateStudentInvoice
};
