import web3 from '~/common/services/web3';
import {
  compareHashSecret,
  generateHashSecret,
  generateRandomString,
} from '~/server/services/crypto';
import { closeRedis } from '~/server/services/redis';

afterAll(async () => {
  // Workaround to give web3 provider time for async imports (otherwise jest
  // will throw an error as all the tests here are sync):
  await new Promise((resolve) => setTimeout(resolve, 100));

  await closeRedis();
});

describe('Crypto service', () => {
  let str;

  beforeEach(() => {
    str = 'juppi puppi 2000';
  });

  describe('generateHashSecret', () => {
    it('should generate a hash and return the secret input', () => {
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

  describe('generateRandomString', () => {
    it('should generate a random string', () => {
      const len = 8;
      const randomStr = generateRandomString(len);
      const anotherRandomStr = generateRandomString(len);

      expect(randomStr.length).toBe(len);
      expect(anotherRandomStr.length).toBe(len);
      expect(randomStr).not.toBe(anotherRandomStr);
    });
  });
});
