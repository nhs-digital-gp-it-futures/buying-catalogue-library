module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'array-callback-return': 'off',
    'linebreak-style': 'off',
    'no-console': 1,
  },
};
