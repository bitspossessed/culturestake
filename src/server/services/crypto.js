import bcrypt from 'bcrypt';

const HASH_SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return await bcrypt.hash(password, HASH_SALT_ROUNDS);
}

export async function comparePasswords(password, hash) {
  return await bcrypt.compare(password, hash);
}
