// const { createTicketTier } = require('../controller/Auth/ticketController');
// const { retrieveToken, verifyToken,authorized } = require('../utils/Tokens');
// // const eventModel = require("../../models/eventModel");
// const eventModel = require("../models/eventModel");
// const userModel = require("../controller/Auth/userController.js");


// jest.mock("../models/eventModel");
// jest.mock("../controller/Auth/userController.js");
// jest.mock("../utils/Tokens.js");

// // Mock the required dependencies
// // jest.mock('../models/eventModel', () => ({
// //   findById: jest.fn().mockResolvedValue({
// //     creatorId: 'testCreatorId',
// //     ticketTiers: [],
// //     save: jest.fn().mockResolvedValue(),
// //   }),
// // }));
// // jest.mock('../utils/Tokens', () => ({
// //   retrieveToken: jest.fn().mockResolvedValue('testToken'),
// //   verifyToken: jest.fn().mockResolvedValue({ user_id: 'testUserId' }),
// // }));


// // /IN////////////
// // jest.mock("../utils/Tokens", () => ({
// //   authorized: jest.fn(),
// // }));
// /////////////IN
// /////INNN///////////////
// describe('createTicketTier', () => {
//   let req;
//   let res;
// ///IN//////////////////////..................

//   // beforeEach(() => {
//   //   req = {
//   //     params: { eventID: 'testEventId' },
//   //     body: { tierName: 'testTierName', maxCapacity: 3000,price:400,
//   //     startSelling: new Date('2023-06-01'),
//   //     endSelling: new Date('2023-07-15'), },
//   //   };
//   //   res = {
//   //     status: jest.fn().mockReturnThis(),
//   //     json: jest.fn(),
//   //   };
//   // }); 


// // omar 
//   beforeEach(() => {
//     req = { params: { eventID: "123456" } };
//     res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//     };
// });


//   afterEach(() => {
// 		jest.resetAllMocks();
// 	});

//   /////IN//////////////////////////////////////////////////////////////////////////////////
//   it("the user is authorized to create tier", async () => {
// 		const eventId = "123456";
// 		const userId = "abcdef";
// 		const event = { _id: eventId, creatorId: userId };

//     const tierName = "VIP";
//     const maxCapacity = 100;
//     const price = 50;
//     const startSelling = "2022-01-01";
//     const endSelling = "2022-12-31";

//   	authorized.mockResolvedValue({ authorized: true, user_id: userId }); 
//     eventModel.findById.mockResolvedValue(event);


//   //   const req = {
//   //     params: {
//   //         eventID: eventId,
//   //     },
//   //     body: {
//   //         tierName,
//   //         maxCapacity,
//   //         price,
//   //         startSelling,
//   //         endSelling,
//   //     },
//   // };
//   // const res = {
//   //     status: jest.fn().mockReturnThis(),
//   //     json: jest.fn(),
//   // };

//   await createTicketTier(req, res);

//   expect(authorized).toHaveBeenCalledWith(req);
//   expect(eventModel.findById).toHaveBeenCalledWith(eventId);
//   expect(res.status).toHaveBeenCalledWith(200);
//   expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: "Ticket Tier Created",
//       newTicketTier: {
//           tierName,
//           quantitySold: 0,
//           maxCapacity,
//           price,
//           startSelling,
//           endSelling,
//       },
//   });
// });

// })
// /////IN/////////////////////////////////////////////////////////////////////////////////////////

// 		// eventModel.findById.mockResolvedValue(event);

// 		// await createTicketTier(req, res);

// 		// expect(authorized).toHaveBeenCalledWith(req);
// 		// expect(eventModel.findById).toHaveBeenCalledWith(eventId);
// 		// expect(res.status).toHaveBeenCalledWith(200);
// 		// expect(res.json).toHaveBeenCalledWith({ event });
// 	// });  
// ///IN/////////////////////////
//   //   it("error message if the event is not found", async () => {
// 	// 	eventModel.findById.mockReturnValue(null);
// 	// 	const errorMessage = "No event Found";

// 	// 	await createTicketTier(req, res);

// 	// 	expect(eventModel.findById).toHaveBeenCalledWith(req.params.eventID);
// 	// 	expect(res.status).toHaveBeenCalledWith(404);
// 	// 	expect(res.json).toHaveBeenCalledWith({
// 	// 		message: errorMessage,
// 	// 	});
// 	// });



//   // it("user not authorized to create tier", async () => {
// 	// 	const eventId = "123456";
// 	// 	const userId = "abcdef";
// 	// 	const event = { _id: eventId, creatorId: "xyz" };

// 	// 	authorized.mockResolvedValue({ authorized: true, user_id: userId });
// 	// 	eventModel.findById.mockResolvedValue(event);

// 	// 	await createTicketTier(req, res);

