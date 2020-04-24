const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const helmet = require('helmet');
const lusca = require('lusca');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
// protect header
app.use(helmet());
// limit amount of requests from single user
app.use(
  '/api/v1',
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many accounts created from this IP, please try again later',
  }),
);
// protect injection
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
// configure mongo
const { SESSION_SECRET, MONGODB_URI, ENVIRONMENT } = require('./config/secrets');
const MongoStore = require('./db/mongoose')(MONGODB_URI, session);
// app middleware
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error.middleware');
// debug API calls
const morgen = require('morgan');
if (ENVIRONMENT === 'development') {
  app.use(morgen('dev'));
}
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'docs')));
app.use(express.json());
app.use(cookieParser());
// prevent xss attacks
app.use(lusca.xssProtection(true));
// TODO: add here origin
app.use(lusca.xframe('only_my_origin'));
// protect query params
app.use(hpp({}));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      url: MONGODB_URI,
      autoReconnect: true,
    }),
  }),
);

// cors protection
const corsOptions = require('./config/cors.config');
app.use('/api/v1', cors(corsOptions)); // include before other routes
//API routes
const router = require('./routes/v1');
app.use('/api/v1', router);

// error handler
app.use(errorHandler);
app.set('port', process.env.PORT || 8080);
app.set('mode', process.env.NODE_ENV || app.get('env'));

module.exports = app;
