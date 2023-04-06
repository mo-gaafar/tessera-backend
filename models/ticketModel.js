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

      // reference to the objectID of the user, to link ticket to user
      userID:{

      type:object,
      ref:'userModel',
      required:true,
   
      },

      purchaseDate: {
        type: String,
        required:true,
      },
      purchasePrice: {
        type: Number,
        required:true,
      },
      type: {
        type: String,
        required:true,
      },

      // creator:req.userID
    
   
    },

   { timestamps: true },

);

module.exports = mongoose.model("ticketModel", ticketSchema);
