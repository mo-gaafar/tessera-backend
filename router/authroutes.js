const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.get("/verify/:token", authController.verify);

module.exports = router;
