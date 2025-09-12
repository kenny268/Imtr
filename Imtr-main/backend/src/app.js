const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const config = require('./config/env');
const { logger, addRequestId, requestLogger, errorLogger } = require('./config/logger');
const { corsMiddleware, handlePreflight } = require('./middleware/cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

// Create Express app
const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(corsMiddleware);
app.use(handlePreflight);

// Request ID and logging middleware
app.use(addRequestId);
app.use(requestLogger);

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser(config.cookie.secret));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IMTR School Management System API',
      version: '1.0.0',
      description: 'API documentation for IMTR School Management System',
      contact: {
        name: 'IMTR Development Team',
        email: 'dev@imtr.ac.ke'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken'
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ]
  },
  apis: ['./src/modules/*/*.js', './src/routes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'IMTR School Management API'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'IMTR School Management System is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: config.nodeEnv
  });
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorLogger);
app.use(globalErrorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
