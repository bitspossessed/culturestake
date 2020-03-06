import web3 from '~/common/services/web3';

import {
  compareHashSecret,
  generateHashSecret,
} from '~/server/services/crypto';

describe('Crypto service', () => {
  let str;

  beforeEach(() => {
    str = 'juppi puppi 2000';
  });

  describe('generateHashSecret', () => {
    it('should non-deterministcally generate a hash', () => {
      const { hash, secret } = generateHashSecret(str);
      const { hash: anotherHash } = generateHashSecret(str);

      // It has the right format
      expect(secret.length).toBe(64);
      expect(hash.length).toBe(66);
      expect(web3.utils.isHexStrict(hash)).toBeTruthy();

      // It is non deterministic
      expect(hash).not.toBe(anotherHash);

      // It contains a human readable information
      expect(secret.includes('juppi')).toBe(true);
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
