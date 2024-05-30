import projectRoot from './projectRoot.js';

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testMatch Expressions to match to test file paths
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @returns { !import("@jest/types").Config.InitialProjectOptions } Jest config
 */
function getJestProjectConfig(projectName, testMatch, testPathIgnorePatterns) {
  /** @type { !import("@jest/types").Config.InitialProjectOptions } */
  const projectConfig = {
    displayName: projectName,
    coveragePathIgnorePatterns: ['/fixtures/', '/node_modules/'],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
    rootDir: '.',
    roots: [projectRoot],
    setupFiles: ['@cornie-js/frontend-jest-config/setup'],
    testEnvironment: 'jest-environment-jsdom',
    testMatch: testMatch,
    testPathIgnorePatterns: testPathIgnorePatterns,
    transform: { '\\.[jt]sx?$': 'babel-jest' },
  };

  return projectConfig;
}

export default getJestProjectConfig;
