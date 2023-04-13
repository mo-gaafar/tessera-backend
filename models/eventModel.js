const mongoose = require("mongoose");
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
        longitude: {
          type: Number,
        },
        latitude: {
          type: Number,
        },
        placeId: {
          type: Number,
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

    privatePassword: String,

    ticketTiers: [
      {
        quantitySold: String,

        capacity: Number,

        tier: {
          type: String,
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

<<<<<<< HEAD
    isPublic: Boolean,

    eventQRimage: {
      type: String,
      default:
        "https://www.eventbrite.com/blog/wp-content/uploads/2022/04/2022_placeholder-116-768x445.png",
    },
=======
    isPublic: Boolean, // if true so the event will be public - if false the event will be private
>>>>>>> 6be14d615efe029a0b21eadcf2e2bce31ce065a1

    published: Boolean, // if the creator have published the event ( it will be availble for the users to book tickets)

    eventQRimage: String,

    eventImage: String,

    creatorId: {
      type: String,
    },

    isOnline: Boolean, // to be discussed

    promocode: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "promocodeModel",
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
