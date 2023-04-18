const { createTicketTier } = require('../controller/Auth/ticketController');
// const eventModel = require("../../models/eventModel");


// Mock the required dependencies
jest.mock('../models/eventModel', () => ({
  findById: jest.fn().mockResolvedValue({
    creatorId: 'testCreatorId',
    ticketTiers: [],
    save: jest.fn().mockResolvedValue(),
  }),
}));
jest.mock('../utils/Tokens', () => ({
  retrieveToken: jest.fn().mockResolvedValue('testToken'),
  verifyToken: jest.fn().mockResolvedValue({ user_id: 'testUserId' }),
}));

describe('createTicketTier', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { eventID: 'testEventId' },
      body: { tierName: 'testTierName', maxCapacity: 3000,price:400,
      startSelling: new Date('2023-06-01'),
      endSelling: new Date('2023-07-15'), },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a new ticket tier for the event if the creator is authorized', async () => {
    await createTicketTier(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Ticket Tier Created',
      newTicketTier: {
        tierName: 'testTierName',
        quantitySold: 0,
        maxCapacity: 3000,
        price:400,
        startSelling: new Date('2023-06-01'),
        endSelling: new Date('2023-07-15'), 
      },
    });
  });

  it('should return an error message if the creator is not authorized', async () => {
    // Mock the event to have a different creatorId than the user who created the tier
    const eventModel = require('../models/eventModel');
    eventModel.findById.mockResolvedValue({
      creatorId: 'differentCreatorId',
      ticketTiers: [],
      save: jest.fn().mockResolvedValue(),
    });

    await createTicketTier(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Can't add new tier as event creator and editor are not the same",
    });
  });

  it('should return an error message if the request body is invalid', async () => {
    // Modify the request body to be missing the required 'tierName' field
    req.body = { maxCapacity: 3000 };

    await createTicketTier(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'invalid details',
    });
  });
});
