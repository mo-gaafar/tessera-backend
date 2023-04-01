const userModel = require("../../models/userModel");
const eventModel = require("../../models/eventModel");
const mongoose = require('mongoose');

async function displayfilteredTabs(req, res) {
    try{
        //const { category, location, startDate, endDate } = req.query;
        const category=req.query.category;
        const longitude=req.query.longitude;
        const latitude=req.query.latitude;
        const startDate=req.query.startDate;
        const endDate=req.query.endDate;
        //const eventHosted=req.query.eventhosted; ////hosted online or onground event
        const futureDate=req.query.futureDate////today/tommorw/weekend
        const query = {};

        if (category) {
        query["basicInfo.categories"] = category;
        }
        if (futureDate) {
          console.log(futureDate)
          if(futureDate==="today"){
            //start
            
            //end
            const today = new Date()
            const yesterday=new Date(today)
            yesterday.setDate(today.getDate() - 1)
            const tomorrow= new Date(today)
            tomorrow.setDate(today.getDate() + 1)
            today.setUTCHours(0,0,1)
            tomorrow.setUTCHours(2,5,5)
            yesterday.setUTCHours(21,5,5)
            var eventStartDate=yesterday
            var eventEndDate=tomorrow
            //2 hours span
            console.log("Trial for today: ",today)
            console.log("Trial for tomorrow: ",tomorrow)
            console.log("Trial for yesterday: ",yesterday)
            // const aftertomorrow=(today.getDate()+2).toString()
            // console.log("incremented date as a whole: ",(today+1))
            // console.log("After tomorrow should be April: ",aftertomorrow)
            // //remove time
            // const year=today.getFullYear().toString();
            // const month=(today.getMonth()+1).toString();
            // const yesterday=(today.getDate()-1).toString()
            // const tomorrow=(today.getDate()+1).toString()
            // var eventStartDate=[year, month, yesterday].join('-')
            // var eventEndDate=[year, month, tomorrow].join('-')
            //console.log("New format for today: ",eventStartDate)
            
          }
          else if(futureDate==="tomorrow"){
            const today = new Date()            
            const afterTomorrow= new Date(today)
            afterTomorrow.setDate(today.getDate() + 2)
            //2 hours span
            today.setUTCHours(21,5,5)
            afterTomorrow.setUTCHours(2,5,5)
            var eventStartDate=today
            var eventEndDate=afterTomorrow
            //2 hours span
            console.log("Trial for today: ",today)
            console.log("Trial for After tomorrow: ",afterTomorrow)
            
            // const startYear=(today.getFullYear()).toString();
            // const startMonth=(today.getMonth()+1).toString();
            // const startDay=(today.getDate()).toString();
            // console.log("year ",startYear,"month ",startMonth,"day ",startDay)
            // const endYear=(afterTomorrow.getFullYear()).toString();
            // const endMonth=(afterTomorrow.getMonth()+1).toString();
            // const endDay=(afterTomorrow.getDate()).toString();
            // console.log("2year ",endYear,"2month ",endMonth,"2day ",endDay)
            // var eventStartDate=[startYear, startMonth, startDay].join('-')
            // console.log("stringified: ",eventStartDate)
            // var eventEndDate=[endYear, endMonth, endDay].join('-')
            // console.log("stringified: ",eventEndDate)
            // const hello=new Date(eventStartDate)
            // const helloTomorrow=new Date(eventEndDate)
            // console.log("hello from today: ",hello)
            // console.log("hello from after tomorrow: ",helloTomorrow)
            // console.log("haaaa ", new Date(2023,4,5,23,0,0))
            //
            
          }
          else if(futureDate==="weekend"){
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
            const friday = new Date(today);
            friday.setDate(today.getDate() + ((12 - dayOfWeek) % 7));
            const sunday = new Date(friday);
            sunday.setDate(friday.getDate() + 3);
            friday.setUTCHours(0,1,1)
            sunday.setUTCHours(2,5,5)
            var eventStartDate=friday;
            var eventEndDate=sunday;
            console.log("Next friday is: ",eventStartDate)
            console.log("Next monday is: ",eventEndDate)
          }
          query["basicInfo.startDateTime.utc"] = {
            //event starts after the startdate
            $gt: eventStartDate,//new Date(eventStartDate),
            //event ends before the enddate
            $lt: eventEndDate,//new Date(eventEndDate),
          };
          /*

  "$match": {
    "year": currentDate.getFullYear(),
    "month": currentDate.getMonth() + 1,
    "day": currentDate.getDate()
  }
}
          */
          
        }
        // if (location) {
        // query["basicInfo.location"] = location;
        // }
        //get events starts between these start and end dates
        if (startDate && endDate) {
        console.log("type of startdarte",typeof startDate)
        query["basicInfo.startDateTime.utc"] = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
        }
        //prints
        console.log("category selected: ",category)
        console.log("startDate selected: ",startDate)
        console.log("endDate selected: ",endDate)
        console.log("longitude selected: ",longitude)
        console.log("latitude selected: ",latitude)
        console.log("furtue event: ",futureDate)
        const events = await eventModel.find(query);
        res
        .status(200)
        .json({success:"true",events})
    }catch (err) {
        console.error(err);
        // Return error message
        res
          .status(500)
          .json({ success: "false", message: "Internal server error" });
        throw err;
    }
}
/*
//geolocation inetegarted with attendeecontroler.js
EventController.getEvents = async (req, res) => {
    const { category, latitude, longitude } = req.query;
    const MAX_DISTANCE = 10000; // in meters
    try {
      const locations = await Location.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: MAX_DISTANCE,
          },
        },
      });
      const locationIds = locations.map((location) => location._id);
      const events = await Event.find({
        category: category,
        location: { $in: locationIds },
      });
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
//weekend function code integrated with attendeecontrolle.js
const { category, latitude, longitude, startDate } = req.query;
const MAX_DISTANCE = 10000; // in meters
const now = new Date();
const thisFriday = new Date(now);
thisFriday.setDate(now.getDate() + ((12 - now.getDay()) % 7));
const thisSunday = new Date(thisFriday);
thisSunday.setDate(thisFriday.getDate() + 2);
try {
  const locations = await Location.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: MAX_DISTANCE,
      },
    },
  });
  const locationIds = locations.map((location) => location._id);
  const events = await Event.find({
    category: category,
    location: { $in: locationIds },
    startDate: {
      $gte: thisFriday,
      $lt: thisSunday,
    },
  });
  res.json(events);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
};
//tommorow date
const today = new Date()
// to return the date number(1-31) for the specified date
console.log("today => ",today)
let tomorrow =  new Date()
tomorrow.setDate(today.getDate() + 1)
//returns the tomorrow date
console.log("tomorrow => ",tomorrow)
//date weekend
//function to get next weekend from Friday to Sunday
function getNextWeekend() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const friday = new Date(today);
    friday.setDate(today.getDate() + ((12 - dayOfWeek) % 7));
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    return { friday, sunday };
}





try {
    const { category, location, startDate, endDate } = req.query;

    const query = {};

    if (category) {
      query["basicInfo.categories"] = category;
    }

    if (location) {
      query["basicInfo.location"] = location;
    }

    if (startDate && endDate) {
      query["basicInfo.startDateTime.utc"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const events = await Event.find(query);

    res.render("events", { events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
},



*/



module.exports = { displayfilteredTabs};