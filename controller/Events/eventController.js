const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");

const {
  GenerateToken,
  retrieveToken,
  verifyToken,
  authorized,
} = require("../../utils/Tokens");
const jwt = require("jsonwebtoken");

const { comparePassword } = require("../../utils/passwords");

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
    //check if user exists
    const userExist = await authorized(req);
    //create event
    //if (userExist.authorized) {
    const event = await eventModel.create({
      ...req.body,
      creatorId: userExist.user_id,
    });
    //sets events url
    await eventModel.updateOne(
      { _id: event._id },
      {
        $set: { eventUrl: `https://www.tessera.social/event/${event._id}` },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Event has been created successfully",
      event_Id: event._id,
    });
    //}
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
  try {
    const eventId = req.params.eventID;
    const event = await eventModel.findById(eventId); //search event by id
    //check if no events
    if (!event) {
      return res.status(404).json({ message: "No event Found" });
    }
    //authorize that user exists
    const userExist = await authorized(req);

    if (event.creatorId.toString() !== userExist.user_id.toString()) {
      // check if the creator of the event matches the user making the delete request
      return res.status(401).json({
        success: false,
        message: "You are not authorized to retrieve this event",
      });
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
  try {
    const eventId = req.params.eventID;
    const event = await eventModel.findById(eventId); //search event by id
    const userExist = await authorized(req);

    if (!event) {
      return res.status(404).json({ message: "No event Found" });
    }
    //check if user exists
    if (!userExist.authorized) {
      res.status(402).json({
        success: false,
        message: "the user is not found",
      });
    }

    if (event.creatorId.toString() !== userExist.user_id.toString()) {
      // check if the creator of the event matches the user making the delete request
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this event",
      });
    }

    await eventModel.findByIdAndDelete(eventId); // delete the found event

    return res
      .status(200)
      .json({ success: true, message: "the event is deleted" });
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
    if (update.basicInfo) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update basicInfo",
      });
    }
    const event = await eventModel.findById(eventId);
    const userExist = await authorized(req);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    // check if the updatedEvent exists
    if (event.creatorId.toString() !== userExist.user_id.toString()) {
      // check if the creator of the event matches the user making the delete request
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this event",
      });
    }
    // search event by id and update using request body
    await eventModel.findOneAndUpdate({ _id: eventId }, update, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "the event is updated" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Publishes an event by updating its attributes, such as making it public or setting a password or link to access it.
// @async
// @function publishEvent
// @param {Object} req - The request object containing the attributes of the event to be published.
// @param {string} req.body.isPublic - whether the event is public or private
// @param {string} req.body.isPublic - whether the event is public or private
// @param {Object} res - The response object containing the updated event attributes.
// @returns {Object} Returns the updated event object with its attributes.
// @throws {Object} Throws an error if the event is not found or if the user is not authorized to publish it.
// */
async function publishEvent(req, res) {
  try {
    // getting attributes from body
    const isPublic = req.body.isPublic;
    const publishNow = req.body.publishNow;
    const publicDate = req.body.publicDate;
    const privateToPublicDate = req.body.privateToPublicDate;
    const hasLink = req.body.link;
    const generatedPassword = req.body.generatedPassword;
    const hasPassword = req.body.password;
    const alwaysPrivate = req.body.alwaysPrivate;

    const event = await eventModel.findById(req.params.eventID); //getting event by its ID

    // event not found
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "No event Found",
      });
    }

    privatePasswordStored = event.privatePassword;

    const userid = await authorized(req);

    // user not found
    if (!userid.authorized) {
      res.status(402).json({
        success: false,
        message: "the user is not found",
      });
    }

    // checking if the creator of the event is the one who publishes it
    if (event.creatorId.toString() !== userid.user_id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to publish this event",
      });
    } else {
      const url = await event.eventUrl; // getting url for event
      password = event.privatePassword; // getting password for event
      const isPublished = await event.published; // getting if event was published

      // event is public
      if (isPublic) {
        // updating the event attributes with the public date and making the event public
        const update = { publicDate: new Date(publicDate), isPublic: true };
        const updatedEvent = await eventModel.findOneAndUpdate(
          { _id: req.params.eventID },
          update,
          {
            new: true,
            runValidators: true,
          }
        );

        // console.log("updated event is:",updatedEvent)

        const publicDateSet = await event.publicDate;
        console.log("public Date Set:", publicDateSet);

        res.status(200).json({
          success: true,
          message: "Event is publicly accessed by this Link",
          url,
        });
      }

      //if event is private
      else {
        // updating event attributes to be private
        const update = { isPublic: false };
        const updatedEvent = await eventModel.findOneAndUpdate(
          { _id: req.params.eventID },
          update,
          {
            new: true,
            runValidators: true,
          }
        );

        console.log("updated event is:", updatedEvent);

        // validating that a private event cannot be published by both password and link

        if (hasPassword && hasLink) {
          res.status(400).json({
            success: false,
            message:
              "Event cannot be published by both password and private link.",
          });

          // validating that a private event cannot be published without a password or link
        } else if (!hasPassword && !hasLink) {
          res.status(400).json({
            success: false,
            message:
              "Event cannot be published without a password or private link.",
          });
        }

        // event accessed by password
        else if (hasPassword) {
          isMatch = await comparePassword(
            privatePasswordStored,
            generatedPassword
          );
          console.log("isMatch:", isMatch);
          if (isMatch) {
            res.status(200).json({
              success: true,
              message: "Event is accessed by password",
              url,
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Failed to access password",
              url: null,
            });
          }
        }

        // event accessed by link
        else if (hasLink) {
          return res.status(200).json({
            success: true,
            message: "Event is accessed by this Private Link",
            url,
          });
        }

        //checking if event will turn public one day
        if (!alwaysPrivate) {
          //setting public date for event
          const update_2 = { publicDate: new Date(privateToPublicDate) };
          const updatedEventFinal = await eventModel.findOneAndUpdate(
            { _id: req.params.eventID },
            update_2,
            {
              new: true,
              runValidators: true,
            }
          );

          console.log("updated event is:", updatedEventFinal);
        }
      }

      // if event is not published
      if (!isPublished) {
        // update the published attribute to be true to publish the event
        const update_last = { published: true };
        const updatedEvent_last = await eventModel.findOneAndUpdate(
          { _id: req.params.eventID },
          update_last,
          {
            new: true,
            runValidators: true,
          }
        );
        console.log("Updated event:", updatedEvent_last);
      }
      // if event is already published
      else {
        console.log("event is already published");
      }
    }
  } catch {
    res.status(400).json({
      success: false,
      message: "invalid error",
    });
  }
}

const AWS = require("aws-sdk");

// configure AWS SDK with your S3 bucket credentials
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});
const s3 = new AWS.S3();

async function uploadImage(req, res) {
  try {
    const eventId = req.params.eventID;
    console.log(
      "🚀 ~ file: eventController.js:386 ~ uploadImage ~ eventId:",
      eventId
    );
    // check if an event with this id exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const base64data = Buffer.from(req.files.image.data, "base64");
    const filename = `event-images/${eventId}/${event.basicInfo.eventName}`;

    // upload the image to S3 bucket
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filename,
      Body: base64data,
      ContentType: "image/png",
    };
    const s3data = await s3.upload(uploadParams).promise();

    // update event with the image url
    event.basicInfo.eventImage = s3data.Location;
    await event.save();

    // return the uploaded image URL
    res.status(201).json({
      success: true,
      imageUrl: s3data.Location,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  createEvent,
  getEventById,
  deleteEvent,
  updateEvent,
  publishEvent,
  uploadImage,
};
