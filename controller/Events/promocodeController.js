const eventModel = require("../../models/eventModel");
const promocodeModel = require("../../models/promocodeModel");
const {
  GenerateToken,
  retrieveToken,
  verifyToken,
  authorized,
} = require("../../utils/Tokens");

/**
 * Creates a new promocode for an event.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} Returns the new promocode object.
 * @throws {Error} Throws an error if the event or promocode code already exists.
 */
async function createPromocode(req, res) {
  const eventId = req.params.event_Id;
  const { code, discount, limitOfUses } = req.body;

  // Retrieve the JWT token from the request headers.
  const token = await retrieveToken(req);

  try {
    // Find the event in the database.
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Verify the JWT token and get the decoded user ID.
    const decoded = await verifyToken(token);
    const decodedId = decoded.user_id;

    // Get the event creator ID.
    const creatorId = event.creatorId;

    // Check if the decoded user ID matches the event creator ID.
    if (decodedId != creatorId) {
      throw new Error(
        "You are not authorized to create a promocode for this event"
      );
    }

    // Check if the promocode code already exists for this event.
    const promocodeExists = await checkPromocodeExists(eventId, code);
    if (promocodeExists) {
      throw new Error("Promocode code already exists for this event");
    }

    // Create a new promocode object and save it to the database.
    const promocode = await promocodeModel.create({
      code,
      discount,
      limitOfUses,
      remainingUses:
        limitOfUses === "unlimited" ? "unlimited" : Number(limitOfUses),
      event: eventId,
    });
    await promocode.save();
    // add the promcode to the event Schema
    await addPromocodeToEvent(eventId, promocode);
    // Return the new promocode object in the response.
    return res.status(200).json({
      success: true,
      message: "Promocode has been created successfully",
      promocode,
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
 * Check if a promocode with the given code exists for the given event.
 * @param {string} eventId - The ID of the event to check for the promocode.
 * @param {string} code - The code of the promocode to check for.
 * @returns {boolean} - A boolean that resolves to true if the promocode exists for the event, false otherwise.
 * @throws {Error} - If an error occurs while checking for the promocode.
 */
async function checkPromocodeExists(eventId, code) {
  try {
    // Find a promocode with the given event ID and code in the database.
    const promocode = await promocodeModel.findOne({ event: eventId, code });
    // Return true if a promocode was found, false otherwise.
    return promocode ? true : false;
  } catch (err) {
    // If an error occurs, log it and re-throw the error.
    console.error(err);
    throw err;
  }
}

/**
 * Add a promocode to an event's promocode array
 * @param {string} eventId - The ID of the event to add the promocode to
 * @param {object} promocode - The promocode object to add to the event's promocode array
 * @returns {Void} update the event object with the added promocode
 * @throws {Error} If the event is not found or if the promocode is already associated with the event
 */
async function addPromocodeToEvent(eventId, promocode) {
  try {
    // Find the event in the database using the event ID.
    const event = await eventModel.findById(eventId);

    // Throw an error if the event does not exist.
    if (!event) {
      throw new Error("Event not found");
    }

    // Add the promocode to the event's promocodes array.
    event.promocodes.push(promocode);

    // Save the updated event to the database.
    await event.save();
  } catch (err) {
    console.error(err);

    // Throw an error if an error occurs.
    throw new Error(err.message);
  }
}

module.exports = { createPromocode };
