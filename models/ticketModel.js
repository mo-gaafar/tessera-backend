const mongoose = require("mongoose");
// creating ticket schema
const ticketSchema = new mongoose.Schema(
  {
    // reference to the objectID of the event, to link ticket to a certain event
    eventId: {
      type: mongoose.Schema.Types.String,
      ref: "eventModel",
      required: true,
    },

    // reference to the objectID of the user, to link ticket to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },

    promocodeUsed: {
      type: mongoose.Schema.Types.String,
      ref: "promocodeModel",
    },
    purchaseDate: {
      type: String,
      required: true,
    },
    purchasePrice: {
      type: String,
      required: true,
    },
    tierName: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("ticketModel", ticketSchema);
