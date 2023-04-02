const mongoose = require("mongoose"); 
// require the necessary libraries
//const faker = require("faker");

const {faker} = require('@faker-js/faker');

const eventModel=require("../../models/eventModel");



async function connectDB() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("DB Connected"))
      .catch((err) => console.log(err));
  }
  //calling function connect to database using the connection string
  connectDB();


  async function seedDB(req,res){
    events=[]

//  const events=[];
 for (let i = 0; i < 2; i++){
    console.log('ana gwa')

   const newEvent= new eventModel({
    basicInfo: {
      eventName: faker.lorem.words(),
      description: faker.lorem.sentences(),
      startDateTime: {
        // timezone: faker.address.timeZone(),
        utc: faker.date.future().toISOString(),
        // console.console.log(utc),

      },
      endDateTime: {
        timezone: faker.address.timeZone(),
        utc: faker.date.future().toISOString(),
      },
      categories: faker.helpers.arrayElement([
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
      ]),
      location: faker.address.city(),
    },
    privatePassword: faker.internet.password(),
    // ticketTiers: [
    //   {
    //     quantitySold: faker.datatype.number(),
    //     capacity: faker.datatype.number(),
    //     tier: faker.random.arrayElement(["Free", "Regular", "VIP"]),
    //     price: faker.finance.amount(),
    //   },
    //   {
    //     quantitySold: faker.datatype.number(),
    //     capacity: faker.datatype.number(),
    //     tier: faker.random.arrayElement(["Free", "Regular", "VIP"]),
    //     price: faker.finance.amount(),
    //   },
    //   {
    //     quantitySold: faker.datatype.number(),
    //     capacity: faker.datatype.number(),
    //     tier: faker.random.arrayElement(["Free", "Regular", "VIP"]),
    //     price: faker.finance.amount(),
    //   },
    // ],
    eventStatus: faker.helpers.arrayElement([
      "started",
      "ended",
      "completed",
      "cancelled",
      "live",
    ]),
    startSelling: {
      timezone: faker.address.timeZone(),
      utc: faker.date.future(),
    },
    endSelling: {
      timezone: faker.address.timeZone(),
      utc: faker.date.future(),
    },
    publicDate: {
      timezone: faker.address.timeZone(),
      utc: faker.date.future(),
    },
    emailMessage: faker.lorem.sentences(),
    eventQRimage: faker.image.imageUrl(),
    promoCodes: [
      {
        code: faker.random.alphaNumeric(10),
        percentage: faker.datatype.number({ min: 10, max:60 }),
        remainingUses: faker.datatype.number(),
      },
      {
        code: faker.random.alphaNumeric(10),
        percentage: faker.datatype.number({ min: 10, max: 60 }),
        remainingUses: faker.datatype.number(),
      },
    ],
    isVerified: faker.datatype.boolean(),
    isPublic: faker.datatype.boolean(),
  });

  events.push(newEvent);
// newEvent.save((err) => {
//     if (err) {
//       console.log(err);
//     }
//   });

newEvent.save()
 
}

res.status(201).json(
  {
  success:true,
  message: "Database Seeded",
  }
)

  }


console.log('Database seeded!')



// await eventModel.insertMany(events);

// process.exit();

//  }
 
//  seedDB();
// Seed the database with 10 events
// for (let i = 0; i < 10; i++) {
//   const event = generateEvent();
//   event.save();
// }

module.exports = { seedDB };

