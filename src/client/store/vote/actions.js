import ActionTypes from '~/client/store/vote/types';
import { getAccount, removePrivateKey } from '~/client/services/wallet';
import { postRequest } from '~/client/store/api/actions';

export const VOTE_ACCOUNT_NAME = 'vote';

export function initializeVote(voteData) {
  return (dispatch) => {
    dispatch(resetVote());

    const { address } = getAccount(VOTE_ACCOUNT_NAME, true);

    dispatch({
      type: ActionTypes.VOTE_INITIALIZE,
      meta: {
        address,
        ...voteData,
      },
    });
  };
}

export function vote(voteData, requestId) {
  return postRequest({
    path: ['votes'],
    body: voteData,
    id: requestId,
  });
}

export function resetVote() {
  removePrivateKey(VOTE_ACCOUNT_NAME);

  return {
    type: ActionTypes.VOTE_RESET,
  };
}
