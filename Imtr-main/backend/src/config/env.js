require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',

  // Database Configuration
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    username: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Cookie Configuration
  cookie: {
    secret: process.env.COOKIE_SECRET || 'your-cookie-secret',
    domain: process.env.COOKIE_DOMAIN || '10.192.24.152',
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'strict'
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://10.192.24.152:3000',
    credentials: process.env.CORS_CREDENTIALS !== 'false'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    uploadPath: process.env.UPLOAD_PATH || 'uploads',
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT) || 1025,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@imtr.ac.ke'
  },

  // SMS Configuration
  sms: {
    provider: process.env.SMS_PROVIDER || 'safaricom',
    apiKey: process.env.SMS_API_KEY || '',
    shortCode: process.env.SMS_SHORT_CODE || '',
    username: process.env.SMS_USERNAME || '',
    password: process.env.SMS_PASSWORD || ''
  },

  // M-Pesa Configuration
  mpesa: {
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    passkey: process.env.MPESA_PASSKEY || '',
    shortcode: process.env.MPESA_SHORTCODE || '',
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'http://localhost:3001/api/v1/finance/mpesa/callback'
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB) || 0
  },

  // S3/MinIO Configuration
  s3: {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
    bucket: process.env.S3_BUCKET || 'imtr-files',
    region: process.env.S3_REGION || 'us-east-1'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret'
  },

  // Kenya Specific Configuration
  locale: {
    timezone: process.env.TIMEZONE || 'Africa/Nairobi',
    currency: process.env.CURRENCY || 'KES',
    dateFormat: process.env.DATE_FORMAT || 'YYYY-MM-DD',
    phoneRegion: process.env.PHONE_REGION || 'KE'
  },

  // External API Keys
  external: {
    kmdApiKey: process.env.KMD_API_KEY || '',
    wmoApiKey: process.env.WMO_API_KEY || ''
  }
};

module.exports = config;
