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
const { exportToCsv } = require("../../utils/exports");

// to be modified
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
			//check ticket is found
			if (!ticket) {
				return res.status(404).send("ticket not found");
			}
			//retrieve usermodel of user and buyer
			const user = await userModel2.findById(soldTickets[i].userId);
			const buyer = await userModel2.findById(ticket.buyerId);
			if (!user || !buyer) {
				return res.status(404).send("user not found");
			}

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
				"Buyer name": buyer.firstName + " " + user.lastName,
				"Buyer email": buyer.email,
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

async function getAttendeeSummary(eventID) {
	try {
		const url =
			process.env.BASE_URL + `/dashboard/reportJason/attendees-list/${eventID}`;
		// Get event data from the API endpoint
		// Extract relevant data from the response
		const response = await axios.get(url);
		return response.data.attendeeSummary;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}

/**

Export attendee summary to CSV file and download it
@async
@function exportAttendeeSummary
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {string} req.params.eventID - ID of the event for which to export the attendee summary
@returns {Object} - Express response object containing CSV file with attendee summary
@throws {Error} If there is an error finding the event, ticket or user data, or exporting the CSV file
*/
async function exportAttendeeSummary(req, res) {
	try {
		const attendeeSummary = await getAttendeeSummary(req.params.eventID);

		const csvHeaders = [
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
		];
		await exportToCsv(attendeeSummary, "attendee_summary.csv", csvHeaders);
		//download
		res.download("attendee_summary.csv", () => {
			console.log("CSV file downloaded successfully");
		});
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
	// configure axios
	const instance = axios.create({
		baseURL: process.env.BASE_URL,
		timeout: 1000,
	});
	// read params and queries
	const eventID = req.params.eventID;
	const allTiers = req.query.allTiers;
	const tierName = req.query.tierName;
	// prepare the Url of axios to call
	const url =
		process.env.BASE_URL +
		`/dashboard/eventsales/events/${eventID}?allTiers=${allTiers}&tierName=${tierName}`;
	// replace with the actual event ID
	try {
		// axios call
		const response = await instance.get(url);
		console.log(response.data);
		// write to csv
		const csvHeaders = [
			// Headers
			{ id: "eventID", title: "Event ID" },
			// Data
			{ id: "eventSales", title: "Event Sales" },
		];
		const csvFilePath = "event_sales.csv";
		const data = [
			// create the csv record
			{
				eventID: req.params.eventID,
				eventSales: response.data.totalSales || response.data.salesByTierType,
			},
		];
		await exportToCsv(data, csvFilePath, csvHeaders);

		// download the csv
		res.setHeader("Content-Type", "text/csv");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=event_sales.csv"
		);
		res.download(csvFilePath, () => {
			console.log("CSV file downloaded successfully");
		});
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
	exportEventSales,
	AttendeeSumJason,
};
