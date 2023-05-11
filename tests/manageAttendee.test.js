const eventModel = require("../models/eventModel");
jest.mock("../models/eventModel");
jest.mock("../controller/Auth/userController");
jest.mock("../utils/Tokens");
const userModel = require("../models/userModel");
jest.mock("../models/userModel");
const {
  addAttendee,
  bookTicketForAttendees,
} = require("../controller/Events/manageAttendeeController");
const { authorized } = require("../utils/Tokens");
jest.mock("../models/eventModel");
jest.mock("../controller/Auth/userController");
jest.mock("../utils/Tokens");

describe("manage Attendee function", () => {
  const event =
    //[
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
      published: false,
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
    };

  const req = {
    //all the req.query.params
    params: {
      eventID: "123",
    },
    body: {
      contactInformation: {
        first_name: "tessera",
        last_name: "backend",
        email: "tessera.backend@gmail.com",
      },
      promocode: null,
      SendEmail: true,

      ticketTierSelected: [
        {
          tierName: "Regular",
          quantity: 2,
          price: 20,
          tickets: [
            {
              firstname: "Lara", //string
              lastname: "Mohsen", //string,
              email: "Heidi2008@live.com", //string,
            },

            {
              firstname: "Sozan", //string
              lastname: "Mohsen", //string
              email: "mercol58@ymail.com", //string
            },
          ],
        },
      ],
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.mock("../models/eventModel", () => ({
    findOne: jest.fn(),
  }));
  test("event not found", async () => {
    // Mock the eventModel dependency

    const query = { published: true, _id: req.params.eventID };
    const expectedResponse = {
      success: false,
      message: "No event Found",
    };
    eventModel.findOne.mockResolvedValueOnce(null);
    const userId = "abcdef";
    authorized.mockResolvedValue({ authorized: false, user_id: userId });
    const user = { user_id: "643a56706f55e9085d193f48" };
    await addAttendee(req, res);

    // Assert
    expect(eventModel.findOne).toHaveBeenCalledWith(query);
    // expect(res.json).toEqual(expectedResponse);
  });
  test("No event Found ", async () => {
    const userId = "abcdef";
    authorized.mockResolvedValue({ authorized: false, user_id: userId });
    const user = { user_id: "643a56706f55e9085d193f48" };
    //Filter events by creator ID and additional filters based on the 'filterBy' parameter
    // const events = await filterCreatorEvents(user, req.query.filterBy);
    await addAttendee(req, res);
    // expect(res.status).toHaveBeenCalledWith(404);
    // expect(res.json).toHaveBeenCalledWith({
    //   success: false,
    //   message: "You are not authorized to add attendee to this event",
    // });
    // const userId = "abcdef";
    // authorized.mockResolvedValue({ authorized: true, user_id: userId });
    // const user = { user_id: "643a56706f55e9085d193f48" };

    //Filter events by creator ID and additional filters based on the 'filterBy' parameter
    //const events = await filterCreatorEvents(user, req.query.filterBy);

    // await addAttendee(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No event Found",
    });
  });
  /////
  test("returns an error when no event is found", async () => {
    // Define a mock request and response object
    // const req = {
    //   params: {
    //     eventID: "123",
    //   },
    // };
    // Create a mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Create a mock eventModel that returns null when findOne is called with the correct query
    const eventModel = {
      findOne: jest.fn().mockResolvedValueOnce(null),
    };

    const userId = "abcdef";
    authorized.mockResolvedValue({ authorized: true, user_id: userId });
    // const user = { user_id: "643a56706f55e9085d193f48" };
    // // Call the function with the mock event id and model
    // await searchEventById("mockId", eventModel, {}, res);
    // Check that the event model's findOne method was called with the correct query
    // expect(eventModel.findOne).toHaveBeenCalledWith({
    //   _id: "mockId",
    //   published: false,
    // });
    /////////
    //book tickets for attendees added manually
    // Get the buyer information object from the database
    const user = await userModel.findOne({
      email: req.body.contactInformation.email,
    });
    var promocode = null;
    jest.mock("../controller/Events/manageAttendeeController", () => {
      return jest.fn().mockResolvedValue(true);
    });
    // await bookTicketForAttendees(
    //   event,
    //   user,
    //   req.body.ticketTierSelected,
    //   promocode,
    //   req.params.eventID
    // );
    await addAttendee(req, res);
    // // Check that the response object's status and json methods were called with the correct values
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No event Found",
    });
  });
});
