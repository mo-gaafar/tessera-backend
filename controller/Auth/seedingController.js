
const mongoose = require("mongoose");
const eventModel = require("../../models/eventModel");

const {faker} = require('@faker-js/faker');


async function connectDB() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("DB Connected"))
      .catch((err) => console.log(err));
  }
  //calling function connect to database using the connection string
  connectDB();


async function seedDB(req,res){

await eventModel.deleteMany({});

events=[]
const numEvents = 10;
const numConcerts = Math.floor(numEvents / 4);
console.log("ana gowa el zft sedding")
//  const events=[];
 for (let i = 0; i < 5; i++){
    console.log('ana gwa');


   const newEvent= new eventModel({
    
      basicInfo: {
      eventName: faker.helpers.arrayElement([
       "Where does Depression route from? _ Free Lecture",
       "Learn How To Increase your Potential and Push yourself more! FREE EVENT!",
        "OPEN DAY EXECUTIVE MBA",
        "Living Machines 2023",
        "Tour Day Pontremoli",
        "Warhammer Fest 3-Day Pass - Standard"]
      ),
      description: faker.helpers.arrayElement([
        "Learn why your mind reacts in a negative way and why this can have an affect on our potential! Did you know we only use 10% of our potential",
        "Attend this free lecture on How To Achieve Self Confidence and remove self doubt from your mind!",
        "This conference highlights the most exciting research in the fields of biomimetics and biohybrid systems under the theme of Living Machines.",
        "SWL Imaging Training Academy in collaboration with Medicare and Health Education England present a Thoracic Imaging Study Day",
        "Get ready for the greatest Warhammer convention the world has ever seen – Warhammer Fest 2023!"
      ]
      ),
      startDateTime: {
         timezone: faker.address.timeZone(),
        utc: faker.date.future(),
        // console.console.log(utc),

      },
      endDateTime: {
        timezone: faker.address.timeZone(),
        utc: faker.date.future(),
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
      // location: faker.address.city(),

      location: {
        longitude:faker.datatype.number(), 
        latitude: faker.datatype.number(),
        placeId:faker.datatype.number(),
        venueName: faker.lorem.words(),
        streetNumber:faker.datatype.number(),   
        route:faker.lorem.words(),
        administrativeAreaLevel1:faker.lorem.words(),       
        country:faker.lorem.words(),
        city:faker.lorem.words(),
          
      },

    
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
    evenImage: faker.image.imageUrl(),
    creatorID:faker.datatype.number(),
    streetNumber:faker.datatype.number(),
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
    published:faker.datatype.boolean(),

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


// console.log('Database seeded!')



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

