const mongoose = require("mongoose");
const { passwordEncryption } = require("../utils/passwords");
const eventSchema = new mongoose.Schema(
  {
    basicInfo: {
      // event Title
      eventName: {
        type: String,
        required: true,
      },
      startDateTime: {
        type: Date,
        required: true,
      },
      endDateTime: {
        type: Date,
        required: true,
      },
      eventImage: String,

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
        longitude: {
          type: Number,
        },
        latitude: {
          type: Number,
        },
        // Id of location in google maps
        placeId: {
          type: String,
        },
        venueName: {
          type: String,
        },
        streetNumber: {
          type: Number,
        },
        route: {
          type: String,
        },
        administrativeAreaLevel1: {
          type: String,
        },
        country: {
          type: String,
        },
        city: {
          type: String,
        },
      },
    },

    summary: String,

    description: String,

    ticketTiers: [
      {
        // need the tierName to be unique
        tierName: {
          type: String,
          unique: true,
        },

        quantitySold: Number,

        maxCapacity: Number,

        price: String, // String because it could be Free

        startSelling: {
          type: Date,
        },
        endSelling: {
          type: Date,
        },
        // derived attribute: capacityFull of tickets  --for Frontend and Cross-Platform
        // derived attribute: isFree  --for Frontend and Cross-Platform
      },
    ],

    eventStatus: {
      type: String,
      enum: ["started", "ended", "completed", "cancelled", "live"],
    },
    // if the creator have published the event ( it will be availble for the users to book tickets)
    published: {
      type: Boolean,
      default: false,
    },

    isPublic: Boolean, // if true so the event will be public - if false the event will be private

    publicDate: {
      type: Date,
    },

    isOnline: Boolean,

    eventUrl: String,

    onlineEventUrl: String,

    privatePassword: String, // if the event is private so the creator will set a password for the event

    soldTickets: [
      {
        ticketId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ticketModel",
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userModel",
        },
        // it takes a uuid id
        orderId: {
          type: String,
        },
      },
    ],

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },

    promocodes: [
      {
        promocodeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "promocodeModel",
        },
        code: String,
      },
    ],
  },

  {
    timestamps: true,
  }
);

eventSchema.pre("save", async function (next) {
  if (!this.isModified("privatePassword")) {
    next();
  }
  if (this.privatePassword != null) {
    this.privatePassword = await passwordEncryption(this.privatePassword);
  } else this.privatePassword = await passwordEncryption(null);
});

/*eventSchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	if (update.basicInfo) {
		const err = new Error("Cannot update basicInfo");
		err.status = 403;
		return next(err);
	}
	next();
}); */
module.exports = mongoose.model("eventModel", eventSchema);
//TODO comment the attributes
