const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

module.exports.signupGetController = (req, res, next) => {
  res.render('pages/auth/signup', { title: 'Sign Up', errors: {}, value: {} });
};

module.exports.signupPostController = async (req, res, next) => {
  let formatter = (error) => error.msg;
  let errors = validationResult(req).formatWith(formatter);
  const { username, email, password, confirmPassword } = req.body;
  if (!errors.isEmpty()) {
    return res.render('pages/auth/signup', {
      value: { username, email, password },
      title: 'Sign Up',
      errors: errors.mapped(),
    });
  }
  try {
    let hashedPassword = await bcrypt.hash(password, 11);
    const user = new User({ username, email, password: hashedPassword });
    let createdUser = await user.save();
    console.log('Created: ', createdUser);
    res.render('pages/auth/signup', { title: 'Sign Up' });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports.loginGetController = (req, res, next) => {
  console.log(req.session.isLoggedIn, req.session.user);
  res.render('pages/auth/login', {
    title: 'Log In',
    errors: {},
  });
};

module.exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;
  let formatter = (error) => error.msg;
  let errors = validationResult(req).formatWith(formatter);
  if (!errors.isEmpty()) {
    return res.render('pages/auth/login', {
      title: 'Log In',
      errors: errors.mapped(),
    });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ ErrorMessage: 'Something Went Wrong!' });
    }
    let matched = bcrypt.compare(password, user.password);
    if (!matched) {
      return res.json({ ErrorMessage: 'Something Went Wrong!' });
    }
    console.log(user);
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.render('pages/auth/login', {
      title: 'Log In',
      errors: {},
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.logoutController = (req, res, next) => {};
