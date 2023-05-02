const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");

const {
  GenerateToken,
  retrieveToken,
  verifyToken,
  authorized,
} = require("../../utils/Tokens");
const jwt = require("jsonwebtoken");

//list events
async function listEvents(req, res) {
  try {
    const creatorId = req.params.creatorID;
    if (!creatorId) {
      return res.status(404).json({ message: "No parameter was provided" });
    }
    //search event by id
    const query = {};
    //only retrieve published
    query["published"] = true;
    //filter events by creator id
    query["creatorId"] = "6439f95a3d607d6c49e56a1e";

    //filter events by query object
    const events = await eventModel.find(query);
    if (!events) {
      return res.status(404).json({ message: "No events Found" });
    }
    var filteredEvents = events.map((eventModel) => {
      const {
        createdAt,
        updatedAt,
        __v,
        privatePassword,
        isVerified,
        promocodes,
        // startSelling,
        // endSelling,
        publicDate,
        emailMessage,
        // soldTickets,
        eventUrl,
        ...filtered
      } = eventModel._doc;
      return filtered;
    });
    const eventsoldtickets = [];
    const isEventOnSale = [];

    //get date as user time zone
    const currentDate = new Date();

    // Get the time zone offset in minutes
    const timezoneOffset = currentDate.getTimezoneOffset();

    //convert date to UTC
    const utcDate = new Date(
      currentDate.getTime() - timezoneOffset * 60 * 1000
    );

    //compute total sold tickets for each event
    events.map((event) => {
      // get the array of sold tickets for the current event
      const soldTicketsCounts = event.soldTickets.length;
      eventsoldtickets.push(soldTicketsCounts);

      var totalCapacity = 0;
      var isSellingValid = true;
      for (let i = 0; i < event.ticketTiers.length; i++) {
        //could we reduce complexity??
        const tier = event.ticketTiers[i];
        //compute total event capacity
        totalCapacity = totalCapacity + tier.maxCapacity;

        if (
          utcDate.getTime() < tier.startSelling.getTime() ||
          utcDate.getTime() > tier.endSelling.getTime()
        ) {
          isSellingValid = false;
        } else {
          isSellingValid = true;
        }
      }

      if (totalCapacity === soldTicketsCounts && isSellingValid === false) {
        isEventOnSale.push(false);
      } else {
        isEventOnSale.push(true);
      }
    });

    return res.status(200).json({
      filteredEvents,
      eventsoldtickets,
      isEventOnSale,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  listEvents,
};
