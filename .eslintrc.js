/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'import/extensions': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx', '.astro', '.md'] },
    ],
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': [2],
    '@typescript-eslint/no-explicit-any': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': [2],
    'no-undef': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'no-bitwise': 0,
    'no-unused-expressions': [2, { allowShortCircuit: true }],
    'no-redeclare': 0,
    '@typescript-eslint/no-redeclare': [2],
    'no-empty-function': 0,
    '@typescript-eslint/no-empty-function': [0],
    'no-empty': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.astro', '.md'],
      },
      typescript: {},
    },
  },
};
