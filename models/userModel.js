//////////////////////////////Start of 5 hrs tutorial
require("dotenv").config();
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// creating user schema with fields
const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      //required:true,//check
    },
    last_name: {
      type: String,
      //required:true,//check
    },
    email: {
      type: String,
      required: true,
    },
    email_confirmation: {
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
    verified: {
      type: Boolean,
      default: false,
    },
    social_media_user: {
      type: Boolean,
      required: true,
    },
    // tag:{
    //     type:String,
    //     required:true,
    //     unique:true
    //  },

    // profileAvater: {
    //     url:{ type: String,
    //     trim: true,
    //     default:null},
    //     cloudnaryId:{
    //       type: String,
    //     trim: true,
    //     default:null
    // }
    // },
  },
  { timestamps: true }
);

// const User= mongoose.model('User',UserSchema);

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
  return jwt.sign({ id: this.id }, process.env.SECRET, { expiresIn: "3h" });
};

module.exports = mongoose.model("users", UserSchema);
