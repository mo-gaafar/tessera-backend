/*const {
  createPromocode,
  checkPromocodeExists,
  addPromocodeToEvent,
} = require("../../controller/Events/promocodeController");
const eventModel = require("../../models/eventModel");
const promocodeModel = require("../../models/promocodeModel");
const { authorized } = require("../../utils/Tokens");

// const { authorized } = require("../../utils/Tokens");
// const { updateEvent } = require("../../controller/Events/eventController");

jest.mock("../../models/eventModel");
jest.mock("../../models/promocodeModel");

describe("createPromocode", () => {
  const mockReq = {
    params: {
      event_Id: "mock-event-id",
    },
    body: {
      code: "MOCKCODE",
      discount: 10,
      limitOfUses: 100,
    },
  };
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 401 status if the event is not found", async () => {
    eventModel.findById = jest.fn(() => null);

    await createPromocode(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Event not found",
    });
  });
});*/
