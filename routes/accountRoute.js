// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountView));
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Process the registration data
router.post("/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

//update account Information
router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdateView)
);

router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/update/password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

// logout account
router.get(
  "/logout",
  utilities.handleErrors(accountController.logout)
);

module.exports = router;