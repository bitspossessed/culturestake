import dotenv from 'dotenv';

import web3 from '~/common/services/web3';

import {
  compareHashSecret,
  generateHashSecret,
} from '~/server/services/crypto';

describe('Crypto service', () => {
  let str;

  beforeAll(() => {
    // We have to manually import the .env variables for this test
    dotenv.config();
  });

  beforeEach(() => {
    str = 'juppi puppi 2000';
  });

  describe('generateHashSecret', () => {
    it('should non-deterministcally generate a hash', () => {
      const { hash, secret } = generateHashSecret(str);

      expect(hash).not.toBe(generateHashSecret(str).hash);
      expect(hash.length).toBe(66);
      expect(secret.length).toBe(64);
      expect(web3.utils.isHexStrict(hash)).toBeTruthy();
    });
  });

  describe('compareHashSecret', () => {
    it('should correctly indicate if the hash input is correct', () => {
      const { hash, secret } = generateHashSecret(str);
      const { hash: anotherHash } = generateHashSecret(str);

      expect(compareHashSecret(secret, hash)).toBeTruthy();
      expect(compareHashSecret(secret, anotherHash)).toBeFalsy();
      expect(compareHashSecret(secret + 'ha', hash)).toBeFalsy();
    });
  });
});
