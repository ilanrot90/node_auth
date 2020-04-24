// configure mongoose
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const mongo = require('connect-mongo');

const connectDB = (MONGODB_URI, session, withStore = true) => {
    const MongoStore = withStore? mongo(session) : undefined;
    mongoose.Promise = bluebird;
    mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(`MongoDB connected`);
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
      })
      .catch((err) => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        // process.exit();
      });

    return MongoStore;
};

module.exports = connectDB;
