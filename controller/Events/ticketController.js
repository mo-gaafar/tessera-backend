const mongoose = require("mongoose");

const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");
const promocodeModel = require("../../models/promocodeModel");
const generateQRCodeWithLogo = require("../../utils/qrCodeGenerator");

const {
  retrieveToken,
  verifyToken,
  GenerateToken,
} = require("../../utils/Tokens");

const { sendUserEmail, orderBookedOption } = require("../../utils/sendEmail");

/**
 * Creates a new ticket for an event and user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body.contactInformation - The contact information of the user creating the ticket.
 * @param {string} req.body.contactInformation.first_name - The first name of the user creating the ticket.
 * @param {string} req.body.contactInformation.last_name - The last name of the user creating the ticket.
 * @param {string} req.body.contactInformation.email - The email of the user creating the ticket.
 * @param {string} req.body.promocode - The promocode used (optional).
 * @param {Array} req.body.ticketTierSelected - An array of objects representing the selected ticket tiers.
 * @param {string} req.body.ticketTierSelected[i].tierName - The name of the i-th ticket tier.
 * @param {number} req.body.ticketTierSelected[i].quantity - The number of tickets to be booked for the i-th ticket tier.
 * @param {number} req.body.ticketTierSelected[i].price - The price per ticket of the i-th ticket tier.
 *
 * @returns {Object} The newly created ticket object.
 *
 * @throws {Error} If the event or user do not exist in the database.
 */
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

    // check all the ticket tiers in the ticketTierSelected array if they all exist with the correct price in the ticket tiers of the event model
    for (let i = 0; i < ticketTierSelected.length; i++) {
      const ticketTier = event.ticketTiers.find(
        (ticketTier) =>
          ticketTier.tierName == ticketTierSelected[i].tierName &&
          ticketTier.price == ticketTierSelected[i].price
      );

      // check the ticket tier if the ticket tier exists
      if (!ticketTier) {
        throw new Error(
          "Ticket tier not found or the price doesn't match the ticket tier"
        );
      }
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

    // send email with order and Qr-Code
    sendOrderEmail(eventId, promocodeObj, ticketTierSelected, email);

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
 * Sends an order confirmation email to the user with the specified email address.
 * @async
 * @function sendOrderEmail
 * @param {string} eventID - The ID of the event.
 * @param {Object} promocodeObj - An object containing the promo code information.
 * @param {Array} ticketTierSelectedArray - An array containing the selected ticket tiers.
 * @param {string} email - The email address of the user.
 * @throws {Error} If any error occurs during the process.
 */
async function sendOrderEmail(
  eventID,
  promocodeObj,
  ticketTierSelectedArray,
  email
) {
  try {
    // add new attribute in ticketTierSelected equal to the new price multiplied with the quantity using the implemented functions
    for (let i = 0; i < ticketTierSelectedArray.length; i++) {
      totalPrice = await calculateTotalPrice(
        ticketTierSelectedArray[i],
        promocodeObj,
        (forEmail = true)
      );
      ticketTierSelectedArray[i].totalPrice =
        totalPrice * ticketTierSelectedArray[i].quantity;
    }

    // get the event basic info from events
    let event = await eventModel.findOne({ _id: eventID });
    let eventBasicInfo = [event.basicInfo];

    // generate QrCode and connects it to the evenURL
    const qrcodeImage = await generateQRCodeWithLogo(event.eventUrl);

    // const order = { ticketTierSelectedArray, eventBasicInfo, qrcode };
    const order = { ticketTierSelectedArray, eventBasicInfo };
    console.log("🚀 ~ file: ticketController.js:123 ~ order:", order);

    // send email with order and Qr-Code
    await sendUserEmail(email, order, orderBookedOption, qrcodeImage);
  } catch (error) {
    throw error;
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
  // Loop through each ticket tier object in the array
  for (let i = 0; i < ticketTiers.length; i++) {
    // Destructure the properties of the current ticket tier object
    tickets = [];
    const { tierName, quantity } = ticketTiers[i];

    // Loop through each quantity of the current ticket tier and create a ticket object for each one
    for (let j = 0; j < quantity; j++) {
      // Calculate the total price of the ticket
      const ticketPrice = await calculateTotalPrice(
        ticketTiers[i],
        promocodeObj
      );

      // Create a new ticket object
      const ticket = new ticketModel({
        eventId: eventId,
        userId: userId,
        promocodeUsed: promocodeObj ? promocodeObj.code : null,
        purchaseDate: new Date(),
        purchasePrice: ticketPrice,
        tierName: tierName,
      });

      await ticket.save();
      const soldTicket = {
        ticketId: ticket._id,
        userId: userId,
      };

      // add the tickets to the event schema
      await addSoldTicketToEvent(eventId, soldTicket, tierName);
    }
  }
}

/**
 * Calculates the total purchase price for a selected ticket tier with an optional discount from a promocode.
 * @param {object} ticketTierSelected - The selected ticket tier object containing properties of tier name, quantity, and price.
 * @param {object} promocodeObj - The promocode object containing properties of code and discount percentage.
 * @returns {number} - The total purchase price after applying any applicable discount.
 */
async function calculateTotalPrice(
  ticketTierSelected,
  promocodeObj,
  forEmail = null
) {
  let ticketPrice = ticketTierSelected.price; // Get the base ticket price

  let discount = 0;
  if (promocodeObj) {
    // Check if a promocode was provided
    discount = (ticketPrice * promocodeObj.discount) / 100; // Calculate the discount amount
    ticketPrice = ticketPrice - discount; // Apply the discount to the base price

    promocodeObj.remainingUses = promocodeObj.remainingUses - 1;

    if (forEmail) {
      await promocodeObj.save();
    }
  }

  // add new atribute in ticketTierSelected equal to the new price multiplied with the quantity
  ticketTierSelected.totalPrice = ticketPrice * ticketTierSelected.quantity;

  return ticketPrice; // Return the total purchase price
}

/**
 * Add a sold ticket to an event's soldTickets array
 * @param {string} eventId - The ID of the event to add the sold ticket to
 * @param {object} soldTicket - The sold ticket object to add to the event's soldTickets array
 * @returns {Void} update the event object with the added sold ticket
 * @throws {Error} If the event is not found or if the sold ticket is already associated with the event
 */
async function addSoldTicketToEvent(eventId, soldTicket, tierName) {
  try {
    // Find the event in the database using the event ID.
    const event = await eventModel.findById(eventId);

    // Throw an error if the event does not exist.
    if (!event) {
      throw new Error("Event not found");
    }

    // increment the quantitySold in the ticket tiers in the event model
    for (let i = 0; i < event.ticketTiers.length; i++) {
      if (event.ticketTiers[i].tierName === tierName) {
        event.ticketTiers[i].quantitySold += 1;
      }
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
 * @param {Array} req - The request array of objects containing the ticket Tier(s) info
 * @param {Object} req - The request object containing the ticket Tier info
 * @param {string} req.body.tierName - The name of the tier
 * @param {Number} req.body.maxCapacity - The capacity of the tier
 * @param {String} req.body.price - The price of the tier
 * @param {Date} req.body.startSelling - The start selling date of the ticket tier
 * @param {Date} req.body.endSelling - The end selling date of the ticket tier
 * @param {Object} res - The response object that will be sent back to the creator for each tier.
 * @param {Array} res - The response array that will be sent back to the creator for the ticket tiers.
 * @returns {Object} - A response object with whether the ticket tier has been created successfully or not.
 * @throws {Error} If there is an internal server error.
 * @throws {Error} If the ticket tier creator is not the one who created the event.
 */

async function createTicketTier(req, res) {
  //getting the attributes of ticket tier from body
  // console.log("inside ticket tier ");
  try {
    const { tierName, maxCapacity, price, startSelling, endSelling } = req.body;

    const token = await retrieveToken(req); //getting the token of the ticket tier creator
    console.log("token is:", token);

    const decodedToken = verifyToken(token); //decoding the token

    decodedToken.then((resolvedValue) => {
      tierCreatorID = resolvedValue.user_id;
      console.log("tier Creator ID:", tierCreatorID); // getting ID of ticket tier creator
    });

    const quantitySold = 1000;
    const event = await eventModel.findById(req.params.eventID); //getting event by its ID
    // console.log("ticket tier is to be added in this event:", event);
    console.log("creator ID:", event.creatorId);
    // checking if creator of the event is the one who edits it
    if (event.creatorId == tierCreatorID) {
      console.log(
        "creator of the event is the one who edits:",
        event.creatorId
      );

      const newTicketTier = {
        tierName,
        quantitySold,
        maxCapacity,
        price,
        startSelling,
        endSelling,
      };

      event.ticketTiers.push(newTicketTier); // adding new tier to the array of tiers

      const eventWithNewTier = await event.save();

      res.status(200).json({
        success: true,
        message: "Ticket Tier Created",
        newTicketTier,
      });
    } else {
      console.log("Can't add new tier as creator and editor not same");

      res.status(201).json({
        success: false,
        message:
          "Can't add new tier as event creator and editor are not the same",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "invalid details",
    });
  }
}

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

/**
 * Edits a ticket tier for an event.
 * @param {Object} req - The  request object that has the tier ID and the the tier array of objects
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.eventID - The ID of the desired event to edit.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.tierID - The ID of the ticket tier to edit.
 * @param {Array<Object>} req.body.ticketTiers - An array of objects containing the updated ticket tier information.
 * @param {string} req.body.ticketTiers.tierName - The type of the ticket tier.
 * @param {number} req.body.ticketTiers.maxCapacity - The  capacity of the ticket tier.
 * @param {number} req.body.ticketTiers.price - The price of the ticket tier.
 * @param {Date} req.body.ticketTiers.startSelling - The date to start selling the ticket tier.
 * @param {Date} req.body.ticketTiers.endSelling - The date to stop selling the ticket tier
 * @param {Object} res - The response object.
 * @returns {Object} An object containing the success status and a message is sent
 */

async function editTicketTier(req, res) {
  try {
    const eventID = req.params.eventID; // get the event ID from the request URL

    // getting the parameters from the request body
    const enteredTierID = req.body.tierID;
    if (!enteredTierID) {
      return res.status(404).json({
        success: false,
        message: "Please enter the ID of the desired tier",
      });
    }
    const newTierName = req.body.ticketTiers[0].tierName;
    const newMaxCapacity = req.body.ticketTiers[0].maxCapacity;
    const newPrice = req.body.ticketTiers[0].price;
    const newStartSelling = req.body.ticketTiers[0].startSelling;
    const newEndSelling = req.body.ticketTiers[0].endSelling;
    console.log("new Tier Name:", newTierName);
    console.log("desired tierID:", enteredTierID);

    const event = await eventModel.findById(req.params.eventID); //getting event by its ID
    // event not found
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "No event Found",
      });
    }

    // update the ticket tier attributes with the body parameters using the tier ID
    const updatedEvent = await eventModel.findOneAndUpdate(
      { _id: eventID, "ticketTiers._id": enteredTierID },
      {
        $set: {
          "ticketTiers.$.tierName": newTierName,
          "ticketTiers.$.maxCapacity": newMaxCapacity,
          "ticketTiers.$.price": newPrice,
          "ticketTiers.$.startSelling": newStartSelling,
          "ticketTiers.$.endSelling": newEndSelling,
        },
      },
      { new: true, runValidators: true }
    );

    console.log("updated event:", updatedEvent);

    return res.status(200).json({
      success: true,
      message: "Ticket tier has been successfully edited",
    });
  } catch {
    // error
    res.status(400).json({
      success: false,
      message: "internal server error",
    });
  }
}

module.exports = {
  bookTicket,
  createTicketTier,
  retrieveTicketTier,
  editTicketTier,
  generateTickets,
};
