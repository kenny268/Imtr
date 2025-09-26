const express = require('express');
const router = express.Router();

const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  getPayments,
  createPayment,
  getFinancialStatistics,
  getFeeStructures
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
  getFeeStructuresSchema
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

module.exports = router;
