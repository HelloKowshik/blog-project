const validatorRouter = require('express').Router();
const { check, validationResult } = require('express-validator');

validatorRouter.get('/validator', (req, res, next) => {
  res.render('playground/signup', { title: 'Validator Playground' });
});

validatorRouter.post(
  '/validator',
  [
    check('username')
      .not()
      .isEmpty()
      .withMessage(`User Name can't be empty`)
      .trim()
      .isLength({ max: 15 })
      .withMessage(`Not More then 15 character`),
    check('email')
      .isEmail()
      .withMessage(`Provide a valid Email`)
      .normalizeEmail(),
    check('password').custom((value) => {
      if (value.length < 5) {
        throw new Error('Password is too short');
      }
      return true;
    }),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords mismatched!');
      }
      return true;
    }),
  ],
  (req, res, next) => {
    let errors = validationResult(req);
    let formatter = (error) => error.msg;
    console.log(errors.formatWith(formatter).mapped());
    res.render('playground/signup', { title: 'Validator Playground' });
  }
);

module.exports = validatorRouter;
