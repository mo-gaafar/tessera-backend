require("dotenv").config();
const express = require("express");
//////start of 5 hrs tutorial
// const cookieSession=require("cookie-session")
const session = require("express-session");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const cors = require("cors");
// const cookieParser = require('cookie-parser')
const passport = require("passport");
require("./passport/passport");
/////end of 5 hrs tutorial
const app = express();
const Token = require("./models/Token");

// Define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//////start of 5 hrs tutorial
// app.use
// app.use(session({
//    secret:'expresssessionsecret',
//    cookie:{
//     samsite:'strict',
//    }
// }));
/**
 * This is an express session middleware
 * create and manage a session middleware
 * A session will contain some unique data about that client 
 * to allow the server to keep track of the user’s state using session unique id 
 * In session-based authentication, the user’s state is stored in the server’s memory or a database.
 */
app.use(
  session({
    secret: "glory to the king",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);
app.use(cors());
app.use(express.json());
//call user routes 
app.use("/user", userRouter);
// app.use(session(//if page is refreshed, user keep logged in
//     {
//         name:"session",
//         keys:["lama"],
//         maxAge:24*60*60*100,
//     }
// ))
//passport module initialization
app.use(passport.initialize());
app.use(passport.session());

//   app.use(passport.authenticate('session'));
/**
 * CORS allows the developer to have control over what requests the server will respond to:
 * request methods, headers and origins.In this case it is "GET,POST,PUT,DELET".
 * It simply prevents the abnormal use of APIs (requests).
 */
app.use(
  cors({
    //allow us to send client sessions
    origin: process.env.LOCAL_HOST,
    methodscl: "GET,POST,PUT,DELET",
    credentials: true,
  })
);
//Routes
// app.use('/user', require('./router/userRouter'))

//connect to mongoose
async function connectDB() {
  mongoose
    .connect(process.env.dbUrl)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
}
////calling function connect to databas using the connection string
connectDB();
