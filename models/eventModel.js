const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { passwordEncryption } = require("../utils/passwords");
const eventSchema = new mongoose.Schema(
	{
		basicInfo: {
			eventName: {
				type: String,
				required: true,
			},
			description: String,
			startDateTime: {
				// timezone: String,
				utc: Date,
			},
			endDateTime: {
				timezone: String,
				utc: Date,
			},
			categories: {
				type: String,
				enum: [
					"Boat & Air",
					"Business & Profession",
					"Charity & Causes",
					"Community & Culture",
					"Family & Education",
					"Fashion & Beauty",
					"Film , Media & Entertainment",
					"Food & Drink",
					"Government & Politics",
					"Health & Wellness",
					"Hobbies & Special Interest",
					"Home & Lifestyle",
					"Music",
					"Other",
					"Performing & Visual Arts",
					"Religion & Spirtuality",
					"School Activities",
					"Science & Technology",
					"Seasonal Holiday",
					"Sports & Fitness",
					"Travel & Outdoor",
				],
				default: "Other",
			},
			location: {
				type: String,
				required: true,
			},
		},

		privatePassword: String,

		ticketTiers: [
			{
				quantitySold: String,

				capacity: Number,

				tier: {
					type: String,
					//enum: ["Free", "Regular", "VIP"],
				},
			},
		],

		eventStatus: {
			type: String,
			enum: ["started", "ended", "completed", "cancelled", "live"],
		},
		startSelling: {
			timezone: String,
			utc: Date,
		},
		endSelling: {
			timezone: String,
			utc: Date,
		},
		publicDate: {
			timezone: String,
			utc: Date,
		},
		emailMessage: String,

		isVerified: Boolean,

		isPublic: Boolean,

		eventQRimage: String,
		promoCodes: [{ code: String, percentage: Number, remainingUses: Number }],

		isVerified: Boolean,
		isPublic: Boolean,

		creatorId: {
			type: String,
		},

		isOnline: Boolean, // to be discussed
	},

	{
		timestamps: true,
	}
);

eventSchema.pre("save", async function (next) {
	if (!this.isModified("privatePassword")) {
		next();
	}
	this.privatePassword = await passwordEncryption(this.privatePassword);
});

eventSchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	if (update.basicInfo) {
		const err = new Error("Cannot update basicInfo");
		err.status = 403;
		return next(err);
	}
	next();
});
module.exports = mongoose.model("eventModel", eventSchema);
