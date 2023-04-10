const mongoose = require("mongoose");

const promocodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // The code for each promocode must be unique
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // The discount must be between 0 and 100
    },
    expires: {
      type: Date,
      required: true, // The expiration date for the promocode
    },
    limitOfUses: {
      type: Number,
      required: true, // The limit of uses for the promocode
    },
    remainingUses: {
      type: Number,
      required: true, // The remaining uses for the promocode
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // An array of ObjectIds referencing the events associated with this promocode
      },
    ],
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket", // An array of ObjectIds referencing the tickets associated with this promocode
      },
    ],
  },
  { timestamps: true } // Add timestamps to the schema
);

const Promocode = mongoose.model("Promocode", promocodeSchema);

module.exports = Promocode;
