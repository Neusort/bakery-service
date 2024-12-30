require('dotenv').config();

const DATABASE_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'bakery_db',
    port: process.env.DB_PORT || '3306',
    connectionLimit: 10
  };

  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  module.exports = {
    DATABASE_CONFIG,
    JWT_SECRET
  };
