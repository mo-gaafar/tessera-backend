const eventModel = require("../../models/eventModel");
const {
  GenerateToken,
  retrieveToken,
  verifyToken,
} = require("../../utils/Tokens");
const jwt = require("jsonwebtoken");
const util = require("util");

/**
Asynchronous function that creates a new event based on the request body and adds the creatorId based on the token.
@async
@function createEvent
@param {Object} req - The HTTP request object.
@param {Object} req.body - The request body containing the event information.
@param {Object} res - The HTTP response object.
@returns {Object} The response object indicating whether the event was successfully created.
@throws {Object} An error message if there was an error creating the event.
*/
async function createEvent(req, res) {
  try {
    const event = await eventModel.create(req.body); //await for Creating collection based of req body
    const token = await retrieveToken(req);

    const decoded = await verifyToken(token);
    await eventModel.findByIdAndUpdate(
      { _id: event._id },
      { $set: { creatorId: decoded.user_id } },
      { new: true }
    );
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event has been created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**

Retrieves an event from the database by its ID.
@async
@function
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {string} req.params.eventID - The ID of the event to retrieve.
@returns {Object} - The retrieved event object or an error message.
@throws {Error} - If an error occurs while retrieving the event.
*/
async function getEventById(req, res) {
  const eventId = req.params.eventID;
  try {
    const event = await eventModel.findById(eventId); //returns event of given id
    if (!event) {
      return res.status(404).json({ message: "Event is not found" });
    }
    return res.status(200).json({ event });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**

Deletes an event from the database by its ID.
@async
@function
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {string} req.params.eventID - The ID of the event to delete.
@returns {Object} - A success message if the event is deleted.
@throws {Error} - If an error occurs while deleting the event.
*/
async function deleteEvent(req, res) {
  const eventIdd = req.params.eventID;

  try {
    const event = await eventModel.findById(eventIdd); //search event by id

    if (!event) {
      return res.status(404).json({ message: "No event Found" });
    }

    await eventModel.findByIdAndDelete(eventIdd); // delete the found event

    return res.status(200).json({ message: "success !! the event is deleted" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**

Updates an event in the database by its ID.
@async
@function
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {string} req.params.eventID - The ID of the event to update.
@param {Object} req.body - The update object for the event.
@returns {Object} - The updated event object.
@throws {Error} - If an error occurs while updating the event.
*/
async function updateEvent(req, res) {
  try {
    const eventId = req.params.eventID; // get the event ID from the request URL
    const update = req.body; // get the update object from the request body

    // update the document in the database using findOneAndUpdate
    const updatedEvent = await eventModel.findOneAndUpdate(
      { _id: eventId },
      update,
      { new: true, runValidators: true }
    );

    // check if the updatedEvent exists
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // return the updated document
    return res.status(200).json({ message: "success !! the event is updated" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function publishEvent(req, res) {
  const event = await eventModel.findById(req.params.eventID);
  console.log("event is:", event);
}

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// configure AWS SDK with your S3 bucket credentials
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});
const s3 = new AWS.S3();
const uploadImage = async (req, res) => {
  try {
    const eventId = req.params.eventID;
    const base64data = Buffer.from(req.files.image.data, 'base64');
    // generate a unique filename for the uploaded image
    const filename = '${uuidv4()}.png';

    // upload the image to your S3 bucket
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filename,
      Body: base64data,
      ContentType: "image/png",
    };
    const s3data = await s3.upload(uploadParams).promise();

    // updates eventModel in the database using findOneAndUpdate
    const updatedEvent = await eventModel.findOneAndUpdate(
      { _id: eventId },
      { eventImage: s3data.Location },
      { new: true, runValidators: true }
    );
    // await event.save();

    // return the uploaded image URL
    res.status(201).json({ imageUrl: s3data.Location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEvent,
  getEventById,
  deleteEvent,
  updateEvent,
  publishEvent,
  uploadImage,
};
