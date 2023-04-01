require("dotenv").config();
require("./passport/passport");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

//Import routes
const usersRoutes = require("./router/userRouter");
const verificationRoutes = require("./router/verificationRoutes");
const userSocialRouter = require("./router/userSocialRouter");
const ticketTierRouter = require("./router/ticketTierRouter");
const eventRouter = require("./router/eventRouter");

const app = express();
//connect to mongoose (database)
async function connectDB() {
	mongoose
		.connect(process.env.MONGODB_URI)
		.then(() => console.log("DB Connected"))
		.catch((err) => console.log(err));
}
//calling function connect to database using the connection string
connectDB();

// Define a route handler for the default home page
app.get("/", (req, res) => {
	res.send("Hello World!");
});

// Add middleware
app.use(express.json());
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
	})
);

// Enable CORS for all requests
app.use(cors());

// /**
//  * CORS allows the developer to have control over what requests the server will respond to:
//  * request methods, headers and origins.In this case it is "GET,POST,PUT,DELET".
//  * It simply prevents the abnormal use of APIs (requests).
//  */
// app.use(
//   cors({
//     //allow us to send client sessions
//     origin: process.env.LOCAL_HOST,
//     methodscl: "GET,POST,PUT,DELET",
//     credentials: true,
//   })
// );

app.use("/api", usersRoutes); //to develop api
app.use("/api", verificationRoutes);
//call user routes
app.use("/api", userSocialRouter);
app.use("/api", ticketTierRouter);
app.use("/api", eventRouter);

//passport module initialization
app.use(passport.initialize());
app.use(passport.session());

// Start the server on port 3000
const PORT = 3000;
const server = app.listen(PORT, () =>
	console.log(`It's aliveee on http://localhost:${PORT}`)
);
// app.listen(PORT, () => console.log(`It's aliveee on http://localhost:${PORT}`));
module.exports = server;
