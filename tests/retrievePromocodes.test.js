const {
	retriveAllPromocodesForEvent,
} = require("../controller/Events/promocodeController");
const eventModel = require("../models/eventModel");
describe("retriveAllPromocodesForEvent", () => {
	const req = {
		params: {
			event_Id: "event123",
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

	it("should return an error if user is not authorized", async () => {
		// Mock eventModel.findById to return a mock event object
		const mockEvent = { creatorId: "user123" };
		jest.spyOn(eventModel, "findById").mockResolvedValue(mockEvent);
		eventModel.findById.mockResolvedValue(mockEvent);

		// Mock promocodeModel.find to return mock promocodes
		const mockPromocodes = [
			{
				code: "PROMO123",
				discount: 20,
				remainingUses: 10,
			},
			{
				code: "PROMO456",
				discount: 30,
				remainingUses: 0,
			},
		];

		await retriveAllPromocodesForEvent(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Cannot read properties of undefined (reading 'authorization')",
		});
	});

	it("should return an error if event is not found", async () => {
		// Mock eventModel.findById to return null (event not found)
		eventModel.findById.mockResolvedValue(null);

		await retriveAllPromocodesForEvent(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "No event Found" });
	});
});
