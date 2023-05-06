const { response } = require("express");
const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const listEvents = require("../Events/eventsRetrievalController");
const axios = require("axios");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const moment = require("moment");

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

				status: event.isOnline ? "Online" : "Offline",
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
	try {
		console.log(`this is eventID inside listattendee ${eventID} `);
		const event = await eventModel
			.findById(eventID)
			.populate("soldTickets.userId");
		if (!event) {
			throw new Error(`Event with ID ${eventID} not found`);
		}
		const attendeeList = event.soldTickets.map((ticket) => ticket.userId);
		return { attendees: attendeeList };
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}

async function exportAttendeeSummary(req, res) {
	try {
		const attendeeList = await listAttendee(req.params.eventID);
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
		const csvWriter = createCsvWriter({
			path: "attendee-summary.csv",
			header: [
				{ id: "firstName", title: "First Name" },
				{ id: "lastName", title: "Last Name" },
				{ id: "email", title: "Email" },
				{ id: "userType", title: "User Type" },
			],
		});
		await csvWriter.writeRecords(attendeeList.attendees.slice(1));
		res.setHeader("Content-Type", "text/csv");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=attendee-summary.csv"
		);
		res.download("attendee-summary.csv");
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
