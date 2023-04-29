const eventModel = require("../../models/eventModel");
const { getEventById } = require("../../controller/Events/eventController");
const userModel = require("../../controller/Auth/userController.js");
const { authorized } = require("../../utils/Tokens");

jest.mock("../../models/eventModel");
jest.mock("../../controller/Auth/userController");
jest.mock("../../utils/Tokens");

describe("getEventById function", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { eventID: "123456" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("the user is authorized to retrieve it", async () => {
    const eventId = "123456";
    const userId = "abcdef";
    const event = { _id: eventId, creatorId: userId };

    authorized.mockResolvedValue({ authorized: true, user_id: userId });
    eventModel.findById.mockResolvedValue(event);

    await getEventById(req, res);

    expect(authorized).toHaveBeenCalledWith(req);
    expect(eventModel.findById).toHaveBeenCalledWith(eventId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ event });
  });

  it("error message if the event is not found", async () => {
    eventModel.findById.mockReturnValue(null);
    const errorMessage = "No event Found";

    await getEventById(req, res);

    expect(eventModel.findById).toHaveBeenCalledWith(req.params.eventID);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage,
    });
  });

  it("user not authorized to retrieve event", async () => {
    const eventId = "123456";
    const userId = "abcdef";
    const event = { _id: eventId, creatorId: "xyz" };

    authorized.mockResolvedValue({ authorized: true, user_id: userId });
    eventModel.findById.mockResolvedValue(event);

    await getEventById(req, res);

    expect(authorized).toHaveBeenCalledWith(req);
    expect(eventModel.findById).toHaveBeenCalledWith(eventId);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "You are not authorized to retrieve this event",
    });
  });

  it("error occurs while retrieving the event", async () => {
    eventModel.findById.mockRejectedValue(
      new Error("Something wrong with the request")
    );

    await getEventById(req, res);

    expect(eventModel.findById).toHaveBeenCalledWith(req.params.eventID);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Something wrong with the request",
    });
  });
});
