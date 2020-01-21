require('dotenv').config();

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: process.env.DATABASE_DIALECT || 'postgres',
  timezone: '+00:00',
};
