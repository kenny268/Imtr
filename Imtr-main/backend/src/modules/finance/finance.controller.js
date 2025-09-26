const { Invoice, Payment, InvoiceItem, Student, Program, FeeStructure } = require('../../models');
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

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  getPayments,
  createPayment,
  getFinancialStatistics,
  getFeeStructures
};
