const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
} = require('../controllers/authController');

const authRouter = require('express').Router();
const signupValidator = require('../validators/auth/signupValidators');
const loginValidator = require('../validators/auth/loginValidator');

authRouter.get('/signup', signupGetController);
authRouter.post('/signup', signupValidator, signupPostController);

authRouter.get('/login', loginGetController);
authRouter.post('/login', loginValidator, loginPostController);

authRouter.get('/logout', logoutController);

module.exports = authRouter;
