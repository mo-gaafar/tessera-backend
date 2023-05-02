const express = require("express");
const router = express.Router();

const eventsRetrievalController = require("../controller/Events/eventsRetrievalController");

router.get(
  "/event-management/listEvents/:creatorID",
  eventsRetrievalController.listEvents
);

module.exports = router; //exporting the module in order to use it in other files
