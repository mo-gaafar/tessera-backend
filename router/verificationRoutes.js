const express = require("express");
const verificationController = require("../controller/verificationController");

const router = express.Router();

// post request
router.post("/auth/verify/", verificationController.resendEmailVerification);

// get request
router.get("/auth/isverify/:token", verificationController.verifyEmail);

module.exports = router;
