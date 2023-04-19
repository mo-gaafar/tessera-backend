const mongoose = require("mongoose");

const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");
const promocodeModel = require("../../models/promocodeModel");

const {
  retrieveToken,
  verifyToken,
  GenerateToken,
  authorized,
} = require("../../utils/Tokens");

async function bookTicket(req, res) {
  try {
    const eventId = req.params.eventId;

    const { contactInformation, promocode, ticketTierSelected } = req.body;

    const email = contactInformation.email;

    // Get the user object from the database
    const user = await userModel.findOne({
      email: email,
    });

    // check the user if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Find the event in the database.
    const event = await eventModel.findById(eventId);

    // check the event if the event exists
    if (!event) {
      throw new Error("Event not found");
    }

    // Get the ticket tier object from the event object
    const ticketTier = event.ticketTiers.find(
      (tier) =>
        tier.tierName == ticketTierSelected[0].tierName &&
        tier.price == ticketTierSelected[0].price
    );

    // check the ticket tier if the ticket tier exists
    if (!ticketTier) {
      throw new Error("Ticket tier not found");
    }

    // Get the promocode object from the database by the promocode code
    let promocodeObj = null;
    if (promocode) {
      promocodeObj = await promocodeModel.findOne({ code: promocode });
      if (!promocodeObj) {
        throw new Error("Promocode not found");
      }
    }

    // Generate the tickets
    generateTickets(ticketTierSelected, eventId, promocodeObj, user._id);

    // Return a success response if the ticket is created successfully.
    return res.status(200).json({
      success: true,
      message: "Ticket has been created successfully",
    });
  } catch (err) {
    console.error(err);

    // Return an error response if an error occurs.
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * Generates an array of tickets based on the provided ticket tiers.
 * Each ticket tier object must have a "tierName", "quantity", and "price" property.
 * The function will create a ticket for each quantity of each ticket tier.
 * @param {Array<Object>} ticketTiers - An array of ticket tier objects
 * @returns {Array<Object>} An array of ticket objects with "tierName" and "price" properties
 */
async function generateTickets(ticketTiers, eventId, promocodeObj, userId) {
  const tickets = [];

  // Loop through each ticket tier object in the array
  for (let i = 0; i < ticketTiers.length; i++) {
    // Destructure the properties of the current ticket tier object
    const { tierName, quantity } = ticketTiers[i];

    // Loop through each quantity of the current ticket tier and create a ticket object for each one
    for (let j = 0; j < quantity; j++) {
      // Calculate the total price of the ticket if there is a discount
      let ticketPrice = ticketTiers[i].price;
      if (promocodeObj) {
        ticketPrice = await calculateTotalPrice(ticketTiers[i], promocodeObj);
      }

      // Create a new ticket object
      const ticket = new ticketModel({
        eventId: eventId,
        userId: userId,
        promocodeUsed: promocodeObj ? promocodeObj.code : null,
        purchaseDate: new Date(),
        purchasePrice: ticketPrice,
        tierName: tierName,
      });
      console.log(
        "🚀 ~ file: ticketController.js:113 ~ generateTickets ~ ticket:",
        ticket
      );

      // tickets.push(ticket);
      await ticket.save();
      const soldTicket = {
        ticketId: ticket._id,
        userId: userId,
      };

      // add the tickets to the event schema
      await addSoldTicketToEvent(eventId, soldTicket);
    }
  }

  return tickets;
}

/**
 * Calculates the total purchase price for a selected ticket tier with an optional discount from a promocode.
 * @param {object} ticketTierSelected - The selected ticket tier object containing properties of tier name, quantity, and price.
 * @param {object} promocodeObj - The promocode object containing properties of code and discount percentage.
 * @returns {number} - The total purchase price after applying any applicable discount.
 */
async function calculateTotalPrice(ticketTierSelected, promocodeObj) {
  let ticketPrice = ticketTierSelected.price; // Get the base ticket price

  let discount = 0;

  // Check if a promocode was provided
  discount = (ticketPrice * promocodeObj.discount) / 100; // Calculate the discount amount
  totalPrice = ticketPrice - discount; // Apply the discount to the base price

  promocodeObj.remainingUses = promocodeObj.remainingUses - 1;

  await promocodeObj.save();

  return totalPrice; // Return the total purchase price
}

/**
 * Add a sold ticket to an event's soldTickets array
 * @param {string} eventId - The ID of the event to add the sold ticket to
 * @param {object} soldTicket - The sold ticket object to add to the event's soldTickets array
 * @returns {Void} update the event object with the added sold ticket
 * @throws {Error} If the event is not found or if the sold ticket is already associated with the event
 */
async function addSoldTicketToEvent(eventId, soldTicket) {
  try {
    // Find the event in the database using the event ID.
    const event = await eventModel.findById(eventId);

    // Throw an error if the event does not exist.
    if (!event) {
      throw new Error("Event not found");
    }

    // Add the sold ticket to the event's soldTickets array.
    event.soldTickets.push(soldTicket);

    // Save the updated event to the database.
    await event.save();
  } catch (err) {
    console.error(err);

    // Throw an error if an error occurs.
    throw new Error(err.message);
  }
}

/**
 * Creates a new ticket tier for an event.
 * @async
 * @function createTicketTier
 * @param {Array<Object>} ticketTiers - An array of ticket tier objects
 * @param {string} req.body.tierName - The name of the tier
 * @param {Number} req.body.maxCapacity - The capacity of the tier
 * @param {String} req.body.price - The price of the tier
 * @param {Date} req.body.startSelling - The start selling date of the ticket tier
 * @param {Date} req.body.endSelling - The end selling date of the ticket tier
 * @param {Array<Object>} res - An array of ticket tier objects that are created for the event
 * @returns {Object} - A response object with whether the ticket tier has been created successfully or not.
 * @throws {Error} If there is an internal server error.
 * @throws {Error} If the ticket tier creator is not the one who created the event.
 */
async function createTicketTier(req, res) {
  //getting the attributes of ticket tier from body
  console.log("ana gowa el create ticket tier ");
  try {
    const { tierName, maxCapacity, price, startSelling, endSelling } = req.body;
    const quantitySold = 0;
    const event = await eventModel.findById(req.params.eventID); //getting event by its ID
    if (!event) {
      return res.status(404).json({ message: "No event Found" });
    }
    const userid = await authorized(req);

    if (event.creatorId.toString() !== userid.user_id.toString()) {
      // check if the creator of the event matches the user making the delete request
      return res.status(401).json({
        success: false,
        message: "You are not authorized to retrieve this event",
      });
    }

    console.log("ticket tier is to be added in this event:", event);

    //   if (event.creatorId==tierCreatorID){
    //   console.log("creator of the event is the one who edits:",event.creatorId)

    const newTicketTier = {
      tierName,
      quantitySold,
      maxCapacity,
      price,
      startSelling,
      endSelling,
    };
    console.log("new tier is:", newTicketTier);
    event.ticketTiers.push(newTicketTier); // adding new tier to the array of tiers

    const eventWithNewTier = await event.save();

    // console.log("new event with the tier is:", eventWithNewTier);

    res.status(200).json({
      success: true,
      message: "Ticket Tier Created",
      newTicketTier,
    });

    //   }
    // else{
    //   console.log("Can't add new tier as creator and editor not same");

    //   res.status(201).json({
    //     success: false,
    //     message: "Can't add new tier as event creator and editor are not the same",

    //   });

    // }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "invalid details",
    });
  }
}

// }

/**
 * Retrieves the ticket tier(s) for a certain event
 * @async
 * @function retrieveTicketTier
 * @param {string} req.params.eventID - The ID of the event to retrieve ticket tiers in it
 * @param {Array<Object>} res - An array of ticket tier objects that are retrieved for the event
 * @returns {Object} - A response object whether the ticket tiers are retrieved successfully for the event or there is an error message
 * @throws {Error} - If there is an internal server error
 * @throws {Error} - If the event is not found
 *
 */

async function retrieveTicketTier(req, res) {
  console.log("inside retrieveTicketTier");
  // const event=await eventModel.findById(req.params.eventID);
  try {
    const event = await eventModel.findById(req.params.eventID); //returns event of given id
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event is not found",
      });
    }
    const { ticketTiers } = event;
    return res.status(200).json({
      success: true,
      message: "Ticket tier details for the event",
      ticketTiers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "invalid details",
    });
  }
}

module.exports = {
  bookTicket,
  createTicketTier,
  retrieveTicketTier,
  // editTicketTier,
}; //,editTicket };
