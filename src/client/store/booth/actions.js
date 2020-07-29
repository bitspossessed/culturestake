import ActionTypes from '~/client/store/booth/types';
import translate from '~/common/services/i18n';
import { NOTIFICATION } from '~/client/middlewares/notifications';
import { NotificationsTypes } from '~/client/store/notifications/actions';
import { getAccount, removePrivateKey } from '~/client/services/wallet';
import { getNonce, removeNonce } from '~/client/services/nonce';
import { getVotingBooth } from '~/common/services/contracts/booths';
import { postRequest } from '~/client/store/api/actions';

export const BOOTH_ACCOUNT_NAME = 'booth';

export function initializeBooth() {
  const nonce = getNonce();
  const { address } = getAccount(BOOTH_ACCOUNT_NAME);

  return {
    type: ActionTypes.BOOTH_INITIALIZE,
    meta: {
      address,
      nonce,
    },
  };
}

export function checkBoothStatus() {
  return async (dispatch, getStore) => {
    const { booth } = getStore();

    if (!booth.address) {
      return;
    }

    const {
      festivalChainId,
      isDeactivated,
      isInitialized,
    } = await getVotingBooth(booth.address);

    if (
      booth.isDeactivated !== isDeactivated ||
      booth.isInitialized !== isInitialized
    ) {
      dispatch({
        type: ActionTypes.BOOTH_UPDATE_STATUS,
        meta: {
          festivalChainId,
          isDeactivated,
          isInitialized,
        },
      });
    }
  };
}

export function voteOnBooth(voteData) {
  return postRequest(
    {
      path: ['votes'],
      body: voteData,
    },
    {
      request: {
        type: ActionTypes.BOOTH_VOTE_REQUEST,
      },
      success: {
        type: ActionTypes.BOOTH_VOTE_SUCCESS,
        [NOTIFICATION]: {
          text: translate('booth.notificationVoteSuccess'),
        },
      },
      failure: {
        type: ActionTypes.BOOTH_VOTE_FAILURE,
        [NOTIFICATION]: {
          text: translate('booth.errorVoteFailure'),
          type: NotificationsTypes.ERROR,
        },
      },
    },
  );
}

export function resetBooth() {
  removePrivateKey(BOOTH_ACCOUNT_NAME);
  removeNonce();

  return {
    type: ActionTypes.BOOTH_RESET,
  };
}
