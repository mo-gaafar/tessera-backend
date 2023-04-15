 
const mongoose = require("mongoose");
const eventModel = require("../../models/eventModel");
const userModel=require("../../models/userModel");
const {faker} = require('@faker-js/faker');
const shortid = require('shortid');
const { resendEmailVerification } = require("./verificationController");

// const eventModel = require("../../models/eventModel");
// const {faker} = require('@faker-js/faker');
// const shortid = require('shortid');
// const { resendEmailVerification } = require("./verificationController");

async function connectDB() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("DB Connected"))
      .catch((err) => console.log(err));
  }
  //calling function connect to database using the connection string
  connectDB();


async function seedDB(req,res){
  
  
// await eventModel.deleteMany({});
// await userModel.deleteMany({});
// await userModel.deleteMany({});

// events=[]
console.log("ana gowa el  sedding")
const events=[];

 for (let i = 0; i < 6; i++){
  console.log('ana gwa el for');
   const newEvent= new eventModel({
      basicInfo: {
      eventName: faker.helpers.arrayElement([
       "Where does Depression route from? _ Free Lecture",
       "Learn How To Increase your Potential and Push yourself more! FREE EVENT!",
        "Living Machines 2023",
        "Gain skills in self development and business - Free Workshop", 
        "Adult Mental Health First Aid Training April 18 & 25",
        "Anime North 2023"
        ]
      ),
      startDateTime: faker.date.future(),
      endDateTime:faker.date.future(),
      eventImage:"https://picsum.photos/200/300",
      

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
      

      location: {
        // longitude:faker.datatype.number(0,180), 
        // latitude: faker.datatype.number(0,90),
        // placeId:faker.random.alphaNumeric(),
        // venueName: faker.lorem.words(),
        // streetNumber:faker.datatype.number(1,999),   
        // route:faker.lorem.words(),
        // country:faker.lorem.words(),
        // city:faker.lorem.words(),
        // administrativeAreaLevel1:faker.lorem.words(),
        longitude:31,
        latitude:30,
        placeId:"ChIJ674hC6Y_WBQRujtC6Jay33k",
        venueName:"Khan el Khalili ",
        streetNumber:5,
        route:"Khan el Khalili",
        country:"Egypt",
        city:"Cairo",
        administrativeAreaLevel1:"Cairo Governorate	"
        
                

},

      },

      
    summary:faker.helpers.arrayElement(
     [

       "Learn why your mind reacts in a negative way and why this can have an affect on our potential!",
       " most exciting research under the theme of Living Machines ",
       "largest fan-run Japanese Animation convention",
        "Mental Health First Aid Training",
       "Aiming to Achieve Self Confidence and remove self doubt",
       "Learn how to Improve your self-awareness and emotional intelligence which can also help you in business. Free Workshop",
     ]
    ),

    description: faker.helpers.arrayElement([
      " How does the mind work? Why do we get triggered by simple mistakes and mishaps in life? You can learn how your mind works and how where your triggers are steming from      Will the tools from this event you can learn how to improve and improve quickly.",
      "Attend this free lecture on How To Achieve Self Confidence and remove self doubt from your mind!",
      "This conference highlights the most exciting research in the fields of biomimetics and biohybrid systems under the theme of Living Machines.",
      "SWL Imaging Training Academy in collaboration with Medicare and Health Education England present a Thoracic Imaging Study Day",
      "One important factor in improving your efficiency is to work on your self-development. When you take the time to understand your strengths, weaknesses, and areas for improvement, you can develop strategies to overcome obstacles and increase your productivity. For example, if you struggle with procrastination, you can learn time management techniques or use tools to help you stay focused and on track.",
      "Anime North is Toronto's largest fan-run Japanese Animation convention, being held May 26-28, 2023 at the Toronto Congress Centre"
    ]
    ),

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

    published:faker.datatype.boolean(),
    isPublic: faker.datatype.boolean(),

    publicDate:faker.date.future(), 
    // isOnline: faker.datatype.boolean(),
    isOnline:false,
    eventUrl:"https://www.tessera.social/",
    onlineEventUrl:"https://www.tessera.social/",
    privatePassword: faker.internet.password(), 

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
       
       promocodes: faker.helpers.arrayElement([
        "64393801b48bff2e5d22cdd3",
        "6439387edb728b680beea649",
        "6439396ba9d318e958edc858",
        "64394a2d880ae848d65f8c7e",
        "643959a3021ab8c901ae5e23"
        
       ]
       ),
  }
  
  );
  events.push(newEvent);
  newEvent.save()
 
}


  res.status(201).json(
    {
    success:true,
    message: "Database Seeded",
    }
  )
  
  
 
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////DONE

// events.push(newEvent);
// newEvent.save((err) => {
//     if (err) {
//       console.log(err);
//     }
//   });

// newEvent.save()
 
// // }

// res.status(201).json(
//   {
//   success:true,
//   message: "Database Seeded",
//   }
// )

// }


//   });


  


// // console.log('Database seeded!')





//  }
 
//  seedDB();




module.exports = { seedDB };

