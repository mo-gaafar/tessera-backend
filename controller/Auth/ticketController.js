const mongoose = require("mongoose");

const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");
const { retrieveToken, verifyToken, GenerateToken } = require("../../utils/Tokens");
const { authenticate } = require("passport");
const { boolean } = require("joi");
const { generate } = require("generate-password");

// /**
// //  * * Creates a new ticket that is linked to a specific event by event ID
// //  * @async
// //  * @function createTicket
// //  * @param {Object} req - The request object containing the ticket's infos
// //  * @param {string} req.body.eventID - The ID of the event
// //  * @param {string} req.body.ticketID - The ID of the ticket
// //  * @param {string} req.body.purchasePrice - The purchasing price of the ticket
// //  * @param {object} req.body.ticketTier -ticket tier object
// //  * @param {Object} res - The response object that will be sent back to the client with the ticket information
// //  * @returns {Object} - A response object with information about the new ticket if it is created successfully with a message or a message if it is not created
// //  * @throws {Error} If there is an internal server error.
// //  * @throws {Error} If an invalid event ID is entered
// //  *
// // */

async function bookTicket(req, res) {
  // getting parameters from request body
  const { eventID, userID, purchaseDate, purchasePrice, type } = req.body;

  // const event=await eventModel.findById(eventID);

  // if (!event){

  //   res.status(200).json(
  //     {
  //     success:false,
  //     message: "Invalid event Id",
  //     }
  // )
  // }

  // create ticket object
  try {
    const ticket = new ticketModel({
      eventID: eventID,
      userID: userID,
      purchaseDate,
      purchasePrice,
      type,
    });

    // save ticket
    const savedTicket = await ticket.save();

    res.status(201).json({
      success: true,
      message: "Ticket  Created",
      ticket: savedTicket,
    });
  } catch {
    res.status(200).json({
      success: false,
      message: "error",
    });
  }
}

// const generatedtoken=  GenerateToken("6417b9099e62572b43c9267e")
// console.log("generated token is:",generatedtoken)


async function createTicketTier(req, res) {
  //getting the attributes of ticket tier from body
  const { quantitySold, capacity, tier, price } = req.body;
  const token=await retrieveToken(req) //getting the token of the ticket tier creator
  console.log("token is:",token)
  const decodedToken=verifyToken(token) //decoding the token
  
  decodedToken.then((resolvedValue) => {
    tierCreatorID=resolvedValue.user_id
    console.log("tier Creator ID:",tierCreatorID); // getting ID of ticket tier creator
  });
  
  
  const event = await eventModel.findById(req.params.eventID);//getting event by its ID
  console.log("ticket tier is to be added in this event:", event);
  console.log("creator ID:",event.creatorId) 
  if (event.creatorId==tierCreatorID){

  console.log("creator of the event is the one who edits:",event.creatorId) 


  const newTicketTier = { quantitySold, capacity, tier, price };
  console.log("new tier is:", newTicketTier);
  event.ticketTiers.push(newTicketTier); // adding new tier to the array of tiers 

  const eventWithNewTier = await event.save();

  console.log("new event with the tier is:", eventWithNewTier);

  res.status(200).json({
    success: true,
    message: "Ticket Tier Created",
    newTicketTier
  });

  }
else{
  console.log("Can't add new tier as creator and editor not same");

  res.status(201).json({
    success: false,
    message: "Can't add new tier as event creator and editor are not the same",
    
  });

}

}

module.exports = { bookTicket, createTicketTier }; //,editTicket };
