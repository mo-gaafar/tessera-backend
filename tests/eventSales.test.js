const eventModel = require("../models/eventModel");
const {
  retrieveTicketTier,
  createTicketTier,
} = require("../controller/Events/ticketController");
const { eventSales } = require("../controller/Dashboard/dashboardController");
const userModel = require("../models/userModel");
const { retrieveToken, verifyToken, authorized } = require("../utils/Tokens");

describe("eventSales", () => {
  let req, res, event;

  beforeEach(() => {
    req = {
      params: {
        eventID: "event123",
      },
      query: {
        allTiers: "true",
        tierName: "Tier 1",
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    event = {
      _id: "event123",
      name: "Test Event",
      date: new Date(),
      creatorId: "user123",
      ticketTiers: [
        {
          tierName: "Tier 1",
          maxCapacity: 100,
          price: 10,
          startSelling: new Date(),
          endSelling: new Date(),
          quantitySold: 50,
        },
        {
          tierName: "Free",
          maxCapacity: 50,
          price: "Free",
          startSelling: new Date(),
          endSelling: new Date(),
          quantitySold: 10,
        },
      ],
    };
    jest.spyOn(eventModel, "findById").mockResolvedValueOnce(event);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return total event sales when allTiers is "true"', async () => {
    await eventSales(req, res);

    expect(eventModel.findById).toHaveBeenCalledWith("event123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Total Event Sales:  ",
      totalSales: 500,
    });
  });

  it('should return event sales by specified tier type when allTiers is "false" and tierName is specified', async () => {
    req.query.allTiers = "false";
    await eventSales(req, res);

    expect(eventModel.findById).toHaveBeenCalledWith("event123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Event Sales by the specified tier type:  ",
      salesByTierType: 500,
    });
  });

  it('should return 404 error when allTiers is "false" and tierName is "Free"', async () => {
    req.query.allTiers = "false";
    req.query.tierName = "Free";
    await eventSales(req, res);

    expect(eventModel.findById).toHaveBeenCalledWith("event123");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "There are no event sales for free ticket tiers ",
    });
  });
});
