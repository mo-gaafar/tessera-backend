
const mongoose = require("mongoose");
const eventModel = require("../../models/eventModel");
const {faker} = require('@faker-js/faker');
const shortid = require('shortid');
const { resendEmailVerification } = require("./verificationController");

async function connectDB() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("DB Connected"))
      .catch((err) => console.log(err));
  }
  //calling function connect to database using the connection string
  connectDB();


async function seedDB(req,res){
  let loc1;
  let loc2;
  objects=[]
  
await eventModel.deleteMany({});
events=[]
console.log("ana gowa el zft sedding")
//  const events=[];
// const countries= ["United States","UK","Germany","Spain","Italy" ];
// const randomIndex = faker.datatype.number({ min: 0, max: 6 });


 for (let i = 0; i < 5; i++){
  console.log('ana gwa el for');
   const newEvent= new eventModel({
      basicInfo: {
      eventName: faker.helpers.arrayElement([
       "Where does Depression route from? _ Free Lecture",
       "Learn How To Increase your Potential and Push yourself more! FREE EVENT!",
        "OPEN DAY EXECUTIVE MBA",
        "Living Machines 2023",
        "Tour Day Pontremoli",
        "Warhammer Fest 3-Day Pass - Standard",
        "Emerson Park Community Fun Day",
        "Anime North 2023"
        ]
      ),
      startDateTime: faker.date.future(),
      endDateTime:faker.date.future(),
      // evenImage: faker.image.imageUrl(),
      eventImage:faker.image.imageUrl(),

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
      
    


       objects :[loc1 ,loc2],

       location :faker.helpers.arrayElement([objects]),
      

      location: {
        longitude:faker.datatype.number(0,180), 
        latitude: faker.datatype.number(0,90),
        placeId:faker.random.alphaNumeric(),
        venueName: faker.lorem.words(),
        streetNumber:faker.datatype.number(1,999),   
        route:faker.lorem.words(),
        country:faker.lorem.words(),
        city:faker.lorem.words(),
        administrativeAreaLevel1:faker.lorem.words(),
        // country:faker.lorem.words(),
        // city:faker.lorem.words(),
          
  // l
        // const country=countries[Math.floor.random(1,5)],

},

      },


    summary:faker.lorem.sentences(),

    description: faker.helpers.arrayElement([
      "Learn why your mind reacts in a negative way and why this can have an affect on our potential! Did you know we only use 10% of our potential",
      "Attend this free lecture on How To Achieve Self Confidence and remove self doubt from your mind!",
      "This conference highlights the most exciting research in the fields of biomimetics and biohybrid systems under the theme of Living Machines.",
      "SWL Imaging Training Academy in collaboration with Medicare and Health Education England present a Thoracic Imaging Study Day",
      "Get ready for the greatest Warhammer convention the world has ever seen – Warhammer Fest 2023!",
      "Come join us for a fun packed family day out to celebrate the King's Coronation!",
      "Anime North is Toronto's largest fan-run Japanese Animation convention, being held May 26-28, 2023 at the Toronto Congress Centre"
    ]
    ),

    privatePassword: faker.internet.password(),
     ticketTiers: [
      {
        tierName: faker.helpers.arrayElement(["Free", "Regular", "VIP"]),
        quantitySold: faker.datatype.number(0,2500),
        maxcapacity: faker.datatype.number(200),
        price: faker.finance.amount(),
        startSelling: faker.date.future(),
        endSelling:faker.date.future()
      },
      

      {
        tierName: faker.helpers.arrayElement(["Free", "Regular", "VIP"]),
        quantitySold: faker.datatype.number(0,2500),
        maxcapacity: faker.datatype.number(200),
        price: faker.finance.amount(),
        startSelling: faker.date.future(),
        endSelling:faker.date.future()
      },

    ],
    eventStatus: faker.helpers.arrayElement([
      "started",
      "ended",
      "completed",
      "cancelled",
      "live",
    ]),
    // startSelling: {
    //   timezone: faker.address.timeZone(),
    //   utc: faker.date.future(),
    // },
    // endSelling: {
    //   timezone: faker.address.timeZone(),
    //   utc: faker.date.future(),
    // },
    published:faker.datatype.boolean(),
    isPublic: faker.datatype.boolean(),
    publicDate:faker.date.future(),
    isOnline: faker.datatype.boolean(),
    // emailMessage: faker.lorem.sentences(),
    // eventQRimage: faker.image.imageUrl(),
    eventUrl:  shortid.generate(),

    soldTickets: [
      {
        ticketId:faker.helpers.arrayElement([
         "6434110d4537615b85caea52"
        ]),

      },

      {
        userId:faker.helpers.arrayElement([
          "6417b9099e62572b43c9267e",
          "6418b9920a40ca7bd287fcd4",
          "641d66a88344a16b3df1019a",
          "641ee21476e39de14334bff3",
          "641eddf055c9b5c70ae4ecdf"
         ]
         )
          
        } 
    
    ],

    creatorId: faker.helpers.arrayElement([
     "6417b9099e62572b43c9267e",
     "6418b9920a40ca7bd287fcd4",
     "641d66a88344a16b3df1019a",
     "641ee21476e39de14334bff3",
     "641eddf055c9b5c70ae4ecdf"

    ]
    ),

   



  }

  );

  // events.push(newEvent);
//   newEvent.save(),

// }
//   res.status(201).json(
//     {
//     success:true,
//     message: "Database Seeded",
//     }
//   )
  
  
 
// }

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


  // });


  


// console.log('Database seeded!')





//  }
 
//  seedDB();
// Seed the database with 10 events
// for (let i = 0; i < 10; i++) {
//   const event = generateEvent();
//   event.save();
// }




























































































module.exports = { seedDB };
