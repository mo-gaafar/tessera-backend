const express = require("express");
const router = express.Router();
const attendeeController = require("../controller/attendees/attendeeController");
router.get("/attendee/Eventsby", attendeeController.displayfilteredTabs);
router.get(
  "/landing-page/retrieve-categories",
  attendeeController.listAllCategories
);
router.get("/attendee/event/:eventID", attendeeController.getEventInfo);
module.exports = router; //exporting the module in order to use it in other files
