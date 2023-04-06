const mongoose = require("mongoose");


const ticketModel = require("../../models/ticketModel");
const eventModel=require("../../models/eventModel");


// /** 
// //  * * Creates a new ticket that is linked to a specific event by event ID 
// //  * @async
// //  * @function createTicket
// //  * @param {Object} req - The request object containing the ticket's infos
// //  * @param {string} req.body.eventID - The ID of the event
// //  * @param {string} req.body.ticketID - The ID of the ticket
// //  * @param {string} req.body.purchasePrice - The purchasing price of the ticket 
// //  * @param {object} req.body.ticketTier -ticket tier object
// //  * @param {Object} res - The response object that will be sent back to the client with the ticket information
// //  * @returns {Object} - A response object with information about the new ticket if it is created successfully with a message or a message if it is not created 
// //  * @throws {Error} If there is an internal server error.
// //  * @throws {Error} If an invalid event ID is entered
// //  * 
// // */


async function bookTicket(req,res)

{

  
    // getting parameters from request body
    const {eventID,userID,purchaseDate,purchasePrice,type} =req.body; 
   

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
    try{
    const ticket=new ticketModel(
     {
       eventID:eventID,
       userID:userID,
       purchaseDate,
       purchasePrice,
       type
     } );
    
     // save ticket
       const savedTicket=await ticket.save(); 

     res.status(201).json(
       {
       success:true,
       message: "Ticket  Created",
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




async function createTicketTier(req,res) 

{

// const {quantitySold,capacity,tier,price}=req.body; 
const {quantitySold,capacity,tier,price}=req.body
const event=await eventModel.findById(req.params.eventID);
console.log("ticket tier is added in this eventtttt:",event)

const newTicketTier={quantitySold,capacity,tier,price}
console.log("new tierrrrrr",newTicketTier)
event.ticketTiers.push(newTicketTier)

const eventWithNewTier=await event.save()

console.log("new event is:",eventWithNewTier)





}

  // async function editTicket(req,res){

  //     console.log("ana gwa")
  //     const validUpdates=['capacity','purchasePrice'];
  //     console.log("Attributes that can be updated",validUpdates)
  //     const updateObjectData=Object.keys(req.body.ticketTier); // 3yz ageeb properties le zfttt request body objects
  //     console.log("object data need to be updated is:",updateObjectData)
  //     const updateData=Object.keys(req.body)
  //     console.log(" data need to be updated is:",updateData)
  //     const finalUpdateData=[]
      
  //     for (let i=0;i<updateData.length;i++){
  //       if (updateData[i]!="ticketTier")
  //       {
  //          finalUpdateData.push(updateData[i])

  //       }

  //     }
  //     console.log(" data need to be updated is:",finalUpdateData)
  //     let allDataUpdated=[]
  //     allDataUpdated=finalUpdateData.concat(updateObjectData)
  //     console.log("All Data Updated is:",allDataUpdated)

  //     let canUpdate=true;
  //     for (let i=0;i<allDataUpdated.length;i++){

  //        const updateParameter=allDataUpdated[i];
  //        console.log("update Parameter is:",updateParameter)
  //        if (!validUpdates.includes(updateParameter)){

  //        canUpdate=false;
  //        //console.log("can update is:",canUpdate)
  //       break;
  //        }
  //      }
  //      console.log("can update is:",canUpdate)
   
  //      if (!canUpdate){
  //          console.log("ana da5alt gowa cannot update")
  //          res.status(400).json({

  //          success:false,
  //          message:"please enter valid parameters to be updated",
  //           }
  //           )
          
  //         }

       

  //        const ticket=await ticketTierModel.findById(req.params.tickID);
  //        console.log("ticket details are",ticket)
  //     // // try {
        
        


  //         if (!ticket) {
  //           return res.status(404).send("Invalid Ticket");
  //         }

           


                      
      //  const ticket = await ticketTierModel.findByIdAndUpdate(req.params.id, req.body,{new:true});
      //  console.log("ya rab ticket is:",ticket)
      
      //   $set: {
      //     'ticketTiers.name': req.body.ticketTier.name,
      //     'ticketTiers.capacity': req.body.ticketTier.capacity
      //   }
      // })
          

      //  updateData.forEach((field) => {
      //   if (validUpdates.includes(field)) {
      //     if (field.includes('.')) {
      //       const [tier, capacityField] = field.split('.');
      //        ticket.tier[tier][capacity] = req.body[field];
      //       ticket.tier.forEach((t) => {
      //         if (t.tier === tier) {
      //           t.capacity[capacityField] = req.body[field];
      //         }
      //       })
      //     }
      //       //  if (field.startsWith('tier.')) {
      //       //   const fieldParts = field.split('.');
      //       //   const tier = fieldParts[1];
      //       //   const subField = fieldParts[2];
      //       //   const tierIndex = ticket.tier.findIndex((t) => t.tier === tier);
      //       //   if (tierIndex !== -1) {
      //       //     ticket.tier[tierIndex].capacity[subField] = req.body[field];
      //       //   }
      //       // }
      //       else {
      //         ticket[field] = req.body[field];
      //       }


    //       } 
    //     },
    //  //  });

    //   }
    //    )



        //   for (let i = 0; i < allDataUpdated.length; i++) {
        //         const field = allDataUpdated[i];
        //         console.log("field is:",field)
        //         //console.log("update is fe a5er loop:",update)
        //        if (validUpdates.includes(field))
        //        {
        //         if (field==='capacity') {
        //           console.log("ana gwa tickerTierlcapacitty")
        //        //    const [tierField,capacityField]=field.split('.');
        // //           ticket[tierField][capacityField]=req.body[field];
        //          ticket[ticketTierModel.field]=req.body[ticketTierModel.field];
        //          console.log("menek lellah")

        //          }
        //          else{

        //          ticket[field]=req.body[field];
        //          console.log("ana gwa el tnya")
        //          }
               
        //         }

        //       }

        ///////////////////////Fail Trials//////////////////

            // if (update === 'purchasePrice') {
            //   ticketTierModel[update] = req.body[purchasePrice];
            //    }
            //    console.log("ticket now is:",ticket)
            //    else{ 
             
            //    ticketTierModel[update] = req.body[update];
            //   }
            
            // }
             
        //     await ticket.save();
        //   res.status(201).json(
        //    {
        //    success:true,
        //    message: "Ticket tier updated",
        //    ticket
        //    }
        //  )
        
    
 //}
//  /////////////////////////////////////////////////////////FAILLL////////////////////////////
//             updateticket= await ticket.save();
//             console.log("ya mosahel",updateticket);
//    // catch{
//     //   res.status(200).json(
//     //     {
//     //     success:false,
//     //     message: "Error",
//     //     }
    //   )

    // //}
  
    
  //}


  //}
      

//}


module.exports = { bookTicket,createTicketTier}//,editTicket };
