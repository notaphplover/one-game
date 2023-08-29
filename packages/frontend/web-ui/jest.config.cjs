/** @type {!import("@jest/types").Config.InitialOptions} */
module.exports = {
  rootDir: '.',
  roots: ['<rootDir>'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  transform: { '\\.[jt]sx?$': 'babel-jest' },
};
