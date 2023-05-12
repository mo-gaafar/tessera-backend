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
  generateUniqueId,
  authorized,
} = require("../../utils/Tokens");

const {
  sendUserEmail,
  orderBookedOption,
  addAttendeeOption,
} = require("../../utils/sendEmail");

const { comparePassword } = require("../../utils/passwords");

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

    // Get the buyer id from the user object
    const buyerId = user._id;

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
    // generate order id
    const orderId = await generateUniqueId();

    // Generate the tickets
    generateTickets(
      ticketTierSelected,
      eventId,
      promocodeObj,
      user._id,
      buyerId,
      orderId
    );

    // send email with order and Qr-Code
    sendOrderEmail(
      eventId,
      promocodeObj,
      ticketTierSelected,
      email,
      orderId,
      contactInformation.first_name
    );

    // Return a success response if the ticket is created successfully.
    return res.status(200).json({
      success: true,
      message:
        "Ticket has been created successfully" + ` Email sent to ${email}`,
    });
  } catch (err) {
    console.error(err);

    // Return an error response if an error occurs.
    return res.status(400).json({
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
  email,
  orderId,
  firstName
) {
  try {
    console.log("🚀 ~ file: ticketController.js:147 ~ sendOrderEmail:");
    let totalOrderPrice = 0;
    // add new attribute in ticketTierSelected equal to the new price multiplied with the quantity using the implemented functions
    for (let i = 0; i < ticketTierSelectedArray.length; i++) {
      totalPrice = await calculateTotalPrice(
        ticketTierSelectedArray[i],
        promocodeObj,
        (forEmail = true)
      );
      ticketTierSelectedArray[i].totalPrice =
        totalPrice * ticketTierSelectedArray[i].quantity;
      totalOrderPrice += ticketTierSelectedArray[i].totalPrice; // add to total order price
    }

    // get the event basic info from events
    let event = await eventModel.findOne({ _id: eventID });
    let eventBasicInfo = event.basicInfo;

    // get the location info from events
    let location = eventBasicInfo.location;

    // generate location string
    const locationString = `${location.streetNumber} ${location.route}, ${location.city}, ${location.administrativeAreaLevel1}, ${location.country}`;

    // generate QrCode and connects it to the evenURL
    const qrcodeImage = await generateQRCodeWithLogo(event.eventUrl);

    // const order = { ticketTierSelectedArray, eventBasicInfo, qrcode };
    const order = {
      ticketTierSelectedArray,
      eventBasicInfo,
      totalOrderPrice,
      orderId,
      firstName,
      locationString,
    };

    // send email with order and Qr-Code
    await sendUserEmail(email, order, orderBookedOption, qrcodeImage);
    // await sendUserEmail(email, order, addAttendeeOption, qrcodeImage);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Generates an array of tickets based on the provided ticket tiers.
 * Each ticket tier object must have a "tierName", "quantity", and "price" property.
 * The function will create a ticket for each quantity of each ticket tier.
 * @param {Array<Object>} ticketTiers - An array of ticket tier objects
 * @returns {Array<Object>} An array of ticket objects with "tierName" and "price" properties
 */
async function generateTickets(
  ticketTiers,
  eventId,
  promocodeObj,
  userId,
  buyerId,
  orderId
) {
  try {
    // Loop through each ticket tier object in the array
    for (let i = 0; i < ticketTiers.length; i++) {
      // Destructure the properties of the current ticket tier object
      tickets = [];
      const { tierName, quantity } = ticketTiers[i];

      // check if the quantitySold excceds the maxCapacity in the tickets tier
      if (ticketTiers[i].quantitySold >= ticketTiers[i].maxCapacity) {
        // throw error if quantitySold exceeds maxCapacity
        throw new Error(
          `The quantity of tickets sold exceeds the capacity of the ticket tier. Ticket tier: ${tierName}. Quantity sold: ${ticketTiers[i].quantitySold}. Max capacity: ${ticketTiers[i].maxCapacity}.`
        );
      }

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
          buyerId: buyerId,
          promocodeUsed: promocodeObj ? promocodeObj.code : null,
          orderId: orderId,
          purchaseDate: Date.now(),
          purchasePrice: ticketPrice,
          tierName: tierName,
        });

        await ticket.save();

        // Add the ticket to the tickets array
        const soldTicket = {
          ticketId: ticket._id,
          userId: userId,
          orderId: orderId,
        };

        // add the tickets to the event schema
        await addSoldTicketToEvent(eventId, soldTicket, tierName, promocodeObj);
      }
    }
  } catch (error) {
    console.error(error);
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
  try {
    let remainingOfUses;

    if (ticketTierSelected.price == "Free") {
      ticketTierSelected.price = 0; // set it to zero if it is free
    }
    if (promocodeObj.remainingUses == "unlimited") {
      remainingOfUses = 1000000000000; // Set a high number for unlimited remaining uses
    } else {
      remainingOfUses = promocodeObj.remainingUses;
    }

    // Calculate the total purchase price
    let ticketPrice = ticketTierSelected.price; // Get the base ticket price

    let discount = 0;

    if (promocodeObj) {
      // Check if the promocode limit is still available
      if (remainingOfUses <= 0) {
        throw new Error("The promocode is no longer available");
      }

      if (ticketPrice == 0) {
        throw new Error("The promocode cannot be applied to free tickets");
      }

      if (ticketPrice != 0 && remainingOfUses > 0) {
        discount = (ticketPrice * promocodeObj.discount) / 100; // Calculate the discount amount

        ticketPrice = ticketPrice - discount; // Apply the discount to the base price

        if (!forEmail && promocodeObj.remainingUses != "unlimited") {
          promocodeObj.remainingUses = promocodeObj.remainingUses - 1; // Decrease the remaining uses of the promocode
        }
      }
      // Check if a promocode was provided

      if (!forEmail) {
        await promocodeObj.save(); // Save the updated promocode object
      }

      // Add a new attribute in ticketTierSelected equal to the new price multiplied by the quantity
      ticketTierSelected.totalPrice = ticketPrice * ticketTierSelected.quantity;

      return ticketPrice; // Return the total purchase price
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Add a sold ticket to an event's soldTickets array
 * @async
 * @function addSoldTicketToEvent
 * @param {string} eventId - The ID of the event to add the sold ticket to
 * @param {object} soldTicket - The sold ticket object to add to the event's soldTickets array
 * @returns {Void} update the event object with the added sold ticket and increment the quantitySold in the ticket tiers in the event model and add the sold tickects to the promocode tickets array
 * @throws {Error} If the event is not found or if the sold ticket is already associated with the event
 */
async function addSoldTicketToEvent(
  eventId,
  soldTicket,
  tierName,
  promocodeObj
) {
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

    // add the sold ticket to the tickets array in the promocode
    promocodeObj.tickets.push(soldTicket.ticketId);

    // Save the updated event to the database.
    await event.save();

    // Save the updated promocode to the database.
    await promocodeObj.save();

    // Return the updated event.
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
 * @param {Array{Object}} req - The request array of objects containing the ticket Tier(s) info
 * @param {string} req.params.eventID - The ID of the event to create its ticket tiers.
 * @param {string} req.body.tierName - The name of the tier
 * @param {Number} req.body.maxCapacity - The capacity of the tier
 * @param {String} req.body.price - The price of the tier
 * @param {Date} req.body.startSelling - The start selling date of the ticket tier
 * @param {Date} req.body.endSelling - The end selling date of the ticket tier
 * @param {Array{Object}} res - The response array that will be sent back to the creator for the ticket tiers.
 * @returns {Object} - A response object with whether the ticket tier has been created successfully or not.
 * @throws {Error} If there is an internal server error.
 * @throws {Error} If the ticket tier creator is not the one who created the event.
 */
async function createTicketTier(req, res) {
  //getting the attributes of ticket tier from body
  try {
    const { tierName, maxCapacity, price, startSelling, endSelling } = req.body;

    //checking that all attributes are present
    if (
      !req.body ||
      !tierName ||
      !maxCapacity ||
      !price ||
      !startSelling ||
      !endSelling
    ) {
      return res.status(200).json({
        success: false,
        message: "All tier attributes should be entered",
      });
    }

    const quantitySold = 0;
    const event = await eventModel.findById(req.params.eventID); //getting event by its ID

    // event not found
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "No event Found",
      });
    }

    console.log("creator ID:", event.creatorId);
    const userid = await authorized(req);

    // user not found
    if (!userid.authorized) {
      res.status(402).json({
        success: false,
        message: "the user is not found",
      });
    }

    // check if the creator of the event matches the user creating the tier
    if (event.creatorId.toString() !== userid.user_id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to create tier for this event",
      });
    } else {
      const ticketTier = event.ticketTiers.find(
        (tier) => tier.tierName === tierName
      ); // searching if the tier name provided in the body is already found in the array

      //tier name not unique
      if (ticketTier) {
        return res.status(404).json({
          success: false,
          message: "Ticket Tier Name is not unique",
        });
      }

      // creating new tier object
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
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "invalid details",
    });
  }
}

