const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

router.route("/signup")
  .get(userControllers.renderSignupForm)
  .post(wrapasync(userControllers.signUp));

router.route("/login")
  .get(userControllers.renderLoginForm)
  .post(saveRedirectUrl, passport.authenticate("local",
    {
      failureRedirect: "/login",
      failureFlash: true,
    }
  ), userControllers.login);
router.get("/logout", userControllers.logOut);

module.exports = router;