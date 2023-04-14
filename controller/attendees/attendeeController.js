const userModel = require("../../models/userModel");
const Promocode = require("../../models/promocodeModel");
const eventModel = require("../../models/eventModel");
const mongoose = require("mongoose");
const { func } = require("joi");
/**
 * This function filter events by selected tabs and get categories involved
 *
 * @async
 * @function
 * @param {Object} req -request
 * @param {Object} res -response
 * @returns -events array & retreived categories
 * @throws {Error} -internal server error
 */
async function displayfilteredTabs(req, res) {
  try {
    //get query parameters
    const category = req.query.category;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const futureDate = req.query.futureDate;
    const eventHosted = req.query.eventHosted;
    const city = req.query.administrative_area_level_1;
    const country = req.query.country;

    //use query object to filter by
    const query = {};

    //get events by category
    if (category) {
      queryWithCategory(query, category);
    }
    //get online events
    if (eventHosted) {
      queryWithOnline(query);
    }
    //get events by city location
    if (city) {
      queryWithCity(query, city);
    }
    //get events by country location
    if (country) {
      queryWithCountry(query, country);
    }
    //get future events
    if (futureDate && startDate) {
      if (futureDate === "today") {
        var { eventStartDate, eventEndDate } = await getToday(startDate);
        queryWithDate(query, eventStartDate, eventEndDate, 1);
      } else if (futureDate === "tomorrow" && startDate) {
        var { eventStartDate, eventEndDate } = await getTomorrow(startDate);
        queryWithDate(query, eventStartDate, eventEndDate, 1);
      } else if (futureDate === "weekend" && startDate) {
        var { eventStartDate, eventEndDate } = await getWeekend(startDate);
        queryWithDate(query, eventStartDate, eventEndDate, 2);
      }
    }

    //get events that starts within the highlighted period on calender
    if (startDate && endDate) {
      var { eventStartDate, eventEndDate } = await getCalender(
        startDate,
        endDate
      );

      queryWithDate(query, eventStartDate, eventEndDate, 2);
    }
    //remove private events from array //published or not to be added later
    query["isPublic"] = true;
    //array of events filtered using the query object
    const events = await eventModel.find(query);

    //retreive categories
    const categoriesRetreived = [
      ...new Set(events.map((eventModel) => eventModel.basicInfo.categories)),
    ];
    //exclude unnecessary fields
    const filteredEvents = events.map((eventModel) => {
      const {
        createdAt,
        updatedAt,
        __v,
        privatePassword,
        isVerified,
        promocode,
        startSelling,
        endSelling,
        publicDate,
        emailMessage,
        ticketTiers,
        creatorId,
        soldTickets,
        eventUrl,
        ...filtered
      } = eventModel._doc;
      return filtered;
    });
    console.log("displaying filtered tabs");
    res
      .status(200)
      .json({ success: "true", filteredEvents, categoriesRetreived });
  } catch (err) {
    console.error(err);
    // Return error message
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
    throw err;
  }
}

/**
 * compute tomorrow's date
 *
 * @async
 * @function getTomorrow
 * @param {String} startDate -current date of attendee's timezone
 * @returns -today's date and afterTomorrows's date
 * @throws {Error} -couldn't get tomorrow
 */
async function getTomorrow(startDate) {
  try {
    //get date as user time zone
    const userDate = new Date(startDate);

    // Get the time zone offset in minutes
    const timezoneOffset = userDate.getTimezoneOffset();

    //convert date to UTC
    const utcDate = new Date(userDate.getTime() - timezoneOffset * 60 * 1000);

    const afterTomorrow = new Date(utcDate);
    afterTomorrow.setDate(utcDate.getDate() + 2);

    utcDate.setUTCHours(23, 0, 0);
    afterTomorrow.setUTCHours(0, 0, 0);
    var eventStartDate = utcDate;
    var eventEndDate = afterTomorrow;
    return { eventStartDate, eventEndDate };
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by tomorrow" });
    throw err;
  }
}
/**
 * compute today's date
 *
 * @async
 * @function getToday
 * @param {String} startDate -current date of attendee's timezone
 * @returns -yesterday's date and tomorrow's date
 * @throws {Error} -couldn't get today
 */
