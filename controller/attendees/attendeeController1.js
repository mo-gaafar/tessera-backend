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
        //prints
        console.log("category selected: ",category)
        console.log("startDate selected: ",startDate)
        console.log("endDate selected: ",endDate)
        console.log("longitude selected: ",longitude)
        console.log("latitude selected: ",latitude)
        console.log("furtue event: ",futureDate)
        const query = {};

        if (category) {
        query["basicInfo.categories"] = category;
        }
        if (futureDate && startDate){
          console.log(futureDate)
          if(futureDate==="today"){
            //start
            //get date as user time zone
            const userDate= new Date(startDate)
            console.log("today user tiemzone: ",userDate)
            // Get the time zone offset in minutes
            const timezoneOffset = userDate.getTimezoneOffset();
            console.log("offset in minutes: ",timezoneOffset)
            //convert date to UTC 
            const utcDate = new Date(userDate.getTime() - timezoneOffset * 60 * 1000);
            //get yesterday from this utcDate today
            const yesterday=new Date(userDate)
            yesterday.setDate(utcDate.getDate() - 1)
            const tomorrow= new Date(userDate)
            tomorrow.setDate(utcDate.getDate() + 1)
            yesterday.setUTCHours(22,59,58)
            tomorrow.setUTCHours(0,0,58)
            var eventStartDate=yesterday
            var eventEndDate=tomorrow
            console.log("Trial for tomorrow: ",eventStartDate)
            console.log("Trial for yesterday: ",eventEndDate)
            //end
            // const today = new Date()
            // const yesterday=new Date(today)
            // yesterday.setDate(today.getDate() - 1)
            // const tomorrow= new Date(today)
            // tomorrow.setDate(today.getDate() + 1)
            // today.setUTCHours(0,0,1)
            // tomorrow.setUTCHours(2,5,5)
            // yesterday.setUTCHours(21,5,5)
            // var eventStartDate=yesterday
            // var eventEndDate=tomorrow
            // //2 hours span
            // console.log("Trial for today: ",today)
            // console.log("Trial for tomorrow: ",tomorrow)
            // console.log("Trial for yesterday: ",yesterday)

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
          else if(futureDate==="tomorrow" && startDate){//check why it's also getting todays events !!
            //start
            console.log("ana gwa tomorrow")
            //get date as user time zone
            const userDate= new Date(startDate)
            console.log("today user timezone: ",userDate)
            // Get the time zone offset in minutes
            const timezoneOffset = userDate.getTimezoneOffset();
            console.log("offset in minutes: ",timezoneOffset)
            //convert date to UTC 
            const utcDate = new Date(userDate.getTime() - timezoneOffset * 60 * 1000);
            const afterTomorrow= new Date(utcDate);
            afterTomorrow.setDate(utcDate.getDate() + 2)
            utcDate.setUTCHours(0,0,58);
            afterTomorrow.setUTCHours(0,0,58)
            var eventStartDate=utcDate
            var eventEndDate=afterTomorrow
            
            console.log("Trial for today: ",eventStartDate)
            console.log("Trial for After tomorrow: ",eventEndDate)
            //end
           // const today = new Date()            
            //const afterTomorrow= new Date(today)
           // afterTomorrow.setDate(today.getDate() + 2)
            //2 hours span
            //today.setUTCHours(21,5,5)
            //afterTomorrow.setUTCHours(2,5,5)
            // var eventStartDate=today
            // var eventEndDate=afterTomorrow
            
            // console.log("Trial for today: ",today)
            // console.log("Trial for After tomorrow: ",afterTomorrow)
            
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
          //weekend is from Friday all day to Sunday all day
          else if(futureDate==="weekend" && startDate){
            //start
            //get date as user time zone
            const userDate= new Date(startDate)
            console.log("today user tiemzone: ",userDate)
            // Get the time zone offset in minutes
            const timezoneOffset = userDate.getTimezoneOffset();
            console.log("offset in minutes: ",timezoneOffset)
            //convert date to UTC 
            const utcDate = new Date(userDate.getTime() - timezoneOffset * 60 * 1000);
            const dayOfWeek = utcDate.getDay(); // 0 (Sunday) to 6 (Saturday)
            const friday = new Date(utcDate);
            friday.setDate(utcDate.getDate() + ((12 - dayOfWeek) % 7));
            const sunday = new Date(friday);
            sunday.setDate(friday.getDate() + 3);
            friday.setUTCHours(0,0,59)
            sunday.setUTCHours(22,59,59)//last second in Sunday
            var eventStartDate=friday;
            var eventEndDate=sunday;
            console.log("Next friday is: ",eventStartDate)
            console.log("Next monday is: ",eventEndDate)
            //end
            // const today = new Date();
            // const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
            // const friday = new Date(today);
            // friday.setDate(today.getDate() + ((12 - dayOfWeek) % 7));
            // const sunday = new Date(friday);
            // sunday.setDate(friday.getDate() + 3);
            // friday.setUTCHours(0,1,1)
            // sunday.setUTCHours(2,5,5)
            // var eventStartDate=friday;
            // var eventEndDate=sunday;
            // console.log("Next friday is: ",eventStartDate)
            // console.log("Next monday is: ",eventEndDate)
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

module.exports = { displayfilteredTabs};