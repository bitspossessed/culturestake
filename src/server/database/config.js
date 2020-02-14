require('dotenv').config();

let url = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'test') {
  if (process.env.DATABASE_TEST_URL) {
    url = process.env.DATABASE_TEST_URL;
  } else {
    throw new Error('DATABASE_TEST_URL is not set for test environment');
  }
}

module.exports = {
  url,
  dialect: process.env.DATABASE_DIALECT || 'postgres',
  timezone: '+00:00',
};
