const { prod: isProd } = require('./secrets');
const origin = isProd ? 'https://some-origin.com' : 'http://localhost:3000';
// TODO: add here origin
const corsOptions = function(req, callback) {
    callback(null, { credentials: true, origin: req.header('Origin') === origin }); // callback expects two parameters: error and options
};

module.exports = corsOptions;
