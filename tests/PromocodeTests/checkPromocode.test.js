const {
	checkPromocode,
} = require("../../controller/Events/promocodeController");
const promocodeModel = require("../../models/promocodeModel");
const promocodeController = require("../../controller/Events/promocodeController");

describe("checkPromocode", () => {
	it("should return success if promocode exists for the event", async () => {
		const req = {
			params: {
				eventId: "event123",
			},
			query: {
				code: "PROMO123",
			},
		};

		const res = {
			status: jest.fn(() => res),
			json: jest.fn(),
		};

		// Mock the promocodeModel.findOne method
		promocodeModel.findOne = jest.fn().mockResolvedValue({ discount: 10 });

		await checkPromocode(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Promocode exists",
			discount: expect.any(Number),
		});
	});

	it("should return error if promocode does not exist for the event", async () => {
		const req = {
			params: {
				eventId: "event123",
			},
			query: {
				code: "NONEXISTENT",
			},
		};

		const res = {
			status: jest.fn(() => res),
			json: jest.fn(),
		};
		promocodeModel.findOne = jest.fn().mockResolvedValue(null);

		// Mock the checkPromocodeExists function
		promocodeController.checkPromocodeExists = jest
			.fn()
			.mockImplementation(async (eventId, code) => {
				// Simulate the behavior of the actual function
				const promocode = await promocodeModel.findOne({
					event: null,
					code,
				});
				return promocode ? promocode.discount : false;
			});

		await checkPromocode(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Promocode does not exist",
		});
	});
});
