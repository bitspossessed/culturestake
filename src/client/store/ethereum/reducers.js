import update from 'immutability-helper';

import ActionTypes from '~/client/store/ethereum/types';

const initialState = {
  account: undefined,
  provider: null,
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
    default:
      return state;
  }
};

export default ethereumReducer;