// 	// 	expect(authorized).toHaveBeenCalledWith(req);
// 	// 	expect(eventModel.findById).toHaveBeenCalledWith(eventId);
// 	// 	expect(res.status).toHaveBeenCalledWith(401);
// 	// 	expect(res.json).toHaveBeenCalledWith({
// 	// 		success: false,
// 	// 		message: "You are not authorized to create tier for this event",
// 	// 	});
// 	// });

//   //   it("error occurs while creating tier", async () => {
// 	// 	eventModel.findById.mockRejectedValue(
// 	// 		new Error("Something wrong with the request")
// 	// 	);

// 	// 	await createTicketTier(req, res);

// 	// 	expect(eventModel.findById).toHaveBeenCalledWith(req.params.eventID);
// 	// 	expect(res.status).toHaveBeenCalledWith(400);
// 	// 	expect(res.json).toHaveBeenCalledWith({
// 	// 		success: false,
// 	// 		message: "Something wrong with the request",
// 	// 	});
// 	// });
// ///////////////////////IN//////////////////////////////////



  
// //     // expect(res.json).toHaveBeenCalledWith({
// //     //   success: true,
// //     //   message: 'Ticket Tier Created',
// //     //   newTicketTier: {
// //     //     tierName: 'testTierName',
// //     //     quantitySold: 0,
// //     //     maxCapacity: 3000,
// //     //     price:400,
// //     //     startSelling: new Date('2023-06-01'),
// //     //     endSelling: new Date('2023-07-15'), 
// //     //   },
// //     // });


// // //   it("the user is authorized to retrieve it", async () => {f
// // //     const eventId = "123456";
// // //     const userId = "abcdef";
// // //     const event = { _id: eventId, creatorId: userId };

// // //     authorized.mockResolvedValue({ authorized: true, user_id: userId });
// // //     eventModel.findById.mockResolvedValue(event);

// // //     await getEventById(req, res);

// // //     expect(authorized).toHaveBeenCalledWith(req);
// // //     expect(eventModel.findById).toHaveBeenCalledWith(eventId);
// // //     expect(res.status).toHaveBeenCalledWith(200);
// // //     expect(res.json).toHaveBeenCalledWith({ event });
// // // });


// //   // it('should return an error message if the creator is not authorized', async () => {
// //   //   // Mock the event to have a different creatorId than the user who created the tier
// //   //   const eventModel = require('../models/eventModel');
// //   //   eventModel.findById.mockResolvedValue({
// //   //     creatorId: 'differentCreatorId',
// //   //     ticketTiers: [],
// //   //     save: jest.fn().mockResolvedValue(),
// //   //   });

// //   //   await createTicketTier(req, res);

// //   //   expect(res.status).toHaveBeenCalledWith(201);
// //   //   expect(res.json).toHaveBeenCalledWith({
// //   //     success: false,
// //   //     message: "Can't add new tier as event creator and editor are not the same",
// //   //   });
// //   // });

// //   // it('should return an error message if the request body is invalid', async () => {
// //   //   // Modify the request body to be missing the required 'tierName' field
// //   //   req.body = { maxCapacity: 3000 };

// //   //   await createTicketTier(req, res);

// //   //   expect(res.status).toHaveBeenCalledWith(400);
// //   //   expect(res.json).toHaveBeenCalledWith({
// //   //     success: false,
// //   //     message: 'invalid details',
// //   //   });
// //   // });

// //   it("successfully creates a new ticket tier", async () => {
// // 		const event = {
// // 			_id: "123456",
// // 			creatorId: "abcdef",
// // 			ticketTiers: [],
// // 		};

// // 		authorized.mockResolvedValue({ authorized: true, user_id: "abcdef" });
// // 		eventModel.findById.mockResolvedValue(event);
// // 		event.save.mockResolvedValue(event);

// // 		await createTicketTier(req, res);

// // 		expect(authorized).toHaveBeenCalledWith(req);
// // 		expect(eventModel.findById).toHaveBeenCalledWith("123456");
// // 		expect(eventModel.prototype.save).toHaveBeenCalled();
// // 		expect(res.status).toHaveBeenCalledWith(200);
// // 		expect(res.json).toHaveBeenCalledWith({
// // 			success: true,
// // 			message: "Ticket Tier Created",
// // 			newTicketTier: {
// // 				tierName: "VIP",
// // 				quantitySold: 0,
// // 				maxCapacity: 100,
// // 				price: 50,
// // 				startSelling: "2023-05-01T00:00:00Z",
// // 				endSelling: "2023-05-10T00:00:00Z",
// // 			},
// // 		});
// // 	});

// // 	it("returns error if event is not found", async () => {
// // 		eventModel.findById.mockResolvedValue(null);

// // 		await createTicketTier(req, res);

