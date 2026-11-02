const { body } = require("express-validator");

const googleAuthValidator = [
  body("credential")
    .isString()
    .withMessage("Invalid Google sign-in request")
    .isLength({ min: 20, max: 4096 })
    .withMessage("Invalid Google sign-in request"),
];

module.exports = {
  googleAuthValidator,
};