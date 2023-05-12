/** @type { import("eslint").ESLint.ConfigData } */
module.exports = {
  extends: '@cornie-js/eslint-config-backend',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
