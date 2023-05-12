const eventModel = require("../models/eventModel");
const {
  retrieveTicketTier,
  createTicketTier,
} = require("../controller/Events/ticketController");

jest.mock("../models/eventModel"); //mocking event model

// mock event object as a mock response from the eventModel
describe("retrieveTicketTier", () => {
  const mockEvent = {
    _id: "mockEventId",
    name: "Mock Event",
    ticketTiers: [
      {
        tierName: "VIP",
        quantitySold: 1000,
        maxCapacity: 5000,
        price: "150",
        startSelling: new Date("2023-06-01"),
        endSelling: new Date("2023-07-10"),
      },
      {
        tierName: "Regular",
        quantitySold: 2000,
        maxCapacity: 6000,
        price: "50",
        startSelling: new Date("2023-05-02"),
        endSelling: new Date("2023-06-27"),
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return ticket tier details for an event", async () => {
    eventModel.findById.mockResolvedValue(mockEvent); //  mock implementation for findById to return the mockEvent object when it is called.

    //set up mock request and response objects to pass as arguments to retrieveTicketTier
    const req = { params: { eventID: "mockEventId" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await retrieveTicketTier(req, res); //calls the retrieveTicketTier function with the mock request and response objects.

    const expectedTicketTierDetails = mockEvent.ticketTiers.map((tier) => ({
      tierName: tier.tierName,
      quantitySold: tier.quantitySold,
      maxCapacity: tier.maxCapacity,
      price: tier.price,
      percentageSold: (tier.quantitySold / tier.maxCapacity) * 100,
      startSelling: tier.startSelling,
      endSelling: tier.endSelling,
    }));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Ticket tier details for the event",
      ticketTiers: expectedTicketTierDetails,
    });
  });

  it("should return 404 if event is not found", async () => {
    eventModel.findById.mockResolvedValue(null);

    const req = { params: { eventID: "invalidEventId" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await retrieveTicketTier(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Event is not found",
    });
  });

  it("should return 400 if request is invalid", async () => {
    const errorMessage = "Invalid request";
    eventModel.findById.mockRejectedValue(new Error(errorMessage));

    const req = { params: { eventID: "invalidRequestId" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await retrieveTicketTier(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "invalid details",
    });
  });
});
