const { createEvent } = require("../controller/Events/eventController");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");

const { authorized } = require("../utils/Tokens");

jest.mock("../models/eventModel");
jest.mock("../models/userModel");
jest.mock("../utils/Tokens");

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

  it(" error creating the event", async () => {
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
});
