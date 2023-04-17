const { createEvent } = require("../controller/Events/eventController");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");

const {
	GenerateToken,
	retrieveToken,
	verifyToken,
	authorized,
} = require("../utils/Tokens");

jest.mock("../models/eventModel");
//jest.mock("../Auth/userController");
jest.mock("../models/userModel.js");
jest.mock("../utils/Tokens.js");

describe("createEvent", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should create an event successfully", async () => {
		const req = {
			body: {
				title: "Test Event",
				description: "Test description",
				location: "Test Location",
				date: "2023-04-18",
			},
		};
		const res = {
			status: jest.fn(() => res),
			json: jest.fn(),
		};

		authorized.mockResolvedValueOnce({
			authorized: true,
			user_id: "testuser123",
		});

		eventModel.create.mockResolvedValueOnce({});

		await createEvent(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Event has been created successfully",
		});
	});

	it("should return an error if there was an error creating the event", async () => {
		const req = {
			body: {
				title: "Test Event",
				description: "Test description",
				location: "Test Location",
				date: "2023-04-18",
			},
		};
		const res = {
			status: jest.fn(() => res),
			json: jest.fn(),
		};

		authorized.mockResolvedValueOnce({
			authorized: true,
			user_id: "testuser123",
		});

		eventModel.create.mockRejectedValueOnce(new Error("Error creating event"));

		await createEvent(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Error creating event",
		});
	});

	it("should return an error if user is not authorized", async () => {
		const req = {
			body: {
				title: "Test Event",
				description: "Test description",
				location: "Test Location",
				date: "2023-04-18",
			},
		};
		const res = {
			status: jest.fn(() => res),
			json: jest.fn(),
		};

		//authorized.mockReturnValueOnce(false);
		authorized.mockResolvedValueOnce({ authorized: false });
		//console.log(authorized);

		await createEvent(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "the user doesnt have access",
		});
	});
});

/*require("mongoose");
const {
	GenerateToken,
	retrieveToken,
	verifyToken,
	authorized,
} = require("../utils/Tokens");
const jwt = require("jsonwebtoken");
jest.mock("../models/userModel");
jest.mock("../models/eventModel");
jest.mock("../controller/Auth/userController");

describe("createEvent function", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should create a new event", async () => {
		const req = {
			body: {
				title: "Test Event",
				date: "2023-04-18",
				location: "Test Location",
				description: "Test description",
			},
			headers: {
				authorization: "Bearer somefaketoken",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const mockUser = {
			_id: "testuserid",
		};
		userModel.findById.mockResolvedValue(mockUser);

		const mockEvent = {
			_id: "testeventid",
			creatorId: "testuserid",
			title: "Test Event",
			date: "2023-04-18",
			location: "Test Location",
			description: "Test description",
		};
		eventModel.create.mockResolvedValue(mockEvent);

		await createEvent(req, res);

		expect(userModel.findById).toHaveBeenCalledWith("testuserid");
		expect(eventModel.create).toHaveBeenCalledWith({
			title: "Test Event",
			date: "2023-04-18",
			location: "Test Location",
			description: "Test description",
			creatorId: "testuserid",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Event has been created successfully",
		});
	});

	it("should return 400 error when authorization fails", async () => {
		const req = {
			headers: {
				authorization: "Bearer invalidtoken",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		userModel.findById.mockResolvedValue(null);

		await createEvent(req, res);

		expect(userModel.findById).not.toHaveBeenCalled();
		expect(eventModel.create).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Authorization failed",
		});
	});

	it("should return 400 error when event creation fails", async () => {
		const req = {
			body: {
				title: "Test Event",
				date: "2023-04-18",
				location: "Test Location",
				description: "Test description",
			},
			headers: {
				authorization: "Bearer somefaketoken",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const mockUser = {
			_id: "testuserid",
		};
		userModel.findById.mockResolvedValue(mockUser);

		const errorMessage = "Error creating event";
		eventModel.create.mockRejectedValue(new Error(errorMessage));

		await createEvent(req, res);

		expect(userModel.findById).toHaveBeenCalledWith("testuserid");
		expect(eventModel.create).toHaveBeenCalledWith({
			title: "Test Event",
			date: "2023-04-18",
			location: "Test Location",
			description: "Test description",
			creatorId: "testuserid",
		});
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: errorMessage,
		});
	});
});

/*describe("createEvent function", () => {
	it("should create a new event", async () => {
		const req = {
			body: {
				title: "Test Event",
				date: "2023-04-18",
				location: "Test Location",
				description: "Test description",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const userid = "testuser123";
		const event = {
			...req.body,
			creatorId: userid,
		};
		const createMock = jest
			.spyOn(eventModel, "create")
			.mockResolvedValue(event);

		await createEvent(req, res);

		expect(createMock).toHaveBeenCalledWith({
			...req.body,
			creatorId: userid,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Event has been created successfully",
		});

		createMock.mockRestore();
	});

	it("should return an error if there was an error creating the event", async () => {
		const req = {
			body: {
				title: "Test Event",
				date: "2023-04-18",
				location: "Test Location",
				description: "Test description",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const error = new Error("Error creating event");
		jest.spyOn(eventModel, "create").mockRejectedValue(error);

		await createEvent(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: error.message,
		});

		eventModel.create.mockRestore();
	});
});
*/

/*jest.mock("../models/eventModel");

describe("createEvent function", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should create a new event", async () => {
		// Mock authorized function to return a user ID
		const authorized = jest.fn().mockResolvedValue("testuser123");
		// Mock eventModel.create to return a new event object
		eventModel.create.mockResolvedValue({
			_id: "eventid123",
			title: "Test Event",
			date: "2023-04-18",
			location: "Test Location",
			description: "Test description",
			creatorId: "testuser123",
		});
		const req = {
			body: {
				title: "Test Event",
				date: "2023-04-18",
				location: "Test Location",
				description: "Test description",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await createEvent(req, res);

		expect(authorized).toHaveBeenCalledWith(req);
		expect(eventModel.create).toHaveBeenCalledWith({
			title: "Test Event",
			date: "2023-04-18",
			location: "Test Location",
			description: "Test description",
			creatorId: "testuser123",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Event has been created successfully",
		});
	});

	it("should return a 400 error if there is an error creating the event", async () => {
		// Mock authorized function to return a user ID
		const authorized = jest.fn().mockResolvedValue("testuser123");
		// Mock eventModel.create to throw an error
		eventModel.create.mockRejectedValue(new Error("Could not create event"));
		const req = {
			body: {
				title: "Test Event",
				date: "2023-04-18",
				location: "Test Location",
				description: "Test description",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await createEvent(req, res);

		//expect(authorized).toHaveBeenCalledWith(req);
		expect(eventModel.create).toHaveBeenCalledWith({
			title: "Test Event",
			date: "2023-04-18",
			location: "Test Location",
			description: "Test description",
			creatorId: "testuser123",
		});
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Could not create event",
		});
	});
});*/
