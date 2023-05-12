const axios = require("axios");
const {
	exportEventSales,
} = require("../controller/Dashboard/dashboardController");

jest.mock("axios");

describe("exportEventSales function", () => {
	let req;
	let res;

	beforeEach(() => {
		req = {
			params: {
				eventID: "12345",
			},
			query: {
				allTiers: true,
				tierName: "VIP",
			},
		};
		res = {
			setHeader: jest.fn(),
			download: jest.fn(),
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should export event sales data to a CSV file and download it", async () => {
		const mockResponse = {
			data: {
				totalSales: 1000,
				salesByTierType: [
					{
						tierName: "VIP",
						totalSales: 500,
					},
					{
						tierName: "General",
						totalSales: 500,
					},
				],
			},
		};
		axios.create.mockReturnValue({
			get: jest.fn().mockResolvedValue(mockResponse),
		});

		await exportEventSales(req, res);

		expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
		expect(res.setHeader).toHaveBeenCalledWith(
			"Content-Disposition",
			"attachment; filename=event_sales.csv"
		);
		expect(res.download).toHaveBeenCalledWith(
			"event_sales.csv",
			expect.any(Function)
		);
	});

	it("should handle errors when exporting event sales data", async () => {
		const mockError = new Error(
			"Error occurred while fetching event sales data"
		);
		axios.create.mockReturnValue({
			get: jest.fn().mockRejectedValue(mockError),
		});

		await exportEventSales(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Error occurred while fetching event sales data",
		});
	});
});
