const app = require('./app');
const { sequelize, initializeDatabase } = require('./config/db');
const { logger } = require('./config/logger');
const config = require('./config/env');

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 IMTR School Management System server running on port ${config.port}`);
      logger.info(`📚 API Documentation available at http://localhost:${config.port}/docs`);
      logger.info(`🏥 Health check available at http://localhost:${config.port}/health`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        
        sequelize.close().then(() => {
          logger.info('Database connection closed');
          process.exit(0);
        }).catch((err) => {
          logger.error('Error closing database connection:', err);
          process.exit(1);
        });
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
