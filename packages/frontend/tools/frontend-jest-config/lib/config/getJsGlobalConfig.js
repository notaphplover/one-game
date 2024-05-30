import getJestJsProjectConfig from './getJestJsProjectConfig.js';

/**
 * @returns {!import("@jest/types").Config.InitialOptions}
 */
function getJsGlobalConfig() {
  const jsUnitProject = getJestJsProjectConfig(
    'Unit',
    ['.int.spec.js', '.int.spec.jsx'],
    ['.spec.js', '.spec.jsx'],
  );

  const jsIntegrationProject = getJestJsProjectConfig(
    'Integration',
    [],
    ['.int.spec.js', '.int.spec.jsx'],
  );

  return {
    passWithNoTests: true,
    projects: [jsIntegrationProject, jsUnitProject],
  };
}

export default getJsGlobalConfig;
