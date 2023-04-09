const express = require("express");
const router = express.Router();
const attendeeController = require("../trash/attendeeController_trash");
const trashcontroller = require("../trash/Date_trash");
const attendeeController1 = require("../controller/attendees/attendeeController");
// router.get("/attendee/filteredby/?category=&location=&eventName=&description=&ticketTiers=&eventStatus=&longitude=&latitute=&startDateTime=&endDateTime="
// , attendeeController.displayfilteredTabs);
// router.get("/attendee/Eventsby",attendeeController.displayfilteredTabs);
router.get(
  "/attendee/book-ticket/eventsticket-classes",
  attendeeController1.getBookedTicket
);
router.get("/attendee/Eventsby", attendeeController1.displayfilteredTabs);
module.exports = router; //exporting the module in order to use it in other files
