const passport = require("passport");
const res = require("express/lib/response");

const { redirectingFromSocial } = require("../controller/authUser");
require("../passport/passport")(passport);
const router = require("express").Router();
const {
  googleLogin,
  facebookLogin,
} = require("../controller/Auth/userSocialController"); //importing methods from conroller

//creating router
//post request facebook sign in using mobile app
router.post("/auth/facebook/app", facebookLogin);
//post google sign in using mobile app
router.post("/auth/google/app", googleLogin);
///////////redirect links
router.get("/googlelogin/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

//incase of success login , return user and return to homepage
router.get("/googlelogin/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user, //get my user
    });
  }
});
//facebook redirect links
router.get("/facebooklogin/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
//incase of success login , return user and return to landing page
router.get("/facebooklogin/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user, //get my user
    });
  }
});
//end of facebook redirect links

//get request for facebook login for web
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] }),
  () => {
    //this gives us profile info such as id and username
    res.send({ title: "User logging in" });
  }
);
//redirect to landing page
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureMessage: "Failed",
    failureRedirect:process.env.BASE_URL+"/facebooklogin/failed",
    successRedirect:process.env.BASE_URL+"/facebooklogin/success",
    //session: false,
  })
  //,redirectingFromSocial
);
//get request for google login for web
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  () => {
    //gonna give us profile info such as id and username
    res.send({ title: "User logging in" });
  }
);

//redirect to landing page
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect:process.env.BASE_URL+"/googlelogin/failed",
    successRedirect:process.env.BASE_URL+"/googlelogin/success",
    //session: false,
  })
  //,redirectingFromSocial
);

module.exports = router;