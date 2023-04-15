const express = require("express");
const router = express.Router();

const ticketController = require("../controller/Auth/ticketController"); // importing methods from controller

// creating a router
router.post("/attendee/ticket/:eventId/book", ticketController.bookTicket);

router.put(
  "/event-tickets/create-ticket/:eventID",
  ticketController.createTicketTier
);

router.get(
  "/event-tickets/retrieve-event-ticket-tier/:eventID",
  ticketController.retrieveTicketTier
);

<<<<<<< HEAD


// router.patch(
//     "/event-tickets/edit-ticket/:eventID",
//     ticketController.editTicketTier
// )

// router.put(
//   "/event-tickets/edit-ticket/:eventID",
//   ticketController.editTicketTier
// );
=======
router.patch(
  "/event-tickets/edit-ticket/:eventID",
  ticketController.editTicketTier
);
>>>>>>> a853c3631492c0e721b8330acfd681cb62715d44

// router.put(
//     "/event-tickets/edit-ticket/:tickID",
//     ticketTierController.editTicket
// )

module.exports = router;
