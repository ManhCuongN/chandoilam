const User = require("../models/auth");
var jwt = require("jsonwebtoken");

module.exports.auth = function (req, res, next) {
  if (!req.cookies.tokenId) {
    res.redirect("/auth/sign-in/");
    return;
  } else {
    // res.json("ok");
    var token = req.cookies.tokenId;

    var ver = jwt.verify(token, "1712");
    User.findOne({ _id: ver })
      .then(
        (data) => {
          if (data) {
            res.locals.fullname = data.fullname;
          } else {
            res.locals.fullname = "";
          }
          next();
        }

        // res.render("me/trash-courses")
      )

      .catch(next);
  }
};
