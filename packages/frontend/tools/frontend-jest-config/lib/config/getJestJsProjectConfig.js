import getJestProjectConfig from './getJestProjectConfig.js';
import getTestMatch from './getTestMatch.js';

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { !Array<string> } extensions Test extension to match
 * @returns { !import("jest").Config } Jest config
 */
function getJestJsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  extensions,
) {
  const testMatch = getTestMatch(extensions, false);

  return getJestProjectConfig(projectName, testMatch, testPathIgnorePatterns);
}

export default getJestJsProjectConfig;
