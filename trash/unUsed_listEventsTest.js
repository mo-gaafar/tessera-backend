const { ObjectId } = require("mongoose");
const {
  listEvents,
  computeEventsSellingInformation,
  getTimeNowUTC,
  filterCreatorEvents,
  removeExtraAttributes,
} = require("../controller/Events/eventsRetrievalController");
const eventModel = require("../models/eventModel");
// const userModel = require("../controllers/Auth/userController");
const {
  GenerateToken,
  retrieveToken,
  verifyToken,
  authorized,
} = require("../utils/Tokens");
const jwt = require("jsonwebtoken");
jest.mock("../models/eventModel");
jest.mock("../utils/Tokens");
jest.mock("../controller/Events/eventsRetrievalController");
describe("list events function", () => {
  var req, res;
  //   beforeEach(() => {
  req = {
    query: {
      filterBy: "allevents",
    },
  };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  //   });

  afterEach(() => {
    jest.resetAllMocks();
  });
  // test("should throw error when user is not authorized", async () => {
  //   // arrange
  //   authorized.mockRejectedValueOnce(new Error("user not Autherized"));

  //   // act and assert
  //   await expect(listEvents(req)).rejects.toThrow("user not Autherized");
  // });
  // test("should throw error when user is not authorized", async () => {
  //   // arrange
  //   authorized.mockRejectedValueOnce(new Error("Unauthorized"));

  //   // act
  //   const response = await listEvents(req);
  //   const req = {}; // create a mock request object
  //   const res = {
  //     // create a mock response object
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };
  //   // assert
  //   expect(response).toHaveProperty("status", 404);
  //   expect(response).toHaveProperty("body", {
  //     success: false,
  //     message: "user not authorized",
  //   });
  //   await expect(() => {
  //     throw response.body.message;
  //   }).toThrow(/Unauthorized/);
  // });
  // test("should throw error when user is not authorized", async () => {
  //   // arrange
  //   authorized.mockRejectedValueOnce(new Error("user not authorized"));
  //   const req = {}; // create a mock request object
  //   const res = {
  //     // create a mock response object
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };

  //   // act and assert
  //   await expect(listEvents(req, res)).rejects.toThrow("user not authorized");
  //   expect(res.status).toHaveBeenCalledWith(404);
  //   expect(res.json).toHaveBeenCalledWith({
  //     success: false,
  //     message: "user not authorized",
  //   });
  // });
  // it("should return a 404 error if user is not authorized", async () => {
  //   // arrange
  //   const req = { headers: { authorization: "Bearer invalid-token" } };
  //   authorized.mockResolvedValueOnce({ authorized: false });
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };

  //   // act
  //   await listEvents(req, res);

  //   // assert
  //   expect(authorized).toHaveBeenCalledWith(req);
  //   expect(res.status).toHaveBeenCalledWith(404);
  //   expect(res.json).toHaveBeenCalledWith({
  //     success: false,
  //     message: "user not Autherized",
  //   });
  // });
  test("should throw error when user is not authorized", async () => {
    // arrange
    authorized.mockResolvedValueOnce({ authorized: false });
    const req = {
      headers: {
        authorization: "Bearer TOKEN",
      },
      query: {
        filterBy: "allevents",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // act
    await listEvents(req, res);

    // assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "user not Autherized",
    });
  });

  // test("should return error message when no events are found", async () => {
  //   // arrange
  //   const user = { authorized: true, user_id: "123456" };
  //   const req = {
  //     headers: {
  //       authorization: "Bearer TOKEN",
  //     },
  //     query: {
  //       filterBy: "allevents",
  //     },
  //   };
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };
  //   filterCreatorEvents.mockResolvedValueOnce(null);

  //   // act
  //   await listEvents(req);

  //   // assert
  //   expect(filterCreatorEvents).toHaveBeenCalledWith(user, req.query.filterBy);
  //   expect(res.status).toBe(404);
  //   expect(res.body.success).toBe(false);
  //   expect(res.body.message).toBe("No events Found");
  // });

  // test("should return error message when no events are found", async () => {
  //   // arrange
  //   const newId = new ObjectId("643a56706f55e9085d193f48");
  //   const user = { authorized: true, user_id: newId };
  //   const filterBy = "allevents";
  //   const req = {
  //     headers: {
  //       authorization: "Bearer TOKEN",
  //     },
  //     query: {
  //       filterBy,
  //     },
  //   };
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };
  //   filterCreatorEvents.mockResolvedValueOnce(null);

  //   // act
  //   await listEvents(req, res);

  //   // assert
  //   expect(filterCreatorEvents).toHaveBeenCalledWith(user, filterBy);
  //   expect(res.status).toHaveBeenCalledWith(404);
  //   expect(res.json).toHaveBeenCalledWith({
  //     success: false,
  //     message: "No events Found",
  //   });
  // });
});
