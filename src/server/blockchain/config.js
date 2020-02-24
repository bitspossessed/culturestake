require('dotenv').config();

const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';

module.exports = {
  rpcUrl,
};
