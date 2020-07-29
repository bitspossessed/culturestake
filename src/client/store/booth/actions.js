import ActionTypes from '~/client/store/booth/types';
import { getAccount, removePrivateKey } from '~/client/services/wallet';
import { getNonce, removeNonce } from '~/client/services/nonce';
import { getVotingBooth } from '~/common/services/contracts/booths';

export function initializeBooth() {
  const nonce = getNonce();
  const { address } = getAccount();

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

export function resetBooth() {
  removePrivateKey();
  removeNonce();

  return {
    type: ActionTypes.BOOTH_RESET,
  };
}
