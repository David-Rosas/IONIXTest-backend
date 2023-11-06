const Router = require("express").Router;
const {
  Login,
  Logout,
  Register,
  validateUserToken,
  generateCodeRecover,
  validateRecoverCode,
  ListUserExecute,
} = require("../controllers/UsersController");

const {
  signUpValidationRules,
  loginValidationRules,
  requestRecoverValidationRules,
  codeRecoverValidationRules,
  validate,
} = require("../helpers/validator");

const router = Router();
const { middlewareAuth } = require("../middlewares/isAuth.js");

router.post("/api/user/login", loginValidationRules, validate, Login);
router.post("/api/user/logout",middlewareAuth, Logout);
router.post("/api/user/register",middlewareAuth, signUpValidationRules, validate, Register);
router.get("/api/user/validate-token", validateUserToken);
router.post("/api/user/request-code-recover", requestRecoverValidationRules, validate, generateCodeRecover);
router.post("/api/user/validate-code", codeRecoverValidationRules, validate, validateRecoverCode);
router.get("/api/user/list-execute",middlewareAuth, ListUserExecute);

module.exports = router;
