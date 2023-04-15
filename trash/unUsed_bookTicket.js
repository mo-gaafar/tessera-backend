
async function bookTicket(req, res) {
    // getting parameters from request body
    const { eventID, userID, purchaseDate, purchasePrice, type } = req.body;
  
    // const event=await eventModel.findById(eventID);
  
    // if (!event){
  
    //   res.status(200).json(
    //     {
    //     success:false,
    //     message: "Invalid event Id",
    //     }
    // )
    // }
  
    // create ticket object
    try {
      const ticket = new ticketModel({
        eventID: eventID,
        userID: userID,
        purchaseDate,
        purchasePrice,
        type,
      });
  
      // save ticket
      const savedTicket = await ticket.save();
  
      res.status(201).json({
        success: true,
        message: "Ticket  Created",
        ticket: savedTicket,
      });
    } catch {
      res.status(200).json({
        success: false,
        message: "error",
      });
    }
  }