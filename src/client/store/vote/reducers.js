import update from 'immutability-helper';

import ActionTypes from '~/client/store/vote/types';

const initialState = {
  address: null,
  boothSignature: null,
  festivalAnswerIds: [],
  festivalQuestionId: null,
  nonce: 0,
};

const voteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.VOTE_INITIALIZE:
      return update(state, {
        address: { $set: action.meta.address },
        boothSignature: { $set: action.meta.boothSignature },
        festivalAnswerIds: { $set: action.meta.festivalAnswerIds },
        festivalQuestionId: { $set: action.meta.festivalQuestionId },
        nonce: { $set: action.meta.nonce },
      });
    case ActionTypes.VOTE_RESET:
      return update(state, { $set: initialState });
    default:
      return state;
  }
};

export default voteReducer;