/**
Retrieves the ticket tiers details for the event by its ID
@async
@function
@param {Object} res - The response object that has the ticket tiers details
@param {Object} req.params - The parameters of the request.
@param {string} req.params.eventID - The ID of the event to retrieve its ticket tiers.
@returns {Object} - The retrieved ticket tier details object or an error message
@throws {Error} - If an error occurs while retrieving the ticket tiers details
@throws {Error} - If event is not found
*/

async function retrieveTicketTier(req, res) {
  try {
    const event = await eventModel.findById(req.params.eventID); //returns event of given id
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event is not found",
      });
    }

    // returning ticket tier details for the event
    const { ticketTiers } = event;

    const ticketTierDetails = event.ticketTiers.map((tier) => ({
      tierName: tier.tierName,
      quantitySold: tier.quantitySold,
      maxCapacity: tier.maxCapacity,
      price: tier.price,
      percentageSold: (tier.quantitySold / tier.maxCapacity) * 100,
      startSelling: tier.startSelling,
      endSelling: tier.endSelling,
    }));

    return res.status(200).json({
      success: true,
      message: "Ticket tier details for the event",
      ticketTiers: ticketTierDetails,
    });

    // return res.status(200).json({
    //   success: true,
    //   message: "Ticket tier details for the event",
    //   ticketTiers,
    // });
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
 * @param {string} req.body.tierName - The name of the tier you want to edit
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
    const enteredTierName = req.body.desiredTierName;
    if (!enteredTierName) {
      return res.status(404).json({
        success: false,
        message: "Please enter the name of the tier to edit",
      });
    }

    const newTierName = req.body.ticketTiers[0].tierName;
    const newMaxCapacity = req.body.ticketTiers[0].maxCapacity;
    const newPrice = req.body.ticketTiers[0].price;
    const newStartSelling = req.body.ticketTiers[0].startSelling;
    const newEndSelling = req.body.ticketTiers[0].endSelling;
    console.log("new Tier Name:", newTierName);

    const userid = await authorized(req);

    const event = await eventModel.findById(req.params.eventID); //getting event by its ID
    // event not found
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "No event Found",
      });
    }

    // user not found
    if (!userid.authorized) {
      res.status(402).json({
        success: false,
        message: "the user is not found",
      });
    }

    // check if the creator of the event matches the user editing the tier
    if (event.creatorId.toString() !== userid.user_id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to edit tier for this event",
      });
    } else {
      if (enteredTierName != newTierName) {
        const ticketTier = event.ticketTiers.find(
          (tier) => tier.tierName === newTierName
        ); // searching if the tier name provided in the body is already found in the array
        console.log("found:", ticketTier);

        // tier name that is needed to be edited is not unique
        if (ticketTier) {
          return res.status(404).json({
            success: false,
            message: "Cannot edit ticket tier",
          });
        }
      }
      // update the ticket tier attributes with the body parameters using the tier ID
      const updatedEvent = await eventModel.findOneAndUpdate(
        { _id: eventID, "ticketTiers.tierName": enteredTierName },
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
    }
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
