const express = require('express');
const router = express.Router();

const {
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
  generateStudentInvoice,
  generateProgramInvoices
} = require('./finance.controller');

const { validate } = require('../../middleware/validate');
const { authenticateToken } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const {
  createInvoiceSchema,
  updateInvoiceSchema,
  createPaymentSchema,
  getInvoicesSchema,
  getPaymentsSchema,
  getFeeStructuresSchema,
  createFeeStructureSchema,
  updateFeeStructureSchema
} = require('./finance.validation');

// Apply authentication to all routes
router.use(authenticateToken);

// Financial Statistics
router.get('/statistics',
  requirePermission('finance:read'),
  getFinancialStatistics
);

// Invoice Management
router.get('/invoices',
  requirePermission('finance:read'),
  validate(getInvoicesSchema, 'query'),
  getInvoices
);

router.get('/invoices/:id',
  requirePermission('finance:read'),
  getInvoiceById
);

router.post('/invoices',
  requirePermission('finance:write'),
  validate(createInvoiceSchema, 'body'),
  createInvoice
);

// Payment Management
router.get('/payments',
  requirePermission('finance:read'),
  validate(getPaymentsSchema, 'query'),
  getPayments
);

router.post('/payments',
  requirePermission('finance:write'),
  validate(createPaymentSchema, 'body'),
  createPayment
);

// Fee Structures
router.get('/fee-structures',
  requirePermission('finance:read'),
  validate(getFeeStructuresSchema, 'query'),
  getFeeStructures
);

router.post('/fee-structures',
  authenticateToken,
  requirePermission('finance:write'),
  validate(createFeeStructureSchema, 'body'),
  createFeeStructure
);

router.put('/fee-structures/:id',
  authenticateToken,
  requirePermission('finance:write'),
  validate(updateFeeStructureSchema, 'body'),
  updateFeeStructure
);

router.delete('/fee-structures/:id',
  authenticateToken,
  requirePermission('finance:write'),
  deleteFeeStructure
);

// Student-specific finance routes
router.get('/students/:id/fee-info',
  authenticateToken,
  requirePermission('finance:read'),
  getStudentFeeInfo
);

router.post('/students/:id/generate-invoice',
  authenticateToken,
  requirePermission('finance:write'),
  generateStudentInvoice
);

// Program-level invoice generation
router.post('/programs/:id/generate-invoices',
  authenticateToken,
  requirePermission('finance:write'),
  generateProgramInvoices
);

module.exports = router;
