const express = require("express");
const router = express.Router();
//const upload = require("../middlewares/validation/upload");
const promocodeController = require("../controller/Events/promocodeController");
//const uploadMiddleware = require("../middlewares/validation/upload");
const multer = require("multer");
//const storage = multer.memoryStorage(); // Store file in memory instead of disk
const upload = multer();
router.post(
	"/manage/events/:event_Id/promocode/create",
	promocodeController.createPromocode
);

router.post(
	"/event-management/import-promo/:eventID",
	upload.single("csvFile"),
	promocodeController.importPromocode
);

router.get(
	"/attendee/ticket/:eventId/promocode/retrieve",
	promocodeController.checkPromocode
);

module.exports = router;
