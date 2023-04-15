const express = require("express");
const router = express.Router();
const promocodeController = require("../controller/Events/promocodeController");

router.post(
  // "/manage/events/:event_Id/promocode/create",
  "/manage/events/:event_Id/promocode/create",
  promocodeController.createPromocode
);

router.get(
  "/attendee/ticket/:eventId/promocode/retrieve",
  promocodeController.checkPromocode
);

module.exports = router;
