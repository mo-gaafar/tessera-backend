const express = require("express");
const router = express.Router();

const seedingEvent=require("../controller/Auth/seedingController");


router.post(
	"/auth/seedingevent",
	seedingEvent.seedDB
);


module.exports=router;

