const eventModel = require("../models/eventModel");

const {
  eventSoldTickets,
} = require("../controller/Dashboard/dashboardController");

jest.mock("../models/eventModel");

describe("eventSoldTickets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return event sold tickets as a percentage of capacity when allTiers=true", async () => {
    const req = { params: { eventID: "1" }, query: { allTiers: "true" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockEvent = {
      ticketTiers: [
        { tierName: "Tier 1", price: 10, maxCapacity: 100, quantitySold: 50 },
        { tierName: "Tier 2", price: 20, maxCapacity: 200, quantitySold: 100 },
      ],
    };
    eventModel.findById.mockResolvedValue(mockEvent);

    await eventSoldTickets(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Event sold tickets as a percentage of the capacity ",
      soldTickets: 150,
      totalMaxCapacity: 300,
      soldTicketsFromCapacity: 50,
    });
  });

  test("should return event sold tickets by tier as a percentage of capacity when allTiers=false", async () => {
    const req = {
      params: { eventID: "1" },
      query: { allTiers: "false", tierName: "Tier 2" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockEvent = {
      ticketTiers: [
        { tierName: "Tier 1", price: 10, maxCapacity: 100, quantitySold: 50 },
        { tierName: "Tier 2", price: 20, maxCapacity: 200, quantitySold: 100 },
      ],
    };
    eventModel.findById.mockResolvedValue(mockEvent);

    await eventSoldTickets(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Event sold tickets by tier as a percentage of the capacity ",
      soldTicketsByTierType: 100,
      capacityOfDesiredTier: 200,
      perSoldTicketsByTierType: 50,
    });
  });
});
