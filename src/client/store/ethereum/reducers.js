import update from 'immutability-helper';

import ActionTypes from '~/client/store/ethereum/types';

const initialTransactionState = {
  isError: false,
  isPending: true,
  isSuccess: false,
  txHash: null,
};

const initialState = {
  account: undefined,
  hasProvider: false,
  isOwner: false,
  transactions: {},
};

const ethereumReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ETHEREUM_INITIALIZE:
      return update(state, {
        hasProvider: { $set: action.meta.hasProvider },
      });
    case ActionTypes.ETHEREUM_ACCOUNT_CHANGED:
      return update(state, {
        account: { $set: action.meta.account },
        isOwner: { $set: action.meta.isOwner },
      });
    case ActionTypes.ETHEREUM_TRANSACTIONS_ADD:
      return update(state, {
        transactions: {
          $merge: {
            [action.meta.id]: Object.assign({}, initialTransactionState, {
              txHash: action.meta.txHash,
            }),
          },
        },
      });
    case ActionTypes.ETHEREUM_TRANSACTIONS_UPDATE: {
      return update(state, {
        transactions: {
          $merge: {
            [action.meta.id]: Object.assign(
              {},
              state.transactions[action.meta.id],
              {
                isError: action.meta.isError,
                isPending: action.meta.isPending,
                isSuccess: action.meta.isSuccess,
              },
            ),
          },
        },
      });
    }
    default:
      return state;
  }
};

export default ethereumReducer;
