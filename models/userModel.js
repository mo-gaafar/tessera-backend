const mongoose = require("mongoose");
// // const usersRoute = require('../router/userRouter');
// const router=express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// creating user schema with fields
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailConfirmation: {
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

userSchema.methods.comparePassword = async function (yourPassword) {
  return await bcrypt.compare(yourPassword, this.password);
};

// generating user token
userSchema.methods.GenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.SECRETJWT, { expiresIn: "3h" });
};

module.exports = mongoose.model("userModel", userSchema); //exporting module