// // 		expect(eventModel.findById).toHaveBeenCalledWith("123456");
// // 		expect(res.status).toHaveBeenCalledWith(404);
// // 		expect(res.json).toHaveBeenCalledWith({ message: "No event Found" });
// // 	});

// // 	it("returns error if user is not authorized", async () => {
// // 		const event = {
// // 			_id: "123456",
// // 			creatorId: "xyz",
// // 			ticketTiers: [],
// // 		};

// // 		authorized.mockResolvedValue({ authorized: true, user_id: "abcdef" });
// // 		eventModel.findById.mockResolvedValue(event);

// // 		await createTicketTier(req, res);

// // 		expect(authorized).toHaveBeenCalledWith(req);
// // 		expect(eventModel.findById).toHaveBeenCalledWith("123456");
// // 		expect(res.status).toHaveBeenCalledWith(401);
// // 		expect(res.json).toHaveBeenCalledWith({
// // 			success: false,
// // 			message: "You are not authorized to retrieve this event",
// // 		});
// // 	});

// // 	it("returns error if there's an error while saving the event", async () => {
// // 		const event = {
// // 			_id: "123456",
// // 			creatorId: "abcdef",
// // 			ticketTiers: [],
// // 		};

// // 		authorized.mockResolvedValue({ authorized: true, user_id: "abcdef" });
// // 		eventModel.findById.mockResolvedValue(event);
// // 		event.save.mockRejectedValue(new Error("Something went wrong"))


// // }); 

// // })


// // });




// ///////3AKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK////////////////////////////////////////////
// // const createTicketTier = require('./createTicketTier');
// // const eventModel = require('./eventModel');

// // jest.mock('./eventModel');

// // describe('createTicketTier', () => {
// //   const req = {
// //     body: {
// //       tierName: 'Tier 1',
// //       maxCapacity: 100,
// //       price: 10,
// //       startSelling: '2023-05-01T00:00:00.000Z',
// //       endSelling: '2023-06-01T00:00:00.000Z',
// //     },
// //     params: {
// //       eventID: '1234567890',
// //     },
// //   };

// //   const res = {
// //     status: jest.fn().mockReturnThis(),
// //     json: jest.fn(),
// //   };

// //   const event = {
// //     _id: '1234567890',
// //     creatorId: 'user1',
// //     ticketTiers: [],
// //     save: jest.fn(),
// //   };

// //   beforeEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   test('creates a new ticket tier', async () => {
// //     eventModel.findById.mockResolvedValue(event);

// //     await createTicketTier(req, res);

// //     expect(eventModel.findById).toHaveBeenCalledTimes(1);
// //     expect(eventModel.findById).toHaveBeenCalledWith('1234567890');

// //     expect(event.ticketTiers).toHaveLength(1);
// //     expect(event.ticketTiers[0].tierName).toBe('Tier 1');
// //     expect(event.ticketTiers[0].maxCapacity).toBe(100);
// //     expect(event.ticketTiers[0].price).toBe(10);
// //     expect(event.ticketTiers[0].startSelling).toBe('2023-05-01T00:00:00.000Z');
// //     expect(event.ticketTiers[0].endSelling).toBe('2023-06-01T00:00:00.000Z');

// //     expect(event.save).toHaveBeenCalledTimes(1);

// //     expect(res.status).toHaveBeenCalledTimes(1);
// //     expect(res.status).toHaveBeenCalledWith(200);
// //     expect(res.json).toHaveBeenCalledTimes(1);
// //     expect(res.json).toHaveBeenCalledWith({
// //       success: true,
// //       message: 'Ticket Tier Created',
// //       newTicketTier: {
// //         tierName: 'Tier 1',
// //         maxCapacity: 100,
// //         price: 10,
// //         startSelling: '2023-05-01T00:00:00.000Z',
// //         endSelling: '2023-06-01T00:00:00.000Z',
// //         quantitySold: 0,
// //       },
// //     });
// //   });

// //   test('returns 401 unauthorized if user is not the event creator', async () => {
// //     eventModel.findById.mockResolvedValue({
// //       ...event,
// //       creatorId: 'user2',
// //     });

// //     await createTicketTier(req, res);

// //     expect(eventModel.findById).toHaveBeenCalledTimes(1);
// //     expect(eventModel.findById).toHaveBeenCalledWith('1234567890');

// //     expect(event.ticketTiers).toHaveLength(0);
// //     expect(event.save).toHaveBeenCalledTimes(0);

// //     expect(res.status).toHaveBeenCalledTimes(1);
// //     expect(res.status).toHaveBeenCalledWith(401);
// //     expect(res.json).toHaveBeenCalledTimes(1);
// //     expect(res.json).toHaveBeenCalledWith({
// //       success: false,
// //       message: 'You are not authorized to retrieve this event',
// //     });
// // })

// // })