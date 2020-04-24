const router = require('express').Router();
const handlers = require('../../controllers/v1/auth.controller');
const { isLoggedIn } = require('../../middleware/auth.middleware');

router.route('/register').post(handlers.register);
router.route('/login').post(handlers.loginUser);
router.route('/logout').post(handlers.logoutUser);
router.route('/me').get(isLoggedIn, handlers.getCurrentUser);
// router.route('/forgot-password').post(handlers.setResetToken);
// router.route('/forgot-password/:token').put(handlers.resetPassword);
// router.route('/update').put(isLoggedIn, handlers.updateUser);
// router.route('/update/password').put(isLoggedIn, handlers.updatePassword);

module.exports = router;
