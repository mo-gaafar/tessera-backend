const mongoose = require("mongoose");
// // const usersRoute = require('../router/userRouter');
// const router=express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// creating user schema with fields
const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    email_confirmation: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// encrypting password before saving
UserSchema.pre("save", async function (next) {
  // passing password to schema
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); // encrypting password
});

//verify passsword entered by user using encryption
UserSchema.methods.comparePassword = async function (yourPassword) {
  return await bcrypt.compare(yourPassword, this.password);
};

// generating user token
UserSchema.methods.GenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.SECRETJWT, { expiresIn: "3h" });
};

module.exports = mongoose.model("userModel", UserSchema); //exporting module
