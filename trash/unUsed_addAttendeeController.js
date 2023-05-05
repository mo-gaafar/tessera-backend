const ticketModel = require("../../models/ticketModel");
const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");
const promocodeModel = require("../../models/promocodeModel");
const { authorized, GenerateToken } = require("../../utils/Tokens");
const {
  bookTicket,
  createTicketTier,
  retrieveTicketTier,
  generateTickets,
} = require("../Events/ticketController");
async function addAttendee(req, res) {
  console.log("Gonna add attendee manually");
  // const useridid = "6439f95a3d607d6c49e56a1e";
  // const tok = GenerateToken(useridid);
  // console.log(tok);
  try {
    //get request body
    const { contactInformation, promocode, ticketTierSelected } = req.body;
    if (!ticketTierSelected || ticketTierSelected.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendees information was provided",
      });
    }
    //get path parameter
    const eventId = req.params.eventID;

    if (!eventId) {
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
      return res
        .status(404)
        .json({ success: false, message: "No event Found" });
    }

    //check if user is authorized
    const userid = await authorized(req);

    if (event.creatorId.toString() !== userid.user_id.toString()) {
      // check if the creator of the event matches the user making the add attendee request
      return res.status(401).json({
        success: false,
        message: "You are not authorized to add attendee to this event",
      });
    }

    // Get the user object from the database
    const user = await userModel.findOne({
      email: email,
    });

    //check if inviter is a user
    if (!user) {
      throw new Error("User not found");
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

    //getting information for send email

    //get some inviter information
    const email = contactInformation.email;
    const inviterName =
      contactInformation.first_name + " " + contactInformation.last_name;

    //some event information
    const eventName = event.basicInfo.eventName;

    const dateObj = new Date(event.basicInfo.startDateTime);
    const eventStartDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const eventPublicDate = dateObj.toISOString().substring(0, 10);
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
      const eventLocation = "Online";
    } else {
      const eventLocation =
        event.basicInfo.location.streetNumber +
        " " +
        event.basicInfo.location.route +
        ", " +
        event.basicInfo.location.city +
        ", " +
        event.basicInfo.location.country;
    }

    //book ticket for each attendee invited to the event
    //loop over the tickettier array to acess ticket info of each attendee
    for (const tier of ticketTierSelected) {
      //some tickets information for email
      const ticketname = tier.ticketname;
      const quantity = tier.quantity;
      const price = tier.price;
      if (tier.tickets) {
        for (const attendee of tier.tickets) {
          //some attendees information
          const firstname = attendee.firstname;
          const lastname = attendee.lastname;
          const email = attendee.email;

          //Generate the tickets for booking
          generateTickets(ticketTierSelected, eventId, promocodeObj, user._id);
          console.log("Ticket has been created successfully");
          //send email
        }
      } else {
        throw new Error("Some tickets information is missing");
      }
    }

    return res.status(200).json({
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
module.exports = {
  addAttendee,
};
