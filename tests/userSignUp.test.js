const request = require("supertest");
const server = require("../app");

describe("POST /api/auth/signup", () => {
  describe("user gives required signup information ", () => {
    //status code is 201
    test("should respond with 201 status code", async () => {
      const response = await request(server).post("/api/auth/signup").send({
        firstName: "Ahmed",
        lastName: "Osama",
        email: "ahmedd_osa1567@gmail.com",
        emailConfirmation: "ahmedd_osa1567@gmail.com",
        password: "User3136_2003",
      });

      expect(response.statusCode).toBe(201);
    });
  });
});

describe("POST /api/auth/login", () => {
  describe("user gives required login information ", () => {
    //status code is 201
    test("should respond with 201 status code", async () => {
      const response = await request(server).post("/api/auth/login").send({
        email: "user123@gmail.com",
        password: "Usera153_2003",
      });

      expect(response.statusCode).toBe(200);
      // expect(response.statusCode).toBe(201)
    });
  });
});
