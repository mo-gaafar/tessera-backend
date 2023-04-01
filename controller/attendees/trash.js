
const userModel = require("../../models/userModel");
const eventModel = require("../../models/eventModel");
const mongoose = require('mongoose');
const { date } = require("joi");

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
        var events={}; 
        //compare with date inside database 
        if (futureDate) {
            console.log(futureDate)
            //get date as user time zone
            //const localDate = new Date('2023-04-01T12:00:00-07:00');
            const today=new Date();
            //console.log("local Date: ",localDate);
            console.log("today: ",today)
            // Get the time zone offset in minutes
            const timezoneOffset = today.getTimezoneOffset();
            //convert date to UTC 
            const utcDate = new Date(today.getTime() - timezoneOffset * 60 * 1000);
            const newDate= new Date(utcDate.getTime() + timezoneOffset * 60 * 1000);
            console.log("new date: ",newDate)
            // Output the UTC date and time in ISO format
            console.log("Utc date: ",utcDate.toISOString()); // Output: 2023-04-01T19:00:00.000Z
            //get year,month and day
            utcDateYear=utcDate.getFullYear()
            utcDateMonth=utcDate.getMonth()+1
            utcDateDay=utcDate.getDate()
            if(futureDate==="today"){
                // query["basicInfo.startDateTime.utc"] = {
                //     "$match": {
                //         "basicInfo.startDateTime.utc.year": utcDateYear,
                //         "basicInfo.startDateTime.utc.month": utcDateMonth,
                //         "basicInfo.startDateTime.utc.day": utcDateDay,
                //     }
                //   };

                // query["basicInfo.startDateTime.utc"] = {
                //     $match: {
                //         $expr: {
                //           $eq: [
                //             { $dateToString: { format: "%Y-%m-%d", date: "basicInfo.startDateTime.utc" } },
                //             { $dateToString: { format: "%Y-%m-%d", date: utcDate } }
                //           ]
                //         }
                //     }
                // }
                //
                events = await eventModel.find({
                    $expr: {
                      $eq: [
                        { $dateToString: { format: "%Y-%m-%d", date: "$basicInfo.startDateTime.utc" } },
                        { $dateToString: { format: "%Y-%m-%d", date: utcDate } }
                      ]
                    }
                })
                
            }}
        
        


        if(category) {
        query["basicInfo.categories"] = category;
        }
        //prints
        console.log("category selected: ",category)
        console.log("startDate selected: ",startDate)
        console.log("endDate selected: ",endDate)
        console.log("longitude selected: ",longitude)
        console.log("latitude selected: ",latitude)
        console.log("furtue event: ",futureDate)
        // const events = await eventModel.find(query);
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