import { Linter } from 'eslint'

export const config: Linter.Config = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: 'react-app',
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  rules: {
    curly: [2, 'all'],
    semi: [2, 'never'],
    quotes: [2, 'single', { avoidEscape: true }],
    'sort-imports': 0,
    'import/order': 0,
    'simple-import-sort/imports': 2,
    'simple-import-sort/exports': 2,
    'import/first': 2,
    'import/newline-after-import': 2,
    'import/no-duplicates': 2,
    'import/no-extraneous-dependencies': 2,
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
      },
    ],
  },
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
}
