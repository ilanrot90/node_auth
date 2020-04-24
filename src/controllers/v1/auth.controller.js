const User = require('../../models/User');
const crypto = require('crypto');
const asyncHandler = require('../../middleware/async.middleware');
const ErrorResponse = require('../../utils/error.utils');
const { isProd } = require('../../config/secrets');
const { cookieExpire } = require('../../config/secrets');
/*
 * set cookie- JWT from model and send response
 */
const sendToken = (user, statusCode, res) => {
  const token = user.signJwtToken();
  const options = {
    httpOnly: true,
    expires: new Date(new Date() + cookieExpire * 24 * 60 * 60 * 1000),
    secure: isProd,
  };

  res.cookie('token', token, options);
  res.status(statusCode).json({
    success: true,
    token,
  });
};

/*
 * @desc register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse(`user with email: ${email} is already exist`, 400));
  }

  user = await User.create(req.body);
  // send token
  sendToken(user, 201, res);
});
/*
 * @desc login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, company } = req.body;
  if (!email || !password || !company) {
    return next(new ErrorResponse(`Please provide a valid values`, 400));
  }
  // find user and add password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  // check if password is valid
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  // send token
  sendToken(user, 200, res);
});
/*
 * @desc logout user
 * @route POST /api/v1/auth/logout
 * @access Public
 */
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(new Date() + 10 * 1000),
  });

  res.status(200).json({
    success: true,
  });
});
/*
 * @desc get current user
 * @route GET /api/v1/auth/me
 * @access Private
 */
const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = {
  register,
  logoutUser,
  getCurrentUser,
  loginUser,
};
