const express = require("express");
const router = express.Router();

const ticketController = require("../controller/Auth/ticketController"); // importing methods from controller


// creating a router
router.post(
	"/event-tickets/book-ticket",
	ticketController.bookTicket
);

router.put(
	"/event-tickets/create-ticket/:eventID",
	ticketController.createTicketTier
);

router.get(
	"/event-tickets/retrieve-event-ticket-tier/:eventID",
	ticketController.retrieveTicketTier
);


// router.put(
//     "/event-tickets/edit-ticket/:id",
//     ticketTierController.editTicket
// )

// router.put(
//     "/event-tickets/edit-ticket/:tickID",
//     ticketTierController.editTicket
// )


module.exports=router;


