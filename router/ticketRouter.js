const express = require("express");
const router = express.Router();

const ticketController = require("../controller/Events/ticketController"); // importing methods from controller

// creating a router

// router.post("/attendee/ticket/:eventId/book", ticketController.bookTicket);
router.put(
  "/event-tickets/create-ticket/:eventID",
  ticketController.createTicketTier
);

router.get(
  "/event-tickets/retrieve-event-ticket-tier/:eventID",
  ticketController.retrieveTicketTier
);

router.post("/attendee/ticket/:eventId/book", ticketController.bookTicket);

module.exports = router;
