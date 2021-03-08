import createTypes from 'redux-create-action-types';

export default createTypes(
  'ETHEREUM_ACCOUNT_CHANGED',
  'ETHEREUM_ACCOUNT_FAILURE',
  'ETHEREUM_INITIALIZE',
  'ETHEREUM_TRANSACTIONS_ADD',
  'ETHEREUM_TRANSACTIONS_UPDATE',
);
