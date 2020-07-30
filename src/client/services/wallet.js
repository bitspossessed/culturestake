import web3 from '~/common/services/web3';
import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/client/utils/storage';

const STORAGE_NAME = 'privateKey';

function getName(name) {
  if (!name) {
    throw new Error('`name` is not set');
  }

  return `${STORAGE_NAME}-${name}`;
}

function generatePrivateKey() {
  const { privateKey } = web3.eth.accounts.create();
  return privateKey;
}

function setPrivateKey(name, privateKey) {
  setItem(getName(name), privateKey);
}

export function getPrivateKey(name) {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  const storageKey = getName(name);

  if (hasItem(storageKey)) {
    return getItem(storageKey);
  } else {
    const privateKey = generatePrivateKey();
    setPrivateKey(name, privateKey);
    return privateKey;
  }
}

export function removePrivateKey(name) {
  removeItem(getName(name));
}

// Always returns a wallet, when it does not exist yet it
// will create one automatically
export function getAccount(name) {
  const privateKey = getPrivateKey(name);
  return web3.eth.accounts.privateKeyToAccount(privateKey);
}
