function getApiServerUrl () {
  return API_SERVER_URL;
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  IS_PROD: process.env.NODE_ENV === 'production',
  IS_DEV: process.env.NODE_ENV === 'development',
  API_SERVER_URL: getApiServerUrl(),
};
