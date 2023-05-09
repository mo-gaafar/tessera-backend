const axios = require("axios");
const {
	exportAttendeeSummary,
} = require("../../controller/Dashboard/dashboardController");

jest.mock("axios");

describe("exportAttendeeSummary", () => {
	test("exports attendee summary to CSV file and downloads it", async () => {
		const req = {
			params: {
				eventID: "1234",
			},
		};
		const res = {
			download: jest.fn(),
		};
		const attendeeSummary = [
			{
				OrderId: "1",
				OrderDate: "2022-06-01",
				Attending: "Yes",
				"Attendee Name": "John Doe",
				"attendee email": "johndoe@example.com",
				"Event name": "Example Event",
				"Ticket Quantity": "1",
				"Ticket Type": "General Admission",
				"Ticket Price": "50.00",
				"Buyer name": "Jane Smith",
				"Buyer email": "janesmith@example.com",
			},
		];
		axios.get.mockResolvedValue({ data: { attendeeSummary } });

		await exportAttendeeSummary(req, res);

		expect(res.download).toHaveBeenCalledWith(
			"attendee_summary.csv",
			expect.any(Function)
		);
	});

	test("returns error message if there is an error", async () => {
		const req = {
			params: {
				eventID: "1234",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const errorMessage = "res is not defined";
		axios.get.mockRejectedValue(new Error(errorMessage));

		await exportAttendeeSummary(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: errorMessage,
		});
	});
});
