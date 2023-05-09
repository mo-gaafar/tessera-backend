const axios = require("axios");
const moment = require("moment");
const {
	exportsListEvents,
} = require("../../controller/Events/eventsRetrievalController");
require("dotenv").config();
jest.mock("axios");

describe("exportsListEvents", () => {
	let req;
	let res;

	beforeEach(() => {
		req = {
			query: {
				filterBy: "upcoming",
			},
			headers: {
				authorization: "Bearer abc123",
			},
		};
		res = {
			setHeader: jest.fn(),
			download: jest.fn(),
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	it("should export event data to CSV and send to client", async () => {
		// Define mock response data
		const eventData = {
			filteredEvents: [
				{
					basicInfo: {
						eventName: "Test Event 1",
						startDateTime: "2022-01-01T10:00:00Z",
					},
					eventStatus: "published",
				},
				{
					basicInfo: {
						eventName: "Test Event 2",
						startDateTime: "2022-02-01T14:30:00Z",
					},
					eventStatus: "draft",
				},
			],
			eventsoldtickets: [10, 20],
			maxCapacity: [100, 200],
		};
		axios.create.mockReturnValue({
			get: jest.fn().mockResolvedValue({
				data: eventData,
			}),
		});

		// Define expected CSV data
		const expectedCsvData = [
			{
				eventName: "Test Event 1",
				startDateTime: "Saturday, January 1, 2022, 10:00 AM",
				status: "published",
				eventsoldtickets: 10,
				RemainingTickets: 90,
			},
			{
				eventName: "Test Event 2",
				startDateTime: "Tuesday, February 1, 2022, 2:30 PM",
				status: "draft",
				eventsoldtickets: 20,
				RemainingTickets: 180,
			},
		];

		// Call function and check CSV data
		await exportsListEvents(req, res);
		expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
		expect(res.setHeader).toHaveBeenCalledWith(
			"Content-Disposition",
			"attachment; filename=listEvents.csv"
		);
		expect(res.download).toHaveBeenCalledWith("listEvents.csv");
	});
});
