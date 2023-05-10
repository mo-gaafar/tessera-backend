const express = require("express");
const router = express.Router();

const eventsRetrievalController = require("../controller/Events/eventsRetrievalController");

router.get(
	"/event-management/listEvents",
	eventsRetrievalController.listEvents
);

router.get(
	"/event-management/csv-exports",
	eventsRetrievalController.exportsListEvents
);

module.exports = router; //exporting the module in order to use it in other files
