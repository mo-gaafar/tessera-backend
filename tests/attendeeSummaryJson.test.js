const eventModel = require("../models/eventModel");
const ticketModel = require("../models/ticketModel");
const userModel2 = require("../models/userModel");
const {
	AttendeeSumJason,
} = require("../controller/Dashboard/dashboardController");

describe("AttendeeSumJason function", () => {
	let req;
	let res;

	beforeEach(() => {
		req = { params: { eventID: "someID" } };
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			send: jest.fn(),
		};
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

	test("returns 404 if event is not found", async () => {
		// Arrange
		eventModel.findById = jest.fn().mockResolvedValue(null);

		// Act
		await AttendeeSumJason(req, res);

		// Assert
		expect(eventModel.findById).toHaveBeenCalledWith("someID");
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith("Event not found");
	});
});
