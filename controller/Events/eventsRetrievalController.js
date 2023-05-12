const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");

const {
	GenerateToken,
	retrieveToken,
	verifyToken,
	authorized,
} = require("../../utils/Tokens");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const moment = require("moment");
const { exportToCsv } = require("../../utils/exports");

/**
 * List events filtered by creator id and optionally by status (upcoming, past, or draft)
 *
 * @async
 * @function listEvents
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {Object} - The HTTP response with an array of events, as well as additional data for each event
 * @throws {Object} - The HTTP response with an error message if an error occurs
 *
 *
 */
async function listEvents(req, res) {
	try {
		console.log("Gonna list events by creator");

		// get filterBy parameter from query string
		const filterBy = req.query.filterBy;

		// verify user authorization with a helper function
		const user = await authorized(req);
		// if user is not authorized, return an error response
		if (user.authorized === false) {
			return res
				.status(404)
				.json({ success: false, message: "user not Autherized" });
		}

		//Filter events by creator ID and additional filters based on the 'filterBy' parameter
		const events = await filterCreatorEvents(user, filterBy);

		// If no events were found, return an error response
		if (!events) {
			return res
				.status(404)
				.json({ success: false, message: "No events Found" });
		}

		// If there are no events, return an empty response with only the keys defined below
		if (events.length === 0) {
			return res.status(200).json({
				success: true,
				filteredEvents: [],
				eventsoldtickets: [],
				isEventOnSale: [],
				gross: [],
				maxCapacity: [],
			});
		}

		// Extract only the desired properties from each event and return them in a new array
		const filteredEvents = await removeExtraAttributes(events);

		// add event Id to the filtered Events
		filteredEvents.forEach((event, index) => {
			event["eventId"] = events[index]._id;
		});

		//Computes selling information for an array of events
		const { eventsoldtickets, isEventOnSale, gross, maxCapacity } =
			await computeEventsSellingInformation(events);

		console.log("events by creator listed successfully");
		//return filtered events and corresponding arrays
		return res.status(200).json({
			success: true,
			filteredEvents,
			eventsoldtickets,
			isEventOnSale,
			gross,
			maxCapacity,
		});
	} catch (error) {
		return res.status(404).json({
			success: false,
			message: error.message,
		});
	}
}

/**

Filter events by creator ID and additional filters based on the 'filterBy' parameter
@async
@function filterCreatorEvents
@param {Object} user - The authenticated user object
@param {String} filterBy - The filter parameter to apply to the events query (upcomingevents, pastevents, draft)
@returns {Array<Object>} - An array of event objects filtered by creator ID and the 'filterBy' parameter
*/
async function filterCreatorEvents(user, filterBy) {
	//get the ID of the authorized user
	const creatorId = user.user_id.toString();

	//create an empty query object
	const query = {};

	//filter events by creator id
	query["creatorId"] = creatorId;

	//get time now UTC
	const utcDate = await getTimeNowUTC();

	// Apply additional filters based on the 'filterBy' parameter in the query string
	if (filterBy) {
		if (filterBy === "upcomingevents") {
			// Retrieve only published events that have a start date/time after the current date/time
			query["published"] = true;

			query["basicInfo.startDateTime"] = {
				$gte: utcDate,
			};
		} else if (filterBy === "pastevents") {
			// Retrieve only published events that have a start date/time before the current date/time
			query["published"] = true;

			query["basicInfo.startDateTime"] = {
				$lte: utcDate,
			};
		} else if (filterBy === "draft") {
			// Retrieve only unpublished events
			query["published"] = false;
		}
	}

	//filter events by query object
	const events = await eventModel.find(query);
	console.log(`events filtered by ${filterBy}`);

	return events;
}

/**

Get the current UTC time
@async
@function getTimeNowUTC
@returns {Object} - The current UTC date/time

*/
async function getTimeNowUTC() {
	// Get the current date/time
	const currentDate = new Date();

	// Get the time zone offset in minutes
	const timezoneOffset = currentDate.getTimezoneOffset();

	//convert date to UTC to compare with DB
	const utcDate = new Date(currentDate.getTime() - timezoneOffset * 60 * 1000);
	return utcDate;
}

/**

Remove extra attributes from an array of event objects.
@async
@function removeExtraAttributes
@param {Array<Object>} events - An array of event objects to be filtered.
@returns {Array<Object>} - An array of event objects with only the desired properties.
*/

async function removeExtraAttributes(events) {
	// Extract only the desired properties from each event and return them in a new array
	var filteredEvents = events.map((eventModel) => {
		const {
			_id,
			createdAt,
			updatedAt,
			__v,
			privatePassword,
			isVerified,
			promocodes,
			startSelling,
			endSelling,
			publicDate,
			emailMessage,
			soldTickets,
			ticketTiers,
			summary,
			description,
			isPublic,
			published,
			creatorId,
			...filtered
		} = eventModel._doc;
		return filtered;
	});
	return filteredEvents;
}

