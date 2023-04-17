const eventModel = require("../models/eventModel");
const { authorized } = require("../utils/Tokens");
const { updateEvent } = require("../controller/Events/eventController");

jest.mock("../models/eventModel"); // Mock the eventModel module
jest.mock("../utils/Tokens"); // Mock the authorized module

describe("updateEvent function", () => {
	let req, res, eventId, update, event, userid;

	beforeEach(() => {
		req = {
			params: { eventID: "123456789012" },
			body: { name: "Updated Event Name" },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		eventId = "123456789012";
		update = { name: "Updated Event Name" };
		event = {
			_id: eventId,
			creatorId: "1234",
		};
		userid = { user_id: "1234" };
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should return 404 if event is not found", async () => {
		eventModel.findById.mockResolvedValueOnce(null);

		await updateEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith(eventId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
	});

	it(" user is not authorized to update the event", async () => {
		eventModel.findById.mockResolvedValueOnce(event);
		authorized.mockResolvedValueOnce({ user_id: "5678" });

		await updateEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith(eventId);
		expect(authorized).toHaveBeenCalledWith(req);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "You are not authorized to update this event",
		});
	});

	it(" update the event if user is authorized", async () => {
		eventModel.findById.mockResolvedValueOnce(event);
		authorized.mockResolvedValueOnce(userid);
		eventModel.findOneAndUpdate.mockResolvedValueOnce(event);

		await updateEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith(eventId);
		expect(authorized).toHaveBeenCalledWith(req);
		expect(eventModel.findOneAndUpdate).toHaveBeenCalledWith(
			{ _id: eventId },
			update,
			{ new: true, runValidators: true }
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "the event is updated",
		});
	});

	it(" there is an error", async () => {
		eventModel.findById.mockRejectedValueOnce(new Error("Database error"));

		await updateEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith(eventId);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Database error",
		});
	});
});
