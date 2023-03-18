const express = require("express");
const verificationController = require("../controller/verificationController");

const router = express.Router();

router.get("/auth/verify/", verificationController.verifyEmail);

module.exports = router;
