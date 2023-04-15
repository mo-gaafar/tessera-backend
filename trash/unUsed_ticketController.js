const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");

const {
  retrieveToken,
  verifyToken,
  GenerateToken,
} = require("../../utils/Tokens");

/**
 * Creates a new ticket for an event and user.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.eventId - The ID of the event to create the ticket for.
 * @param {string} req.body.userId - The ID of the user creating the ticket.
 * @param {string} req.body.promocodeUsedId - The ID of the promocode used (optional).
 * @param {string} req.body.purchaseDate - The date of the purchase.
 * @param {number} req.body.purchasePrice - The price of the ticket.
 * @param {string} req.body.tierName - The name of the ticket tier.
 *
 * @returns {Object} The newly created ticket object.
 *
 * @throws {Error} If the event or user do not exist in the database.
 */
async function bookTicket(req) {
  try {
    const {
      eventId,
      userId,
      promocodeUsedId: promocodeUsed,
      purchaseDate,
      tierName,
    } = req.body;

    //validations
    // Get the event object from the database
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Get the user object from the database
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // // Get the ticket tier object from the event object
    // const ticketTier = event.ticketTiers.find((tier) => tier.name === tierName);
    // if (!ticketTier) {
    //   throw new Error("Ticket tier not found");
    // }

    // Get the promocode object from the database by the promocode code
    let promocode;
    if (promocodeUsed) {
      promocode = await promocodeModel.findOne({ code: promocodeUsed });
      if (!promocode) {
        throw new Error("Promocode not found");
      }
    }

    // Calculate the purchase price
    let purchasePrice = ticketTier.price;
    if (promocode) {
      purchasePrice = purchasePrice - promocode.discount;
    }

    const ticket = new ticketModel({
      eventId,
      userId,
      promocodeUsed: promocodeUsed,
      purchaseDate,
      purchasePrice,
      tierName,
    });

    await ticket.save();

    // Return the newly created ticket object
    return {
      success: true,
      data: ticket,
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}

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

// async function bookTicket(req, res) {
//   // getting parameters from request body
//   const { eventID, userID, purchaseDate, purchasePrice, type } = req.body;

//   try {
//     const ticket = new ticketModel({
//       eventID: eventID,
//       userID: userID,
//       purchaseDate,
//       purchasePrice,
//       type,
//     });

//     // save ticket
//     const savedTicket = await ticket.save();

//     res.status(201).json({
//       success: true,
//       message: "Ticket  Created",
//       ticket: savedTicket,
//     });
//   } catch {
//     res.status(200).json({
//       success: false,
//       message: "error",
//     });
//   }
// }

// const generatedtoken=  GenerateToken("641eddf055c9b5c70ae4ecdf")

// console.log("generated token is:",generatedtoken)

async function createTicketTier(req, res) {
  //getting the attributes of ticket tier from body
  console.log("ana gowa el create ticket tier ");
  try {
    const {
      tierName,
      quantitySold,
      maxCapacity,
      price,
      startSelling,
      endSelling,
    } = req.body;
    const token = await retrieveToken(req); //getting the token of the ticket tier creator
    console.log("token is:", token);
    const decodedToken = verifyToken(token); //decoding the token

    decodedToken.then((resolvedValue) => {
      tierCreatorID = resolvedValue.user_id;
      console.log("tier Creator ID:", tierCreatorID); // getting ID of ticket tier creator
    });

    const event = await eventModel.findById(req.params.eventID); //getting event by its ID
    console.log("ticket tier is to be added in this event:", event);
    console.log("creator ID:", event.creatorId);
    if (event.creatorId == tierCreatorID) {
      console.log(
        "creator of the event is the one who edits:",
        event.creatorId
      );

      // const newTicketTier = { quantitySold, capacity, tier, price };
      // const newTicketTier = { quantitySold, capacity, tier, price };
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

async function editTicketTier(req, res) {
  try {
    const eventId = req.params.eventID; // get the event ID from the request URL
    const update = req.body; // get the update object from the request body

    const updatedEvent = await eventModel.findOneAndUpdate(
      { _id: eventId },
      update,
      { new: true, runValidators: true }
    );

    console.log("updated project:", updatedEvent);
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
  editTicketTier,
}; //,editTicket };
