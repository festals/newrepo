const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccountView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
      title: "You're Logged In!",
      nav,
      errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccountUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
  })    
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const {
      account_id,
      account_firstname,
      account_lastname,
      account_email
  } = req.body

const updateResult = await model.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
  )

  if (updateResult) {
      const accountData = await model.getAccountById(account_id)
      delete accountData.account_password
      res.locals.accountData = accountData
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
      if (process.env.NODE_ENV === 'development'){
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      req.flash("notice", `Congratulations, you've updated your account information.`)
      res.redirect("/account/")
  }else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/update", {
          title: "Update Account Information",
          nav,
          errors: null
      })
  }
}

async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const {
      account_id,
      account_password
  } = req.body

  // Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error changing the new password.')
  res.status(500).render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
  })
}

  const updateResult = await model.changePassword(
      account_id,
      hashedPassword
  )

  if (updateResult) {
      req.flash("notice", `Congratulations, you've change your password`)
      res.redirect("account/") 
  }else {
      req.flash("notice", "Sorry, the password change failed.")
      res.status(501).render("account/update", {
          title,
          nav,
          errors: null
      })
  }
}

/* ****************************************
*  Process logout request
* ************************************ */
async function logout(req, res, next) {
  res.clearCookie("jwt");
  res.redirect("/");
}
  
module.exports = { logout, changePassword, updateAccount, buildAccountUpdateView, buildLogin, buildRegister, registerAccount, accountLogin, buildAccountView }
