const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { passwordEncryption } = require("../utils/passwords");

// creating user schema with fields
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailConfirmation: {
      type: String,
      //required:true,//check
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      //newely added
      type: String,
      trim: true,
    },
    facebookId: {
      //newely added
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      default: "normal",
    },
  }
  // { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await passwordEncryption(this.password);
});

module.exports = mongoose.model("userModel", userSchema);
