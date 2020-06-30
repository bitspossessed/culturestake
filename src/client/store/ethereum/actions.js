import ActionTypes from '~/client/store/ethereum/types';
import { detectMetaMask } from '~/client/services/ethereum';

export function initializeProvider() {
  return async (dispatch) => {
    const provider = await detectMetaMask();

    provider.on('accountsChanged', (accounts) => {
      dispatch({
        type: ActionTypes.ETHEREUM_ACCOUNT_CHANGED,
        meta: {
          account: accounts[0],
        },
      });
    });

    dispatch({
      type: ActionTypes.ETHEREUM_INITIALIZE,
      meta: {
        provider,
      },
    });
  };
}

export function enableAccount() {
  return async (dispatch, getStore) => {
    const { ethereum } = getStore();
    const accounts = await ethereum.provider.enable();

    dispatch({
      type: ActionTypes.ETHEREUM_ACCOUNT_CHANGED,
      meta: {
        account: accounts[0],
      },
    });
  };
}
