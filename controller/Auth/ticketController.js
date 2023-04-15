const mongoose = require("mongoose");

const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");
const {
  retrieveToken,
  verifyToken,
  GenerateToken,
} = require("../../utils/Tokens");
const { authenticate } = require("passport");
const { boolean } = require("joi");
const { generate } = require("generate-password");

//generating token:
// const generatedtoken=  GenerateToken("641eddf055c9b5c70ae4ecdf")
// console.log("generated token is:",generatedtoken)

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
    const {
      tierName,
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
  

    const quantitySold=0
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



module.exports = {
  bookTicket,
  createTicketTier,
  retrieveTicketTier,
  // editTicketTier,
}; //,editTicket };
