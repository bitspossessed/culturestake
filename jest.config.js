module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src$1',
  },
  setupFilesAfterEnv: ['./jest.setup.js']
};
