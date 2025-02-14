const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const User = require("../models/user.model");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please add a valid email")
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            throw new Error("Email already exists");
          }
          return true;
        });
      })
      .normalizeEmail(),
  ],
  authController.signUp
);

router.post("/login", authController.login);

module.exports = router;
