import bcrypt from 'bcrypt';

import web3 from '~/common/services/web3';

const HASH_SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return await bcrypt.hash(password, HASH_SALT_ROUNDS);
}

export async function comparePasswords(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function hashSecret(str) {
  // We generate a keyed hash for all data instances
  // to identify them on the blockchain without leaking
  // any data / to keep them private.
  const { signature } = web3.eth.accounts.sign(
    str,
    process.env.HASH_PRIVATE_KEY,
  );

  return signature;
}

export function compareHashSecret(str, hash) {
  return hashSecret(str) === hash;
}

export function validateHashSecret(str, hash, address) {
  const recoveredAddress = web3.eth.accounts.recover(str, hash);

  return recoveredAddress === address;
}

export function hashSecretAddress() {
  const { address } = web3.eth.accounts.privateKeyToAccount(
    process.env.HASH_PRIVATE_KEY,
  );

  return address;
}
