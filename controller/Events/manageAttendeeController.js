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
const eventModel = require("../../models/eventModel");
const { authorized, GenerateToken } = require("../../utils/Tokens");
async function addAttendee(req, res) {
  console.log("Gonna add attendee in creators view");
  // const useridid = "6439f95a3d607d6c49e56a1e";
  // const tok = GenerateToken(useridid);
  // console.log(tok);
  try {
    const { contactInfo, SendEmail, tickettier } = req.body;
    console.log("req bodyy");
    console.log(contactInfo, SendEmail, tickettier);
    const eventId = req.params.eventID;
    if (!eventId) {
      return res.status(404).json({ message: "No parameter was provided" });
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
      return res.status(404).json({ message: "No event Found" });
    }

    const userid = await authorized(req);

    if (event.creatorId.toString() !== userid.user_id.toString()) {
      // check if the creator of the event matches the user making the add attendee request
      return res.status(401).json({
        success: false,
        message: "You are not authorized to add attendee to this event",
      });
    }

    // Loop through the tickettier array
    for (const tier of tickettier) {
      // Find the corresponding ticket tier in the event document
      const eventTier = event.ticketTiers.find(
        (t) => t.tierName === tier.ticketname
      );

      if (eventTier) {
        // Check if the sum of quantitySold and soldout exceeds the capacity
        const totalSold = eventTier.quantitySold + tier.soldout;

        if (totalSold <= eventTier.maxCapacity) {
          // Update the quantitySold field with the soldout value from the request body
          eventTier.quantitySold += tier.soldout;
        } else {
          console.log(
            `Sold out tickets for ${tier.ticketname} exceeds the capacity`
          );
        }
      } else {
        console.log(`No matching ticket tier found for ${tier.ticketname}`);
      }
    }
    // Save the updated document
    await event.save();
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

module.exports = {
  addAttendee,
};
