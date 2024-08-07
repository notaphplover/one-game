/** @type { import("eslint").ESLint.ConfigData } */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        overrides: {
          constructors: 'no-public',
        },
      },
    ],
    '@typescript-eslint/member-ordering': ['warn'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['classProperty'],
        format: ['strictCamelCase', 'UPPER_CASE', 'snake_case'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeParameter',
        format: ['StrictPascalCase'],
        prefix: ['T'],
      },
      {
        selector: ['typeLike'],
        format: ['StrictPascalCase'],
      },
      {
        selector: ['function', 'classMethod'],
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: ['parameter'],
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: ['variableLike'],
        format: ['strictCamelCase', 'UPPER_CASE', 'snake_case'],
      },
    ],
    '@typescript-eslint/no-duplicate-type-constituents': 'off',
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': ['error'],
    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1],
        ignoreArrayIndexes: true,
        ignoreEnums: true,
        ignoreReadonlyClassProperties: true,
      },
    ],
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': ['off'],
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/prefer-readonly': ['warn'],
    '@typescript-eslint/promise-function-async': ['error'],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/restrict-plus-operands': [
      'error',
      {
        skipCompoundAssignments: false,
      },
    ],
    '@typescript-eslint/typedef': ['off'],
    '@typescript-eslint/unified-signatures': 'error',
    'import/default': 'off',
    'import/namespace': 'off',
    'import/newline-after-import': 'error',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['builtin', 'external'],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@jest/globals',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'jest-mock',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['@jest/globals', 'jest-mock'],
      },
    ],
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: false,
        natural: true,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: true,
      typescript: true,
    },
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: ['classProperty'],
            format: ['strictCamelCase', 'UPPER_CASE', 'snake_case'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'typeParameter',
            format: ['StrictPascalCase'],
            prefix: ['T'],
          },
          {
            selector: ['typeLike'],
            format: ['StrictPascalCase'],
          },
          {
            selector: ['function', 'classMethod'],
            format: ['strictCamelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: ['parameter'],
            format: ['strictCamelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: ['variableLike'],
            format: [
              'strictCamelCase',
              'StrictPascalCase',
              'UPPER_CASE',
              'snake_case',
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.spec.{ts,tsx}'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
        'jest/valid-title': 'off',
      },
    },
  ],
};
