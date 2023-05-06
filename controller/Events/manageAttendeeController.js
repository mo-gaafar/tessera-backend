const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");
const promocodeModel = require("../../models/promocodeModel");
const {
  authorized,
  GenerateToken,
  generateUniqueId,
} = require("../../utils/Tokens");
const {
  bookTicket,
  createTicketTier,
  retrieveTicketTier,
  generateTickets,
} = require("../Events/ticketController");
const generateQRCodeWithLogo = require("../../utils/qrCodeGenerator");
/**
 * Add attendee to an event
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} req.body.contactInformation - Contact information of the ticket buyer
 * @param {string} req.body.promocode - Promocode for the attendee
 * @param {Array} req.body.ticketTierSelected - Selected ticket tiers and contact information for the attendee
 * @param {boolean} req.body.SendEmail - Whether to send an email confirmation to the attendee
 * @returns {Object} -Array of event ticket tiers and event image
 */

async function addAttendee(req, res) {
  console.log("Gonna add attendee manually");
  // const useridid = "643a56706f55e9085d193f48";
  // const tok = GenerateToken(useridid);
  // console.log(tok);
  try {
    //get request body
    const { contactInformation, promocode, ticketTierSelected, SendEmail } =
      req.body;
    //get path parameter
    const eventId = req.params.eventID;
    //check if inviter is a user
    const email = contactInformation.email;

    // generate order id
    const orderId = await generateUniqueId();

    if (!ticketTierSelected || ticketTierSelected.length === 0) {
      console.log("No attendees information was provided");
      return res.status(404).json({
        success: false,
        message: "No attendees information was provided",
      });
    }

    if (!eventId) {
      console.log("No parameter was provided");
      return res
        .status(404)
        .json({ success: false, message: "No parameter was provided" });
    }

    //search event by id
    const query = {};
    //only retrieve published
    query["published"] = true;
    //filter by event id
    query["_id"] = eventId;

    //filter events by query object
    const event = await eventModel.findOne(query);

    if (!event) {
      console.log("No event Found");
      return res
        .status(404)
        .json({ success: false, message: "No event Found" });
    }

    //check if user is authorized
    const userid = await authorized(req);

    // check if the creator of the event matches the user making the add attendee request
    if (event.creatorId.toString() !== userid.user_id.toString()) {
      console.log("You are not authorized to add attendee to this event");
      return res.status(401).json({
        success: false,
        message: "You are not authorized to add attendee to this event",
      });
    }

    // Get the user object from the database
    const user = await userModel.findOne({
      email: email,
    });

    // check the user if the user exists
    if (!user) {
      console.log("User not found");
      throw new Error("User not found");
    }
    //get buyer id for booking tickets
    const buyerId = user._id;

    // check all the ticket tiers in the ticketTierSelected array if they all exist with the correct price in the ticket tiers of the event model
    for (let i = 0; i < ticketTierSelected.length; i++) {
      const ticketTier = event.ticketTiers.find(
        (ticketTier) =>
          ticketTier.tierName == ticketTierSelected[i].tierName &&
          ticketTier.price == ticketTierSelected[i].price
      );

      // check the ticket tier if the ticket tier exists
      if (!ticketTier) {
        console.log(
          "Ticket tier not found or the price doesn't match the ticket tier"
        );
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
        console.log("Promocode not found");
        throw new Error("Promocode not found");
      }
    }

    generateTickets(
      ticketTierSelected,
      eventId,
      promocodeObj,
      user._id,
      buyerId,
      orderId
    );

    console.log("Ticket has been created successfully");
    // generate QrCode and connects it to the evenURL
    const qrcodeImage = await generateQRCodeWithLogo(event.eventUrl);
    if (SendEmail) {
      sendEmailsToattendees(event, user, ticketTierSelected);
    }

    return res.status(200).json({
      success: true,
      eventImage: event.basicInfo.eventImage,
      ticketTiers: event.ticketTiers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
Sends emails to event attendees and the ticket buyer
@param {Object} event - Event object
@param {Object} user - User object for ticket buyer 
@param {Array} ticketTierSelected - Array of ticket tiers selected and attendees information
@param {Boolean} SendEmail - Flag indicating whether to send emails to attendees
@returns {void} -Sends emails to event attendees and the ticket buyer
*/

async function sendEmailsToattendees(
  event,
  user,
  ticketTierSelected,
  SendEmail
) {
  //get some inviter information
  const email = user.email;
  const inviterName = user.firstName + " " + user.lastName;

  //some event information
  const eventName = event.basicInfo.eventName;

  const dateObj = new Date(event.basicInfo.startDateTime);
  const eventStartDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  //const eventPublicDate = dateObj.toISOString().substring(0, 10);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();

  // getting time
  let amOrPm;
  if (hours >= 12) {
    amOrPm = "PM";
  } else {
    amOrPm = "AM";
  }
  const hoursTwelveHourFormat = hours % 12 || 12;
  const eventTime = `${
    hoursTwelveHourFormat < 10 ? "0" : ""
  }${hoursTwelveHourFormat}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds} ${amOrPm}`;
  eventTime;
  const eventDate = eventStartDate + ", at " + eventTime;

  if (event.isOnline) {
    var eventLocation = "Online";
  } else {
    var eventLocation =
      event.basicInfo.location.streetNumber +
      " " +
      event.basicInfo.location.route +
      ", " +
      event.basicInfo.location.city +
      ", " +
      event.basicInfo.location.country;
  }
  //send email to the ticket buyer

  //check if no attendees invited
  var invitationsExist = true;
  for (let i = 0; i < ticketTierSelected.length; i++) {
    if (
      !ticketTierSelected[i].tickets ||
      ticketTierSelected[i].tickets.length === 0
    ) {
      invitationsExist = false;
    }
  }

  //if there are invitations then get attendees info and send email
  if (invitationsExist) {
    for (const tier of ticketTierSelected) {
      //some tickets information for email
      const ticketname = tier.ticketname;
      const quantity = tier.quantity;
      const price = tier.price;
      //loop over the tickettier array to acess ticket info of each attendee
      if (tier.tickets) {
        for (const attendee of tier.tickets) {
          //some attendees information
          const firstname = attendee.firstname;
          const lastname = attendee.lastname;
          const email = attendee.email;

          //send email with order info for each attendee invited to the event
          console.log(`Sending email to ${firstname} to add attendees`);
        }
      }
    }
  } else {
    //send email with order info for ticket buyer
    console.log(`Sending email to ${inviterName} to add attendees`);
  }
}

module.exports = {
  addAttendee,
};
