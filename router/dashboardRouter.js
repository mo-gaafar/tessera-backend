const express = require("express");
const router = express.Router();
const eventController = require("../controller/Events/eventController");
const dashboardController = require("../controller/Dashboard/dashboardController");

// to be modified
router.get(
	"/dashboard/eventsales/events/:eventID",
	dashboardController.eventSales
);

router.get(
	"/dashboard/report/attendees-list/:eventID",
	dashboardController.exportAttendeeSummary
);

router.get(
	"/dashboard/reports/sales/:eventID",
	dashboardController.exportEventSales
);

router.get(
	"/dashboard/reportJason/attendees-list/:eventID",
	dashboardController.AttendeeSumJason
);

router.get(
	"/dashboard/eventsoldtickets/events/:eventID",
	dashboardController.eventSoldTickets
);

//

module.exports = router; //exporting the module in order to use it in other files
