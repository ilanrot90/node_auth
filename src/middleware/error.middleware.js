const ErrorResponse = require('../utils/error.utils');
const _map = require('lodash').map;
const errorCallback = (err, req, res, next) => {
    let error = { ...err};
    // mongoose bad id
    if(err.name === 'CastError') {
        const message = `No resource with id of ${err.value} was found`;
        error =  new ErrorResponse(message, 404);
    }

    // mongoose validation error
    if(err.name === 'ValidationError') {
        const message = _map(err.errors, error => error.message);
        error =  new ErrorResponse(message, 400);
    }

    // mongoose error code 11000 ( duplicate key )
    if(err.code === 11000) {
        const message = `Duplicated field was entered`;
        error =  new ErrorResponse(message, 400);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
    });
};

module.exports = errorCallback;
