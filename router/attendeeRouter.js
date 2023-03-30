const express = require("express");
const router = express.Router();
const attendeeController = require("../controller/attendees/attendeeController"); 

// router.get("/attendee/filteredby/?category=&location=&eventName=&description=&ticketTiers=&eventStatus=&longitude=&latitute=&startDateTime=&endDateTime="
// , attendeeController.displayfilteredTabs);
router.get("/attendee/Eventsby",attendeeController.displayfilteredTabs);
module.exports = router; //exporting the module in order to use it in other files