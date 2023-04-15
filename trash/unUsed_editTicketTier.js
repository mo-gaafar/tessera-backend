async function editTicketTier(req, res) {
    try {
      const eventId = req.params.eventID; // get the event ID from the request URL
      // const update = req.body; // get the update object from the request body
      const { tierID,tierName, quantitySold, maxCapacity, price, startSelling,endSelling } = req.body;
      console.log("tierID:",tierID)
  
  
      const updatedEvent = await eventModel.findOneAndUpdate(
        { _id: eventId,'ticketTiers._id':tierID }, 
        { $set: { 'details.$.tierName': tierName,'details.$.quantitySold':quantitySold,'details.$.maxCapacity':maxCapacity,
        'details.$.price':price,'details.$.startSelling':startSelling,'details.$.endSelling':endSelling  }
      },
        { new: true, runValidators: true }
      );
  
      console.log("updated event:", updatedEvent.ticketTiers);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "invalid details",
      });
    }
  }