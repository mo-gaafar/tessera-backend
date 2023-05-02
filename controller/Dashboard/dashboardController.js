const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");



// to be modified

async function eventSalesByTicketType(req, res) {
    const event = await eventModel.findById(req.params.eventID);
    console.log("Event to be used is:", event);
    const desiredTierName = req.query.tierName;
    eventSales = 0;
  
    if (desiredTierName == "Free") {
      res.status(404).json({
        success: false,
        message: "There are no event sales for free ticket tiers ",
      });
    } else {
      for (let i = 0; i < event.ticketTiers.length; i++) {
        const tierObject = event.ticketTiers[i];
        const tierName = tierObject.tierName;
        console.log(`Tier ${i + 1}: ${tierName}`);
        if (tierName == desiredTierName) {
          const tierQuantitySold = tierObject.quantitySold;
          const tierPrice = tierObject.price;
          console.log(" tier qs:", tierQuantitySold);
          console.log(" tier price:", tierPrice);
          eventSales = eventSales + tierQuantitySold * tierPrice;
          console.log(" event quantity sold:", eventSales);
        }
      }
      eventSales = Math.round(eventSales);
      console.log("event quantity sold:", eventSales);
  
      res.status(200).json({
        success: true,
        message: "Event sales by the specified ticket type is: ",
        eventSales,
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
    eventSalesByTicketType,
    eventSoldTickets,
  };