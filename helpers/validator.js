const { body, validationResult } = require("express-validator");

const signUpValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .trim(),

body("rol_id")
    .notEmpty()
    .withMessage("role is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim(),
];

const loginValidationRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim(),
];

const requestRecoverValidationRules = body("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email format")
  .normalizeEmail();

const codeRecoverValidationRules = [
  body("codeRecover")
    .notEmpty()
    .withMessage("codeRecover is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim(),
];

const createTaskValidate = [

  body("title")
    .notEmpty()
    .withMessage("title lot is required"),

  body("description")
    .notEmpty()
    .withMessage("description is required"),

  body("expiration_date")
    .notEmpty()
    .withMessage("expiration_date is required"),

  body("user_execute_id")
    .notEmpty()
    .withMessage("user_execute_id is required"),
]


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  signUpValidationRules,
  loginValidationRules,
  requestRecoverValidationRules,
  codeRecoverValidationRules,
  createTaskValidate,
  validate,
};