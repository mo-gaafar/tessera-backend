const { response } = require("express");
const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");
const userModel2 = require("../../models/userModel");
const ticketModel = require("../../models/ticketModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const listEvents = require("../Events/eventsRetrievalController");
const axios = require("axios");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const moment = require("moment");

// to be modified

async function exportsListEvents(req, res) {
  const instance = axios.create({
    baseURL: "https://www.tessera.social/api",
    timeout: 1000,
  });
  const filtering = req.query.filterBy;
  const url =
    "https://www.tessera.social/api" +
    `/event-management/listEvents/?filterBy=${filtering}`;
  // replace with the actual event ID
  try {
    const response = await instance.get(url, {
      headers: {
        Authorization: `Bearer ${req.headers.authorization.split(" ")[1]}`,
      },
    });
    //console.log(response.data);
    /*res.status(200).json({
			success: true,
			message: response.data,
		}); */

    const filteredEvents = response.data.filteredEvents;
    const eventsoldtickets = response.data.eventsoldtickets;

    const csvWriter = createCsvWriter({
      path: "event_sales.csv",
      header: [
        { id: "eventName", title: "EventName" },
        { id: "startDateTime", title: "Date" },
        { id: "status", title: "Status" },
        { id: "eventsoldtickets", title: "eventsoldtickets" },
        { id: "RemainingTickets", title: "Tickets Available" },
      ],
    });

    const records = [];
    for (let i = 0; i < filteredEvents.length; i++) {
      const event = filteredEvents[i];
      const remainingTickets =
        response.data.eventsoldtickets[i] > response.data.maxCapacity[i]
          ? 0
          : response.data.maxCapacity[i] - response.data.eventsoldtickets[i];
      const record = {
        eventName: event.basicInfo.eventName,

        startDateTime: moment(event.basicInfo.startDateTime)
          .utc()
          .format("dddd, MMMM D, YYYY, h:mm A"),

        status: event.eventStatus,
        eventsoldtickets: eventsoldtickets[i],
        RemainingTickets: remainingTickets,
      };
      records.push(record);
    }

    csvWriter.writeRecords(records).then(() => {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=event_sales.csv"
      );
      res.download("event_sales.csv");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching event sales data",
    });
  }
}

