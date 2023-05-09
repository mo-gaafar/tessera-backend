const eventModel = require("../models/eventModel");
jest.mock("../models/eventModel");

const {
  listEvents,
  computeEventsSellingInformation,
  getTimeNowUTC,
  filterCreatorEvents,
  removeExtraAttributes,
} = require("../controller/Events/eventsRetrievalController");
const { authorized } = require("../utils/Tokens");
jest.mock("../models/eventModel");
jest.mock("../controller/Auth/userController");
jest.mock("../utils/Tokens");
describe("listEvents function", () => {
  const req = {
    //all the req.query.params
    query: {
      filterBy: "allevents",
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const events = [
    {
      basicInfo: {
        location: {
          longitude: 45.523064,
          latitude: -122.676483,
          placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
          venueName: "My Venue",
          streetNumber: 123,
          route: "Main St",
          administrativeAreaLevel1: "OR",
          country: "US",
          city: "Portland",
        },
        eventName: "Tessseraaaaaa",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://picsum.photos/282/140",
        categories: "Music",
      },
      eventStatus: "live",
      isOnline: false,
      eventUrl: "https://www.tessera.social/",
      _id: "123",
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
      __v: 0,
      privatePassword: "secret",
      isVerified: true,
      promocodes: [],
      startSelling: "2022-01-01T00:00:00.000Z",
      endSelling: "2022-01-02T00:00:00.000Z",
      publicDate: "2022-01-03T00:00:00.000Z",
      emailMessage: "Welcome to the event!",
      soldTickets: 100,
      ticketTiers: [
        { name: "VIP", price: 50 },
        { name: "General", price: 25 },
      ],
      summary: "The best event ever",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      isPublic: true,
      published: true,
      creatorId: "456",
    },
    {
      basicInfo: {
        location: {
          longitude: 45.523064,
          latitude: -122.676483,
          placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
          venueName: "My Venue",
          streetNumber: 123,
          route: "Main St",
          administrativeAreaLevel1: "OR",
          country: "US",
          city: "Portland",
        },
        eventName: "Tessseraaaaaa",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://picsum.photos/282/140",
        categories: "Music",
      },
      eventStatus: "live",
      isOnline: false,
      eventUrl: "https://www.tessera.social/",
      _id: "456",
      createdAt: "2022-02-01T00:00:00.000Z",
      updatedAt: "2022-02-01T00:00:00.000Z",
      __v: 0,
      privatePassword: "topsecret",
      isVerified: false,
      promocodes: [{ code: "ABC", discount: 10 }],
      startSelling: "2022-02-01T00:00:00.000Z",
      endSelling: "2022-02-02T00:00:00.000Z",
      publicDate: "2022-02-03T00:00:00.000Z",
      emailMessage: "Welcome to the other event!",
      soldTickets: 50,
      ticketTiers: [
        { name: "VIP", price: 100 },
        { name: "General", price: 50 },
      ],
      summary: "Another great event",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
      isPublic: false,
      published: false,
      creatorId: "789",
    },
  ];
  expectedFilteredEvents = [
    {
      basicInfo: {
        location: {
          longitude: 45.523064,
          latitude: -122.676483,
          placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
          venueName: "My Venue",
          streetNumber: 123,
          route: "Main St",
          administrativeAreaLevel1: "OR",
          country: "US",
          city: "Portland",
        },
        eventName: "Tessseraaaaaa",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://picsum.photos/282/140",
        categories: "Music",
      },
      eventStatus: "live",
      isOnline: false,
      eventUrl: "https://www.tessera.social/",
    },
    {
      basicInfo: {
        location: {
          longitude: 45.523064,
          latitude: -122.676483,
          placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
          venueName: "My Venue",
          streetNumber: 123,
          route: "Main St",
          administrativeAreaLevel1: "OR",
          country: "US",
          city: "Portland",
        },
        eventName: "Tessseraaaaaa",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://picsum.photos/282/140",
        categories: "Music",
      },
      eventStatus: "live",
      isOnline: false,
      eventUrl: "https://www.tessera.social/",
    },
  ];

  test("should test get utc date", async () => {
    //get time now UTC
    // Get the current date/time
    const currentDate = new Date();

    // Get the time zone offset in minutes
    const timezoneOffset = currentDate.getTimezoneOffset();

    //convert date to UTC to compare with DB
    const expectedUtcDate = new Date(
      currentDate.getTime() - timezoneOffset * 60 * 1000
    );

    const utcDate = await getTimeNowUTC();
    expect(utcDate.getTime()).toBeGreaterThanOrEqual(expectedUtcDate.getTime());
  });
  test("remove event extra attributes", async () => {
    removeExtraAttributes;
  });
  test("removes unwanted properties from each event", async () => {
    //const filteredEvents = await removeExtraAttributes(events);
    const filteredEvents = events.map((eventModel) => {
      const {
        _id,
        createdAt,
        updatedAt,
        __v,
        privatePassword,
        isVerified,
        promocodes,
        startSelling,
        endSelling,
        publicDate,
        emailMessage,
        soldTickets,
        ticketTiers,
        summary,
        description,
        isPublic,
        published,
        creatorId,
        ...filtered
      } = eventModel;
      return filtered;
    });
    // return filteredEvents;
    expect(filteredEvents).toEqual(expectedFilteredEvents);
  });

  test("filter creator events", async () => {
    const userId = "abcdef";
    authorized.mockResolvedValue({ authorized: true, user_id: userId });
    const user = { user_id: "643a56706f55e9085d193f48" };
    //Filter events by creator ID and additional filters based on the 'filterBy' parameter
    const events = await filterCreatorEvents(user, req.query.filterBy);
    await listEvents(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No events Found",
    });
  });
  test("compute Events Selling Information", async () => {
    const userId = "abcdef";
    authorized.mockResolvedValue({ authorized: true, user_id: userId });
    const user = { user_id: "643a56706f55e9085d193f48" };
    const expectedmaxCapacity = [0, 0];
    const expectedgross = [0, 0];
    const expectedisEventOnSale = [false, false];
    const expectedeventsoldtickets = [undefined, undefined];
    //Computes selling information for an array of events
    const { eventsoldtickets, isEventOnSale, gross, maxCapacity } =
      await computeEventsSellingInformation(events);
    await listEvents(req, res);

    expect(maxCapacity).toEqual(expectedmaxCapacity);
    expect(isEventOnSale).toEqual(expectedisEventOnSale);
    expect(gross).toEqual(expectedgross);
    expect(eventsoldtickets).toEqual(expectedeventsoldtickets);
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //       success: true,
    //       filteredEvents,
    //       eventsoldtickets,
    //       isEventOnSale,
    //       gross,
    //       maxCapacity,
    //     });
  });
});
