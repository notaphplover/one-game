import getJestTsProjectConfig from './getJestTsProjectConfig.js';

/**
 * @returns {!import("@jest/types").Config.InitialOptions}
 */
function getTsGlobalConfig() {
  const tsUnitProject = getJestTsProjectConfig(
    'Unit',
    ['.int.spec.ts', '.int.spec.tsx'],
    ['.spec.ts', '.spec.tsx'],
  );

  const tsIntegrationProject = getJestTsProjectConfig(
    'Integration',
    [],
    ['.int.spec.ts', '.int.spec.tsx'],
  );

  return {
    passWithNoTests: true,
    projects: [tsIntegrationProject, tsUnitProject],
  };
}

export default getTsGlobalConfig;
