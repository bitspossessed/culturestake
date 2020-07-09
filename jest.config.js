module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src$1',
  },
  setupFilesAfterEnv: ['dotenv/config'],
};
