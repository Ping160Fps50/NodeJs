const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/login",
  body("email").isEmail().withMessage("Please Enter Valid Email!"),
  body(
    "password",
    "Please Enter Password With Only Numbers And Text And At Least 5 Characters!",
  )
    .isLength({ min: 5 })
    .isAlphanumeric(),
  authController.postLogin,
);

router.post(
  "/signup",
  body("email")
    .isEmail()
    .withMessage("Please Enter Valid Email!")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("This Email Already Exists!");
        }
      });
    }),
  body(
    "password",
    "Please Enter Password With Only Numbers And Text And At Least 5 Characters!",
  )
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords Have To Match!");
    }
    return true;
  }),
  authController.postSignup,
);

router.post("/logout", authController.postLogout);

router.post("/reset", authController.postReset);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
