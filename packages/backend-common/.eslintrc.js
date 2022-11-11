/** @type { import("eslint").ESLint.ConfigData } */
module.exports = {
  extends: "@one-game-js/eslint-config-backend",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
};
