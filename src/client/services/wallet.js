import web3 from '~/common/services/web3';
import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/client/utils/storage';

const STORAGE_NAME = 'privateKey';

function generatePrivateKey() {
  const { privateKey } = web3.eth.accounts.create();
  return privateKey;
}

function getPrivateKey() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasItem(STORAGE_NAME)) {
    return getItem(STORAGE_NAME);
  } else {
    const privateKey = generatePrivateKey();
    setPrivateKey(privateKey);
    return privateKey;
  }
}

function setPrivateKey(privateKey) {
  setItem(STORAGE_NAME, privateKey);
}

export function removePrivateKey() {
  removeItem(STORAGE_NAME);
}

// Always returns a wallet, when it does not exist yet it
// will create one automatically
export function getAccount() {
  const privateKey = getPrivateKey();
  return web3.eth.accounts.privateKeyToAccount(privateKey);
}
