import update from 'immutability-helper';

import ActionTypes from '~/client/store/ethereum/types';

const initialTransactionState = {
  isError: false,
  isPending: false,
  isSuccess: false,
  txHash: null,
};

const initialState = {
  account: undefined,
  provider: null,
  transactions: {},
};

const ethereumReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ETHEREUM_INITIALIZE:
      return update(state, {
        provider: { $set: action.meta.provider },
      });
    case ActionTypes.ETHEREUM_ACCOUNT_CHANGED:
      return update(state, {
        account: { $set: action.meta.account },
      });
    case ActionTypes.ETHEREUM_TRANSACTIONS_ADD:
      return update(state, {
        transactions: {
          [action.meta.id]: {
            $set: Object.assign({}, initialTransactionState, {
              txHash: action.meta.txHash,
            }),
          },
        },
      });
    case ActionTypes.ETHEREUM_TRANSACTIONS_UPDATE: {
      return update(state, {
        transactions: {
          [action.meta.id]: {
            $set: Object.assign({}, initialTransactionState, {
              isError: action.meta.isError,
              isPending: action.meta.isPending,
              isSuccess: action.meta.isSuccess,
            }),
          },
        },
      });
    }
    default:
      return state;
  }
};

export default ethereumReducer;
