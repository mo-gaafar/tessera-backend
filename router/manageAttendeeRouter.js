const express = require("express");
const manageAttendeeController = require("../controller/Events/manageAttendeeController");

const router = express.Router();
// post request
router.post(
  "/manage-attendee/addattendee/:eventID",
  manageAttendeeController.addAttendee
);
module.exports = router; //exporting the module in order to use it in other files
