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
 * Add attendee to an event manually
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
 * @param {Object} req.body.ticketTierSelected[i].tickets - the contact information for the attendees
 * @param {boolean} req.body.SendEmail - Whether to send an email confirmation to the attendee
 * @returns {Object} -Array of event ticket tiers and event image
 */

async function addAttendee(req, res) {
  // console.log("Gonna add attendee manually");
  // const useridid = "6439f95a3d607d6c49e56a1e";
  // const tok = GenerateToken(useridid);
  // console.log(tok);
  try {
    //get request body
    const { contactInformation, promocode, ticketTierSelected, SendEmail } =
      req.body;

    if (
      !ticketTierSelected ||
      ticketTierSelected.length === 0 ||
      !contactInformation ||
      !SendEmail
    ) {
      console.log("No attendees information was provided or it's incomplete");
      return res.status(404).json({
        success: false,
        message: "No attendees information was provided or it's incomplete",
      });
    }

    //get path parameter
    const eventId = req.params.eventID;
    //check if inviter is a user
    const email = contactInformation.email;

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

    // Get the buyer information object from the database
    const user = await userModel.findOne({
      email: email,
    });

    // check the user if the user exists
    if (!user) {
      console.log("User not found");
      throw new Error("User not found");
    }

    //check if no attendees invited
    let invitationsExist = true;
    for (let i = 0; i < ticketTierSelected.length; i++) {
      if (
        ticketTierSelected[i].quantity !== ticketTierSelected[i].tickets.length
      ) {
        console.log("No attendees information was provided or it's incomplete");
        throw new Error(
          "No attendees information was provided or it's incomplete"
        );
      }
      if (
        !ticketTierSelected[i].tickets ||
        ticketTierSelected[i].tickets.length === 0
      ) {
        invitationsExist = false;
      }
    }

    //book tickets for attendees added manually
    await bookTicketForAttendees(
      event,
      user,
      ticketTierSelected,
      promocode,
      eventId
    );

    console.log("Ticket has been created successfully");

    // generate QrCode and connects it to the evenURL
    const qrcodeImage = await generateQRCodeWithLogo(event.eventUrl);

    //if creator want to send email
    if (SendEmail) {
      sendEmailsToattendees(event, user, ticketTierSelected, invitationsExist);
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

Books tickets for attendees.
@async
@function bookTicketForAttendees
@param {Object} event - The event for which the tickets are being booked.
@param {Object} user - The user for whom the tickets are being booked.
@param {Array} ticketTierSelected - An array of objects representing the selected ticket tiers.
@param {string} promocode - The promocode used (optional).
@param {string} eventId - The ID of the event being booked.
@throws {Error} If the ticket tier does not exist or the price is incorrect.
@throws {Error} If the promocode does not exist.
@returns {Promise<void>} Resolves when the tickets have been successfully booked.
*/
async function bookTicketForAttendees(
  event,
  user,
  ticketTierSelected,
  promocode,
  eventId
) {
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

  //get buyer id for booking tickets
  const buyerId = user._id;

  // generate order id
  const orderId = await generateUniqueId();

  //generate the tickets
  await generateTickets(
    ticketTierSelected,
    eventId,
    promocodeObj,
    user._id,
    buyerId,
    orderId
  );
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
  invitationsExist
) {
  //get some inviter information
  const buyerEmail = user.email;
  const buyerName = user.firstName + " " + user.lastName;

  //create buyer Contact Information object
  buyerContactInformation = {
    name: buyerName,
    email: buyerEmail,
  };

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
  eventBasicInfoObj = {
    eventName: eventName,
    eventDate: eventDate,
    eventLocation: eventLocation,
  };

  const attendeesArray = [];
  /* abdallah:: hena ana ba3mel if condition bas 3lshan 
  lw l buyer gayb l tickets b esmo hwa w msh 3azem had ,
  mafesh attendees f ana keda m3andesh list of attendees 
  w keda hab3at nafs l email bt3 l attendees bas ll buyer da 
  in the else statement 3lshan shoft eventbrite by3mel keda.
  */
  //if there are invitations then get attendees info and send email
  if (invitationsExist) {
    for (const tier of ticketTierSelected) {
      //some tickets information for email
      const ticketname = tier.tierName;
      const price = tier.price;
      //loop over the tickettier array to acess ticket info of each attendee
      if (tier.tickets) {
        for (const attendee of tier.tickets) {
          //some attendees information
          const firstname = attendee.firstname;
          const lastname = attendee.lastname;
          const email = attendee.email;
          const attendeesInformation = {
            name: firstname + " " + lastname,
            email: email,
            tierName: ticketname,
            price: price,
          };

          attendeesArray.push(attendeesInformation);

          const attendeeOrderObj = {
            buyerContactInformation: buyerContactInformation,
            eventBasicInfo: eventBasicInfoObj,
            attendeesInformation: [attendeesInformation],
          };
          console.log("Attendee order:");
          console.log(attendeeOrderObj);

          //TODO abdallah:: send email with order info for each attendee invited to the event

          console.log(`Sending email to ${firstname} to add attendees`);
        }
      }
    }

    //add all objects to a single objectto send for email
    buyerOrderObj = {
      buyerContactInformation: buyerContactInformation,
      eventBasicInfo: eventBasicInfoObj,
      attendeesArray: attendeesArray,
    };
    console.log(`Sending email to ${buyerName} to add attendees`);
    console.log("Buyer object for email:");
    console.log(buyerOrderObj);

    //TODO abdallah::send email to the ticket buyer with attendees information
  } else {
    //TODO abdallah::send email with order info for ticket buyer & the attendee is the buyer
    const buyerOrderObj = {
      buyerContactInformation: buyerContactInformation,
      eventBasicInfo: eventBasicInfoObj,
      attendeesArray: [buyerContactInformation], //abdallah:: note that it's an array of a single value
    };

    console.log(`Sending email to ${buyerName} to add attendee`);
    console.log("buyer object for email:  ");
    console.log(buyerOrderObj);
  }
}

module.exports = {
  addAttendee,
};
