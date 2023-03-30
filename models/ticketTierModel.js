const mongoose = require("mongoose");
const object=mongoose.Schema.Types.ObjectId
// creating ticket schema
const ticketSchema = new mongoose.Schema(

{     
     // reference to the objectID of the event, to link ticket to a certain event
     eventID:{

     type:object,
     ref:'eventModel',
     required:true,

      },

      ticketID: {
        type: String,
        required: true,
      },
      purchaseDate: {
        type: String,
      },
      purchasePrice: {
        type: Number,
      },
      type: {
        type: String,
      },

      // ticket tier object
      ticketTier: {
          quantitySold: {
            type:Number,
            required:true,

          },
    
          capacity: {
            type:Number,
            required:true,
          },
    
          tier: {
            type: String,
            required:true,
          },
    
          price:{
            type:Number,
            required:true,
          } 
        
      },
    },

   { timestamps: true },

);

module.exports = mongoose.model("ticketTierModel", ticketSchema);
