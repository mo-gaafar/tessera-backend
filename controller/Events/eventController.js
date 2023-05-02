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
		//const useridid = "643c89200765c86f18483a0c";
		//const tok = GenerateToken(useridid);
		//console.log(tok);
		//const token = await retrieveToken(req);
		//const decoded = await verifyToken(token);
		const userid = await authorized(req);

		const event = await eventModel.create({
			...req.body,
			creatorId: userid.user_id,
		});
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
		//const token = await retrieveToken(req);
		//const decoded = await verifyToken(token);
		if (!event) {
			return res.status(404).json({ message: "No event Found" });
		}

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
		//const token = await retrieveToken(req);
		//const decoded = await verifyToken(token);

		if (!event) {
			return res.status(404).json({ message: "No event Found" });
		}

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


// const token= GenerateToken("6417b9099e62572b43c9267e")
// console.log("token is:",token)

async function publishEvent(req, res) {
    
    const isPublic  = req.body.isPublic;
	const publishNow  = req.body.publishNow;
	const publicDate  = req.body.publicDate;
	const privateToPublicDate  = req.body.publicDate;
	const hasLink  = req.body.link;
	const hasPassword  = req.body.password;
	const alwaysPrivate  = req.body.alwaysPrivate;




    console.log("public:",isPublic)
	console.log("publish now:",publishNow)
	console.log("public date",publicDate)
	console.log("link:",hasLink)
	console.log("password:",hasPassword)
    




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
				success:false,
				message: "No event Found", });
		} 

	console.log("creator ID:", event.creatorId);
	const url=await event.eventUrl
	password=event.privatePassword // getting password for event
	const isPublished=await event.published


    // checking if creator of the event is the one who publishes it
    if (event.creatorId == publisherID) {
      console.log(
        "creator of the event is the one who publishes it:",
        event.creatorId
      );
      
	  }


	  else {
		console.log("Can't publish the event as publisher is not the creator");
  
		res.status(201).json({
		  success: false,
		  message:
			"Can't publish the event as creator and publisher are not the same",
		});
	  }
   


	console.log("user authorized")

	// event is public
    if (isPublic){
     
    //   if (publishNow){

    //  const currentDate=new Date()
	//  console.log("Date is:",currentDate)

	//  setting the event with the publish date
     const update = { publicDate: new Date(publicDate) , isPublic:true };
     const updatedEvent= await eventModel.findOneAndUpdate({ _id: req.params.eventID }, update , {
		new: true,
		runValidators: true,
	});
    
	console.log("updated event is:",updatedEvent)
	const publicDateSet=await event.publicDate
	console.log("public Date Set:",publicDateSet)

    // const eventPublicDate = publicDateSet.toISOString().substring(0,10)
	// console.log("public Date Only Set:",eventPublicDate)
    // const hours = publicDateSet.getHours();
    // const minutes = publicDateSet.getMinutes();
    // const seconds = publicDateSet.getSeconds();

	// // getting time
	// let amOrPm;
    //  if (hours >= 12) {
    //    amOrPm = 'PM';
    //   } else {
    //   amOrPm = 'AM';
    //   }
    // const hoursTwelveHourFormat = hours % 12 || 12;
    // const eventPublicTime = `${ hoursTwelveHourFormat < 10 ? '0' : ''}${ hoursTwelveHourFormat}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${amOrPm}`;
    // console.log("event public time:",eventPublicTime); 
	// }
    		res.status(200).json({
			success: true,
			message: "Event is publicly accessed by this Link",
			url
	       });	

	}

	// }

	// // if event is private
	  else{

		const update = {  isPublic:false };
		const updatedEvent= await eventModel.findOneAndUpdate({ _id: req.params.eventID }, update , {
		   new: true,
		   runValidators: true,
	   });

	   console.log("updated event is:",updatedEvent)


        if (hasPassword && hasLink) {
			res.status(400).json({
			  success: false,
			  message: "Event cannot be published by both password and private link."
			});
		  } else if (!hasPassword && !hasLink) {
			res.status(400).json({
			  success: false,
			  message: "Event cannot be published without a password or private link."
			});
		  
		}

		else if (hasPassword){

			res.status(200).json({
						success: true,
						message: "Event is accessed by this password",
						password,
						url
				       });		  
				} 

         else if (hasLink){

            res.status(200).json({
			success: true,
			message: "Event is accessed by this Private Link",
			url
	       });	

		  }

        if (!alwaysPrivate){
           
			const update_2 = { publicDate: new Date(privateToPublicDate) };
			const updatedEventFinal= await eventModel.findOneAndUpdate({ _id: req.params.eventID }, update_2 , {
			   new: true,
			   runValidators: true,
		   });

		   console.log("updated event is:",updatedEventFinal)


		}

           

		}

       
	// if event is not published
	if (!isPublished){
	// update the published attribute to be true to publish the event
    const update_last = { published:true };
	const updatedEvent_last= await eventModel.findOneAndUpdate({ _id: req.params.eventID }, update_last , {
		new: true,
		runValidators: true,
	});
    console.log('Updated event:', updatedEvent_last);
	}
	// if event is already published
    else{
    console.log("event is already published")
	}
		
	   

}

