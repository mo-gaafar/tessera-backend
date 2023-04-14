const eventModel = require("../../models/eventModel");
const {
	GenerateToken,
	retrieveToken,
	verifyToken,
} = require("../../utils/Tokens");
const jwt = require("jsonwebtoken");

/**
Asynchronous function that creates a new event based on the request body and adds the creatorId based on the token.
@async
@function createEvent
@param {Object} req - The HTTP request object.
@param {Object} req.body - The request body containing the event information.
@param {Object} res - The HTTP response object.
@returns {Object} The response object indicating whether the event was successfully created.
@throws {Object} An error message if there was an error creating the event.
*/
async function createEvent(req, res) {
	try {
		//const event = await eventModel.create(req.body); //await for Creating collection based of req body
		const token = await retrieveToken(req);
		const useridid = "64282ab3eb31d64f9152d48c";
		const tok = GenerateToken(useridid);
		console.log(tok);

		const decoded = await verifyToken(token);
		const event = await eventModel.create({
			...req.body,
			creatorId: decoded.user_id,
		});
		await event.save();

		return res.status(200).json({
			success: true,
			message: "Event has been created successfully",
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
}

/**

Retrieves an event from the database by its ID.
@async
@function
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {string} req.params.eventID - The ID of the event to retrieve.
@returns {Object} - The retrieved event object or an error message.
@throws {Error} - If an error occurs while retrieving the event.
*/
async function getEventById(req, res) {
	const eventId = req.params.eventID;
	const event = await eventModel.findById(eventId); //search event by id
	const token = await retrieveToken(req);
	const decoded = await verifyToken(token);
	if (event.creatorId.toString() !== decoded.user_id) {
		// check if the creator of the event matches the user making the delete request
		return res.status(401).json({
			success: false,
			message: "You are not authorized to retrieve this event",
		});
	}
	try {
		const event = await eventModel.findById(eventId); //returns event of given id
		if (!event) {
			return res.status(404).json({ message: "Event is not found" });
		}
		return res.status(200).json({ event });
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
}

/**

Deletes an event from the database by its ID.
@async
@function
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {string} req.params.eventID - The ID of the event to delete.
@returns {Object} - A success message if the event is deleted.
@throws {Error} - If an error occurs while deleting the event.
*/
async function deleteEvent(req, res) {
	const eventIdd = req.params.eventID;

	try {
		const event = await eventModel.findById(eventIdd); //search event by id
		const token = await retrieveToken(req);
		const decoded = await verifyToken(token);
		if (event.creatorId.toString() !== decoded.user_id) {
			// check if the creator of the event matches the user making the delete request
			return res.status(401).json({
				success: false,
				message: "You are not authorized to delete this event",
			});
		}

		if (!event) {
			return res.status(404).json({ message: "No event Found" });
		}

		await eventModel.findByIdAndDelete(eventIdd); // delete the found event

		return res
			.status(200)
			.json({ success: true, message: "the event is deleted" });
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
}

/**

Updates an event in the database by its ID.
@async
@function
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {string} req.params.eventID - The ID of the event to update.
@param {Object} req.body - The update object for the event.
@returns {Object} - The updated event object.
@throws {Error} - If an error occurs while updating the event.
*/
async function updateEvent(req, res) {
	try {
		const eventId = req.params.eventID; // get the event ID from the request URL
		const update = req.body; // get the update object from the request body
		const event = await eventModel.findById(eventId);
		const token = await retrieveToken(req);
		const decoded = await verifyToken(token);
		if (event.creatorId.toString() !== decoded.user_id) {
			// check if the creator of the event matches the user making the delete request
			return res.status(401).json({
				success: false,
				message: "You are not authorized to update this event",
			});
		}

		// update the document in the database using findOneAndUpdate
		const updatedEvent = await eventModel.findOneAndUpdate(
			{ _id: eventId },
			update,
			{ new: true, runValidators: true }
		);

		// check if the updatedEvent exists
		if (!updatedEvent) {
			return res.status(404).json({ error: "Event not found" });
		}

		// return the updated document
		return res
			.status(200)
			.json({ success: true, message: "the event is updated" });
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
}

async function publishEvent(req, res) {
	const event = await eventModel.findById(req.params.eventID);
	console.log("event is:", event);
}

module.exports = {
	createEvent,
	getEventById,
	deleteEvent,
	updateEvent,
	publishEvent,
};
