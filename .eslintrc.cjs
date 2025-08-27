module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'warn',
    'no-undef': 'error'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.min.js'
  ]
}
