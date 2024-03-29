/** @type {!import("@jest/types").Config.InitialOptions} */
module.exports = {
  passWithNoTests: true,
  rootDir: '.',
  roots: ['<rootDir>'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}'],
  transform: { '\\.[jt]sx?$': 'babel-jest' },
};
