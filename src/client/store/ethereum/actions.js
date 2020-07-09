import ActionTypes from '~/client/store/ethereum/types';
import { detectMetaMask } from '~/client/services/ethereum';

// Helper method to generate string identifier for pending transactions
export function getQueueId(txMethod, params) {
  return Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        acc.push(params[key].toString());
        return acc;
      },
      [txMethod],
    )
    .join('-');
}

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
