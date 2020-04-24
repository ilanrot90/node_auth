const app = require('./app');
const logger = require('./utils/logger.utils');
const server = require('http').createServer(app);

server.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('mode'),
  );
  console.log('  Press CTRL-C to stop\n');
});
// handle unhandled rejected promises
process.on('unhandledRejection', (err) => {
  const logType = app.get('mode') !== 'development' ? 'error' : 'debug';
  logger[logType](`ERROR: ${err.message}`);
  server.close();
});
