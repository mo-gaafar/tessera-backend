const eventModel = require("../../models/eventModel");
const promocodeModel = require("../../models/promocodeModel");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");
const { parse } = require("csv-parse");
const { authorized } = require("../../utils/Tokens");
const upload = multer();

/**

Imports promocodes from a CSV file and adds them to an event.
@async
@function importPromocode
@param {Object} req - Express request object.
@param {Object} res - Express response object.
@returns {Object} Response object with a success boolean, message, and imported promocodes.
@throws {Object} Returns an error response object if an error occurs.
*/
async function importPromocode(req, res) {
  try {
    // Find the event associated with the promocodes and add the promocodes to the event
    const eventId = req.params.eventID;
    const event = await eventModel.findById(eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).send("Event not found");
    }

    // Check if a file has been uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    // Parse the CSV data from the file buffer
    const csvData = await new Promise((resolve, reject) => {
      const csvParser = parse({ delimiter: "," }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
      const csvBuffer = req.file.buffer;
      csvParser.write(csvBuffer);
      csvParser.end();
    });

    // Assuming the first row of the csv file contains the column names
    const [header, ...rows] = csvData;
    const [headerCode, headerDiscount, headerlimitOfUses] = header;

    // Process each row of the CSV file and create a new promocode object for each
    const promocodes = rows.map((row) => {
      const [code, discount, limitOfUses] = row;
      return {
        code,
        discount: parseInt(discount),
        limitOfUses,
      };
    });

    // Check all the promocodes if one of them exists and add them to exists array and if not add it to the database
    const exists = [];
    const notExists = [];
    for (const promocode of promocodes) {
      const { code } = promocode;
      const promocodeExists = await checkPromocodeExists(eventId, code);

      if (promocodeExists) {
        exists.push(promocode);
      } else {
        notExists.push(promocode);
      }
    }

    for (const newPromocodes of notExists) {
      addPromocodeToDatabase(eventId, newPromocodes);
    }

    // Add the newPromocodes to the event using a for loop
    for (const newPromocode of notExists) {
      addPromocodeToEvent(eventId, newPromocode);
    }

    // Return the imported promocodes in the response.
    return res.status(200).json({
      success: true,
      message: "Promocode has been imported successfully",
      promocodesAdded: notExists.length > 0 ? notExists : null,
    });
  } catch (err) {
    // Return an error response if an error occurs.
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

async function createPromocode(req, res) {
  const eventId = req.params.event_Id;
  const { code, discount, limitOfUses } = req.body;
  try {
    // Find the event in the database.
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Verify the JWT token and get an object contains the status of authorization and user id if authorized
    const userStatus = await authorized(req);

    // decodedId equals the user Id got from the bearer token
    let decodedId = null;
    if (userStatus.authorized) {
      decodedId = userStatus.user_id.toString();
    } else {
      throw new Error(
        "You are not authorized to create a promocode for this event"
      );
    }

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
    let promocodeObj = {};
    promocodeObj.code = code;
    promocodeObj.discount = discount;
    promocodeObj.limitOfUses = limitOfUses;
    console.log(
      "🚀 ~ file: promocodeController.js:142 ~ createPromocode ~ promocodeObj:",
      promocodeObj
    );

    await addPromocodeToDatabase(eventId, promocodeObj);

    // add the promcode to the event Schema
    await addPromocodeToEvent(eventId, promocodeObj);
    // Return the new promocode object in the response.
    return res.status(200).json({
      success: true,
      message: "Promocode has been created successfully",
      promocodeObj,
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

async function addPromocodeToDatabase(eventId, promocode) {
  code = promocode.code;
  discount = promocode.discount;
  limitOfUses = promocode.limitOfUses;

  // create a new promocode object and save it to the database
  const newPromocode = await promocodeModel.create({
    code,
    discount,
    limitOfUses,
    remainingUses:
      limitOfUses === "unlimited" ? "unlimited" : Number(limitOfUses),
    event: eventId,
  });

  await newPromocode.save();
  return newPromocode;
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
    // Return the discount if a promocode was found, false otherwise.
    return promocode ? promocode.discount : false;
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

async function checkPromocode(req, res) {
  const eventId = req.params.eventId;

  const codeName = req.query.code;
  console.log(
    "🚀 ~ file: promocodeController.js:206 ~ checkPromocode ~ codeName:",
    codeName
  );
  try {
    const isExists = await checkPromocodeExists(eventId, codeName);

    if (isExists == false)
      return res.status(404).json({
        success: false,
        message: "Promocode does not exist",
      });

    return res.status(200).json({
      success: true,
      message: "Promocode exists",
      discout: isExists / 100,
    });
  } catch (err) {
    // If an error occurs, log it and re-throw the error.
    console.error(err);
    throw err;
  }
}

module.exports = {
  createPromocode,
  checkPromocode,
  addPromocodeToEvent,
  checkPromocodeExists,
  importPromocode,
  upload,
};
