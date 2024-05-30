import projectRoot from './projectRoot.js';

/**
 * @param { !Array.<string> } testExtensions Test extension files
 * @param { !boolean } isTargetingSource True if test are under the source folder
 * @returns { !Array.<string> }
 */
function getTestMatch(testExtensions, isTargetingSource) {
  let testMatch;

  if (isTargetingSource) {
    testMatch = testExtensions.map(
      (testExtension) => `${projectRoot}/src/**/*${testExtension}`,
    );
  } else {
    testMatch = [
      ...testExtensions.map(
        (testExtension) => `${projectRoot}/{dist,lib}/*${testExtension}`,
      ),
      ...testExtensions.map(
        (testExtension) =>
          `${projectRoot}/{dist,lib}/!(cjs)/**/*${testExtension}`,
      ),
    ];
  }

  return testMatch;
}

export default getTestMatch;
