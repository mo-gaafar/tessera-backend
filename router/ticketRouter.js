const express = require("express");
const router = express.Router();

const ticketController = require("../controller/Auth/ticketController"); // importing methods from controller

// creating a router
router.post("/attendee/book-ticket", ticketController.bookTicket);

router.put(
  "/event-tickets/create-ticket/:eventID",
  ticketController.createTicketTier
);

router.get(
  "/event-tickets/retrieve-event-ticket-tier/:eventID",
  ticketController.retrieveTicketTier
);

<<<<<<< HEAD

router.patch(
    "/event-tickets/edit-ticket/:eventID",
    ticketController.editTicketTier
)
=======
router.put(
  "/event-tickets/edit-ticket/:eventID",
  ticketController.editTicketTier
);
>>>>>>> ef0e32bfcaa9ef6e334c7a4b9740de9b858480a3

// router.put(
//     "/event-tickets/edit-ticket/:tickID",
//     ticketTierController.editTicket
// )

module.exports = router;
