const mongoose = require("mongoose");
require("dotenv").config();
require("./passport/passport");
const express = require("express");
const cors = require("cors");
//const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

//Import routes
const usersRoutes = require("./router/userRouter");
const verificationRoutes = require("./router/verificationRoutes");
const userSocialRouter = require("./router/userSocialRouter");
const ticketRouter = require("./router/ticketRouter");
const eventRouter = require("./router/eventRouter");
const promocodeRouter = require("./router/promocodeRouter");
const attendeeRouter = require("./router/attendeeRouter");
const manageAttendeeRouter = require("./router/manageAttendeeRouter");
const eventsRetrievalRouter = require("./router/eventsRetrievalRouter");
// const seedingRouter = require("./router/seedingRouter");

const app = express();
//connect to mongoose (database)n
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

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PATCH,DELETE,PUT",
  allowedHeaders: "Content-Type,X-Forwarded-For,Token,Authorization,",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// const seedingRouter = require("./router/seedingRouter");

// Enable CORS for all requests
// app.use(cors());

//passport module initialization
app.use(passport.initialize());
app.use(passport.session());

//call user routes
app.use("/api", usersRoutes);
app.use("/api", verificationRoutes);
app.use("/api", userSocialRouter);
app.use("/api", eventRouter);
app.use("/api", ticketRouter);
app.use("/api", attendeeRouter);
app.use("/api", promocodeRouter);
app.use("/api", attendeeRouter);
app.use("/api", manageAttendeeRouter);
app.use("/api", eventsRetrievalRouter);
// app.use("/api", seedingRouter);

// Start the server on port 3000
const PORT = 3000;
const server = app.listen(PORT, () =>
  console.log(`It's aliveee on http://localhost:${PORT}`)
);

app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  res.status(500);
  res.send("500: Internal server error");
});

module.exports = server;
