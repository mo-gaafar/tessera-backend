/*const {
	AttendeeSumJason,
} = require("../../controller/Dashboard/dashboardController");
const eventModel = require("../../models/eventModel");
const ticketModel = require("../../models/ticketModel");
const userModel2 = require("../../models/userModel");

jest.mock("../../models/eventModel.js");
jest.mock("../../models/ticketModel.js");
jest.mock("../../models/userModel.js");

describe("AttendeeSumJason", () => {
	it("returns a summary of attendees for a valid event ID", async () => {
		// Arrange
		const req = { params: { eventID: "validEventID" } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		const event = {
			_id: "123",
			basicInfo: {
				eventName: "validEventName",
			},
			soldTickets: [
				{
					ticketId: "validTicketID",
					userId: "validUserID",
					orderId: "validOrderID",
				},
			],
		};
		const ticket = {
			buyerId: "validBuyerID",
			tierName: "validTierName",
			purchasePrice: 50,
			createdAt: new Date(),
		};
		const user = {
			firstName: "John",
			lastName: "Doe",
			email: "johndoe@example.com",
		};
		const buyer = {
			firstName: "John",
			lastName: "Doe",
			email: "johndoe@example.com",
		};
		eventModel.findById.mockResolvedValueOnce(event);
		ticketModel.findById.mockResolvedValueOnce(ticket);
		userModel2.findById.mockResolvedValueOnce(user);
		userModel2.findById.mockResolvedValueOnce(buyer);

		// Act
		await AttendeeSumJason(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Summary jason return successfully",
			attendeeSummary: [
				{
					OrderId: "validOrderID",
					OrderDate: expect.any(String),
					Attending: "Attending",
					"Attendee Name": "John Doe",
					"attendee email": "johndoe@example.com",
					"Event name": "validEventName",
					"Ticket Type": "validTierName",
					"Ticket Price": 50,
					"Buyer name": "John Doe",
					"Buyer email": "johndoe@example.com",
					"Ticket Quantity": 1,
				},
			],
		});
	});

	it("returns a 404 error message for an invalid event ID", async () => {
		// Arrange
		const req = { params: { eventID: "invalidEventID" } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		eventModel.findById.mockResolvedValueOnce(null);

		// Act
		await AttendeeSumJason(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith("Event not found");
	});

	it("returns a 404 error message for an invalid ticket ID", async () => {
		// Arrange
		const req = { params: { eventID: "validEventID" } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		const event = {
			soldTickets: [
				{
					ticketId: "invalidTicketID",
					userId: "validUserID",
					orderId: "validOrderID",
				},
			],
		};
		eventModel.findById.mockResolvedValueOnce(event);
		ticketModel.findById.mockResolvedValueOnce(null);

		// Act
		await AttendeeSumJason(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith("ticket not found");
	});
	it("returns a 404 error message for an invalid user ID", async () => {
		// Arrange
		const req = { params: { eventID: "validEventID" } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		const event = {
			soldTickets: [
				{
					ticketId: "validTicketID",
					userId: "invalidUserID",
					orderId: "validOrderID",
				},
			],
		};
		const ticket = {
			buyerId: "validBuyerID",
			tierName: "validTierName",
			purchasePrice: 50,
			createdAt: new Date(),
		};
		eventModel.findById.mockResolvedValueOnce(event);
		ticketModel.findById.mockResolvedValueOnce(ticket);
		userModel2.findById.mockResolvedValueOnce(null);

		// Act
		await AttendeeSumJason(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith(new Error("Failed to fetch attendee summary");
	});
}); 
*/
const { exportAttendeeSummary } = require("./myModule"); // replace with actual module name

describe("exportAttendeeSummary", () => {
	test("should export attendee summary to CSV file and download it", async () => {
		const req = { params: { eventID: "123" } };
		const res = {
			download: jest.fn(),
		};
		const attendeeSummary = [
			{
				OrderId: "1",
				OrderDate: "2023-05-09",
				Attending: "Yes",
				"Attendee Name": "John Smith",
				"attendee email": "john.smith@example.com",
				"Event name": "My Event",
				"Ticket Quantity": 1,
				"Ticket Type": "General Admission",
				"Ticket Price": 10.0,
				"Buyer name": "Jane Doe",
				"Buyer email": "jane.doe@example.com",
			},
			{
				OrderId: "2",
				OrderDate: "2023-05-09",
				Attending: "No",
				"Attendee Name": "Bob Johnson",
				"attendee email": "bob.johnson@example.com",
				"Event name": "My Event",
				"Ticket Quantity": 2,
				"Ticket Type": "VIP",
				"Ticket Price": 50.0,
				"Buyer name": "Alice Brown",
				"Buyer email": "alice.brown@example.com",
			},
		];
		const expectedCsvHeaders = [
			{ id: "OrderId", title: "OrderId" },
			{ id: "OrderDate", title: "Order Date" },
			{ id: "Attending", title: "Attending Status" },
			{ id: "Attendee Name", title: "Name" },
			{ id: "attendee email", title: "Email" },
			{ id: "Event name", title: "Event name" },
			{ id: "Ticket Quantity", title: "Ticket Quantity" },
			{ id: "Ticket Type", title: "Ticket Type" },
			{ id: "Ticket Price", title: "Ticket Price" },
			{ id: "Buyer name", title: "Buyer Name" },
			{ id: "Buyer email", title: "Buyer Email" },
		];
		jest.spyOn(global.console, "error").mockImplementation(() => {});

		jest.mock("axios", () => ({
			get: jest.fn(() => Promise.resolve({ data: { attendeeSummary } })),
		}));

		await exportAttendeeSummary(req, res);

		expect(res.download).toHaveBeenCalledWith(
			"attendee_summary.csv",
			expect.any(Function)
		);
		expect(console.error).not.toHaveBeenCalled();
	});

	test("should handle error when getting attendee summary", async () => {
		const req = { params: { eventID: "123" } };
		const res = {
			download: jest.fn(),
		};
		const expectedErrorMessage = "Error getting attendee summary";
		jest.spyOn(global.console, "error").mockImplementation(() => {});

		jest.mock("axios", () => ({
			get: jest.fn(() => Promise.reject(new Error(expectedErrorMessage))),
		}));

		const result = await exportAttendeeSummary(req, res);

		expect(res.download).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		expect(result.error).toEqual(expectedErrorMessage);
	});
});
