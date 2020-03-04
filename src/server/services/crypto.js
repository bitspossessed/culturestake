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
  const signature = web3.eth.accounts.sign(str, process.env.HASH_PRIVATE_KEY);
  return signature.r;
}

export function compareHashSecret(str, hash) {
  return hashSecret(str) === hash;
}
