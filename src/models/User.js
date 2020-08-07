const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtKey, jwtExpire } = require('../config/secrets');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, 'Please add email'],
      unique: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    role: {
      type: String,
      enum: ['user', 'publisher', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      minLength: [6, 'password is too short'],
      required: [true, 'Please add password'],
      select: false,
    },
    company: {
      type: String,
      required: [true, 'Please add company name'],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Encrypt password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// compare password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// Sign JWT
UserSchema.methods.signJwtToken = function () {
  return jwt.sign(
    {
      email: this.email,
      id: this._id,
    },
    jwtKey,
    { expiresIn: jwtExpire },
  );
};
// get reset token
UserSchema.methods.getResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  // set expire date to 10min
  this.resetPasswordExpire = new Date() + 10 * 60 * 1000;
  return token;
};

module.exports = mongoose.model('User', UserSchema);
