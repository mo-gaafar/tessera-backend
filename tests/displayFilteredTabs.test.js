const eventModel = require("../models/eventModel");
jest.mock("../models/eventModel");

const {
  displayfilteredTabs,
  queryWithCategory,
  queryWithCountry,
  queryWithOnline,
  queryWithCity,
  queryWithAreaLevel,
  queryWithDate,
  getToday,
  getTomorrow,
  getWeekend,
  getCalender,
} = require("../controller/attendees/attendeeController");
// initialize queryWithCategory
// const queryWithCategory = jest.fn();
describe("displayfilteredTabs function", () => {
  const req = {
    //all the req.query.params
    query: {
      //comment if filter by weekend to match example reponse stated
      category: "Music",
      //   eventHosted: "online",
      city: "Portland",
      administrative_area_level_1: "OR",
      country: "US",
      //   freeEvent: "Free",
      //end comment
      //vary for futureDate and calender
      startDate: "2023-05-01T14:30:00.000Z", //for today: 2023-05-01T14:30:00.000Z ,for tomorrow:2023-04-30T14:30:00.000Z //calender: 2023-05-01T14:30:00.000Z //for weekend: 2023-06-20T12:02:58.236Z
      //endDate: "2023-05-01T14:33:00.000Z",
      futureDate: "today",
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  //mock filtered events
  var expectedFilteredEvents = [
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
      _id: "643aa02d4d2e42199562be5f",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "General Admission",
          quantitySold: 0,
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643aa02d4d2e42199562be60",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643aa02d4d2e42199562be61",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "500",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643aa0cc40aae4652d64a3c0",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643ab7a46ca586bc761c849e",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643aba8c57215220c8ab5c71",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643aba9d57215220c8ab5c7a",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643abaf938649b082e107800",
        },
        {
          quantitySold: 0,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eab010ab4992d0c223c84",
        },
        {
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eab917fc29a41bfbe111f",
        },
        {
          quantitySold: 0,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eacc59c3891daebc35451",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eada59c3891daebc354a3",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eadd7afdffbcbb17b614b",
        },
        {
          tierName: "Regular",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eade7afdffbcbb17b619f",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643a93166c05d2711e8c72f7",
        firstName: "tessera",
        lastName: "backend",
      },
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
        eventName: "Cross Platform",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://picsum.photos/282/140",
        categories: "Music",
      },
      _id: "643ad9af53ce2a393ad6a23e",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          quantitySold: 0,
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643ad9af53ce2a393ad6a23f",
        },
        {
          tierName: "VIP",
          quantitySold: 0,
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643ad9af53ce2a393ad6a240",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643a56706f55e9085d193f48",
        firstName: "Zeekoo",
        lastName: "john",
      },
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
        eventName: "Cross Platform",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643c301a3e7a431a38cf2cdd",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c301a3e7a431a38cf2cde",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c301a3e7a431a38cf2cdf",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643c305b98c577bc4384e4dd",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c305b98c577bc4384e4de",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c305b98c577bc4384e4df",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643c6b570da675b8b54fb678",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c6b570da675b8b54fb679",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c6b570da675b8b54fb67a",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643c891cad75b7766903cb8a",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c891cad75b7766903cb8b",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c891cad75b7766903cb8c",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643c89740a4bfb3e70b0e3c6",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c89740a4bfb3e70b0e3c7",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c89740a4bfb3e70b0e3c8",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643c8a437dccc6aada795d4d",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c8a437dccc6aada795d4e",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643c8a437dccc6aada795d4f",
        },
        {
          tierName: "Regular",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eae538e51a9212d7a86e4",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d1a6927e33b48ed259285",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d1a6927e33b48ed259286",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d1a6927e33b48ed259287",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d1f4a40d797c3e119cbc3",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d1f4a40d797c3e119cbc4",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d1f4a40d797c3e119cbc5",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d1fd3453ffd14bdb7284d",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d1fd3453ffd14bdb7284e",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d1fd3453ffd14bdb7284f",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d28d296f65a0d4ff0c785",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d28d296f65a0d4ff0c786",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d28d296f65a0d4ff0c787",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d28fc7b844cf4fbb31ea8",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d28fc7b844cf4fbb31ea9",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d28fc7b844cf4fbb31eaa",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d295ea2197ad0d54a65b4",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d295ea2197ad0d54a65b5",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d295ea2197ad0d54a65b6",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d29eb89fa15353236285a",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d29eb89fa15353236285b",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d29eb89fa15353236285c",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d2b013e8cdbe110594de3",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d2b013e8cdbe110594de4",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d2b013e8cdbe110594de5",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643bd6454bcebb6861183fa6",
        firstName: "hassan",
        lastName: "samy",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d30cce8b68081bb4dabcb",
      summary: "Join us for an evening of live music!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d30cce8b68081bb4dabcc",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d30cce8b68081bb4dabcd",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643c89200765c86f18483a0c",
        firstName: "Mohamed",
        lastName: "Nasser",
      },
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
        eventName: "Cross body2",
        startDateTime: "2023-05-01T14:30:00.000Z",
        endDateTime: "2023-05-01T18:00:00.000Z",
        eventImage: "https://example.com/image.jpg",
        categories: "Music",
      },
      _id: "643d4298f8503d4156a79f8c",
      summary: "hello im summary!",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
      ticketTiers: [
        {
          tierName: "Regular",
          maxCapacity: 100,
          price: "$20",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d4298f8503d4156a79f8d",
        },
        {
          tierName: "VIP",
          maxCapacity: 50,
          price: "$50",
          startSelling: "2023-04-14T00:00:00.000Z",
          endSelling: "2023-05-01T14:30:00.000Z",
          _id: "643d4298f8503d4156a79f8e",
        },
        {
          tierName: "Regular",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eb648e4aeda8f4b70c245",
        },
        {
          tierName: "Regular",
          quantitySold: 0,
          maxCapacity: 1000,
          price: "5000",
          startSelling: "2023-04-13T22:00:00.000Z",
          endSelling: "2023-04-26T22:00:00.000Z",
          _id: "643eb918f2ce7aedefb6293e",
        },
      ],
      eventStatus: "live",
      published: true,
      isPublic: true,
      isOnline: false,
      creatorId: {
        _id: "643c89200765c86f18483a0c",
        firstName: "Mohamed",
        lastName: "Nasser",
      },
    },
  ];
  //mock events
  if (req.query.futureDate === "weekend" && req.query.startDate) {
    var events = [
      {
        basicInfo: {
          location: {
            longitude: -96,
            latitude: 37,
            placeId: "ChIJCzYy5IS16lQRQrfeQ5K5Oxw",
            venueName: "United Center ",
            streetNumber: 55,
            route: "Magnificent Mile",
            administrativeAreaLevel1: "Illinois",
            country: "United States",
            city: "Chicago",
          },
          eventName: "Adult Mental Health First Aid Training April 18 & 25",
          startDateTime: "2023-06-23T12:02:58.236Z",
          endDateTime: "2024-04-06T18:18:22.443Z",
          eventImage: "https://picsum.photos/282/140",
          categories: "Food & Drink",
        },
        _id: "643ae564dcd599a1f68cfabf",
        summary: "Mental Health First Aid Training",
        description:
          "Attend this free lecture on How To Achieve Self Confidence and remove self doubt from your mind!",
        ticketTiers: [
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 2589,
            price: "617.85",
            startSelling: "2023-05-29T22:25:07.293Z",
            endSelling: "2023-10-27T01:30:38.939Z",
            _id: "643ae564dcd599a1f68cfac0",
          },
          {
            tierName: "Regular",
            quantitySold: 0,
            maxCapacity: 2810,
            price: "690.07",
            startSelling: "2023-11-16T12:39:25.604Z",
            endSelling: "2023-05-06T10:23:12.114Z",
            _id: "643ae564dcd599a1f68cfac1",
          },
        ],
        eventStatus: "completed",
        published: true,
        isPublic: true,
        publicDate: "2023-10-11T05:29:36.055Z",
        isOnline: false,
        eventUrl: "https://www.tessera.social/",
        privatePassword:
          "$2b$10$.3I6RpdRqtMi7cthALS2O.CySHPZcpmpBAzAN9fFNMPGSlSJRUQuK",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643ae564dcd599a1f68cfac2",
          },
          {
            userId: "643a7ffc96470deb953e2bc1",
            _id: "643ae564dcd599a1f68cfac3",
          },
        ],
        creatorId: null,
        promocodes: ["64394a2d880ae848d65f8c7e"],
        createdAt: "2023-04-15T17:56:52.590Z",
        updatedAt: "2023-04-15T17:56:52.590Z",
        __v: 0,
      },
    ];
  } else {
    var events = [
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
        _id: "643aa02d4d2e42199562be5f",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "General Admission",
            quantitySold: 0,
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643aa02d4d2e42199562be60",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643aa02d4d2e42199562be61",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "500",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643aa0cc40aae4652d64a3c0",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643ab7a46ca586bc761c849e",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643aba8c57215220c8ab5c71",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643aba9d57215220c8ab5c7a",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643abaf938649b082e107800",
          },
          {
            quantitySold: 0,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eab010ab4992d0c223c84",
          },
          {
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eab917fc29a41bfbe111f",
          },
          {
            quantitySold: 0,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eacc59c3891daebc35451",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eada59c3891daebc354a3",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eadd7afdffbcbb17b614b",
          },
          {
            tierName: "Regular",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eade7afdffbcbb17b619f",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$GyPM8iZeriNKkLCQn/HUHuMKnXukNsu3OI3xaPLRje3HcPKTDudVy",
        creatorId: {
          _id: "643a93166c05d2711e8c72f7",
          firstName: "tessera",
          lastName: "backend",
        },
        promocodes: [
          "643aa0654d2e42199562be6a",
          "643af89013138372e6646444",
          "643af9725c430dff55a0abc4",
        ],
        soldTickets: [
          {
            ticketId: "643ab9eb64c78cd6712a5fdc",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643ab9eb64c78cd6712a5fe3",
          },
          {
            ticketId: "643adb09e8a00fd68648759a",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb0ae8a00fd6864875a5",
          },
          {
            ticketId: "643adb0ae8a00fd6864875a7",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb0ae8a00fd6864875b3",
          },
          {
            ticketId: "643adb0ae8a00fd6864875b5",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb0ae8a00fd6864875c2",
          },
          {
            ticketId: "643adb0be8a00fd6864875c4",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb0be8a00fd6864875d2",
          },
          {
            ticketId: "643adb0be8a00fd6864875d4",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb0be8a00fd6864875e3",
          },
          {
            ticketId: "643adb2f65e0aa292e139057",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb2f65e0aa292e139067",
          },
          {
            ticketId: "643adb3065e0aa292e139069",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb3065e0aa292e13907a",
          },
          {
            ticketId: "643adb3065e0aa292e13907c",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb3065e0aa292e13908e",
          },
          {
            ticketId: "643adb3065e0aa292e139090",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb3065e0aa292e1390a3",
          },
          {
            ticketId: "643adb3065e0aa292e1390a5",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643adb3065e0aa292e1390b9",
          },
          {
            ticketId: "643af6d519be5b1745131207",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af6d519be5b174513121c",
          },
          {
            ticketId: "643af6d519be5b174513121e",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af6d619be5b1745131234",
          },
          {
            ticketId: "643af6d619be5b1745131236",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af6d619be5b174513124d",
          },
          {
            ticketId: "643af6d619be5b174513124f",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af6d619be5b1745131267",
          },
          {
            ticketId: "643af6d619be5b1745131269",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af6d619be5b1745131282",
          },
          {
            ticketId: "643af9345c430dff55a0ab0c",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af9345c430dff55a0ab26",
          },
          {
            ticketId: "643af9355c430dff55a0ab29",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af9355c430dff55a0ab44",
          },
          {
            ticketId: "643af9355c430dff55a0ab47",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af9355c430dff55a0ab63",
          },
          {
            ticketId: "643af9355c430dff55a0ab66",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af9365c430dff55a0ab83",
          },
          {
            ticketId: "643af9365c430dff55a0ab86",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643af9365c430dff55a0aba4",
          },
          {
            ticketId: "643b06e022d5c13166ec534d",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b06e022d5c13166ec536c",
          },
          {
            ticketId: "643b073a22d5c13166ec539a",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b073a22d5c13166ec53ba",
          },
          {
            ticketId: "643b078222d5c13166ec53dd",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b078222d5c13166ec53fe",
          },
          {
            ticketId: "643b079922d5c13166ec5422",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b079922d5c13166ec5444",
          },
          {
            ticketId: "643b07c122d5c13166ec5469",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b07c122d5c13166ec548c",
          },
          {
            ticketId: "643b083222d5c13166ec54b8",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b083222d5c13166ec54dc",
          },
          {
            ticketId: "643b084922d5c13166ec5503",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b084922d5c13166ec5528",
          },
          {
            ticketId: "643b088922d5c13166ec5556",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643b088a22d5c13166ec557c",
          },
          {
            ticketId: "643dbfb4fbb310851493f1ee",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dbfb5fbb310851493f215",
          },
          {
            ticketId: "643dbfb5fbb310851493f218",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dbfb5fbb310851493f240",
          },
          {
            ticketId: "643dbfb5fbb310851493f243",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dbfb5fbb310851493f26c",
          },
          {
            ticketId: "643dbfb6fbb310851493f26f",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dbfb6fbb310851493f299",
          },
          {
            ticketId: "643dbfb6fbb310851493f29c",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dbfb6fbb310851493f2c7",
          },
          {
            ticketId: "643dc522aa4071f536c93d90",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc522aa4071f536c93dbc",
          },
          {
            ticketId: "643dc522aa4071f536c93dbf",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc522aa4071f536c93dec",
          },
          {
            ticketId: "643dc522aa4071f536c93def",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc523aa4071f536c93e1d",
          },
          {
            ticketId: "643dc523aa4071f536c93e20",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc523aa4071f536c93e4f",
          },
          {
            ticketId: "643dc523aa4071f536c93e52",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc523aa4071f536c93e82",
          },
          {
            ticketId: "643dc809b4cd5cc487461da8",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc809b4cd5cc487461dd9",
          },
          {
            ticketId: "643dc809b4cd5cc487461ddc",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc809b4cd5cc487461e0e",
          },
          {
            ticketId: "643dc809b4cd5cc487461e11",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc809b4cd5cc487461e44",
          },
          {
            ticketId: "643dc80ab4cd5cc487461e47",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc80ab4cd5cc487461e7b",
          },
          {
            ticketId: "643dc80ab4cd5cc487461e7e",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc80ab4cd5cc487461eb3",
          },
          {
            ticketId: "643dc817cc33d2bcda67e5db",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc818cc33d2bcda67e611",
          },
          {
            ticketId: "643dc818cc33d2bcda67e614",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc818cc33d2bcda67e64b",
          },
          {
            ticketId: "643dc818cc33d2bcda67e64e",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc819cc33d2bcda67e686",
          },
          {
            ticketId: "643dc819cc33d2bcda67e689",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc819cc33d2bcda67e6c2",
          },
          {
            ticketId: "643dc819cc33d2bcda67e6c5",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc819cc33d2bcda67e6ff",
          },
          {
            ticketId: "643dc835294591bb460d7a4e",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc836294591bb460d7a89",
          },
          {
            ticketId: "643dc836294591bb460d7a8c",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc836294591bb460d7ac8",
          },
          {
            ticketId: "643dc836294591bb460d7acb",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc836294591bb460d7b08",
          },
          {
            ticketId: "643dc837294591bb460d7b0b",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc837294591bb460d7b49",
          },
          {
            ticketId: "643dc837294591bb460d7b4c",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc837294591bb460d7b8b",
          },
          {
            ticketId: "643dc8ffc09a2d2cbb65bd67",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc8ffc09a2d2cbb65bda7",
          },
          {
            ticketId: "643dc8ffc09a2d2cbb65bdaa",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc8ffc09a2d2cbb65bdeb",
          },
          {
            ticketId: "643dc8ffc09a2d2cbb65bdee",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc900c09a2d2cbb65be30",
          },
          {
            ticketId: "643dc900c09a2d2cbb65be33",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc900c09a2d2cbb65be76",
          },
          {
            ticketId: "643dc900c09a2d2cbb65be79",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dc900c09a2d2cbb65bebd",
          },
          {
            ticketId: "643dd49d4e1f5a3d5765c465",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd49d4e1f5a3d5765c4aa",
          },
          {
            ticketId: "643dd49d4e1f5a3d5765c4ac",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd49d4e1f5a3d5765c4f2",
          },
          {
            ticketId: "643dd49e4e1f5a3d5765c4f4",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd49e4e1f5a3d5765c53b",
          },
          {
            ticketId: "643dd49e4e1f5a3d5765c53d",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd49e4e1f5a3d5765c585",
          },
          {
            ticketId: "643dd49e4e1f5a3d5765c587",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd49e4e1f5a3d5765c5d0",
          },
          {
            ticketId: "643dd56cc522d95da12f43d8",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd56dc522d95da12f4422",
          },
          {
            ticketId: "643dd56dc522d95da12f4424",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd56dc522d95da12f446f",
          },
          {
            ticketId: "643dd56dc522d95da12f4471",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd56dc522d95da12f44bd",
          },
          {
            ticketId: "643dd56dc522d95da12f44bf",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd56dc522d95da12f450c",
          },
          {
            ticketId: "643dd56ec522d95da12f450e",
            userId: "643a93166c05d2711e8c72f7",
            _id: "643dd56ec522d95da12f455c",
          },
        ],
        createdAt: "2023-04-15T13:01:33.837Z",
        updatedAt: "2023-04-18T14:49:11.525Z",
        __v: 83,
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
          eventName: "Cross Platform",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://picsum.photos/282/140",
          categories: "Music",
        },
        _id: "643ad9af53ce2a393ad6a23e",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            quantitySold: 0,
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643ad9af53ce2a393ad6a23f",
          },
          {
            tierName: "VIP",
            quantitySold: 0,
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643ad9af53ce2a393ad6a240",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$p/7usuGpX2dgTN6B14cCY.Mwr7uLFaGcRIx4yl8tEsqwdwRsb7pD2",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643ad9af53ce2a393ad6a241",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643ad9af53ce2a393ad6a242",
          },
        ],
        creatorId: {
          _id: "643a56706f55e9085d193f48",
          firstName: "Zeekoo",
          lastName: "john",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-15T17:06:55.185Z",
        updatedAt: "2023-04-15T17:06:55.185Z",
        __v: 0,
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
          eventName: "Cross Platform",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643c301a3e7a431a38cf2cdd",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c301a3e7a431a38cf2cde",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c301a3e7a431a38cf2cdf",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$KoxFhxrPP/PZb2voDbgQ9.PAtb0H.O.biEATUVCQKWnwi64T3WhxO",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643c301a3e7a431a38cf2ce0",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643c301a3e7a431a38cf2ce1",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-16T17:27:54.754Z",
        updatedAt: "2023-04-16T17:27:54.754Z",
        __v: 0,
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
          eventName: "Cross body",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643c305b98c577bc4384e4dd",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c305b98c577bc4384e4de",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c305b98c577bc4384e4df",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$zcaUACdDqUThD38lhUgdW.xL6vp3eDrS90OKifC6HpzHzTYotUt5C",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643c305b98c577bc4384e4e0",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643c305b98c577bc4384e4e1",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-16T17:28:59.391Z",
        updatedAt: "2023-04-16T17:28:59.391Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643c6b570da675b8b54fb678",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c6b570da675b8b54fb679",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c6b570da675b8b54fb67a",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$W8QGR3MHRKZ7ujklSCayZeae57DxNJZmGEWn3bxFIvwt55bkzxNUW",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643c6b570da675b8b54fb67b",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643c6b570da675b8b54fb67c",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-16T21:40:39.241Z",
        updatedAt: "2023-04-16T21:40:39.241Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643c891cad75b7766903cb8a",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c891cad75b7766903cb8b",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c891cad75b7766903cb8c",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$n3qjLBbxqv/S0TUruzp9S.UEDROYq8MLfIbiFSBWg.yyD0ddC/B3a",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643c891cad75b7766903cb8d",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643c891cad75b7766903cb8e",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-16T23:47:40.069Z",
        updatedAt: "2023-04-16T23:47:40.069Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643c89740a4bfb3e70b0e3c6",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c89740a4bfb3e70b0e3c7",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c89740a4bfb3e70b0e3c8",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$BT1O5GOGtfpToCJC7UiGruC257PnaegGf9vfD78UbuVStNLQtwaQu",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643c89740a4bfb3e70b0e3c9",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643c89740a4bfb3e70b0e3ca",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-16T23:49:08.122Z",
        updatedAt: "2023-04-16T23:49:08.122Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643c8a437dccc6aada795d4d",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c8a437dccc6aada795d4e",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643c8a437dccc6aada795d4f",
          },
          {
            tierName: "Regular",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eae538e51a9212d7a86e4",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$3bufcaYUZGX88B41oTB9TeGK5FU5UaQ/PWZSeN8owexXvoxYLwQ9i",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643c8a437dccc6aada795d50",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643c8a437dccc6aada795d51",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-16T23:52:35.813Z",
        updatedAt: "2023-04-18T14:50:59.288Z",
        __v: 1,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d1a6927e33b48ed259285",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d1a6927e33b48ed259286",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d1a6927e33b48ed259287",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$YuPVX8.dajvq1teuWvcvhOf7hFFPT8zJWOjZC8yiLGa0vf9J65sMW",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d1a6927e33b48ed259288",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d1a6927e33b48ed259289",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T10:07:37.104Z",
        updatedAt: "2023-04-17T10:07:37.104Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d1f4a40d797c3e119cbc3",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d1f4a40d797c3e119cbc4",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d1f4a40d797c3e119cbc5",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$FUXO7ibeN6HnuqyzIX0qQOk9ro9onuhPZaBuQuI.KCgy8uuuNf/lK",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d1f4a40d797c3e119cbc6",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d1f4a40d797c3e119cbc7",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T10:28:26.429Z",
        updatedAt: "2023-04-17T10:28:26.429Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d1fd3453ffd14bdb7284d",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d1fd3453ffd14bdb7284e",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d1fd3453ffd14bdb7284f",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$iuo88bsJdPaNTUdyDicGk.6pRROe1DD1lkHTwuwVxlGgjBLcHI/Uy",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d1fd3453ffd14bdb72850",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d1fd3453ffd14bdb72851",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T10:30:43.219Z",
        updatedAt: "2023-04-17T10:30:43.219Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d28d296f65a0d4ff0c785",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d28d296f65a0d4ff0c786",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d28d296f65a0d4ff0c787",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$fZZe2.v4ZaXEooH5BNF4KOrTs01W.pznSVt/3NrCs7fMTybHQlWn6",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d28d296f65a0d4ff0c788",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d28d296f65a0d4ff0c789",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T11:09:06.975Z",
        updatedAt: "2023-04-17T11:09:06.975Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d28fc7b844cf4fbb31ea8",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d28fc7b844cf4fbb31ea9",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d28fc7b844cf4fbb31eaa",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$f4s75wd2eZh3ghy0N9ZyIeD/KOP40WECzb/SoIzAS28SEI5JxDhji",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d28fc7b844cf4fbb31eab",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d28fc7b844cf4fbb31eac",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T11:09:48.810Z",
        updatedAt: "2023-04-17T11:09:48.810Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d295ea2197ad0d54a65b4",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d295ea2197ad0d54a65b5",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d295ea2197ad0d54a65b6",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$M0cIzka8GKlCMMmro.8zee2AmNdutqRvH9PQ3FUnAUyxvKKcfZXM.",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d295ea2197ad0d54a65b7",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d295ea2197ad0d54a65b8",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T11:11:26.345Z",
        updatedAt: "2023-04-17T11:11:26.345Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d29eb89fa15353236285a",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d29eb89fa15353236285b",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d29eb89fa15353236285c",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$5d9wDvbuPopDhlkl6sAe3ugRI13EiBqgJy7RHmzVfbPDLXBHGuRC2",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d29eb89fa15353236285d",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d29eb89fa15353236285e",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T11:13:47.102Z",
        updatedAt: "2023-04-17T11:13:47.102Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d2b013e8cdbe110594de3",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d2b013e8cdbe110594de4",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d2b013e8cdbe110594de5",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$HdzY4OVI7KoJy7ILwCVDQOLzlnNXWSKGKb9cOALobE6mEOwwLRk3C",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d2b013e8cdbe110594de6",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d2b013e8cdbe110594de7",
          },
        ],
        creatorId: {
          _id: "643bd6454bcebb6861183fa6",
          firstName: "hassan",
          lastName: "samy",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T11:18:25.684Z",
        updatedAt: "2023-04-17T11:18:25.684Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d30cce8b68081bb4dabcb",
        summary: "Join us for an evening of live music!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d30cce8b68081bb4dabcc",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d30cce8b68081bb4dabcd",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$eawXBYzsTG5CIWhwKK/DR.Ck14EyDrhhgAG7CmY5sQ/pesFipBEM2",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d30cce8b68081bb4dabce",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d30cce8b68081bb4dabcf",
          },
        ],
        creatorId: {
          _id: "643c89200765c86f18483a0c",
          firstName: "Mohamed",
          lastName: "Nasser",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T11:43:08.308Z",
        updatedAt: "2023-04-17T11:43:08.308Z",
        __v: 0,
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
          eventName: "Cross body2",
          startDateTime: "2023-05-01T14:30:00.000Z",
          endDateTime: "2023-05-01T18:00:00.000Z",
          eventImage: "https://example.com/image.jpg",
          categories: "Music",
        },
        _id: "643d4298f8503d4156a79f8c",
        summary: "hello im summary!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus sed tempus luctus, nunc sapien lacinia metus, eu finibus velit odio vel nulla.",
        ticketTiers: [
          {
            tierName: "Regular",
            maxCapacity: 100,
            price: "$20",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d4298f8503d4156a79f8d",
          },
          {
            tierName: "VIP",
            maxCapacity: 50,
            price: "$50",
            startSelling: "2023-04-14T00:00:00.000Z",
            endSelling: "2023-05-01T14:30:00.000Z",
            _id: "643d4298f8503d4156a79f8e",
          },
          {
            tierName: "Regular",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eb648e4aeda8f4b70c245",
          },
          {
            tierName: "Regular",
            quantitySold: 0,
            maxCapacity: 1000,
            price: "5000",
            startSelling: "2023-04-13T22:00:00.000Z",
            endSelling: "2023-04-26T22:00:00.000Z",
            _id: "643eb918f2ce7aedefb6293e",
          },
        ],
        eventStatus: "live",
        published: true,
        isPublic: true,
        publicDate: "2023-04-14T00:00:00.000Z",
        isOnline: false,
        eventUrl: "https://example.com/my-event",
        privatePassword:
          "$2b$10$klIMTPuFFcwvmBow7k20tuY/C0FZw.C7K30QkB/zQaS1LfjPpqqlq",
        soldTickets: [
          {
            ticketId: "6434110d4537615b85caea52",
            _id: "643d4298f8503d4156a79f8f",
          },
          {
            userId: "642d2fa0d48c7abb889a7ca1",
            _id: "643d4298f8503d4156a79f90",
          },
        ],
        creatorId: {
          _id: "643c89200765c86f18483a0c",
          firstName: "Mohamed",
          lastName: "Nasser",
        },
        promocodes: ["64393801b48bff2e5d22cdd3"],
        createdAt: "2023-04-17T12:59:04.235Z",
        updatedAt: "2023-04-18T15:36:56.884Z",
        __v: 2,
      },
    ];
  }
  // Set the expected event start and end date
  //uncomment if filter by the weekend
  if (req.query.futureDate === "weekend" && req.query.startDate) {
    var expectedEventStartDate = new Date("2023-06-23T00:00:00.236Z");
    var expectedEventEndDate = new Date("2023-06-26T23:00:00.236Z");
  }

  //uncomment if filter by today or tomorrow
  if (req.query.futureDate === "today" || eq.query.futureDate === "tomorrow") {
    var expectedEventStartDate = new Date("2023-04-30T23:00:00.000Z");
    var expectedEventEndDate = new Date("2023-05-02T00:00:00.000Z");
  }
  // uncomment if filter by calender
  if (req.query.startDate && req.query.endDate) {
    var expectedEventStartDate = new Date("2023-05-01T00:00:00.000Z");
    var expectedEventEndDate = new Date("2023-05-01T23:00:00.000Z");
  }
  if (req.query.category) {
    test("should call queryWithCategory with correct arguments when category is provided", async () => {
      // // Set up a mock query object
      const query = {};

      // Call the function with the mock request and query objects
      queryWithCategory(query, req.query.category);

      // Assert that the categories property of the query object has been set to the category value
      expect(query).toEqual({ "basicInfo.categories": "Music" }); //{ basicInfo: { categories: "Music" } }); //{ "basicInfo.categories": "Music" }); //basicInfo: { categories: "Music" } });
    });
  }
  if (req.query.country) {
    test("should call queryWithCountry with correct arguments when Country is provided", async () => {
      // // Set up a mock query object
      const query = {};

      // Call the function with the mock request and query objects
      queryWithCountry(query, req.query.country);

      // Assert that the categories property of the query object has been set to the category value
      expect(query).toEqual({ "basicInfo.location.country": "US" }); //{ basicInfo: { categories: "Music" } }); //{ "basicInfo.categories": "Music" }); //basicInfo: { categories: "Music" } });
    });
  }
  if (req.query.city) {
    test("should call queryWithCity with correct arguments when City is provided", async () => {
      // // Set up a mock query object
      const query = {};

      // Call the function with the mock request and query objects
      queryWithCity(query, req.query.city);

      // Assert that the categories property of the query object has been set to the category value
      expect(query).toEqual({ "basicInfo.location.city": "Portland" });
    });
  }
  if (req.query.administrative_area_level_1) {
    test("should call queryWithAreaLevel with correct arguments when Area Level is provided", async () => {
      // // Set up a mock query object
      const query = {};

      // Call the function with the mock request and query objects
      queryWithAreaLevel(query, req.query.administrative_area_level_1);

      // Assert that the categories property of the query object has been set to the category value
      expect(query).toEqual({
        "basicInfo.location.administrativeAreaLevel1": "OR",
      });
    });
  }
  if (req.query.eventHosted) {
    test("should call queryWithOnline with correct arguments when online is provided", async () => {
      // // Set up a mock query object
      const query = {};

      // Call the function with the mock request and query objects
      queryWithOnline(query);

      // Assert that the isOnline property of the query object has been set to the category value
      expect(query).toEqual({
        isOnline: true,
      });
    });
  }
  if (req.query.futureDate === "today" && req.query.startDate) {
    test("should return the correct event start and end date for todays event", async () => {
      // Set the test start date to April 19th, 2023 at 12:00 pm
      const testStartDate = new Date("2023-05-01T14:30:00.000Z");

      // Call the getToday function with the test start date
      var { eventStartDate, eventEndDate } = await getToday(testStartDate);

      // Make assertions about the returned result
      expect(eventStartDate).toEqual(expectedEventStartDate);
      expect(eventEndDate).toEqual(expectedEventEndDate);

      //call query with date
      // Set up a mock query object
      const query = {};
      // Call the function with the mock request and query objects
      queryWithDate(query, expectedEventStartDate, expectedEventEndDate, 1);

      // Assert that the isOnline property of the query object has been set to the category value
      expect(query).toEqual({
        "basicInfo.startDateTime": {
          $gt: expectedEventStartDate,
          $lt: expectedEventEndDate,
        },
      });
    });
  }
  if (req.query.futureDate === "tomorrow" && req.query.startDate) {
    test("should return the correct event start and end date for tomorrow's event", async () => {
      // Set the test start date to April 30, 2023 at 14:30 pm
      const testStartDate = new Date("2023-04-30T14:30:00.000Z");

      // Call the getToday function with the test start date
      var { eventStartDate, eventEndDate } = await getTomorrow(testStartDate);
      // Make assertions about the returned result
      expect(eventStartDate).toEqual(expectedEventStartDate);
      expect(eventEndDate).toEqual(expectedEventEndDate);

      //call query with date
      // Set up a mock query object
      const query = {};
      // Call the function with the mock request and query objects
      queryWithDate(query, expectedEventStartDate, expectedEventEndDate, 1);
      // Assert that the isOnline property of the query object has been set to the category value
      expect(query).toEqual({
        "basicInfo.startDateTime": {
          $gt: expectedEventStartDate,
          $lt: expectedEventEndDate,
        },
      });
    });
  }

  //filter by calender
  if (req.query.startDate && req.query.endDate) {
    test("should return the correct event start and end date for calender", async () => {
      // Call the getToday function with the test start date
      var { eventStartDate, eventEndDate } = await getCalender(
        req.query.startDate,
        req.query.endDate
      );
      // Make assertions about the returned result
      expect(eventStartDate).toEqual(expectedEventStartDate);
      expect(eventEndDate).toEqual(expectedEventEndDate);

      //call query with date
      // Set up a mock query object
      const query = {};
      // Call the function with the mock request and query objects
      queryWithDate(query, expectedEventStartDate, expectedEventEndDate, 2);
      // Assert that the isOnline property of the query object has been set to the category value
      expect(query).toEqual({
        "basicInfo.startDateTime": {
          $gte: expectedEventStartDate,
          $lte: expectedEventEndDate,
        },
      });
    });
  }
  //filter by weekend
  if (req.query.futureDate === "weekend" && req.query.startDate) {
    test("should return the correct event start and end date for the weekend", async () => {
      // Call the getToday function with the test start date
      var { eventStartDate, eventEndDate } = await getWeekend(
        req.query.startDate
      );
      // Make assertions about the returned result
      expect(eventStartDate).toEqual(expectedEventStartDate);
      expect(eventEndDate).toEqual(expectedEventEndDate);

      //call query with date
      // Set up a mock query object
      const query = {};
      // Call the function with the mock request and query objects
      queryWithDate(query, expectedEventStartDate, expectedEventEndDate, 2);
      // Assert that the isOnline property of the query object has been set to the category value
      expect(query).toEqual({
        "basicInfo.startDateTime": {
          $gte: expectedEventStartDate,
          $lte: expectedEventEndDate,
        },
      });
    });
  }

  //eventModel.find.populate
  test("should display filtered tabs landing page", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});

    jest.spyOn(eventModel, "find").mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(events),
    });

    // await displayfilteredTabs(req, res);
    //     expect(console.log).toHaveBeenCalledWith(
    //       "Gonna display filtered tabs landing page"
    //     );
    // if (req.query.startDate && req.query.endDate) {
    //   expect(eventModel.find).toHaveBeenCalledWith({
    //     "basicInfo.categories": "Music",
    //     "basicInfo.location.country": "US",
    //     "basicInfo.location.city": "Portland",
    //     "basicInfo.location.administrativeAreaLevel1": "OR",
    //     "basicInfo.startDateTime": {
    //       $gte: expectedEventStartDate,
    //       $lte: expectedEventEndDate,
    //     },
    //     isOnline: true,
    //     isPublic: true,
    //     published: true,
    //   });
    // } else if (req.query.futureDate === "weekend" && req.query.startDate) {
    //   expect(eventModel.find).toHaveBeenCalledWith({
    //     "basicInfo.startDateTime": {
    //       $gte: expectedEventStartDate,
    //       $lte: expectedEventEndDate,
    //     },
    //     isPublic: true,
    //     published: true,
    //   });
    // } else {
    //   expect(eventModel.find).toHaveBeenCalledWith({
    //     "basicInfo.categories": "Music",
    //     "basicInfo.location.country": "US",
    //     "basicInfo.location.city": "Portland",
    //     "basicInfo.location.administrativeAreaLevel1": "OR",
    //     "basicInfo.startDateTime": {
    //       $gt: expectedEventStartDate,
    //       $lt: expectedEventEndDate,
    //     },
    //     isOnline: true,
    //     isPublic: true,
    //     published: true,
    //   });
    // }
    //expect(eventModel.find).toHaveBeenCalledTimes(1);
    //     // expect(res.json).toHaveBeenCalledWith({ events });
  });
  var freeEvents = [];
  if (req.query.freeEvent) {
    test("returns free events as expected", async () => {
      freeEvents = events.filter((eventModel) => {
        const tiersWithFreePrice = eventModel.ticketTiers.filter(
          (tier) => tier.price === "Free"
        );
        return tiersWithFreePrice.length === eventModel.ticketTiers.length;
      });
      await displayfilteredTabs(req, res);
      expect(console.log).toHaveBeenCalledWith(
        "Gonna display filtered tabs landing page"
      );
      //expect(freeEvents).toEqual(events);
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        filteredEvents: [],
        isEventFreeArray: [],
        categoriesRetreived: [],
      });
    });
  }
});
