const express = require("express");
const router = express.Router();

const ticketTierController = require("../controller/Auth/ticketTierController"); // importing methods from controller


// creating a router
router.post(
	"/event-tickets/create-ticket",
	ticketTierController.createTicket
);


module.exports=router;