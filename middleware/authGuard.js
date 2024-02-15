const jwt = require("jsonwebtoken");
const User = require("./../models/User");

const authGuard = (req, res, next) => {
  const token = req.cookies.jwt; // Get the token from the cookies
  if (token) {
    // If tokens exists check for the verification of the jsonwebstoken
    jwt.verify(token, "geeky-developer", (err, decodedToken) => {
      if (err) {
        // res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // Get the token from the cookies
  if (token) {
    // If tokens exists check for the verification of the jsonwebstoken
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { authGuard, checkUser };
