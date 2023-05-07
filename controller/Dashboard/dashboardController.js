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
const bcrypt = require("bcrypt");

// to be modified

async function exportsListEvents(req, res) {
	const instance = axios.create({
		baseURL: process.env.BASE_URL,
		timeout: 1000,
	});
	const filtering = req.query.filterBy;
	const url =
		process.env.BASE_URL +
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
			path: "eventS.csv",
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

/**

Retrieves a list of attendee IDs for the specified event.
@async
@function listAttendee
@param {string} eventID - The ID of the event for which to retrieve the attendee list.
@throws {Error} Throws an error if the specified event cannot be found.
@returns {array}  an array of attendee IDs for the specified event.
*/
async function listAttendee(eventID) {
	try {
		// Retrieve the event by its ID and populate the soldtickets array with the corresponding user ID
		const event = await eventModel
			.findById(eventID)
			.populate("soldTickets.userId");
		//Check if event is not found
		if (!event) {
			throw new Error("Event not found");
		}
		// Map the attendee IDs from the soldTickets array
		const attendeeIds = event.soldTickets.map((ticket) => ticket.userId);
		return attendeeIds;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
/**

Generates a CSV file with summary information about attendees for a given event,
including the attendee's name, email, ticket type and price, order ID and date, and buyer name and email.
@async
@function AttendeeSumJason
@param {object} req - Express request object containing event ID parameter.
@param {object} res - Express response object.
@returns {object} - Returns an object with an error message if there is an error, otherwise undefined.
*/
async function AttendeeSumJason(req, res) {
	try {
		//ListAttendee returns Attendee for certain event
		const lis = await listAttendee(req.params.eventID);
		//console.log(lis);
		//search for event
		const event = await eventModel.findById(req.params.eventID);
		if (!event) {
			return res.status(404).send("Event not found");
		}
		//Retrieve soldTicket attribute of event
		const soldTickets = event.soldTickets;
		//empty array for grouping
		const groupedTickets = {};
		//loop on each sold ticket in event array
		for (let i = 0; i < soldTickets.length; i++) {
			const ticket = await ticketModel.findById(soldTickets[i].ticketId);
			if (!ticket) {
				return res.status(404).send("ticket not found");
			}
			//console.log(`ticket is ${ticket}`);
			//console.log(`sold tickets ${soldTickets}`);
			//console.log(`im checking user findbyid ${soldTickets[i].userId}`);
			const user = await userModel2.findById(soldTickets[i].userId);
			const user2 = await userModel2.findById(ticket.buyerId);
			if (!user || !user2) {
				return res.status(404).send("user not found");
			}

			console.log(`user is ${user}`);
			//populate csv Fields data
			const attendeeInfo = {
				OrderId: soldTickets[i].orderId,
				OrderDate: moment(ticket.createdAt).format("M/D/YY h:mm A"),
				Attending: "Attending",
				"Attendee Name": user.firstName + " " + user.lastName,
				"attendee email": user.email,
				"Event name": event.basicInfo.eventName,
				"Ticket Type": ticket.tierName,
				"Ticket Price": ticket.purchasePrice,
				"Buyer name": user2.firstName + " " + user.lastName,
				"Buyer email": user2.email,
			};
			//add quantity for same ticket type in same OrderID
			const key = `${attendeeInfo.OrderId}_${attendeeInfo["Ticket Type"]}`;
			if (key in groupedTickets) {
				groupedTickets[key]["Ticket Quantity"] += 1;
			} else {
				attendeeInfo["Ticket Quantity"] = 1;
				groupedTickets[key] = attendeeInfo;
			}
		}
		//assign to attendee summary

		const attendeeSummary = Object.values(groupedTickets);
		return res.status(200).json({
			success: true,
			message: "Summary jason return successfully",
			attendeeSummary: attendeeSummary,
		});
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}

async function exportAttendeeSummary(req, res) {
	try {
		//ListAttendee returns Attendee for certain event
		const lis = await listAttendee(req.params.eventID);
		//console.log(lis);
		//search for event
		const event = await eventModel.findById(req.params.eventID);
		if (!event) {
			return res.status(404).send("Event not found");
		}
		//Retrieve soldTicket attribute of event
		const soldTickets = event.soldTickets;
		//empty array for grouping
		const groupedTickets = {};
		//loop on each sold ticket in event array
		for (let i = 0; i < soldTickets.length; i++) {
			const ticket = await ticketModel.findById(soldTickets[i].ticketId);
			if (!ticket) {
				return res.status(404).send("ticket not found");
			}
			//console.log(`ticket is ${ticket}`);
			//console.log(`sold tickets ${soldTickets}`);
			//console.log(`im checking user findbyid ${soldTickets[i].userId}`);
			const user = await userModel2.findById(soldTickets[i].userId);
			const user2 = await userModel2.findById(ticket.buyerId);
			if (!user || !user2) {
				return res.status(404).send("user not found");
			}

			console.log(`user is ${user}`);
			//populate csv Fields data
			const attendeeInfo = {
				OrderId: soldTickets[i].orderId,
				OrderDate: moment(ticket.createdAt).format("M/D/YY h:mm A"),
				Attending: "Attending",
				"Attendee Name": user.firstName + " " + user.lastName,
				"attendee email": user.email,
				"Event name": event.basicInfo.eventName,
				"Ticket Type": ticket.tierName,
				"Ticket Price": ticket.purchasePrice,
				"Buyer name": user2.firstName + " " + user.lastName,
				"Buyer email": user2.email,
			};
			//add quantity for same ticket type in same OrderID
			const key = `${attendeeInfo.OrderId}_${attendeeInfo["Ticket Type"]}`;
			if (key in groupedTickets) {
				groupedTickets[key]["Ticket Quantity"] += 1;
			} else {
				attendeeInfo["Ticket Quantity"] = 1;
				groupedTickets[key] = attendeeInfo;
			}
		}
		//assign to attendee summary

		const attendeeSummary = Object.values(groupedTickets);
		//set csv ids for each csv header
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
		//write to csv
		await csvWriter.writeRecords(attendeeSummary);
		//download
		res.download("attendee_summary.csv", () => {
			console.log("CSV file downloaded successfully");
		});
		/*return res.status(200).json({
			success: true,
			message: "Attendee summary is success Exported ",
		});*/
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}

/**
Export event sales to a CSV file and download it
@async
@function exportEventSales
@param {Object} req - The request object containing parameters and queries
@param {Object} res - The response object to send the CSV file for download
@param {string} req.params.eventID - The ID of the event to export sales data for
@param {Boolean} req.query.allTiers - A flag to indicate whether to include sales data for all ticket tiers or not
@param {string} req.query.tierName - The name of a specific ticket tier to include sales data for
@throws {Error} If an error occurs while fetching event sales data
*/
async function exportEventSales(req, res) {
	//configure axios
	const instance = axios.create({
		baseURL: process.env.BASE_URL,
		timeout: 1000,
	});
	//read params and queries
	const eventID = req.params.eventID;
	const allTiers = req.query.allTiers;
	const tierName = req.query.tierName;
	//prepare the Url of axios to call
	const url =
		process.env.BASE_URL +
		`/dashboard/eventsales/events/${eventID}?allTiers=${allTiers}&tierName=${tierName}`;
	// replace with the actual event ID
	try {
		//axios call
		const response = await instance.get(url);
		console.log(response.data);
		//write to csv
		const csvWriter = createCsvWriter({
			path: "event_sales.csv",
			header: [
				//Headers
				{ id: "eventID", title: "Event ID" },
				//Data
				{ id: "eventSales", title: "Event Sales" },
			],
		});

		//Group the response
		const eventSales =
			response.data.totalSales || response.data.salesByTierType;
		const eventID = req.params.eventID;

		// create the csv record
		const records = [{ eventID, eventSales }];

		//Set Headers and download the csv
		csvWriter.writeRecords(records).then(() => {
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				"attachment; filename=event_sales.csv"
			);
			res.download("event_sales.csv");
		});
		//Handling Error
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Error occurred while fetching event sales data",
		});
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
			if (tierName === "Free") {
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
	const allTiers = req.query.allTiers;
	console.log("all tiers:", allTiers);
	const desiredTierName = req.query.tierName;
	console.log("desired tier name:", desiredTierName);

	totSales = 0;
	salesByTierType=0
	totalMaxCapacity = 0;
	soldTickets = 0;
	soldTicketsByTierType=0

	for (let i = 0; i < event.ticketTiers.length; i++) {
		const tierObject = event.ticketTiers[i];
		const tierName = tierObject.tierName;
		const tierPrice = tierObject.price;
		console.log(`Tier ${i + 1}: ${tierName}`);
		maxCapacity = tierObject.maxCapacity;
		const tierQuantitySold = tierObject.quantitySold;
		console.log(" max Capacity:", maxCapacity);
		if (allTiers==="true")
		{
		if (tierPrice === "Free") {
			totSales = totSales + 0;
			totalMaxCapacity = totalMaxCapacity + maxCapacity;
			console.log(" tier qs:", tierQuantitySold);
			soldTickets = soldTickets + tierQuantitySold;
		} else {
			soldTickets = soldTickets + tierQuantitySold;
			totalMaxCapacity = totalMaxCapacity + maxCapacity;
			console.log(" tier qs:", tierQuantitySold);
			console.log(" tier price:", tierPrice);
			totSales = totSales + tierQuantitySold * tierPrice;
			console.log(" event quantity sold:", totSales);
		}
	}
	else if(allTiers==="false"){

        if (tierName === desiredTierName) {
			console.log("inside desired");

            capacityOfDesiredTier=maxCapacity
			soldTicketsByTierType = soldTicketsByTierType + tierQuantitySold 
			soldTicketsByTierType = Math.round(soldTicketsByTierType);
			perSoldTicketsByTierType=(soldTicketsByTierType/capacityOfDesiredTier)*100
			perSoldTicketsByTierType=Math.round(perSoldTicketsByTierType)
			console.log("event quantity sold:", soldTicketsByTierType);
		}

	}
	}
	// 	}
	totSales = Math.round(totSales);
	totalMaxCapacity = Math.round(totalMaxCapacity);



	if (soldTickets>0) {

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
		soldTickets,
		totalMaxCapacity,
		soldTicketsFromCapacity,
	});

	}

    if(soldTicketsByTierType>0){
     
		res.status(200).json({
			success: true,
			message: "Event sold tickets by tier as a percentage of the capacity ",
			soldTicketsByTierType,
			capacityOfDesiredTier,
			perSoldTicketsByTierType,
		});


	}


	
}

module.exports = {
	eventSales,
	eventSoldTickets,
	exportAttendeeSummary,
	exportsListEvents,
	exportEventSales,
	AttendeeSumJason,
};
