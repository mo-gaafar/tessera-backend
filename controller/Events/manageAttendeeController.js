////add attendee (momken teb3aty l tickets kteera l nafs l shakhs msln for his familly ya3ny! bas i guess only one contact information)
//event id as a query parattmer and validate that the event exists
//authorize the creator id to be received (query param??)
//khody l ticket type 3lshan te3rafy etzwed l attendee 3la anhy ticket
//khody l quantity 3lshan tzwedeeh 3la "this" ticket type
//what is face value??? note that: faceValue * quantity=totalValue pass
//should I take order type?? pass
//I should recieve attendees (kolohm) contact information (firstName,lastName,email) ok
// & send confirmation email and tell them that for example "Malak registered you for Aklatna! " then"Claim your order""
//also return some event info like "startdate " and "eventName" and "inviter name (not creator sah?)"
//also should I receive creator information to send email with?
//drop down for event ticket tiers ?? (need request) //habtha ana
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

    //check if inviter is a user
    const email = contactInformation.email;

    // Get the user object from the database
    const user = await userModel.findOne({
      email: email,
    });

    // check the user if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Get the ticket tier object from the event object for each selected ticket tier
    const ticketTiers = ticketTierSelected.map((selected, i) => {
      const ticketTier = event.ticketTiers.find(
        (tier) =>
          tier.tierName === selected.tierName[i] &&
          tier.price === selected.price[i]
      );
      return ticketTier;
    });

    // Check if any value in the ticketTiers array is undefined
    const isTicketTiersValid = ticketTiers.every(
      (ticketTier) => ticketTier !== undefined
    );

    // If any value is undefined, set isTicketTiersValid to false
    if (!isTicketTiersValid) {
      throw new Error("Ticket tier not found");
    }

    // Get the promocode object from the database by the promocode code
    let promocodeObj = null;
    if (promocode) {
      promocodeObj = await promocodeModel.findOne({ code: promocode });
      if (!promocodeObj) {
        throw new Error("Promocode not found");
      }
    }

    //book ticket for each attendee invited to the event
    //loop over the tickettier array to acess ticket info of each attendee
    for (const tier of tickettier) {
      const ticketname = tier.ticketname;
      const soldout = tier.soldout;
      for (const attendee of tier.tickets) {
        const firstname = attendee.firstname;
        const lastname = attendee.lastname;
        const email = attendee.email;
        //book the ticket
        //Ggnerate the tickets
        generateTickets(ticketTierSelected, eventId, promocodeObj, user._id);
        console.log("Ticket has been created successfully");
        //send email
      }
    }

    // // update quantity sold for each ticket tier
    // // Loop through the tickettier array
    // for (const tier of tickettier) {
    //   // Find the corresponding ticket tier in the event document
    //   const eventTier = event.ticketTiers.find(
    //     (t) => t.tierName === tier.ticketname
    //   );

    //   if (eventTier) {
    //     // Check if the sum of quantitySold and soldout exceeds the capacity
    //     const totalSold = eventTier.quantitySold + tier.soldout;

    //     if (totalSold <= eventTier.maxCapacity) {
    //       // Update the quantitySold field with the soldout value from the request body
    //       eventTier.quantitySold += tier.soldout;
    //     } else {
    //       console.log(
    //         `Sold out tickets for ${tier.ticketname} exceeds the capacity`
    //       );
    //     }
    //   } else {
    //     console.log(`No matching ticket tier found for ${tier.ticketname}`);
    //   }
    // }
    // //Save the updated document
    // await event.save();
    ////////
    return res.status(404).json({
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
//book ticket manage attendee version
async function bookTicketForAddAttendee(eventId, email, ticketname) {}
module.exports = {
  addAttendee,
};
