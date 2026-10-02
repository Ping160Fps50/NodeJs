const { validationResult } = require("express-validator");

const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = message.at(0);
  } else {
    errorMessage = null;
  }
  res.render("./auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage,
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = message.at(0);
  } else {
    errorMessage = null;
  }
  res.render("./auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
    oldInput: { email: "", password: "" },
    validationErrors: errors.array(),
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("./auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array().at(0).msg,
      oldInput: { email, password },
      validationErrors: [{ params: "email" }, { params: "password" }],
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("./auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Email Does Not Found!",
          oldInput: { email, password },
          validationErrors: [{ params: "email" }],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              return res.redirect("/");
            });
          }
          return res.status(422).render("./auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Password is Incorrect!",
            oldInput: { email, password },
            validationErrors: [{ params: "password" }],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("./auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array().at(0).msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: "Alireza",
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = message.at(0);
  } else {
    errorMessage = null;
  }
  res.render("./auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      res.redirect("/reset");
    }
    const token = buf.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No Account Found With That Email!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetExp = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetExp: { $gt: Date.now() } })
    .then((user) => {
      let errorMessage = req.flash("error");
      if (errorMessage.length > 0) {
        errorMessage = message.at(0);
      } else {
        errorMessage = null;
      }
      res.render("./auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { password: newPassword, userId, passwordToken } = req.body;
  let resetUser;
  User.foundOne({
    _id: userId,
    resetToken: passwordToken,
    resetExp: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetExp = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
