const axios = require("axios");
const moment = require("moment");
const {
	exportsListEvents,
} = require("../controller/Events/eventsRetrievalController");

jest.mock("axios");

describe("exportsListEvents function", () => {
	let req;
	let res;

	beforeEach(() => {
		req = {
			query: {
				filterBy: "upcoming",
			},
			headers: {
				authorization: "Bearer token",
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

	it("should export event list to a CSV file and download it", async () => {
		const instanceMock = {
			get: jest.fn().mockResolvedValue({
				data: {
					filteredEvents: [
						{
							basicInfo: {
								eventName: "Event 1",
								startDateTime: "2023-05-11T12:00:00Z",
							},
							eventStatus: "Upcoming",
						},
						{
							basicInfo: {
								eventName: "Event 2",
								startDateTime: "2023-05-12T14:00:00Z",
							},
							eventStatus: "Upcoming",
						},
					],
					eventsoldtickets: [50, 20],
					maxCapacity: [100, 50],
				},
			}),
		};

		axios.create.mockReturnValue(instanceMock);

		await exportsListEvents(req, res);

		expect(instanceMock.get).toHaveBeenCalledWith(
			`${process.env.BASE_URL}/event-management/listEvents/?filterBy=upcoming`,
			{
				headers: {
					Authorization: "Bearer token",
				},
			}
		);

		expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
		expect(res.setHeader).toHaveBeenCalledWith(
			"Content-Disposition",
			"attachment; filename=listEvents.csv"
		);
		expect(res.download).toHaveBeenCalledWith("listEvents.csv");
	});

	it("should handle errors when exporting event list", async () => {
		const instanceMock = {
			get: jest.fn().mockRejectedValue(new Error("API error")),
		};

		axios.create.mockReturnValue(instanceMock);

		await exportsListEvents(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Error occurred while fetching event sales data",
		});
	});
});
