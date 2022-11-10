import { getJestJsProjectConfig } from "./jest.config.base.mjs";

const tsUnitProject = getJestJsProjectConfig(
  "Unit",
  [".int.spec.js"],
  ".spec.js"
);

const tsIntegrationProject = getJestJsProjectConfig(
  "Integration",
  [],
  ".int.spec.js"
);

/** @type {!import("@jest/types").Config.InitialOptions} */
const globalConfig = {
  passWithNoTests: true,
  projects: [tsIntegrationProject, tsUnitProject],
};

export default globalConfig;
