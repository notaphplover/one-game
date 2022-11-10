import { getJestTsProjectConfig } from "./jest.config.base.mjs";

const tsUnitProject = getJestTsProjectConfig(
  "Unit",
  [".int.spec.ts"],
  ".spec.ts"
);

const tsIntegrationProject = getJestTsProjectConfig(
  "Integration",
  [],
  ".int.spec.ts"
);

/** @type {!import("@jest/types").Config.InitialOptions} */
const globalConfig = {
  passWithNoTests: true,
  projects: [tsIntegrationProject, tsUnitProject],
};

export default globalConfig;
