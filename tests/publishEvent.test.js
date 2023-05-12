// const { publishEvent } = require("../../controller/Events/eventController");
const { publishEvent } = require("../controller/Events/eventController");
const eventModel = require("../models/eventModel");

jest.mock("../models/eventModel");

describe("publishEvent", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { eventID: "eventID" },
      body: {
        isPublic: true,
        publishNow: true,
        publicDate: new Date(),
        privateToPublicDate: new Date(),
        link: "link",
        generatedPassword: "password",
        password: "password",
        alwaysPrivate: true,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // clear all mocks after each test
  });

  test("should return 404 if no event is found", async () => {
    eventModel.findById.mockResolvedValue(null);

    await publishEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No event Found",
    });
  });
});
