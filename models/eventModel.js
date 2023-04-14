const mongoose = require("mongoose");
const { passwordEncryption } = require("../utils/passwords");

// const eventSchema = new mongoose.Schema(
//   {
//     basicInfo: {
//       // event Title
//       eventName: {
//         type: String,
//         required: true,
//       },
//       startDateTime: {
//         type: Date,
//         required: true,
//       },
//       endDateTime: {
//         type: Date,
//         required: true,
//       },
//       eventImage: String,

//       categories: {
//         type: String,
//         enum: [
//           "Boat & Air",
//           "Business & Profession",
//           "Charity & Causes",
//           "Community & Culture",
//           "Family & Education",
//           "Fashion & Beauty",
//           "Film , Media & Entertainment",
//           "Food & Drink",
//           "Government & Politics",
//           "Health & Wellness",
//           "Hobbies & Special Interest",
//           "Home & Lifestyle",
//           "Music",
//           "Other",
//           "Performing & Visual Arts",
//           "Religion & Spirtuality",
//           "School Activities",
//           "Science & Technology",
//           "Seasonal Holiday",
//           "Sports & Fitness",
//           "Travel & Outdoor",
//         ],
//         default: "Other",
//       },
//       location: {
//         longitude: {
//           type: Number,
//         },
//         latitude: {
//           type: Number,
//         },
//         // Id of location in google maps
//         placeId: {
//           type: String,
//         },
//         venueName: {
//           type: String,
//         },
//         streetNumber: {
//           type: Number,
//         },
//         route: {
//           type: String,
//         },
//         administrativeAreaLevel1: {
//           type: String,
//         },
//         country: {
//           type: String,
//         },
//         city: {
//           type: String,
//         },
//       },
//     },

//     summary: String,

//     description: String,

//     ticketTiers: [
//       {
//         tierName: String,

//         quantitySold: Number,

//         maxCapacity: Number,

//         price: String, // String because it could be Free

//         startSelling: {
//           type: Date,
//         },
//         endSelling: {
//           type: Date,
//         },

//         // derived attribute: capacityFull of tickets  --for Frontend and Cross-Platform
//         // derived attribute: isFree  --for Frontend and Cross-Platform
//       },
//     ],

//     eventStatus: {
//       type: String,
//       enum: ["started", "ended", "completed", "cancelled", "live"],
//     },

//     published: Boolean, // if the creator have published the event ( it will be availble for the users to book tickets)

//     isPublic: Boolean, // if true so the event will be public - if false the event will be private

//     publicDate: {
//       type: Date,
//     },

//     isOnline: Boolean,

//     eventUrl: String,

//     privatePassword: String, // if the event is private so the creator will set a password for the event

//     soldTickets: [
//       {
//         ticketId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "ticketModel",
//         },
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "userModel",
//         },
//       },
//     ],

//     creatorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "userModel",
//       required: true,
//     },

//     promocode: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "promocodeModel",
//       },
//     ],
//   },

//   {
//     timestamps: true,
//   }
// );

// eventSchema.pre("save", async function (next) {
//   if (!this.isModified("privatePassword")) {
//     next();
//   }
//   this.privatePassword = await passwordEncryption(this.privatePassword);
// });

// eventSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.basicInfo) {
//     const err = new Error("Cannot update basicInfo");
//     err.status = 403;
//     return next(err);
//   }
//   next();
// });
// module.exports = mongoose.model("eventModel", eventSchema);


// 


// const mongoose = require("mongoose");
// const { passwordEncryption } = require("../utils/passwords");
// const eventSchema = new mongoose.Schema(
//   {
//     basicInfo: {
//       // event Title
//       eventName: {
//         type: String,
//         required: true,
//       },
//       startDateTime: {
//         type: Date,
//         required: true,
//       },
//       endDateTime: {
//         type: Date,
//         required: true,
//       },
//       eventImage: String,

//       categories: {
//         type: String,
//         enum: [
//           "Boat & Air",
//           "Business & Profession",
//           "Charity & Causes",
//           "Community & Culture",
//           "Family & Education",
//           "Fashion & Beauty",
//           "Film , Media & Entertainment",
//           "Food & Drink",
//           "Government & Politics",
//           "Health & Wellness",
//           "Hobbies & Special Interest",
//           "Home & Lifestyle",
//           "Music",
//           "Other",
//           "Performing & Visual Arts",
//           "Religion & Spirtuality",
//           "School Activities",
//           "Science & Technology",
//           "Seasonal Holiday",
//           "Sports & Fitness",
//           "Travel & Outdoor",
//         ],
//         default: "Other",
//       },
//       location: {
//         longitude: {
//           type: Number,
//         },
//         latitude: {
//           type: Number,
//         },
//         // Id of location in google maps
//         placeId: {
//           type: String,
//         },
//         venueName: {
//           type: String,
//         },
//         streetNumber: {
//           type: Number,
//         },
//         route: {
//           type: String,
//         },
//         administrativeAreaLevel1: {
//           type: String,
//         },
//         country: {
//           type: String,
//         },
//         city: {
//           type: String,
//         },
//       },
//     },

//     summary: String,

//     description: String,

//     ticketTiers: [
//       {
//         tierName: String,

//         quantitySold: Number,

//         maxCapacity: Number,

//         price: String, // String because it could be Free

//         startSelling: {
//           type: Date,
//         },
//         endSelling: {
//           type: Date,
//         },

//         // derived attribute: capacityFull of tickets  --for Frontend and Cross-Platform
//         // derived attribute: isFree  --for Frontend and Cross-Platform
//       },
//     ],

//     eventStatus: {
//       type: String,
//       enum: ["started", "ended", "completed", "cancelled", "live"],
//     },

//     published: Boolean, // if the creator have published the event ( it will be availble for the users to book tickets)

//     isPublic: Boolean, // if true so the event will be public - if false the event will be private

//     publicDate: {
//       type: Date,
//     },

//     isOnline: Boolean,

//     eventUrl: String,

//     privatePassword: String, // if the event is private so the creator will set a password for the event

//     soldTickets: [
//       {
//         ticketId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "ticketModel",
//         },
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "userModel",
//         },
//       },
//     ],

//     creatorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "userModel",
//       required: true,
//     },

//     promocode: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "promocodeModel",
//       },
//     ],
//   },

//   {
//     timestamps: true,
//   }
// );


// const mongoose = require("mongoose");
// const { passwordEncryption } = require("../utils/passwords");
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
      eventImage: {
        type: String,
        default:
          "https://www.eventbrite.com/blog/wp-content/uploads/2022/04/2022_placeholder-151-768x445.png",
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
        tierName: String,

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

    published: Boolean, // if the creator have published the event ( it will be availble for the users to book tickets)

    isPublic: Boolean, // if true so the event will be public - if false the event will be private

    publicDate: {
      type: Date,
    },

    isOnline: Boolean,

    eventUrl: String,

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
      },
    ],

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
<<<<<<< HEAD
=======
      //required: true,
>>>>>>> cc725f934939454a126b6fd0df17dd40082156e3
    },

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