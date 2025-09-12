const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');

/**
 * Generate a unique UUID
 * @returns {string} - UUID string
 */
const generateUUID = () => {
  return uuidv4();
};

/**
 * Generate student ID in format STU######
 * @param {number} sequence - Sequence number
 * @returns {string} - Student ID
 */
const generateStudentId = (sequence) => {
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `STU${paddedSequence}`;
};

/**
 * Generate lecturer ID in format LEC######
 * @param {number} sequence - Sequence number
 * @returns {string} - Lecturer ID
 */
const generateLecturerId = (sequence) => {
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `LEC${paddedSequence}`;
};

/**
 * Generate course code in format ABC123
 * @param {string} subject - Subject abbreviation (3 letters)
 * @param {number} sequence - Sequence number
 * @returns {string} - Course code
 */
const generateCourseCode = (subject, sequence) => {
  const subjectCode = subject.substring(0, 3).toUpperCase();
  const paddedSequence = sequence.toString().padStart(3, '0');
  return `${subjectCode}${paddedSequence}`;
};

/**
 * Generate invoice number in format INV-YYYY-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Invoice number
 */
const generateInvoiceNumber = (sequence) => {
  const year = dayjs().format('YYYY');
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `INV-${year}-${paddedSequence}`;
};

/**
 * Generate payment reference in format PAY-YYYY-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Payment reference
 */
const generatePaymentReference = (sequence) => {
  const year = dayjs().format('YYYY');
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `PAY-${year}-${paddedSequence}`;
};

/**
 * Generate library item barcode in format LIB-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Library barcode
 */
const generateLibraryBarcode = (sequence) => {
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `LIB-${paddedSequence}`;
};

/**
 * Generate research project ID in format RSP-YYYY-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Research project ID
 */
const generateResearchProjectId = (sequence) => {
  const year = dayjs().format('YYYY');
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `RSP-${year}-${paddedSequence}`;
};

/**
 * Generate exam card number in format EXM-YYYY-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Exam card number
 */
const generateExamCardNumber = (sequence) => {
  const year = dayjs().format('YYYY');
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `EXM-${year}-${paddedSequence}`;
};

/**
 * Generate admission number in format ADM-YYYY-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Admission number
 */
const generateAdmissionNumber = (sequence) => {
  const year = dayjs().format('YYYY');
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `ADM-${year}-${paddedSequence}`;
};

/**
 * Generate clearance certificate number in format CLR-YYYY-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Clearance certificate number
 */
const generateClearanceNumber = (sequence) => {
  const year = dayjs().format('YYYY');
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `CLR-${year}-${paddedSequence}`;
};

/**
 * Generate transcript number in format TRN-YYYY-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Transcript number
 */
const generateTranscriptNumber = (sequence) => {
  const year = dayjs().format('YYYY');
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `TRN-${year}-${paddedSequence}`;
};

/**
 * Generate notification ID in format NOT-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Notification ID
 */
const generateNotificationId = (sequence) => {
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `NOT-${paddedSequence}`;
};

/**
 * Generate audit log ID in format AUD-######
 * @param {number} sequence - Sequence number
 * @returns {string} - Audit log ID
 */
const generateAuditLogId = (sequence) => {
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `AUD-${paddedSequence}`;
};

/**
 * Generate M-Pesa transaction reference
 * @returns {string} - M-Pesa transaction reference
 */
const generateMpesaReference = () => {
  const timestamp = dayjs().format('YYYYMMDDHHmmss');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MP${timestamp}${random}`;
};

/**
 * Generate temporary password
 * @param {number} length - Password length (default: 8)
 * @returns {string} - Temporary password
 */
const generateTemporaryPassword = (length = 8) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

/**
 * Generate verification code
 * @param {number} length - Code length (default: 6)
 * @returns {string} - Verification code
 */
const generateVerificationCode = (length = 6) => {
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  
  return code;
};

/**
 * Generate session ID
 * @returns {string} - Session ID
 */
const generateSessionId = () => {
  return `SES-${uuidv4().replace(/-/g, '').toUpperCase()}`;
};

/**
 * Generate API key
 * @returns {string} - API key
 */
const generateApiKey = () => {
  const prefix = 'IMTR';
  const random = uuidv4().replace(/-/g, '').toUpperCase();
  return `${prefix}-${random}`;
};

/**
 * Generate webhook signature
 * @param {string} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {string} - Webhook signature
 */
const generateWebhookSignature = (payload, secret) => {
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
};

/**
 * Validate ID format
 * @param {string} id - ID to validate
 * @param {string} type - ID type (student, lecturer, course, etc.)
 * @returns {boolean} - True if valid
 */
const validateIdFormat = (id, type) => {
  const patterns = {
    student: /^STU\d{6}$/,
    lecturer: /^LEC\d{6}$/,
    course: /^[A-Z]{3}\d{3}$/,
    invoice: /^INV-\d{4}-\d{6}$/,
    payment: /^PAY-\d{4}-\d{6}$/,
    library: /^LIB-\d{6}$/,
    research: /^RSP-\d{4}-\d{6}$/,
    exam: /^EXM-\d{4}-\d{6}$/,
    admission: /^ADM-\d{4}-\d{6}$/,
    clearance: /^CLR-\d{4}-\d{6}$/,
    transcript: /^TRN-\d{4}-\d{6}$/,
    notification: /^NOT-\d{6}$/,
    audit: /^AUD-\d{6}$/
  };

  const pattern = patterns[type];
  return pattern ? pattern.test(id) : false;
};

/**
 * Extract sequence number from ID
 * @param {string} id - ID string
 * @returns {number|null} - Sequence number or null
 */
const extractSequenceFromId = (id) => {
  const match = id.match(/\d{6}$/);
  return match ? parseInt(match[0]) : null;
};

module.exports = {
  generateUUID,
  generateStudentId,
  generateLecturerId,
  generateCourseCode,
  generateInvoiceNumber,
  generatePaymentReference,
  generateLibraryBarcode,
  generateResearchProjectId,
  generateExamCardNumber,
  generateAdmissionNumber,
  generateClearanceNumber,
  generateTranscriptNumber,
  generateNotificationId,
  generateAuditLogId,
  generateMpesaReference,
  generateTemporaryPassword,
  generateVerificationCode,
  generateSessionId,
  generateApiKey,
  generateWebhookSignature,
  validateIdFormat,
  extractSequenceFromId
};
