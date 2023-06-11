const router = require("express").Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

//get sing-up page
router.get("/sign-up", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("sign-up");
  } else {
    res.render("sign-up");
  }
});

router.post("/sign-up", (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      console.log("hashedPassword", hashedPassword);
      return User.create({ username: username, password: hashedPassword }); //
    })
    .then((userFromDb) => {
      const { username } = userFromDb;
      req.session.currentUser = { username };
      console.log("username ===========>>>>", username);
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/profile", (req, res, next) => {
  if (req.session.currentUser) {
    User.findOne({ username: req.session.currentUser.username })
      .then((foundUser) => {
        res.render("profile", { foundUser });
      })
      .catch((err) => console.log(err));
  } else {
    res.render("profile");
  }
});

router.get("/login", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("login");
  } else {
    res.render("login");
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  //back-end form validation
  if (!username || !password) {
    res.render("/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((foundUser) => {
      console.log("user", foundUser);
      //check if user found in DB
      if (!foundUser) {
        res.render("/login", {
          errorMessage: "Username is not registered. Try with other username.",
        });
      } else if (bcrypt.compareSync(password, foundUser.password)) {
        //check if the input password matches the one stored in the db
        const { username } = foundUser;
        req.session.currentUser = { username };
        res.redirect("/profile");
      } else {
        //if enter password does not maktch user password
        red.render("/login", { errorMessage: "Incorrect password."});
      }
    })
    .catch((err) => console.log(err));
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private",(req,res,next)=>{
res.render("private");
});

module.exports = router;
