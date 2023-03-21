const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

//Import routes
const usersRoutes = require("./router/userRouter");

//connecting to database
mongoose
  .connect(
    "mongodb+srv://mongodatabase2023:1h1jnygQ6c8mTGAS@cluster0.4l4dopm.mongodb.net/test",
    {
      //   useFindAndModify:true,
      //   useCreateIndex:true,
      //   useNewUrlParser:true,
    }
  )
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
// // const PORT=process.env.PORT || 5000;

app.use(express.json());
app.use("/api", usersRoutes); //to develop api

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`It's aliveee on http://localhost:${PORT}`));
