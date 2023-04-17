const eventModel = require("../models/eventModel");
const { getEventById } = require("../controller/Events/eventController");
const userModel = require("../controller/Auth/userController.js");
const {
	GenerateToken,
	retrieveToken,
	verifyToken,
	authorized,
} = require("../utils/Tokens");

jest.mock("../models/eventModel");
jest.mock("../controller/Auth/userController.js");
jest.mock("../utils/Tokens.js");

describe("getEventById function", () => {
	let req, res;

	beforeEach(() => {
		req = { params: { eventID: "123456" } };
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should return the event object if the user is authorized to retrieve it", async () => {
		const eventId = "123456";
		const userId = "abcdef";
		const event = { _id: eventId, creatorId: userId };
		const token = "token123";

		authorized.mockResolvedValue({ authorized: true, user_id: userId });
		eventModel.findById.mockResolvedValue(event);

		await getEventById(req, res);

		expect(authorized).toHaveBeenCalledWith(req);
		expect(eventModel.findById).toHaveBeenCalledWith(eventId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ event });
	});

	it("should return a 404 error message if the event is not found", async () => {
		eventModel.findById.mockReturnValue(null);
		const errorMessage = "No event Found";

		await getEventById(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith(req.params.eventID);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: errorMessage,
		});
	});

	it("should return a 401 error message if the user is not authorized to retrieve the event", async () => {
		const eventId = "123456";
		const userId = "abcdef";
		const event = { _id: eventId, creatorId: "xyz" };
		const token = "token123";

		authorized.mockResolvedValue({ authorized: true, user_id: userId });
		eventModel.findById.mockResolvedValue(event);

		await getEventById(req, res);

		expect(authorized).toHaveBeenCalledWith(req);
		expect(eventModel.findById).toHaveBeenCalledWith(eventId);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "You are not authorized to retrieve this event",
		});
	});

	it("should return a 400 error message if an error occurs while retrieving the event", async () => {
		const errorMessage = "Error retrieving event";
		eventModel.findById.mockRejectedValue(new Error(errorMessage));

		await getEventById(req, res);

		expect(eventModel.findById).toHaveBeenCalledWith(req.params.eventID);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: errorMessage,
		});
	});
});
