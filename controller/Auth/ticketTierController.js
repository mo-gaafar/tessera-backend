

const ticketTierModel = require("../../models/ticketTierModel");
const eventModel=require("../../models/eventModel");



async function createTicket(req,res)

{

  
    
    // getting parameters from request body
    const {eventID,ticketID,ticketTier} =req.body;
    
    // create ticket object
    try{
    const ticket=new ticketTierModel(
     {
       eventID:eventID,
       ticketID,
       ticketTier
     } );
    
     // save ticket
     const savedTicket=await ticket.save(); 

     res.status(201).json(
       {
       success:true,
       message: "Ticket Tier Created",
       ticket:savedTicket
       }
     )

     
     }
     catch{
         res.status(200).json(
             {
             success:false,
             message: "error",
             }
         )
     }  
  
  }




module.exports = { createTicket };
