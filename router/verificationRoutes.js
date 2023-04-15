const express = require("express");
const verificationController = require("../controller/Auth/verificationController");

const router = express.Router();

// post request
router.post("/auth/verify/", verificationController.resendEmailVerification);

router.post("/auth/emailexist", verificationController.emailExist);

// get request
router.get("/auth/isverify/:token", verificationController.verifyEmail);

module.exports = router;
