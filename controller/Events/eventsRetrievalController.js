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
    const filterBy = req.query.filterBy;
    if (!creatorId) {
      return res
        .status(404)
        .json({ success: false, message: "No parameter was provided" });
    }

    const user = await authorized(req);

    if (user.authorized === false) {
      return res
        .status(404)
        .json({ success: false, message: "user not Autherized" });
    }

    //search event by id
    const query = {};

    //get date now
    const currentDate = new Date();

    // Get the time zone offset in minutes
    const timezoneOffset = currentDate.getTimezoneOffset();

    //convert date to UTC to compare with DB
    const utcDate = new Date(
      currentDate.getTime() - timezoneOffset * 60 * 1000
    );

    //filter events by creator id
    query["creatorId"] = creatorId;

    if (filterBy) {
      if (filterBy === "upcomingevents") {
        //only retrieve published
        query["published"] = true;

        query["basicInfo.startDateTime"] = {
          $gte: currentDate,
        };
      } else if (filterBy === "pastevents") {
        //only retrieve published
        query["published"] = true;

        query["basicInfo.startDateTime"] = {
          $lte: currentDate,
        };
      } else if (filterBy === "draft") {
        //only retrieve Unpublished
        query["published"] = false;
      }
    }
    //filter events by query object
    const events = await eventModel.find(query);
    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "No events Found" });
    }
    if (events.length === 0) {
      return res.status(200).json({
        filteredEvents: [],
        eventsoldtickets: [],
        isEventOnSale: [],
        gross: [],
      });
    }
    var filteredEvents = events.map((eventModel) => {
      const {
        createdAt,
        updatedAt,
        __v,
        privatePassword,
        isVerified,
        //promocodes,
        // startSelling,
        // endSelling,
        //publicDate,
        emailMessage,
        soldTickets,
        ...filtered
      } = eventModel._doc;
      return filtered;
    });

    const eventsoldtickets = [];
    const isEventOnSale = [];
    const gross = [];

    //loop over to compute total sold tickets for each event
    events.map((event) => {
      // get the number of sold tickets for the current event
      const soldTicketsCounts = event.soldTickets.length;
      //push into eventsoldtickets array
      eventsoldtickets.push(soldTicketsCounts);

      var totalEventCapacity = 0;
      var isSellingValidCounter = 0;
      var eventGross = 0;
      //loop over event ticket tiers
      for (let i = 0; i < event.ticketTiers.length; i++) {
        //could we reduce complexity??
        const tier = event.ticketTiers[i];

        //compute total event capacity
        totalEventCapacity = totalEventCapacity + tier.maxCapacity;

        if (
          utcDate.getTime() >= tier.startSelling.getTime() &&
          utcDate.getTime() <= tier.endSelling.getTime()
        ) {
          isSellingValidCounter = isSellingValidCounter + 1;
        }
        if (tier.price !== "Free") {
          tierPrice = tier.price;
          // Remove non-numeric characters from price string
          tierPrice = tierPrice.replace(/[^0-9.-]+/g, "");
          // Convert string to number
          tierPrice = parseFloat(tierPrice);

          eventGross = eventGross + tier.quantitySold * tierPrice;
        }
      }

      //if all tickets are sold or outside the selling period time.
      if (
        totalEventCapacity === soldTicketsCounts ||
        isSellingValidCounter === 0
      ) {
        isEventOnSale.push(false);
      } else {
        isEventOnSale.push(true);
      }

      //push total events gross into gross array
      gross.push(eventGross);
    });

    return res.status(200).json({
      filteredEvents,
      eventsoldtickets,
      isEventOnSale,
      gross,
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
