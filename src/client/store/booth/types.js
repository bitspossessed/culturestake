import createTypes from 'redux-create-action-types';

export default createTypes(
  'BOOTH_INITIALIZE',
  'BOOTH_RESET',
  'BOOTH_UPDATE_STATUS',
  'BOOTH_VOTE_FAILURE',
  'BOOTH_VOTE_REQUEST',
  'BOOTH_VOTE_SUCCESS',
);
