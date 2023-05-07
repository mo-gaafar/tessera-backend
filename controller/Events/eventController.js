const eventModel = require("../../models/eventModel");
const userModel = require("../Auth/userController");

const {
	GenerateToken,
	retrieveToken,
	verifyToken,
	authorized,
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
		//const useridid = "643a56706f55e9085d193f48";

		//const tok = GenerateToken(useridid);
		//console.log(tok);
		const userid = await authorized(req);
		//const token = await retrieveToken(req);
		//const decoded = await verifyToken(token);

		const event = await eventModel.create({
			...req.body,
			creatorId: userid.user_id,
		});
		//const eventCreated= getEventById(event._id);
		await eventModel.updateOne(
			{ _id: event._id },
			{
				$set: { eventUrl: `https://www.tessera.social/api/event/${event._id}` },
			}
		);
		if (userid.authorized) {
			return res.status(200).json({
				success: true,
				message: "Event has been created successfully",
			});
		} else {
			return res.status(401).json({
				success: false,
				message: "the user doesnt have access",
			});
		}
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
	try {
		const eventId = req.params.eventID;
		const event = await eventModel.findById(eventId); //search event by id
		//check if no events
		if (!event) {
			return res.status(404).json({ message: "No event Found" });
		}
		//authorize that user exists
		const userid = await authorized(req);

		if (event.creatorId.toString() !== userid.user_id.toString()) {
			// check if the creator of the event matches the user making the delete request
			return res.status(401).json({
				success: false,
				message: "You are not authorized to retrieve this event",
			});
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
	try {
		const eventIdd = req.params.eventID;
		const event = await eventModel.findById(eventIdd); //search event by id
		const userid = await authorized(req);

		if (!event) {
			return res.status(404).json({ message: "No event Found" });
		}
		//check if user exists
		if (!userid.authorized) {
			res.status(402).json({
				success: false,
				message: "the user is not found",
			});
		}

		if (event.creatorId.toString() !== userid.user_id.toString()) {
			// check if the creator of the event matches the user making the delete request
			return res.status(401).json({
				success: false,
				message: "You are not authorized to delete this event",
			});
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
		const userid = await authorized(req);

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}
		// check if the updatedEvent exists
		if (event.creatorId.toString() !== userid.user_id.toString()) {
			// check if the creator of the event matches the user making the delete request
			return res.status(401).json({
				success: false,
				message: "You are not authorized to update this event",
			});
		}
		// search event by id and update using request body
		await eventModel.findOneAndUpdate({ _id: eventId }, update, {
			new: true,
			runValidators: true,
		});
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

// const token= GenerateToken("6418b9920a40ca7bd287fcd4")
// console.log("token is:",token)

async function publishEvent(req, res) {
	const isPublic = req.body.isPublic;
	const publishNow = req.body.publishNow;
	console.log("public:", isPublic);
	console.log("public:", publishNow);

	const token = await retrieveToken(req); //getting the token of the event publisher
	console.log("token is:", token);

	const decodedToken = verifyToken(token); //decoding the token

	decodedToken.then((resolvedValue) => {
		publisherID = resolvedValue.user_id;
		console.log("publisher ID:", publisherID); // getting ID of event publisher
	});

	const event = await eventModel.findById(req.params.eventID); //getting event by its ID
	// event not found
	if (!event) {
		return res.status(404).json({
			success: false,
			message: "No event Found",
		});
	}

	console.log("creator ID:", event.creatorId);

	// checking if creator of the event is the one who publishes it
	if (event.creatorId == publisherID) {
		console.log(
			"creator of the event is the one who publishes it:",
			event.creatorId
		);
	} else {
		console.log("Can't publish the event as publisher is not the creator");

		res.status(201).json({
			success: false,
			message:
				"Can't publish the event as creator and publisher are not the same",
		});
	}

	console.log("user authorized");

	// event is public
	if (isPublic) {
		if (publishNow) {
			const currentDate = new Date();
			console.log("Date is:", currentDate);

			// setting the event with the publish date
			const update = { publicDate: new Date(currentDate) };
			const updatedEvent = await eventModel.findOneAndUpdate(
				{ _id: req.params.eventID },
				update,
				{
					new: true,
					runValidators: true,
				}
			);

			console.log("updated event is:", updatedEvent);
			const publicDateSet = await event.publicDate;
			console.log("public Date Set:", publicDateSet);

			const eventPublicDate = publicDateSet.toISOString().substring(0, 10);
			console.log("public Date Only Set:", eventPublicDate);
			const hours = publicDateSet.getHours();
			const minutes = publicDateSet.getMinutes();
			const seconds = publicDateSet.getSeconds();

			// getting time
			let amOrPm;
			if (hours >= 12) {
				amOrPm = "PM";
			} else {
				amOrPm = "AM";
			}
			const hoursTwelveHourFormat = hours % 12 || 12;
			const eventPublicTime = `${
				hoursTwelveHourFormat < 10 ? "0" : ""
			}${hoursTwelveHourFormat}:${minutes < 10 ? "0" : ""}${minutes}:${
				seconds < 10 ? "0" : ""
			}${seconds} ${amOrPm}`;
			console.log("event public time:", eventPublicTime);
		}
	}

	// isPublished=event.published // getiing whether the event is already published
	// url=event.eventUrl // getiing event URL
	// password=event.privatePassword // getting password for event
	// console.log("published:", isPublished);

	// // if event is not published
	// if (!isPublished){
	// // update the published attribute to be true to publish the event
	// const update = { published:true };
	// const updatedEvent= await eventModel.findOneAndUpdate({ _id: req.params.eventID }, update , {
	// 	new: true,
	// 	runValidators: true,
	// });
	// console.log('Updated event:', updatedEvent);
	// }
	// // if event is already published
	// else{
	// console.log("event is already published")
	// }

	// public=event.isPublic // getiing whether the event is public or private
	// console.log("public:", public);

	// // if event is private
	// if (!public){
	// const accessMethod=req.query.AccessMethod 	// getting access method for the event
	// console.log('Access Method:', accessMethod);

	// // if event is accessed by password
	// if (accessMethod === 'password') {
	// 		res.status(200).json({
	// 		success: true,
	// 		message: "Event is accessed by this password",
	// 		password
	//        });
	// }

	// // if event is accessed by link
	// else if (accessMethod === 'link') {
	// 	res.status(200).json({
	// 		success: true,
	// 		message: "Event is accessed by this Private Link",
	// 		url
	//        });
	// }
	// else {
	//     res.status(400).json({
	// 		success: false,
	// 		message: "Invalid Access Method",
	//        });
	// }
	// }

	// // event is public
	// else{

	// 	res.status(200).json({
	// 		success: true,
	// 		message: "Event is publicly accessed by this Link",
	// 		url
	//        });

	// }
}

//list events

module.exports = {
	createEvent,
	getEventById,
	deleteEvent,
	updateEvent,
	publishEvent,
};
