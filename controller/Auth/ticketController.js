const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");

const {
  retrieveToken,
  verifyToken,
  GenerateToken,
} = require("../../utils/Tokens");

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
async function bookTicket(req) {
  try {
    const { contactInformation, promocode, ticketTierSelected } = req.body;

    // Get the user object from the database
    const user = await userModel.findOne({
      email: contactInformation.email,
    });
    console.log("🚀 ~ file: ticketController.js:37 ~ bookTicket ~ user:", user);
    if (!user) {
      throw new Error("User not found");
    }

    // Get the event object from the database
    const event = await eventModel.findOne({
      ticketTiers: {
        $elemMatch: {
          name: ticketTierSelected[0].tierName,
          price: ticketTierSelected[0].price,
        },
      },
    });
    console.log(
      "🚀 ~ file: ticketController.js:50 ~ bookTicket ~ event:",
      event
    );
    if (!event) {
      throw new Error("Event not found");
    }

    // // Get the ticket tier object from the event object
    const ticketTier = event.ticketTiers.find(
      (ticketTier) =>
        ticketTier.tierName === ticketTierSelected[0].tierName &&
        ticketTier.price === ticketTierSelected[0].price
    );
    console.log(
      "🚀 ~ file: ticketController.js:62 ~ bookTicket ~ ticketTier:",
      ticketTier
    );
    if (!ticketTier) {
      throw new Error("Ticket tier not found");
    }

    // Get the promocode object from the database by the promocode code
    let promocodeObj = null;
    if (promocode) {
      promocodeObj = await promocodeModel.findOne({ code: promocode });

      console.log(
        "🚀 ~ file: ticketController.js:71 ~ bookTicket ~ promocodeObj:",
        promocodeObj
      );

      if (!promocodeObj) {
        throw new Error("Promocode not found");
      }
    }

    // Calculate the total purchase price
    let totalPrice = ticketTierSelected[0].quantity * ticketTier.price;
    console.log(
      "🚀 ~ file: ticketController.js:89 ~ bookTicket ~ totalPrice:",
      totalPrice
    );

    let discount = 0;
    if (promocodeObj) {
      discount = totalPrice * promocodeObj.discount;
      console.log(
        "🚀 ~ file: ticketController.js:94 ~ bookTicket ~ discount:",
        discount
      );

      totalPrice = totalPrice - discount;
      console.log(
        "🚀 ~ file: ticketController.js:98 ~ bookTicket ~ totalPrice:",
        totalPrice
      );
    }

    // Create a new ticket object
    const ticket = new ticketModel({
      eventId: event._id,
      userId: user._id,
      promocodeUsed: promocodeObj ? promocodeObj._id : null,
      purchaseDate: new Date(),
      purchasePrice: totalPrice,
      tierName: ticketTier.name,
      quantity: ticketTierSelected[0].quantity,
      discount: discount,
      contactInformation: contactInformation,
    });

    console.log(
      "🚀 ~ file: ticketController.js:123 ~ bookTicket ~ ticket:",
      ticket
    );
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
    // const update = req.body; // get the update object from the request body
    const { tierID,tierName, quantitySold, maxCapacity, price, startSelling,endSelling } = req.body;
    console.log("tierID:",tierID)


    const updatedEvent = await eventModel.findOneAndUpdate(
      { _id: eventId,'ticketTiers._id':tierID }, 
      { $set: { 'details.$.tierName': tierName,'details.$.quantitySold':quantitySold,'details.$.maxCapacity':maxCapacity,
      'details.$.price':price,'details.$.startSelling':startSelling,'details.$.endSelling':endSelling  }
    },
      { new: true, runValidators: true }
    );

    console.log("updated event:", updatedEvent.ticketTiers);
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
