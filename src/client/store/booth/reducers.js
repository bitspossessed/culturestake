import update from 'immutability-helper';

import ActionTypes from '~/client/store/booth/types';

const initialState = {
  address: null,
  festivalChainId: null,
  isDeactivated: false,
  isInitialized: false,
};

const boothReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.BOOTH_INITIALIZE:
      return update(state, {
        address: { $set: action.meta.address },
      });
    case ActionTypes.BOOTH_UPDATE_STATUS:
      return update(state, {
        festivalChainId: { $set: action.meta.festivalChainId },
        isDeactivated: { $set: action.meta.isDeactivated },
        isInitialized: { $set: action.meta.isInitialized },
      });
    case ActionTypes.BOOTH_RESET:
      return update(state, initialState);
    default:
      return state;
  }
};

export default boothReducer;
