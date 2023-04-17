const { deleteEvent } = require("../controller/Events/eventController");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");
const { authorized } = require("../utils/Tokens");
jest.mock("../models/eventModel");
jest.mock("../controller/Auth/userController.js");
jest.mock("../utils/Tokens.js");

describe("deleteEvent", () => {
	let req, res, event;

	beforeEach(() => {
		req = {
			params: {
				eventID: "123",
			},
		};
		res = {
			status: jest.fn(() => res),
			json: jest.fn(),
		};
		event = {
			_id: "123",
			creatorId: "user1",
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return 404 if event is not found", async () => {
		eventModel.findById.mockResolvedValue(null);

		await deleteEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith("123");
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "No event Found" });
	});

	it("should return 401 if user is not authorized to delete event", async () => {
		eventModel.findById.mockResolvedValue(event);
		event.creatorId = "1234";
		userId = "44444";

		authorized.mockResolvedValue({ authorized: true, user_id: userId });
		eventModel.findById.mockResolvedValue(event);

		await deleteEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith("123");
		expect(authorized).toHaveBeenCalledWith(req);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "You are not authorized to delete this event",
		});
	});

	it("should delete the event if user is authorized", async () => {
		eventModel.findById.mockResolvedValue(event);
		authorized.mockResolvedValue({ authorized: true, user_id: "user1" });

		await deleteEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith("123");
		expect(authorized).toHaveBeenCalledWith(req);
		expect(eventModel.findByIdAndDelete).toHaveBeenCalledWith("123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "the event is deleted",
		});
	});

	it("should return 400 if an error occurs", async () => {
		eventModel.findById.mockRejectedValue(new Error("Something went wrong"));

		await deleteEvent(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith("123");
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Something went wrong",
		});
	});
});
