module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  plugins: [
    'html'
  ],
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'webpack.config.js'
      }
    }
  },
  'rules': {
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  env: {
    browser: true,
    node: true
  }
}
