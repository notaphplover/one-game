/** @type { import("eslint").ESLint.ConfigData } */
module.exports = {
  extends: '@cornie-js/eslint-config-frontend',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
