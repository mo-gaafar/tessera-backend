const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");

const jwt = require("jsonwebtoken");


// to be modified

async function eventSales(req, res) {

    const event = await eventModel.findById(req.params.eventID);
    console.log("Event to be used is:", event);
    const allTiers=req.query.allTiers;
    console.log("all tiers:",allTiers)
    const desiredTierName = req.query.tierName;
    console.log("desired tier name:",desiredTierName)
    eventSales = 0;
    salesByTierType=0;
  


      for (let i = 0; i < event.ticketTiers.length; i++) {
        const tierObject = event.ticketTiers[i];   
        const tierName = tierObject.tierName;
        console.log(`Tier ${i + 1}: ${tierName}`);
        const tierQuantitySold = tierObject.quantitySold;
        tierPrice = tierObject.price;
        if (tierPrice=='Free'){
           tierPrice=0

        }
        console.log(" tier qs:", tierQuantitySold);
        console.log(" tier price:", tierPrice);

        if (allTiers ==='true'){        
            
          if (tierName==='free'){
            eventSales = eventSales + 0;    
          }
         
          else{

        eventSales = eventSales + tierQuantitySold * tierPrice;
        eventSales=Math.round(eventSales)
        console.log(" event sales:", eventSales);

          }

        } 

        else if (allTiers==='false'){
           
          console.log("inside false")
          if (desiredTierName === 'Free') {
            res.status(404).json({
           success: false,
            message: "There are no event sales for free ticket tiers ",
         });

        }

         else if (tierName === desiredTierName) {
          console.log("inside desired")
          
          salesByTierType=salesByTierType+tierQuantitySold * tierPrice;
          salesByTierType = Math.round(salesByTierType);
          console.log("event quantity sold:", salesByTierType);

        }        


      }

        }

   

        if (eventSales>0){
          res.status(200).json({
            success: true,
            message: "Total Event Sales:  ",
            eventSales,
          });

        }

      else{
        console.log("inside last salesByType")

        res.status(200).json({
          success: true,
          message: "Event Sales by the specified tier type:  ",
          salesByTierType,
   });

 }
  
}   



// to be modified

async function eventSoldTickets(req, res) {
    const event = await eventModel.findById(req.params.eventID);
    console.log("Event to be used in event sold tickets:", event);
  
    eventSales = 0;
    totalMaxCapacity = 0;
    soldTickets = 0;

  
    for (let i = 0; i < event.ticketTiers.length; i++) {
      const tierObject = event.ticketTiers[i];
      const tierName = tierObject.tierName;
      console.log(`Tier ${i + 1}: ${tierName}`);
      const maxCapacity = tierObject.maxCapacity;
      console.log(" max Capacity:", maxCapacity);
      if (tierName == "Free") {
        eventSales = eventSales + 0;
        totalMaxCapacity = totalMaxCapacity + maxCapacity;
        const tierQuantitySold = tierObject.quantitySold;
        console.log(" tier qs:", tierQuantitySold);
        soldTickets = soldTickets + tierQuantitySold;
      } else {
        const tierQuantitySold = tierObject.quantitySold;
        soldTickets = soldTickets + tierQuantitySold;
        const tierPrice = tierObject.price;
        totalMaxCapacity = totalMaxCapacity + maxCapacity;
        console.log(" tier qs:", tierQuantitySold);
        console.log(" tier price:", tierPrice);
        eventSales = eventSales + tierQuantitySold * tierPrice;
        console.log(" event quantity sold:", eventSales);
      }
    }
  
    // 	}
    eventSales = Math.round(eventSales);
    totalMaxCapacity = Math.round(totalMaxCapacity);
    soldTickets = Math.round(soldTickets);
    console.log(" event quantity sold:", eventSales);
    console.log(" total max capacity", totalMaxCapacity);
    console.log(" sold Tickets:", soldTickets);
    soldTicketsFromCapacity = (soldTickets / totalMaxCapacity) * 100;
    soldTicketsFromCapacity = Math.round(soldTicketsFromCapacity);
    console.log("per of sold tickets:", soldTicketsFromCapacity);
  
    res.status(200).json({
      success: true,
      message: "Event sold tickets as a percentage of the capacity ",
      soldTicketsFromCapacity,
    });
  }





  module.exports = {
    eventSales,
    eventSoldTickets,
  };