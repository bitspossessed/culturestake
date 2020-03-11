import bcrypt from 'bcrypt';

import web3 from '~/common/services/web3';

const HASH_SALT_ROUNDS = 10;
const HASH_SECRET_LENGTH = 64;

export async function hashPassword(password) {
  return await bcrypt.hash(password, HASH_SALT_ROUNDS);
}

export async function comparePasswords(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function generateHashSecret(str) {
  // We generate a salted hash for all data instances to identify them on the
  // blockchain without leaking any data / to keep them private.

  // The input string is padded with a random hex sequence to get a fixed
  // length. The input string should contain a human readable information.
  const randomStr = generateRandomString(HASH_SECRET_LENGTH);
  const inputStr = str.replace(/\s/g, '').slice(0, HASH_SECRET_LENGTH / 2);
  const randomArg = randomStr.slice(0, randomStr.length - inputStr.length);

  // Hash this secret and return both. The Hash can be used publicly, the
  // secret can be shared optionally to verify the hash.
  const secret = `${inputStr}${randomArg}`;
  const hash = web3.utils.sha3(secret);

  return { hash, secret };
}

export function compareHashSecret(secret, hash) {
  return web3.utils.sha3(secret) === hash;
}

export function generateRandomString(len) {
  return web3.utils.randomHex(len / 2).slice(2);
}
