const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");

const {
  GenerateToken,
  retrieveToken,
  verifyToken,
  authorized,
} = require("../../utils/Tokens");
const jwt = require("jsonwebtoken");

/**
 * List events filtered by creator id and optionally by status (upcoming, past, or draft)
 *
 * @async
 * @function listEvents
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {Object} - The HTTP response with an array of events, as well as additional data for each event
 * @throws {Object} - The HTTP response with an error message if an error occurs
 *
 *
 */
async function listEvents(req, res) {
  try {
    console.log("Gonna list events by creator");
    // get filterBy parameter from query string
    const filterBy = req.query.filterBy;

    // verify user authorization with a helper function
    const user = await authorized(req);
    // if user is not authorized, return an error response
    if (user.authorized === false) {
      return res
        .status(404)
        .json({ success: false, message: "user not Autherized" });
    }

    //get the ID of the authorized user
    const creatorId = user.user_id.toString();

    //create an empty query object
    const query = {};

    // Get the current date/time
    const currentDate = new Date();

    // Get the time zone offset in minutes
    const timezoneOffset = currentDate.getTimezoneOffset();

    //convert date to UTC to compare with DB
    const utcDate = new Date(
      currentDate.getTime() - timezoneOffset * 60 * 1000
    );

    //filter events by creator id
    query["creatorId"] = creatorId;

    // Apply additional filters based on the 'filterBy' parameter in the query string
    if (filterBy) {
      if (filterBy === "upcomingevents") {
        // Retrieve only published events that have a start date/time after the current date/time
        query["published"] = true;

        query["basicInfo.startDateTime"] = {
          $gte: currentDate,
        };
      } else if (filterBy === "pastevents") {
        // Retrieve only published events that have a start date/time before the current date/time
        query["published"] = true;

        query["basicInfo.startDateTime"] = {
          $lte: currentDate,
        };
      } else if (filterBy === "draft") {
        // Retrieve only unpublished events
        query["published"] = false;
      }
    }

    //filter events by query object
    const events = await eventModel.find(query);
    console.log(`events filtered by ${filterBy}`);
    // If no events were found, return an error response
    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "No events Found" });
    }

    // If there are no events, return an empty response with only the keys defined below
    if (events.length === 0) {
      return res.status(200).json({
        filteredEvents: [],
        eventsoldtickets: [],
        isEventOnSale: [],
        gross: [],
        maxCapacity: [],
      });
    }

    // Extract only the desired properties from each event and return them in a new array
    var filteredEvents = events.map((eventModel) => {
      const {
        _id,
        createdAt,
        updatedAt,
        __v,
        privatePassword,
        isVerified,
        promocodes,
        startSelling,
        endSelling,
        publicDate,
        emailMessage,
        soldTickets,
        ticketTiers,
        summary,
        description,
        isPublic,
        published,
        creatorId,
        ...filtered
      } = eventModel._doc;
      return filtered;
    });

    // Create empty arrays to hold data for each event
    const eventsoldtickets = [];
    const isEventOnSale = [];
    const gross = [];
    const maxCapacity = [];

    //loop over to compute total sold tickets for each event
    events.map((event) => {
      //loop over ticketTiers array
      if (!event.ticketTiers || event.ticketTiers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "ticketTiers is not found",
        });
      }
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
        if (tier.maxCapacity) {
          //compute total event capacity
          totalEventCapacity = totalEventCapacity + tier.maxCapacity;
        }
        if (tier.startSelling && tier.endSelling) {
          if (
            utcDate.getTime() >= tier.startSelling.getTime() &&
            utcDate.getTime() <= tier.endSelling.getTime()
          ) {
            isSellingValidCounter = isSellingValidCounter + 1;
          }
        }
        if (tier.quantitySold && tier.price) {
          if (tier.price !== "Free") {
            tierPrice = tier.price;
            // Remove non-numeric characters from price string
            tierPrice = tierPrice.replace(/[^0-9.-]+/g, "");
            // Convert string to number
            tierPrice = parseFloat(tierPrice);

            eventGross = eventGross + tier.quantitySold * tierPrice;
          }
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

      //push max event capcity into maxCapacity array
      maxCapacity.push(totalEventCapacity);
    });
    console.log("events by creator listed successfully");
    //return filtered events and corresponding arrays
    return res.status(200).json({
      filteredEvents,
      eventsoldtickets,
      isEventOnSale,
      gross,
      maxCapacity,
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
