module.exports = {
  env: {
    browser: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  plugins: [
    'react'
  ],
  rules: {
    'no-console': 0,
    'space-before-function-paren': 0,
    'react/display-name': 0,
    'react/prop-types': 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
