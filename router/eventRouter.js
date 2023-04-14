const express = require("express");
const router = express.Router();
const eventController = require("../controller/Events/eventController");
const fileUpload = require('express-fileupload');

router.post(
	"/event-management/creator/:creator-id",
	eventController.createEvent
);

router.get("/event-management/retrieve/:eventID", eventController.getEventById);
router.delete("/event-management/delete/:eventID", eventController.deleteEvent);
router.put("/event-management/update/:eventID", eventController.updateEvent);
router.post("/event-management/upload-image/:eventID", fileUpload(), eventController.uploadImage);

module.exports = router; //exporting the module in order to use it in other files
