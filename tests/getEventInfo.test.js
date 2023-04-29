const eventModel = require("../models/eventModel");
const { getEventInfo } = require("../controller/attendees/attendeeController");
describe("getEventInfo function", () => {
  let req, res;
  beforeEach(() => {
    req = { params: { eventID: "643aa02d4d2e42199562be5f" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  //643aa02d4d2e42199562be5f event id
  test("returns error when eventId is missing", async () => {
    req = {
      params: {},
    };

    await getEventInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Missing eventId parameter",
    });
  });
  test("should filter events based on the query object and return populated creator fields", async () => {
    // Create a mock query object
    const query = { date: "2023-05-01", location: "New York" };
    // Create a mock event object that matches the query
    const mockEvent = {
      date: "2023-05-01",
      location: "New York",
      creatorId: { _id: "123", firstName: "John", lastName: "Doe" },
    };
    // Mock the find and populate methods of the eventModel object
    eventModel.find = jest.fn().mockReturnThis(); // mock the chaining of methods
    eventModel.populate = jest.fn().mockResolvedValue([mockEvent]); // mock the populated result
    // Call the find function with the mock request and query objects
    //event filtered using the query object
    const event = await eventModel
      .find(query)
      //get only these fields from creator
      .populate("creatorId", "_id firstName lastName");
    // Verify that the eventModel.find() method was called with the correct query
    expect(eventModel.find).toHaveBeenCalledWith(query);

    // Verify that the eventModel.populate() method was called with the correct arguments
    expect(eventModel.populate).toHaveBeenCalledWith(
      "creatorId",
      "_id firstName lastName"
    );

    // Verify that the filterEvent function returned the expected array of events
    expect(event).toEqual([mockEvent]);
  });
  test("should check tier capacity and return correct output", () => {
    const tierCapacityFull = [];
    var isEventCapacityFull = true;
    var isEventFree = true;
    var counter1 = 0;
    var counter2 = 0;
    const event = [
      {
        ticketTiers: [
          {
            tierName: "VIP",
            maxCapacity: 100,
            quantitySold: 100,
            price: "Paid",
          },
          {
            tierName: "Regular",
            maxCapacity: 100,
            quantitySold: 50,
            price: "Free",
          },
        ],
      },
    ];
    for (let i = 0; i < event[0].ticketTiers.length; i++) {
      const tier = event[0].ticketTiers[i];
      const isTierCapacityFull = tier.maxCapacity === tier.quantitySold;
      if (isTierCapacityFull === false) {
        counter1 = counter1 + 1;
      }
      if (tier.price != "Free") {
        counter2 = counter2 + 1;
      }
      tierCapacityFull.push({
        tierName: tier.tierName,
        isCapacityFull: isTierCapacityFull,
      });
    }
    if (counter1 > 0) {
      isEventCapacityFull = false;
    } else {
      isEventCapacityFull = true;
    }
    if (counter2 > 0) {
      isEventFree = false;
    } else {
      isEventFree = true;
    }
    expect(tierCapacityFull).toEqual([
      {
        tierName: "VIP",
        isCapacityFull: true,
      },
      {
        tierName: "Regular",
        isCapacityFull: false,
      },
    ]);
    expect(isEventCapacityFull).toEqual(false);
    expect(isEventFree).toEqual(false);
  });

  test("should filter out unnecessary fields from the events", () => {
    const event = [
      {
        _id: "143756tf8tdg4736289",
        createdAt: "2022-01-01T00:00:00.000Z",
        updatedAt: "2022-01-01T00:00:00.000Z",
        __v: 1,
        eventStatus: "live",
        published: true,
        isPublic: true,
        isVerified: true,
        promocodes: [],
        startSelling: "2022-01-01T00:00:00.000Z",
        endSelling: "2022-01-01T00:00:00.000Z",
        publicDate: "2022-01-01T00:00:00.000Z",
        emailMessage: "Welcome to our event!",
        soldTickets: 100,
        privatePassword: "43587r698754fgh45@",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        creatorId: { _id: "123", firstName: "John", lastName: "Doe" },
      },
    ];
    const filteredEvents = event.map((eventModel) => {
      const {
        _id,
        createdAt,
        updatedAt,
        __v,
        eventStatus,
        published,
        isPublic,
        isVerified,
        promocodes,
        startSelling,
        endSelling,
        publicDate,
        emailMessage,
        soldTickets,
        privatePassword,
        ...filtered
      } = eventModel;
      return filtered;
    });
    expect(filteredEvents).toEqual([
      {
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        creatorId: { _id: "123", firstName: "John", lastName: "Doe" },
      },
    ]);
  });
  test("returns the event info, tier capacity, and event capacity", async () => {
    const event = [
      {
        _id: "143756tf8tdg4736289",
        createdAt: "2022-01-01T00:00:00.000Z",
        updatedAt: "2022-01-01T00:00:00.000Z",
        __v: 1,
        eventStatus: "live",
        published: true,
        isPublic: true,
        isVerified: true,
        promocodes: [],
        startSelling: "2022-01-01T00:00:00.000Z",
        endSelling: "2022-01-01T00:00:00.000Z",
        publicDate: "2022-01-01T00:00:00.000Z",
        emailMessage: "Welcome to our event!",
        soldTickets: 100,
        privatePassword: "43587r698754fgh45@",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        creatorId: { _id: "123", firstName: "John", lastName: "Doe" },
        ticketTiers: [
          {
            tierName: "VIP",
            maxCapacity: 100,
            quantitySold: 100,
            price: "Paid",
          },
          {
            tierName: "Regular",
            maxCapacity: 100,
            quantitySold: 50,
            price: "Free",
          },
        ],
      },
    ];
  });
});
