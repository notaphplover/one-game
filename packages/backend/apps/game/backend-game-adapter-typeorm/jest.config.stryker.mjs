import { getJestTsProjectConfig } from '@cornie-js/backend-jest-config';

const tsGlobalConfig = getJestTsProjectConfig(
  'All',
  ['/node_modules', '.int.spec.ts'],
  '.spec.ts',
);

export default tsGlobalConfig;
