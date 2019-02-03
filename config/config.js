/**
 * API configuration
 */
const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'sandbox'],
    default: 'development',
    env: 'NODE_ENV'
  },
  express_port: {
    doc: 'The port the UI listens to.',
    format: 'port',
    default: 8071,
    env: 'EXPRESS_PORT',
    arg: 'express_port'
  },
  bind_address: {
    doc: 'The address the UI listens to.',
    format: '*',
    default: '0.0.0.0',
    env: 'BIND_ADDRESS',
    arg: 'bind_address'
  },
  api_server_url: {
    doc: 'API Server URL',
    format: 'url',
    default: 'http://localhost:3000',
    env: 'API_SERVER_URL',
    arg: 'api_server_url'
  }
});

config.loadFile('./config/' + config.get('env') + '.json');
config.validate({allowed: 'strict'});

module.exports = config;
