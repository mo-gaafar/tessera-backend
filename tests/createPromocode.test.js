const { createPromocode } = require("../controller/Events/promocodeController");

// Mock dependencies
jest.mock("../models/eventModel");
jest.mock("../models/promocodeModel");
jest.mock("../utils/Tokens");
jest.mock("../utils/logger");

describe("createPromocode", () => {
	const req = {
		params: {
			event_Id: "event123",
		},
		body: {
			code: "PROMO123",
			discount: 20,
			limitOfUses: 100,
		},
	};
	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	beforeEach(() => {
		// Clear mock function calls and return values before each test
		Object.values(res).forEach((mockFn) => mockFn.mockClear());
	});

	it("should return an error if event is not found", async () => {
		// Mock eventModel.findById to return null (event not found)
		const eventModel = require("../models/eventModel");
		eventModel.findById.mockResolvedValue(null);

		await createPromocode(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Event not found",
		});
	});

	it("should return an error if user is not authorized", async () => {
		// Mock eventModel.findById to return a mock event object
		const mockEvent = { creatorId: "user123" };
		const eventModel = require("../models/eventModel");
		eventModel.findById.mockResolvedValue(mockEvent);

		// Mock authorized to return unauthorized status
		const authorized = require("../utils/Tokens").authorized;
		authorized.mockResolvedValue({ authorized: false });

		await createPromocode(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "You are not authorized to create a promocode for this event",
		});
	});
});
