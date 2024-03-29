const mongoose = require("mongoose");

const promocodeSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			unique: true,
			required: true,
		},
		discount: {
			type: Number,
			required: true,
			min: 0,
			max: 100, // The discount must be between 0 and 100
		},
		expires: {
			type: Date,
			// required: true, // The expiration date for the promocode
		},
		limitOfUses: {
			type: String, // because it could be unlimited
			required: true, // The limit of uses for the promocode
		},
		remainingUses: {
			type: String,
			// required: true, // The remaining uses for the promocode
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "eventModel", // An array of ObjectIds referencing the events associated with this promocode
		},

		tickets: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ticketModel", // An array of ObjectIds referencing the tickets associated with this promocode
			},
		],
	},
	{ timestamps: true } // Add timestamps to the schema
);

module.exports = mongoose.model("Promocode", promocodeSchema);
