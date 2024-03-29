const mongoose = require("mongoose");

const { faker } = require("@faker-js/faker");

const eventModel = require("../../models/eventModel");

async function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
}
//calling function connect to database using the connection string
connectDB();

async function seedDB(req, res) {
  const events = [];

  for (let i = 0; i < 5; i++) {
    const newEvent = new eventModel({
      basicInfo: {
        eventName: faker.helpers.arrayElement([
          "Where does Depression route from? _ Free Lecture",
          "Learn How To Increase your Potential and Push yourself more! FREE EVENT!",
          "Living Machines 2023",
          "Gain skills in self development and business - Free Workshop",
          "Adult Mental Health First Aid Training April 18 & 25",
          "Anime North 2023",
        ]),
        startDateTime: faker.date.future(),
        endDateTime: faker.date.future(),
        eventImage: "https://picsum.photos/282/140",

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

        //       location: {
        //         // longitude:faker.datatype.number(0,180),
        //         // latitude: faker.datatype.number(0,90),
        //         // placeId:faker.random.alphaNumeric(),
        //         // venueName: faker.lorem.words(),
        //         // streetNumber:faker.datatype.number(1,999),
        //         // route:faker.lorem.words(),
        //         // country:faker.lorem.words(),
        //         // city:faker.lorem.words(),
        //         // administrativeAreaLevel1:faker.lorem.words(),
        //         longitude:-40,
        //         latitude:-4,
        //         placeId:"ChIJgTwKgJcpQg0RaSKMYcHeNsQ",
        //         venueName:"Prado Museum",
        //         streetNumber:30,
        //         route:"Paseo del Prado",
        //         country:"Spain",
        //         city:"Madrid",
        //         administrativeAreaLevel1:"Community of Madrid"

        // },
      },

      summary: faker.helpers.arrayElement([
        "Learn why your mind reacts in a negative way and why this can have an affect on our potential!",
        " most exciting research under the theme of Living Machines ",
        "largest fan-run Japanese Animation convention",
        "Mental Health First Aid Training",
        "Aiming to Achieve Self Confidence and remove self doubt",
        "Learn how to Improve your self-awareness and emotional intelligence which can also help you in business. Free Workshop",
      ]),

      description: faker.helpers.arrayElement([
        " How does the mind work? Why do we get triggered by simple mistakes and mishaps in life? You can learn how your mind works and how where your triggers are steming from      Will the tools from this event you can learn how to improve and improve quickly.",
        "Attend this free lecture on How To Achieve Self Confidence and remove self doubt from your mind!",
        "This conference highlights the most exciting research in the fields of biomimetics and biohybrid systems under the theme of Living Machines.",
        "SWL Imaging Training Academy in collaboration with Medicare and Health Education England present a Thoracic Imaging Study Day",
        "One important factor in improving your efficiency is to work on your self-development. When you take the time to understand your strengths, weaknesses, and areas for improvement, you can develop strategies to overcome obstacles and increase your productivity. For example, if you struggle with procrastination, you can learn time management techniques or use tools to help you stay focused and on track.",
        "Anime North is Toronto's largest fan-run Japanese Animation convention, being held May 26-28, 2023 at the Toronto Congress Centre",
      ]),

      ticketTiers: [
        {
          tierName: faker.helpers.arrayElement(["Regular", "VIP"]),
          // tierName:"Free",
          // tierName:"Free",
          quantitySold: 2500,
          // maxCapacity: faker.datatype.number(3000,8000),
          maxCapacity: 9000,
          price: faker.finance.amount(),
          // price:"Free",
          // price:"Free",
          startSelling: faker.date.future(),
          endSelling: faker.date.future(),
        },

        {
          // tierName: faker.helpers.arrayElement(["Free", "Regular", "VIP"]),
          // tierName: faker.helpers.arrayElement([ "Regular", "VIP"]),
          tierName: "Free",
          // tierName: faker.helpers.arrayElement([ "Regular", "VIP"]),
          // quantitySold: faker.datatype.number(0,2500),
          quantitySold: 1500,
          // maxCapacity: faker.datatype.number(3000,6000),

          maxCapacity: 4000,
          // price: faker.finance.amount(),
          price: "Free",
          // price:"Free",
          startSelling: faker.date.future(),
          endSelling: faker.date.future(),
        },
      ],
      eventStatus: faker.helpers.arrayElement([
        "started",
        "ended",
        "completed",
        "cancelled",
        "live",
      ]),

      published: faker.datatype.boolean(),
      isPublic: faker.datatype.boolean(),

      publicDate: faker.date.future(),
      // isOnline: faker.datatype.boolean(),
      isOnline: true,
      eventUrl: "https://www.tessera.social/",
      onlineEventUrl: "https://www.tessera.social/",
      privatePassword: faker.internet.password(),

      soldTickets: [
        {
          ticketId: faker.helpers.arrayElement(["6434110d4537615b85caea52"]),
        },

        {
          userId: faker.helpers.arrayElement([
            "6439f95a3d607d6c49e56a1e",
            "643a56706f55e9085d193f48",
            "643a7ffc96470deb953e2bc1",
            "643a93166c05d2711e8c72f7",
            "643a96c2a31dbc29e76badb8",
            "643a9cc18e628222267815dc",
          ]),
        },
      ],

      creatorId: faker.helpers.arrayElement([
        "6417b9099e62572b43c9267e",
        "6418b9920a40ca7bd287fcd4",
        "641d66a88344a16b3df1019a",
        "641ee21476e39de14334bff3",
        "641eddf055c9b5c70ae4ecdf",
      ]),

      promocodes: faker.helpers.arrayElement([
        "64393801b48bff2e5d22cdd3",
        "6439387edb728b680beea649",
        "6439396ba9d318e958edc858",
        "64394a2d880ae848d65f8c7e",
        "643959a3021ab8c901ae5e23",
      ]),
    });
    events.push(newEvent);
    newEvent.save();
  }

  res.status(201).json({
    success: true,
    message: "Database Seeded",
  });
}

module.exports = { seedDB };