async function listAttendee(eventID) {
  /*try {
		console.log(`this is eventID inside listattendee ${eventID} `);
		const event = await eventModel
			.findById(eventID)
			.populate("soldTickets.userId");
		if (!event) {
			throw new Error(`Event with ID ${eventID} not found`);
		}
		//const attendeeList = event.soldTickets.map((ticket) => ticket.userId);
		console.log(`im inside list function${event.soldTickets.userId}`);
		return { attendees: attendeeList };
	} catch (error) {
		console.error(error);
		return { error: error.message }; 
	}*/

  /*try {
		const event = await eventModel
			.findById(eventID)
			.populate("soldTickets.userId");
		if (!event) {
			throw new Error("Event not found");
		}

		const attendees = event.soldTickets.map((ticket) => ticket.userId);
		return attendees;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to list attendees");
	}*/
  try {
    const event = await eventModel
      .findById(eventID)
      .populate("soldTickets.userId");
    if (!event) {
      throw new Error("Event not found");
    }
    const attendeeIds = event.soldTickets.map((ticket) => ticket.userId);
    return attendeeIds;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function exportAttendeeSummary(req, res) {
  try {
    const lis = await listAttendee(req.params.eventID);
    console.log(lis);
    const event = await eventModel.findById(req.params.eventID);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    const soldTickets = event.soldTickets;

    const attendeeSummary = [];

    for (let i = 0; i < soldTickets.length; i++) {
      const ticket = await ticketModel.findById(soldTickets[i].ticketId);
      if (!ticket) {
        return res.status(404).send("ticket not found");
      }
      console.log(`ticket is ${ticket}`);
      console.log(`sold tickets ${soldTickets}`);
      console.log(`im checking user findbyid ${soldTickets[i].userId}`);
      const user = await userModel2.findById(soldTickets[i].userId);
      const user2 = await userModel2.findById(ticket.buyerId);
      if (!user || !user2) {
        return res.status(404).send("user not found");
      }

      console.log(`user is ${user}`);
      const attendeeInfo = {
        OrderId: soldTickets[i].orderId,
        OrderDate: moment(ticket.createdAt).format("M/D/YY h:mm A"),
        Attending: "Attending",
        "Attendee Name": user.firstName + " " + user.lastName,
        "attendee email": user.email,
        "Event name": event.basicInfo.eventName,
        "Ticket Quantity": 1,
        "Ticket Type": ticket.tierName,
        "Ticket Price": ticket.purchasePrice,
        "Buyer name": user2.firstName + " " + user.lastName,
        "Buyer email": user2.email,
      };
      attendeeSummary.push(attendeeInfo);
    }

    const csvWriter = createCsvWriter({
      path: "attendee_summary.csv",
      header: [
        { id: "OrderId", title: "OrderId" },
        { id: "OrderDate", title: "Order Date" },
        { id: "Attending", title: "Attending Status" },
        { id: "Attendee Name", title: "Name" },
        { id: "attendee email", title: "Email" },
        { id: "Event name", title: "Event name" },
        { id: "Ticket Quantity", title: "Ticket Quantity" },
        { id: "Ticket Type", title: "Ticket Type" },
        { id: "Ticket Price", title: "Ticket Price" },
        { id: "Buyer name", title: "Buyer Name" },
        { id: "Buyer email", title: "Buyer Email" },
      ],
    });

    await csvWriter.writeRecords(attendeeSummary);

    res.download("attendee_summary.csv", () => {
      console.log("CSV file downloaded successfully");
    });

    //console.log(`attendeeList ${attendeeList}`);
    /*res.status(200).json({
		success: true,
		message: "Event sold tickets as a percentage of the capacity ",
		attendeeList,
	});*/

    /*const attendeeList = {
			attendees: [
				null,
				{
					_id: "643a56706f55e9085d193f48",
					firstName: "Zeekoo",
					lastName: "john",
					email: "mercol58@ymail.com",
					emailConfirmation: "mercol58@ymail.com",
					password:
						"$2b$10$oMOnfihZfhugnJtrEdeZ7uCZtZVS947yS8hq3GfjAJbKJVqk5QF1q",
					isVerified: true,
					userType: "normal",
					__v: 0,
				},
				{
					_id: "643a56706f55e9085d193f48",
					firstName: "omar",
					lastName: "magdy",
					email: "omar@ymail.com",
					emailConfirmation: "omar@ymail.com",
					password:
						"$2b$10$oMOnfihZfhugnJtrEdeZ7uCZtZVS947yS8hq3GfjAJbKJVqk5QF1q",
					isVerified: true,
					userType: "normal",
					__v: 0,
				},
			],
		}; */
    /*const csvWriter = createCsvWriter({
			path: "attendee-summary.csv",
			header: [
				{ id: "firstName", title: "First Name" },
				{ id: "lastName", title: "Last Name" },
				{ id: "email", title: "Email" },
				{ id: "userType", title: "User Type" },
				{ id: "OrderID", title: "Order ID" },
			],
		});
		await csvWriter.writeRecords(attendeeList.attendees.slice(1));
		res.setHeader("Content-Type", "text/csv");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=attendee-summary.csv"
		);
		res.download("attendee-summary.csv"); */
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

async function eventSales(req, res) {
  const event = await eventModel.findById(req.params.eventID);
  console.log("Event to be used is:", event);
  const allTiers = req.query.allTiers;
  console.log("all tiers:", allTiers);
  const desiredTierName = req.query.tierName;
  console.log("desired tier name:", desiredTierName);
  totalSales = 0;
  salesByTierType = 0;

  for (let i = 0; i < event.ticketTiers.length; i++) {
    const tierObject = event.ticketTiers[i];
    const tierName = tierObject.tierName;
    console.log(`Tier ${i + 1}: ${tierName}`);
    const tierQuantitySold = tierObject.quantitySold;
    tierPrice = tierObject.price;
    if (tierPrice == "Free") {
      tierPrice = 0;
    }
    console.log(" tier qs:", tierQuantitySold);
    console.log(" tier price:", tierPrice);

    if (allTiers === "true") {
      if (tierName === "free") {
        totalSales = totalSales + 0;
      } else {
        totalSales = totalSales + tierQuantitySold * tierPrice;
        totalSales = Math.round(totalSales);
        console.log(" event sales:", totalSales);
      }
    } else if (allTiers === "false") {
      console.log("inside false");
      if (desiredTierName === "Free") {
        res.status(404).json({
          success: false,
          message: "There are no event sales for free ticket tiers ",
        });
      } else if (tierName === desiredTierName) {
        console.log("inside desired");

        salesByTierType = salesByTierType + tierQuantitySold * tierPrice;
        salesByTierType = Math.round(salesByTierType);
        console.log("event quantity sold:", salesByTierType);
      }
    }
  }

  if (totalSales > 0) {
    res.status(200).json({
      success: true,
      message: "Total Event Sales:  ",
      totalSales,
    });
  } else {
    console.log("inside last salesByType");

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

  totSales = 0;
  totalMaxCapacity = 0;
  soldTickets = 0;

  for (let i = 0; i < event.ticketTiers.length; i++) {
    const tierObject = event.ticketTiers[i];
    const tierName = tierObject.tierName;
    console.log(`Tier ${i + 1}: ${tierName}`);
    const maxCapacity = tierObject.maxCapacity;
    console.log(" max Capacity:", maxCapacity);
    if (tierName == "Free") {
      totSales = totSales + 0;
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
      totSales = totSales + tierQuantitySold * tierPrice;
      console.log(" event quantity sold:", totSales);
    }
  }

  // 	}
  totSales = Math.round(totSales);
  totalMaxCapacity = Math.round(totalMaxCapacity);
  soldTickets = Math.round(soldTickets);
  console.log(" event quantity sold:", totSales);
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
  exportAttendeeSummary,
  exportsListEvents,
};
