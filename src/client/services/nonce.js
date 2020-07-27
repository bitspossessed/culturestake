import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/client/utils/storage';

const INITIAL_NONCE = 0;
const STORAGE_NAME = 'boothNonce';

export function getNonce() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasItem(STORAGE_NAME)) {
    return getItem(STORAGE_NAME);
  } else {
    setNonce(INITIAL_NONCE);
    return INITIAL_NONCE;
  }
}

function setNonce(nonce) {
  setItem(STORAGE_NAME, nonce);
}

export function removeNonce() {
  removeItem(STORAGE_NAME);
}
