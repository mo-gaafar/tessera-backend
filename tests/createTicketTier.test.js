const eventModel = require("../models/eventModel");
const {
  retrieveTicketTier,
  createTicketTier,
} = require("../controller/Events/ticketController");
const userModel = require("../models/userModel");
const { retrieveToken, verifyToken, authorized } = require("../utils/Tokens");

jest.mock("../models/eventModel"); //mocking event model
jest.mock("../models/userModel"); //mocking user model
jest.mock("../utils/Tokens.js");
// const authorized = jest.fn().mockResolvedValue({ authorized: true, user_id: 'mockUserId' });

describe("createTicketTier", () => {
  const mockEvent = {
    _id: "mockEventId",
    name: "Mock Event",
    creatorId: "mockCreatorId",
    ticketTiers: [],
  };

  const mockUser = {
    _id: "mockCreatorId",
    username: "mockUser",
    password: "mockPassword",
  };

  const mockReq = {
    params: { eventID: "mockEventId" },
    body: {
      tierName: "VIP",
      maxCapacity: 500,
      price: "1000",
      startSelling: new Date("2023-05-05"),
      endSelling: new Date("2023-05-20"),
    },
  };

  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 404 status if event is not found", async () => {
    eventModel.findById.mockResolvedValue(null);

    await createTicketTier(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "No event Found",
    });
  });

  it("should return a 402 status if user is not found", async () => {
    authorized.mockResolvedValue({ authorized: false, user_id: null });
    eventModel.findById.mockResolvedValue(mockEvent);

    await createTicketTier(mockReq, mockRes);

    expect(authorized).toHaveBeenCalledWith(mockReq);
    expect(eventModel.findById).toHaveBeenCalledWith(mockReq.params.eventID);
    expect(mockRes.status).toHaveBeenCalledWith(402);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "the user is not found",
    });
  });

  it("should return a 401 status if user is not authorized to create ticket tier for this event", async () => {
    authorized.mockResolvedValue({ authorized: true, user_id: "mockUserId" });
    eventModel.findById.mockResolvedValue({
      ...mockEvent,
      creatorId: "otherUserId",
    });

    await createTicketTier(mockReq, mockRes);

    expect(authorized).toHaveBeenCalledWith(mockReq);
    expect(eventModel.findById).toHaveBeenCalledWith(mockReq.params.eventID);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "You are not authorized to create tier for this event",
    });
  });

  it("should return a 404 status if tier name is not unique", async () => {
    authorized.mockResolvedValue({ authorized: true, user_id: mockUser._id });
    eventModel.findById.mockResolvedValue({
      mockEvent,
      ticketTiers: [{ tierName: "VIP" }],
    });
  });
});
