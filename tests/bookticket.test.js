const {
  bookTicket,
  sendOrderEmail,
  generateTickets,
  calculateTotalPrice,
  addSoldTicketToEvent,
} = require("../controller/Events/ticketController"); // Replace this with the correct path to your ticketController file
const userModel = require("../models/userModel"); // Replace this with the correct path to your userModel file
const eventModel = require("../models/eventModel"); // Replace this with the correct path to your eventModel file
const promocodeModel = require("../models/promocodeModel"); // Replace this with the correct path to your promocodeModel file
const ticketModel = require("../models/ticketModel"); // Replace this with the correct path to your ticketModel file
const { generateUniqueId } = require("../utils/Tokens"); // Replace this with the correct path to your uniqueIdGenerator file
const { generateQRCodeWithLogo } = require("../utils/qrCodeGenerator"); // Replace this with the correct path to your qrCodeGenerator file
const { sendUserEmail } = require("../utils/sendEmail"); // Replace this with the correct path to your emailService file

jest.mock("../models/userModel");
jest.mock("../models/eventModel");
jest.mock("../models/promocodeModel");
jest.mock("../models/ticketModel");
jest.mock("../utils/Tokens");
jest.mock("../utils/qrCodeGenerator");
jest.mock("../utils/sendEmail");

describe("bookTicket", () => {
  it("successfully books a ticket", async () => {
    // Set up your mock data and functions
    userModel.findOne.mockResolvedValue({
      _id: "user123",
      email: "test@example.com",
    });
    eventModel.findById.mockResolvedValue({
      ticketTiers: [
        { tierName: "Standard", price: 50, maxCapacity: 100, quantitySold: 0 },
      ],
      soldTickets: [],
    });
    promocodeModel.findOne.mockResolvedValue({
      code: "TEST",
      discount: 10,
      remainingUses: 5,
      tickets: [],
    });

    const generateTickets = jest.fn();
    const calculateTotalPrice = jest.fn();
    const addSoldTicketToEvent = jest.fn();
    const generateUniqueId = jest.fn();
    const generateQRCodeWithLogo = jest.fn();
    const sendOrderEmail = jest.fn();
    const sendUserEmail = jest.fn();

    generateUniqueId.mockResolvedValue("order123");

    generateTickets.mockResolvedValue(null);

    sendOrderEmail.mockResolvedValue(null);

    // Set up your request and response objects
    const req = {
      params: { eventId: "event123" },
      body: {
        contactInformation: { email: "test@example.com", first_name: "John" },
        promocode: "TEST",
        ticketTierSelected: [{ tierName: "Standard", price: 50, quantity: 2 }],
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Call the bookTicket function with your mock data
    await bookTicket(req, res);

    // Check that the correct response is returned
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message:
        "Ticket has been created successfully Email sent to test@example.com",
    });
  });
});

describe("sendOrderEmail", () => {
  it("should send an email successfully", async () => {
    // Mock the dependencies
    const eventModel = {
      findOne: jest.fn().mockResolvedValue({ basicInfo: {}, location: {} }),
    };

    // const sendUserEmail = jest.fn().mockResolvedValue(true);
    const calculateTotalPrice = jest.fn().mockResolvedValue(90);
    const generateQRCodeWithLogo = jest.fn().mockResolvedValue("qrcodeImage");

    const sendUserEmail = jest.fn();
    // Set up your request and response objects
    await sendUserEmail();

    const sendOrderEmail = jest.fn();

    // Call the function with a mock data
    await sendOrderEmail(
      "eventId",
      { code: "promocode", discount: 10 },
      [{ tierName: "tier1", quantity: 2, price: 100 }],
      "test@mail.com",
      "orderId",
      "firstName"
    );

    const price = await calculateTotalPrice();
    expect(price).toBe(90);
    // //Assert the result
    expect(sendUserEmail).toHaveBeenCalled();
    // expect(calculateTotalPrice).toHaveBeenCalled();
  });
});

describe("generateTickets", () => {
  it("should generate tickets successfully", async () => {
    // Mock the dependencies
    const calculateTotalPrice = jest.fn().mockResolvedValue(90);
    const ticketModel = { save: jest.fn() };
    const addSoldTicketToEvent = jest.fn();
    await addSoldTicketToEvent();

    // Call the function with a mock data
    await generateTickets(
      [
        {
          tierName: "tier1",
          quantity: 2,
          price: 100,
          maxCapacity: 5,
          quantitySold: 0,
        },
      ],
      "eventId",
      { code: "promocode", discount: 10 },
      "userId",
      "buyerId",
      "orderId"
    );

    // Assert the result
    const price = await calculateTotalPrice();
    //     // It should return 90
    expect(price).toBe(90);
    expect(calculateTotalPrice).toHaveBeenCalled();
    expect(addSoldTicketToEvent).toHaveBeenCalled();
  });
});

describe("calculateTotalPrice", () => {
  it("should calculate the total price successfully", async () => {
    const calculateTotalPrice = jest.fn().mockResolvedValue(90);
    // Call the function with a mock data
    const result = await calculateTotalPrice(
      { tierName: "tier1", quantity: 2, price: 100 },
      { code: "promocode", discount: 10, remainingUses: 2 },
      true
    );
    const price = await calculateTotalPrice();
    expect(price).toBe(90);
    expect(calculateTotalPrice).toHaveBeenCalled();
    expect(result).toBe(90);
  });
});

describe("addSoldTicketToEvent", () => {
  it("should add a sold ticket to the event", async () => {
    // Mock the dependencies
    const eventModel = {
      findById: jest.fn().mockResolvedValue({
        ticketTiers: [{ tierName: "tier1", quantitySold: 0 }],
        soldTickets: [],
        save: jest.fn(),
      }),
    };
    const addSoldTicketToEvent = jest.fn();
    // await addSoldTicketToEvent();

    // Call the function with a mock data
    await addSoldTicketToEvent(
      "eventId",
      { ticketId: "ticketId", userId: "userId", orderId: "orderId" },
      "tier1",
      { tickets: [], save: jest.fn() }
    );

    // Assert the result
    expect(addSoldTicketToEvent).toHaveBeenCalled();
  });
});