/** Computes selling information for an array of events, including total sold tickets, whether the event is currently on sale,
the gross revenue for the event, and the maximum capacity of the event
@async
@function computeEventsSellingInformation
@param {Array} events - An array of events
@returns {Object} - An object containing arrays of selling information for each event in the input array , like this: eventsoldtickets, isEventOnSale, gross, maxCapacity
@throws {Error} - If an error occurs while retrieving information or performing calculations
*/

async function computeEventsSellingInformation(events) {
	// Create empty arrays to hold data for each event
	const eventsoldtickets = [];
	const isEventOnSale = [];
	const gross = [];
	const maxCapacity = [];

	//get UTC time now
	const utcDate = await getTimeNowUTC();

	//loop over to compute total sold tickets for each event
	events.map((event) => {
		//loop over ticketTiers array
		// if (!event.ticketTiers || event.ticketTiers.length === 0) {
		//   throw new Error("TicketTiers are not found");
		// }
		// get the number of sold tickets for the current event
		const soldTicketsCounts = event.soldTickets.length;
		//push into eventsoldtickets array
		eventsoldtickets.push(soldTicketsCounts);

		var totalEventCapacity = 0;
		var isSellingValidCounter = 0;
		var eventGross = 0;

		//loop over event ticket tiers
		for (let i = 0; i < event.ticketTiers.length; i++) {
			const tier = event.ticketTiers[i];

			if (tier.maxCapacity) {
				//compute total event capacity
				totalEventCapacity = totalEventCapacity + tier.maxCapacity;
			}

			//check if event selling period is still valid
			if (tier.startSelling && tier.endSelling) {
				if (
					utcDate.getTime() >= tier.startSelling.getTime() &&
					utcDate.getTime() <= tier.endSelling.getTime()
				) {
					isSellingValidCounter = isSellingValidCounter + 1;
				}
			}

			//compute each event gross
			if (tier.quantitySold && tier.price) {
				if (tier.price !== "Free") {
					tierPrice = tier.price;
					// Remove non-numeric characters from price string
					tierPrice = tierPrice.replace(/[^0-9.-]+/g, "");
					// Convert string to number
					tierPrice = parseFloat(tierPrice);

					eventGross = eventGross + tier.quantitySold * tierPrice;
				}
			}
		}

		//if all tickets are sold or outside the selling period time.
		if (
			totalEventCapacity === soldTicketsCounts ||
			isSellingValidCounter === 0
		) {
			isEventOnSale.push(false);
		} else {
			isEventOnSale.push(true);
		}

		//push total events gross into gross array
		gross.push(eventGross);

		//push max event capcity into maxCapacity array
		maxCapacity.push(totalEventCapacity);
	});

	return { eventsoldtickets, isEventOnSale, gross, maxCapacity };
}

/**

Exports a list of events with sales data to a CSV file.

@async

@function exportsListEvents

@param {Object} req - Express request object.

@param {Object} res - Express response object.

@returns {Object} - Returns an object with a success message or an error message if an error occurred.
*/
async function exportsListEvents(req, res) {
	const instance = axios.create({
		baseURL: process.env.BASE_URL,
		timeout: 1000,
	});
	const filtering = req.query.filterBy;
	const url =
		process.env.BASE_URL +
		`/event-management/listEvents/?filterBy=${filtering}`;
	try {
		// Get event data from the API endpoint
		const response = await instance.get(url, {
			headers: {
				Authorization: `Bearer ${req.headers.authorization.split(" ")[1]}`,
			},
		});
		// Extract relevant data from the response
		const filteredEvents = response.data.filteredEvents;
		const eventsoldtickets = response.data.eventsoldtickets;
		// Define CSV headers and file path
		const csvHeaders = [
			{ id: "eventName", title: "EventName" },
			{ id: "startDateTime", title: "Date" },
			{ id: "status", title: "Status" },
			{ id: "eventsoldtickets", title: "eventsoldtickets" },
			{ id: "RemainingTickets", title: "Tickets Available" },
		];
		const csvFilePath = "listEvents.csv";
		// Extract and format data for each event
		const records = [];
		for (let i = 0; i < filteredEvents.length; i++) {
			const event = filteredEvents[i];
			const remainingTickets =
				eventsoldtickets[i] > response.data.maxCapacity[i]
					? 0
					: response.data.maxCapacity[i] - eventsoldtickets[i];
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
		// Export data to CSV file
		await exportToCsv(records, csvFilePath, csvHeaders);
		// Set headers for CSV download and send file to client
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=listEvents.csv");
		res.download(csvFilePath);
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Error occurred while fetching event sales data",
		});
	}
}

module.exports = {
	listEvents,
	computeEventsSellingInformation,
	getTimeNowUTC,
	filterCreatorEvents,
	removeExtraAttributes,
	exportsListEvents,
};
