const { body } = require('express-validator');
const User = require('../../models/User');

module.exports = [
  body('username')
    .isLength({ min: 2, max: 15 })
    .withMessage('Username Must be between 2 to 15 character')
    .custom(async (username) => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject('Username already exists!');
      }
    })
    .trim(),

  body('email')
    .isEmail()
    .withMessage('Provide a valid Email')
    .custom(async (email) => {
      let mail = await User.findOne({ email });
      if (mail) {
        return Promise.reject('Email already exists!');
      }
    })
    .normalizeEmail(),
  body('password').isLength({ min: 5 }).withMessage('Minimum 5 character!'),

  body('confirmPassword')
    .isLength({ min: 5 })
    .withMessage('Minimum 5 character!')
    .custom((val, { req }) => {
      if ('confirmPassword' !== req.body.password) {
        throw new Error('Password Does not Matched!');
      }
      return true;
    }),
];
