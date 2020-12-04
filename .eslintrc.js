module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'no-console': 'off',
  },
};
