import ActionTypes from '~/client/store/vote/types';
import { getAccount, removePrivateKey } from '~/client/services/wallet';

export const VOTE_ACCOUNT_NAME = 'vote';

export function initializeVote(voteData) {
  const { address } = getAccount(VOTE_ACCOUNT_NAME);

  return {
    type: ActionTypes.VOTE_INITIALIZE,
    meta: {
      address,
      ...voteData,
    },
  };
}

export function resetVote() {
  removePrivateKey(VOTE_ACCOUNT_NAME);

  return {
    type: ActionTypes.VOTE_RESET,
  };
}
