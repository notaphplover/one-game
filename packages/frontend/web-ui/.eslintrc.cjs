/** @type { import("eslint").ESLint.ConfigData } */
module.exports = {
  extends: [
    '@cornie-js/eslint-config-frontend',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
  },
};
