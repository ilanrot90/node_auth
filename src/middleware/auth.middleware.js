const jwt = require('jsonwebtoken');
const asyncHandler = require('./async.middleware');
const ErrorResponse = require('../utils/error.utils');
const User = require('../models/User');
const { jwtKey } = require("../config/secrets");

// protect routes
const isLoggedIn = asyncHandler(async (req, res, next) => {
    let { authorization } = req.headers;
    if(authorization && authorization.startsWith('Bearer')) {
        //get token from header 'Bearer afcsdfcvsdfb'
        authorization = authorization.split(' ')[1];
    }
/*
    get token from cookie
    else if(req.cookies.token){
        authorization = req.cookies.token;
    }
*/
    if(!authorization) {
        return next(new ErrorResponse('Not authorize', 403));
    }

    try {
         // verify token
        const decode = jwt.verify(authorization, jwtKey);
        if(!decode) {
            return next(new ErrorResponse('Not authorize', 403));
        }
        // set req.user
        req.user = await User.findById(decode.id);
        return next()
    } catch (e) {
        return next(new ErrorResponse('Not authorize', 403));
    }
});
// access routes by role
const isAuthorized = (roles) => asyncHandler(async (req, res, next) => {
    const { user } = req;
    const isRoleMatch = roles.includes(user.role);
    if(!isRoleMatch) {
        return next(new ErrorResponse(`${user.role} is not authorized to access this route`, 403));
    }

    return next();
});

module.exports = {
    isLoggedIn,
    isAuthorized
};
