const {
	AttendeeSumJason,
} = require("../../controller/Dashboard/dashboardController");
const eventModel = require("../../models/eventModel");
const ticketModel = require("../../models/ticketModel");
const userModel2 = require("../../models/userModel");
const userModel = require("../../models/userModel");

describe("AttendeeSumJason function", () => {
	let req;
	let res;

	beforeEach(() => {
		req = { params: { eventID: "someID" } };
		res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("returns attendee summary when all data is found", async () => {
		// Arrange
		const mockEvent = {
			_id: "someID",
			basicInfo: { eventName: "someEvent" },
			soldTickets: [
				{ ticketId: "ticketID", userId: "userID", orderId: "orderID" },
			],
		};
		const mockTicket = {
			_id: "ticketID",
			buyerId: "buyerID",
			tierName: "VIP",
			purchasePrice: 100,
		};
		const mockUser = {
			_id: "userID",
			firstName: "John",
			lastName: "Doe",
			email: "johndoe@example.com",
		};
		const mockBuyer = {
			_id: "buyerID",
			firstName: "Jane",
			lastName: "Doe",
			email: "janedoe@example.com",
		};
		eventModel.findById = jest.fn().mockResolvedValue(mockEvent);
		ticketModel.findById = jest.fn().mockResolvedValue(mockTicket);
		userModel2.findById = jest
			.fn()
			.mockResolvedValueOnce(mockUser)
			.mockResolvedValueOnce(mockBuyer);

		// Act
		await AttendeeSumJason(req, res);

		// Assert
		expect(eventModel.findById).toHaveBeenCalledWith("someID");
		expect(ticketModel.findById).toHaveBeenCalledWith("ticketID");
		expect(userModel2.findById).toHaveBeenCalledWith("userID");
		expect(userModel2.findById).toHaveBeenCalledWith("buyerID");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Summary jason return successfully",
			attendeeSummary: [
				{
					OrderId: "orderID",
					OrderDate: expect.any(String),
					Attending: "Attending",
					"Attendee Name": "John Doe",
					"attendee email": "johndoe@example.com",
					"Event name": "someEvent",
					"Ticket Type": "VIP",
					"Ticket Price": 100,
					"Buyer name": "Jane Doe",
					"Buyer email": "janedoe@example.com",
					"Ticket Quantity": 1,
				},
			],
		});
	});
});
/*const eventModel = require("../../models/eventModel");
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

/*const { exportAttendeeSummary } = require("./myModule"); // replace with actual module name

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
});*/

/*describe("AttendeeSumJason", () => {
	it("should return 404 if event is not found", async () => {
		const req = { params: { eventID: "invalidEventID" } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		const eventModel = { findById: jest.fn().mockReturnValue(null) };
		const ticketModel = { findById: jest.fn() };
		const userModel2 = { findById: jest.fn() };
		await AttendeeSumJason(req, res, eventModel, ticketModel, userModel2);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith("Event not found");
	});

	it("should return 404 if ticket is not found", async () => {
		const req = { params: { eventID: "validEventID" } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		const eventModel = {
			findById: jest.fn().mockReturnValue({
				soldTickets: [
					{
						ticketId: "invalidTicketID",
						userId: "validUserID",
						orderId: "validOrderID",
					},
				],
			}),
		};
		const ticketModel = { findById: jest.fn().mockReturnValue(null) };
		const userModel2 = { findById: jest.fn() };
		await AttendeeSumJason(req, res, eventModel, ticketModel, userModel2);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith("ticket not found");
	});

	it("should return 404 if user or buyer is not found", async () => {
		const req = { params: { eventID: "validEventID" } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		const eventModel = {
			findById: jest.fn().mockReturnValue({
				soldTickets: [
					{
						ticketId: "validTicketID",
						userId: "invalidUserID",
						orderId: "validOrderID",
					},
				],
			}),
		};
		const ticketModel = {
			findById: jest.fn().mockReturnValue({
				buyerId: "invalidBuyerID",
				tierName: "validTicketType",
				purchasePrice: "validTicketPrice",
				createdAt: "2023-05-09T11:51:30.035Z",
			}),
		};
		const userModel2 = { findById: jest.fn().mockReturnValue(null) };
		await AttendeeSumJason(req, res, eventModel, ticketModel, userModel2);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith("user not found");
	});

	it("should return a summary of attendees in JSON format", async () => {
		await AttendeeSumJason(mockReq, mockRes);

		expect(eventModel.findById).toHaveBeenCalledWith(mockReq.params.eventID);
		expect(ticketModel.findById).toHaveBeenCalledWith(
			mockEvent.soldTickets[0].ticketId
		);
		expect(userModel2.findById).toHaveBeenCalledTimes(2);
		expect(userModel2.findById).toHaveBeenCalledWith(
			mockEvent.soldTickets[0].userId
		);
		expect(userModel2.findById).toHaveBeenCalledWith(mockTicket.buyerId);
		expect(mockRes.status).toHaveBeenCalledWith(200);
		expect(mockRes.json).toHaveBeenCalledWith({
			success: true,
			message: "Summary jason return successfully",
			attendeeSummary: [
				{
					OrderId: mockEvent.soldTickets[0].orderId,
					OrderDate: moment(mockTicket.createdAt).format("M/D/YY h:mm A"),
					Attending: "Attending",
					"Attendee Name": `${mockUser.firstName} ${mockUser.lastName}`,
					"attendee email": mockUser.email,
					"Event name": mockEvent.basicInfo.eventName,
					"Ticket Type": mockTicket.tierName,
					"Ticket Price": mockTicket.purchasePrice,
					"Buyer name": `${mockUser.firstName} ${mockUser.lastName}`,
					"Buyer email": mockUser.email,
					"Ticket Quantity": 1,
				},
			],
		});

		// Mock the necessary functions
		eventModel.findById = jest.fn().mockResolvedValue(event);
		ticketModel.findById = jest.fn().mockResolvedValue(ticket);
		userModel2.findById = jest.fn().mockImplementation((userId) => {
			if (userId === "userID") return user;
			else if (userId === "buyerID") return buyer;
			else return null;
		});
		const momentMock = jest
			.spyOn(moment, "format")
			.mockReturnValue("5/9/23 12:00 AM");
		// Act
		await AttendeeSumJason(req, res);
		// Assert
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
		expect(eventModel.findById).toHaveBeenCalledWith("someID");
		expect(ticketModel.findById).toHaveBeenCalledWith("ticketID");
		expect(userModel2.findById).toHaveBeenCalledWith("userID");
		expect(userModel2.findById).toHaveBeenCalledWith("buyerID");
		expect(momentMock).toHaveBeenCalledWith(
			"2023-05-09T00:00:00.000Z",
			"M/D/YY h:mm A"
		);
	});
});
*/
