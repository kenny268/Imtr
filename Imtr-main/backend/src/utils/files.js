const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const mimeTypes = require('mime-types');
const config = require('../config/env');
const { logger } = require('../config/logger');

/**
 * Configure multer for file uploads
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), config.upload.uploadPath);
    
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

/**
 * File filter function
 */
const fileFilter = (req, file, cb) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

/**
 * Multer configuration
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: fileFilter
});

/**
 * Validate file type
 * @param {string} mimetype - File MIME type
 * @returns {boolean} - True if valid
 */
const isValidFileType = (mimetype) => {
  return config.upload.allowedTypes.includes(mimetype);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @returns {boolean} - True if valid
 */
const isValidFileSize = (size) => {
  return size <= config.upload.maxFileSize;
};

/**
 * Get file extension from MIME type
 * @param {string} mimetype - File MIME type
 * @returns {string} - File extension
 */
const getFileExtension = (mimetype) => {
  return mimeTypes.extension(mimetype) || '';
};

/**
 * Generate unique filename
 * @param {string} originalname - Original filename
 * @param {string} prefix - Optional prefix
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalname, prefix = '') => {
  const extension = path.extname(originalname);
  const basename = path.basename(originalname, extension);
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  
  const filename = prefix 
    ? `${prefix}-${basename}-${timestamp}-${random}${extension}`
    : `${basename}-${timestamp}-${random}${extension}`;
    
  return filename;
};

/**
 * Process and resize image
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {object} options - Resize options
 * @returns {Promise<string>} - Processed file path
 */
const processImage = async (inputPath, outputPath, options = {}) => {
  try {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'jpeg'
    } = options;

    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    logger.error('Image processing error:', error);
    throw new Error('Image processing failed');
  }
};

/**
 * Generate thumbnail
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {number} size - Thumbnail size (default: 200)
 * @returns {Promise<string>} - Thumbnail file path
 */
const generateThumbnail = async (inputPath, outputPath, size = 200) => {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    logger.error('Thumbnail generation error:', error);
    throw new Error('Thumbnail generation failed');
  }
};

/**
 * Delete file
 * @param {string} filePath - File path to delete
 * @returns {Promise<boolean>} - True if deleted successfully
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    logger.error('File deletion error:', error);
    return false;
  }
};

/**
 * Check if file exists
 * @param {string} filePath - File path to check
 * @returns {Promise<boolean>} - True if file exists
 */
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get file stats
 * @param {string} filePath - File path
 * @returns {Promise<object>} - File stats
 */
const getFileStats = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    logger.error('File stats error:', error);
    throw new Error('Failed to get file stats');
  }
};

/**
 * Create directory
 * @param {string} dirPath - Directory path
 * @returns {Promise<boolean>} - True if created successfully
 */
const createDirectory = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    logger.error('Directory creation error:', error);
    return false;
  }
};

/**
 * Read file content
 * @param {string} filePath - File path
 * @returns {Promise<Buffer>} - File content
 */
const readFile = async (filePath) => {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    logger.error('File read error:', error);
    throw new Error('Failed to read file');
  }
};

/**
 * Write file content
 * @param {string} filePath - File path
 * @param {Buffer|string} content - File content
 * @returns {Promise<boolean>} - True if written successfully
 */
const writeFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content);
    return true;
  } catch (error) {
    logger.error('File write error:', error);
    return false;
  }
};

/**
 * Copy file
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 * @returns {Promise<boolean>} - True if copied successfully
 */
const copyFile = async (sourcePath, destPath) => {
  try {
    await fs.copyFile(sourcePath, destPath);
    return true;
  } catch (error) {
    logger.error('File copy error:', error);
    return false;
  }
};

/**
 * Move file
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 * @returns {Promise<boolean>} - True if moved successfully
 */
const moveFile = async (sourcePath, destPath) => {
  try {
    await fs.rename(sourcePath, destPath);
    return true;
  } catch (error) {
    logger.error('File move error:', error);
    return false;
  }
};

/**
 * Get file MIME type
 * @param {string} filePath - File path
 * @returns {string} - MIME type
 */
const getFileMimeType = (filePath) => {
  return mimeTypes.lookup(filePath) || 'application/octet-stream';
};

/**
 * Sanitize filename
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human readable file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file upload
 * @param {object} file - Multer file object
 * @returns {object} - Validation result
 */
const validateFileUpload = (file) => {
  const result = {
    isValid: true,
    errors: []
  };

  if (!file) {
    result.isValid = false;
    result.errors.push('No file provided');
    return result;
  }

  if (!isValidFileType(file.mimetype)) {
    result.isValid = false;
    result.errors.push(`File type ${file.mimetype} is not allowed`);
  }

  if (!isValidFileSize(file.size)) {
    result.isValid = false;
    result.errors.push(`File size ${formatFileSize(file.size)} exceeds maximum allowed size`);
  }

  return result;
};

module.exports = {
  upload,
  isValidFileType,
  isValidFileSize,
  getFileExtension,
  generateUniqueFilename,
  processImage,
  generateThumbnail,
  deleteFile,
  fileExists,
  getFileStats,
  createDirectory,
  readFile,
  writeFile,
  copyFile,
  moveFile,
  getFileMimeType,
  sanitizeFilename,
  formatFileSize,
  validateFileUpload
};
