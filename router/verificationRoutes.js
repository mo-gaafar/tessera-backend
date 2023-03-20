const express = require("express");
const verificationController = require("../controller/verificationController");

const router = express.Router();

// post request
router.post("/auth/verify/", verificationController.sendVerification);

router.get("/auth/verify/", verificationController.verifyEmail);

module.exports = router;
