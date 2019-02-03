const path = require('path');

module.exports = {
  verbose: true,
  testRegex: '(/src/test/(unit)/.*|(\\.|/)(test|spec))\\.jsx?$',
  modulePaths: [path.resolve('./src')],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/test/system/',
    '/src/test/helpers/'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  globals: {
    API_SERVER_URL: 'development'
  }
};
