module.exports = {
  root: true,
  extends: ['@webpack-contrib/eslint-config-webpack', 'prettier'],
  overrides: [
    {
      globals: {
        globalThis: 'readonly',
      },
      env: {
        browser: true,
        node: true,
      },
      files: ['**/runtime/**/*.js'],
    },
  ],
};
