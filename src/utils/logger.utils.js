const log4js = require('log4js');
const { isProd } = require('../config/secrets');
log4js.configure({
  appenders: { debug: { type: 'file', filename: 'debug.log' } },
  categories: { default: { appenders: ['debug'], level: isProd ? 'error' : 'debug' } },
});

const logger = log4js.getLogger('debug');
module.exports = logger;