async function getToday(startDate) {
  try {
    //get date as user time zone
    const userDate = new Date(startDate);

    // Get the time zone offset in minutes
    const timezoneOffset = userDate.getTimezoneOffset();

    //convert date to UTC
    const utcDate = new Date(userDate.getTime() - timezoneOffset * 60 * 1000);

    //get yesterday from this utcDate today
    const yesterday = new Date(utcDate);
    yesterday.setDate(utcDate.getDate() - 1);

    //get tomorrow from this utcDate today
    const tomorrow = new Date(utcDate);
    tomorrow.setDate(utcDate.getDate() + 1);

    yesterday.setUTCHours(23, 0, 0);
    tomorrow.setUTCHours(0, 0, 0);
    var eventStartDate = yesterday;
    var eventEndDate = tomorrow;
    return { eventStartDate, eventEndDate };
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by today" });
    throw err;
  }
}
/**
 * compute weekend's date
 *
 * @async
 * @function getWeekend
 * @param {String} startDate -current date of attendee's timezone
 * @returns -fridays's date and sunday's date
 * @throws {Error} -couldn't get weekend
 */

async function getWeekend(startDate) {
  //weekend is from Friday all day to Sunday all day
  try {
    //get date as user time zone
    const userDate = new Date(startDate);

    // Get the time zone offset in minutes
    const timezoneOffset = userDate.getTimezoneOffset();

    //convert date to UTC
    const utcDate = new Date(userDate.getTime() - timezoneOffset * 60 * 1000);
    const dayOfWeek = utcDate.getDay(); // 0 (Sunday) to 6 (Saturday)

    const friday = new Date(utcDate);
    friday.setDate(utcDate.getDate() + ((12 - dayOfWeek) % 7));

    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 3);

    friday.setUTCHours(0, 0, 0);
    sunday.setUTCHours(23, 0, 0); //last second in Sunday
    var eventStartDate = friday;
    var eventEndDate = sunday;
    return { eventStartDate, eventEndDate };
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by weekend" });
    throw err;
  }
}
/**
 * compute UTC dates for the start and end of the highlighted period on calender
 *
 * @async
 * @function getCalender
 * @param {String} startDate
 * @param {String} endDate
 * @returns startDate and endDate of highlighted calender UTC timing
 * @throws {Error} -couldn't get calender
 */
async function getCalender(startDate, endDate) {
  try {
    //get date as user time zone
    const userDateStart = new Date(startDate);

    // Get the time zone offset in minutes
    const timezoneOffset1 = userDateStart.getTimezoneOffset();

    //convert date to UTC
    const utcDateStart = new Date(
      userDateStart.getTime() - timezoneOffset1 * 60 * 1000
    );
    //get date as user time zone
    const userDateEnd = new Date(endDate);

    // Get the time zone offset in minutes
    const timezoneOffset2 = userDateEnd.getTimezoneOffset();

    //convert date to UTC
    const utcDateEnd = new Date(
      userDateEnd.getTime() - timezoneOffset2 * 60 * 1000
    );

    utcDateStart.setUTCHours(0, 0, 0);
    utcDateEnd.setUTCHours(23, 0, 0);

    var eventStartDate = utcDateStart;
    var eventEndDate = utcDateEnd;
    return { eventStartDate, eventEndDate };
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by calender" });
    throw err;
  }
}

/**
 * query with given startDate and endDate inside events in DB
 *
 * @async
 * @function queryWithDate
 * @param {Object} query
 * @param {Date} eventStartDate
 * @param {Date} eventEndDate
 * @param {number} key
 * @throws {Error} -couldn't query with dates
 */
async function queryWithDate(query, eventStartDate, eventEndDate, key) {
  try {
    if (key === 1) {
      query["basicInfo.startDateTime.utc"] = {
        //event starts after the startdate
        $gt: eventStartDate,
        //event ends before the enddate
        $lt: eventEndDate,
      };
    } else {
      query["basicInfo.startDateTime.utc"] = {
        //event starts after the startdate
        $gte: eventStartDate,
        //event ends before the enddate
        $lte: eventEndDate,
      };
    }
    query["basicInfo.startDateTime.utc"] = {
      //event starts after the startdate
      $gte: eventStartDate,
      //event ends before the enddate
      $lte: eventEndDate,
    };
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error query with dates" });
    throw err;
  }
}
/**
 * query with given category inside events in DB
 *
 * @async
 * @function queryWithCategory
 * @param {Object} query
 * @param {String} category
 * @throws {Error} -couldn't query with category
 */
