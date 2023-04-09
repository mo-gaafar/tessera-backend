const mongoose = require("mongoose");

const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");

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

async function createTicketTier(req, res) {
  // const {quantitySold,capacity,tier,price}=req.body;
  const { quantitySold, capacity, tier, price } = req.body;
  const event = await eventModel.findById(req.params.eventID);
  console.log("ticket tier is added in this eventtttt:", event);

  const newTicketTier = { quantitySold, capacity, tier, price };
  console.log("new tierrrrrr", newTicketTier);
  event.ticketTiers.push(newTicketTier);

  const eventWithNewTier = await event.save();

  console.log("new event is:", eventWithNewTier);
}

module.exports = { bookTicket, createTicketTier }; //,editTicket };
