const projectRoot = "<rootDir>";

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
    coveragePathIgnorePatterns: ["/node_modules/"],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    moduleFileExtensions: ["ts", "js", "json"],
    rootDir: ".",
    roots: [projectRoot],
    testEnvironment: "node",
    testMatch: testMatch,
    testPathIgnorePatterns: testPathIgnorePatterns,
  };

  return projectConfig;
}

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } extension Test extension to match
 * @returns { !import("jest").Config } Jest config
 */
function getJestJsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  extension
) {
  const testMatch = [getTestMatch(extension, false)];

  return getJestProjectConfig(projectName, testMatch, testPathIgnorePatterns);
}

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } extension Test extension to match
 * @returns @returns { !import("jest").Config } Jest config
 */
function getJestTsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  extension
) {
  const testMatch = [getTestMatch(extension, true)];

  return {
    ...getJestProjectConfig(projectName, testMatch, testPathIgnorePatterns),
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
  };
}

/**
 * @param { !string } testExtension Test extension files
 * @param { !boolean } isTargetingSource True if test are under the source folder
 * @returns { !string }
 */
function getTestMatch(testExtension, isTargetingSource) {
  let testMatch;

  if (isTargetingSource) {
    testMatch = `${projectRoot}/src/**/*${testExtension}`;
  } else {
    testMatch = `${projectRoot}/{dist,lib}/**/*${testExtension}`;
  }

  return testMatch;
}

export { getJestJsProjectConfig, getJestTsProjectConfig };