async function queryWithCategory(query, category) {
  try {
    query["basicInfo.categories"] = category;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by category" });
    throw err;
  }
}
/**
 * query with given category inside events in DB
 *
 * @async
 * @function queryWithOnline
 * @param {Object} query
 * @throws {Error} -couldn't query with online
 */
async function queryWithOnline(query) {
  try {
    query["isOnline"] = true;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by online" });
    throw err;
  }
}
/**
 * query with given city location inside events in DB
 *
 * @async
 * @function queryWithCity
 * @param {Object} query
 * @param {String} city
 * @throws {Error} -couldn't query with city
 */
async function queryWithCity(query, city) {
  try {
    query["basicInfo.location.administrative_area_level_1"] = city;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by city" });
    throw err;
  }
}
/**
 * query with given country location inside events in DB
 *
 * @async
 * @function queryWithCountry
 * @param {Object} query
 * @param {String} country
 * @throws {Error} -couldn't query with country
 */
async function queryWithCountry(query, country) {
  try {
    query["basicInfo.location.country"] = country;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Error filtering by country" });
    throw err;
  }
}
/**
 * retreive events categories inside event schema
 *
 * @param {Object} req
 * @param {object} res -enum of categories
 */
async function listAllCategories(req, res) {
  try {
    const CategoriesList = eventModel.schema.path(
      "basicInfo.categories"
    ).enumValues;
    res.status(200).json({ success: "true", CategoriesList });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
    throw err;
  }
}
/**
 * This function shall return a public event information using eventId
 *
 * @async
 * @function
 * @param {Object} req -evetnId as as path parameter
 * @param {Object} res -event information
 * @returns -response with event information required
 * @throws {Error} -internal server error
 */
async function getEventInfo(req, res) {
  //!!! online url to be added
  try {
    //get eventId from path parameter
    const eventId = req.params.eventID;

    //create query object
    const query = {};
    //remove private events from array
    query["isPublic"] = true;
    query["_id"] = eventId;

    //event filtered using the query object
    const event = await eventModel
      .find(query)
      //get only these fields from creator
      .populate("creatorId", "_id firstName lastName");

    //create dictionary to store ticketCapacity information
    const tierCapacity = {};
    var isEventCapacityFull = true;
    var isEventFree = true;
    var counter1 = 0;
    var counter2 = 0;

    //loop over ticketTiers array
    for (let i = 0; i < event[0].ticketTiers.length; i++) {
      const tier = event[0].ticketTiers[i];
      //checks if capacity full for each tier
      const isTierCapacityFull = tier.maxCapacity === tier.quantitySold;

      if (isTierCapacityFull === false) {
        counter1 = counter1 + 1;
      }
      if (tier.price != "Free") {
        counter2 = counter2 + 1;
      }

      // Store capacity full as a value in dictionary with tier name as key
      tierCapacity[tier.tierName] = isTierCapacityFull;
    }
    //if counter greater than zero,then event overall capacity is not full
    if (counter1 > 0) {
      isEventCapacityFull = false;
    } else {
      isEventCapacityFull = true;
    }
    //if counter greater than zero,then event overall is not full
    if (counter2 > 0) {
      isEventFree = false;
    } else {
      isEventFree = true;
    }

    //exclude unnecessary fields
    const filteredEvents = event.map((eventModel) => {
      const {
        _id,
        createdAt,
        updatedAt,
        __v,
        eventStatus,
        published,
        isPublic,
        isVerified,
        promocode,
        startSelling,
        endSelling,
        publicDate,
        emailMessage,
        soldTickets,
        privatePassword,

        ...filtered
      } = eventModel._doc;
      return filtered;
    });

    console.log("getting event information");

    res.status(200).json({
      success: "true",
      filteredEvents,
      tierCapacity,
      isEventCapacityFull,
      isEventFree,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
    throw err;
  }
}
module.exports = { displayfilteredTabs, listAllCategories, getEventInfo };
