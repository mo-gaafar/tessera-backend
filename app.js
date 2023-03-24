const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

//Import routes
const usersRoutes = require("./router/userRouter");
const verificationRoutes = require("./router/verificationRoutes");

//connecting to database
mongoose
  .connect(process.env.MONGODB_URI, {
    //   useFindAndModify:true,
    //   useCreateIndex:true,
    //   useNewUrlParser:true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
// // const PORT=process.env.PORT || 5000;

// Add middleware
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

app.use("/api", usersRoutes); //to develop api
app.use("/api", verificationRoutes);

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`It's aliveee on http://localhost:${PORT}`));
