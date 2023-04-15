const express = require("express");
const router = express.Router();

const ticketController = require("../controller/Auth/ticketController"); // importing methods from controller

// creating a router
// router.post("/attendee/book-ticket", ticketController.bookTicket);

router.put(
  "/event-tickets/create-ticket/:eventID",
  ticketController.createTicketTier
);

router.get(
  "/event-tickets/retrieve-event-ticket-tier/:eventID",
  ticketController.retrieveTicketTier
);

<<<<<<< HEAD

router.post(
  "/attendee/ticket/:eventId/book",
  ticketController.bookTicket
);




// router.patch(
//     "/event-tickets/edit-ticket/:eventID",
//     ticketController.editTicketTier
// )

// router.put(
//   "/event-tickets/edit-ticket/:eventID",
//   ticketController.editTicketTier
// );

// router.put(
//     "/event-tickets/edit-ticket/:tickID",
//     ticketTierController.editTicket
// )

=======
>>>>>>> 4e17202e4461f1628648a29a4967a25dfe067ddd
module.exports = router;
