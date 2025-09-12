const { Sequelize } = require('sequelize');
const config = require('./env');
const { logger } = require('./logger');

// Create Sequelize instance
const sequelize = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.username,
  password: config.database.password,
  dialect: 'mysql',
  logging: config.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  dialectOptions: {
    charset: 'utf8mb4'
  }
  
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Import all models
    require('../models');

    // Sync database (create tables if they don't exist)
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('Database synchronized successfully');
    }

    return sequelize;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

module.exports = {
  sequelize,
  initializeDatabase,
  closeConnection,
  testConnection
};