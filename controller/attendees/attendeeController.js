const userModel = require("../../models/userModel");
const eventModel = require("../../models/eventModel");
const mongoose = require("mongoose");
async function displayfilteredTabs(req, res) {
  try {
    const category = req.query.category;
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const futureDate = req.query.futureDate;
    //prints
    console.log("category selected: ", category);
    console.log("startDate selected: ", startDate);
    console.log("endDate selected: ", endDate);
    console.log("longitude selected: ", longitude);
    console.log("latitude selected: ", latitude);
    console.log("furtue event: ", futureDate);
    const query = {};

    if (category) {
      query["basicInfo.categories"] = category;
    }
    if (futureDate && startDate) {
      console.log(futureDate);
      if (futureDate === "today") {
        //start
        //get date as user time zone
        const userDate = new Date(startDate);
        console.log("today user tiemzone: ", userDate);
        // Get the time zone offset in minutes
        const timezoneOffset = userDate.getTimezoneOffset();
        console.log("offset in minutes: ", timezoneOffset);
        //convert date to UTC
        const utcDate = new Date(
          userDate.getTime() - timezoneOffset * 60 * 1000
        );
        //get yesterday from this utcDate today
        const yesterday = new Date(utcDate);
        yesterday.setDate(utcDate.getDate() - 1);
        const tomorrow = new Date(utcDate);
        tomorrow.setDate(utcDate.getDate() + 1);
        yesterday.setUTCHours(22, 59, 58);
        tomorrow.setUTCHours(0, 0, 58);
        var eventStartDate = yesterday;
        var eventEndDate = tomorrow;
        console.log("Trial for tomorrow: ", eventStartDate);
        console.log("Trial for yesterday: ", eventEndDate);
      } else if (futureDate === "tomorrow" && startDate) {
        //start
        console.log("ana gwa tomorrow");
        //get date as user time zone
        const userDate = new Date(startDate);
        console.log("today user timezone: ", userDate);
        // Get the time zone offset in minutes
        const timezoneOffset = userDate.getTimezoneOffset();
        console.log("offset in minutes: ", timezoneOffset);
        //convert date to UTC
        const utcDate = new Date(
          userDate.getTime() - timezoneOffset * 60 * 1000
        );
        const afterTomorrow = new Date(utcDate);
        afterTomorrow.setDate(utcDate.getDate() + 2);
        utcDate.setUTCHours(0, 0, 58);
        afterTomorrow.setUTCHours(0, 0, 58);
        var eventStartDate = utcDate;
        var eventEndDate = afterTomorrow;

        console.log("Trial for today: ", eventStartDate);
        console.log("Trial for After tomorrow: ", eventEndDate);
      }
      //weekend is from Friday all day to Sunday all day
      else if (futureDate === "weekend" && startDate) {
        //start
        //get date as user time zone
        const userDate = new Date(startDate);
        console.log("today user tiemzone: ", userDate);
        // Get the time zone offset in minutes
        const timezoneOffset = userDate.getTimezoneOffset();
        console.log("offset in minutes: ", timezoneOffset);
        //convert date to UTC
        const utcDate = new Date(
          userDate.getTime() - timezoneOffset * 60 * 1000
        );
        const dayOfWeek = utcDate.getDay(); // 0 (Sunday) to 6 (Saturday)
        const friday = new Date(utcDate);
        friday.setDate(utcDate.getDate() + ((12 - dayOfWeek) % 7));
        const sunday = new Date(friday);
        sunday.setDate(friday.getDate() + 3);
        friday.setUTCHours(0, 0, 59);
        sunday.setUTCHours(22, 59, 59); //last second in Sunday
        var eventStartDate = friday;
        var eventEndDate = sunday;
        console.log("Next friday is: ", eventStartDate);
        console.log("Next monday is: ", eventEndDate);
      }
      query["basicInfo.startDateTime.utc"] = {
        //event starts after the startdate
        $gt: eventStartDate,
        //event ends before the enddate
        $lt: eventEndDate,
      };
    }

    if (startDate && endDate) {
      console.log("type of startdarte", typeof startDate);

      //get date as user time zone
      const userDateStart = new Date(startDate);
      console.log("today user timezone: ", userDateStart);
      // Get the time zone offset in minutes
      const timezoneOffset1 = userDateStart.getTimezoneOffset();
      console.log("offset in minutes: ", timezoneOffset1);
      //convert date to UTC
      const utcDateStart = new Date(
        userDateStart.getTime() - timezoneOffset1 * 60 * 1000
      );
      //get date as user time zone
      const userDateEnd = new Date(endDate);
      console.log("today user timezone: ", userDateEnd);
      // Get the time zone offset in minutes
      const timezoneOffset2 = userDateEnd.getTimezoneOffset();
      console.log("offset in minutes: ", timezoneOffset2);
      //convert date to UTC
      const utcDateEnd = new Date(
        userDateEnd.getTime() - timezoneOffset2 * 60 * 1000
      );
      utcDateStart.setUTCHours(0, 0, 58);
      utcDateEnd.setUTCHours(22, 59, 58);
      var eventStartDate = utcDateStart;
      var eventEndDate = utcDateEnd;

      console.log("Trial for today: ", eventStartDate);
      console.log("Trial for After tomorrow: ", eventEndDate);
      //end
      query["basicInfo.startDateTime.utc"] = {
        $gte: eventStartDate,
        $lte: eventEndDate,
      };
    }

    //prints
    console.log("category selected: ", category);
    console.log("startDate selected: ", startDate);
    console.log("endDate selected: ", endDate);
    console.log("longitude selected: ", longitude);
    console.log("latitude selected: ", latitude);
    console.log("furtue event: ", futureDate);
    //array of events
    const events = await eventModel.find(query);
    //retreive categories
    const categoriesRetreived = [
      ...new Set(events.map((eventModel) => eventModel.basicInfo.categories)),
    ];
    console.log(categoriesRetreived);
    res.status(200).json({ success: "true", events, categoriesRetreived });
  } catch (err) {
    console.error(err);
    // Return error message
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
    throw err;
  }
}
module.exports = { displayfilteredTabs };