// to be modified

async function eventSalesByTicketType(req, res) {

	const event=await eventModel.findById(req.params.eventID);
	console.log("Event to be used is:",event)
	const desiredTierName=req.query.tierName
    eventSales=0
    
	if (desiredTierName=="Free"){
		res.status(404).json({
			success: false,
			message: "There are no event sales for free ticket tiers ",		
		   });	
	}

	else{

	for (let i = 0; i < event.ticketTiers.length; i++) {
		const tierObject = event.ticketTiers[i];
		const tierName=tierObject.tierName
		console.log(`Tier ${i + 1}: ${tierName}`);
		if (tierName==desiredTierName){
			const tierQuantitySold=tierObject.quantitySold
			const tierPrice=tierObject.price
			console.log(" tier qs:",tierQuantitySold)
			console.log(" tier price:",tierPrice)
            eventSales=eventSales + tierQuantitySold*tierPrice
			console.log(" event quantity sold:",eventSales)

		}

	}
	eventSales=Math.round(eventSales)
	console.log("event quantity sold:",eventSales)

	res.status(200).json({
		success: true,
		message: "Event sales by the specified ticket type is: ",
		eventSales
	   });	
  

  }

}

// to be modified

async function eventSoldTickets(req, res) {

	const event=await eventModel.findById(req.params.eventID);
	console.log("Event to be used in event sold tickets:",event)
	

	eventSales=0
	totalMaxCapacity=0
	soldTickets=0


 	for (let i = 0; i < event.ticketTiers.length; i++) {
        const tierObject = event.ticketTiers[i];
 		const tierName=tierObject.tierName
		console.log(`Tier ${i + 1}: ${tierName}`);
		const maxCapacity=tierObject.maxCapacity
		console.log(" max Capacity:",maxCapacity)
		if (tierName=="Free"){
			eventSales=eventSales + 0
			totalMaxCapacity=totalMaxCapacity + maxCapacity
			const tierQuantitySold=tierObject.quantitySold
			console.log(" tier qs:",tierQuantitySold)
			soldTickets=soldTickets + tierQuantitySold
		}
		else{
		const tierQuantitySold=tierObject.quantitySold
		soldTickets=soldTickets + tierQuantitySold
		const tierPrice=tierObject.price
		totalMaxCapacity=totalMaxCapacity + maxCapacity
		console.log(" tier qs:",tierQuantitySold)
		console.log(" tier price:",tierPrice)
        eventSales=eventSales + tierQuantitySold*tierPrice
		console.log(" event quantity sold:",eventSales)
		}
	}

// 	}
    eventSales=Math.round(eventSales)
	totalMaxCapacity=Math.round(totalMaxCapacity)
	soldTickets=Math.round(soldTickets)
	console.log(" event quantity sold:",eventSales)
	console.log(" total max capacity",totalMaxCapacity)
	console.log(" sold Tickets:",soldTickets)
	soldTicketsFromCapacity=(soldTickets/totalMaxCapacity)*100
	soldTicketsFromCapacity=Math.round(soldTicketsFromCapacity)
	console.log("per of sold tickets:",soldTicketsFromCapacity)

	
	res.status(200).json({
		success: true,
		message: "Event sold tickets as a percentage of the capacity ",
		soldTicketsFromCapacity
	   });	
  


}






module.exports = {
	createEvent,
	getEventById,
	deleteEvent,
	updateEvent,
	publishEvent,
	eventSalesByTicketType,
	eventSoldTickets
};
