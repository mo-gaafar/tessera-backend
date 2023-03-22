const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const securePassword = require("secure-password");
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  //this.password = await bcrypt.hash(this.password, 10);
  this.password = passwordEncryption(this.password);
});

//verify passsword

userSchema.methods.comparePassword = async function (yourPassword) {
  //return await bcrypt.compare(yourPassword, this.password);

  const pwd = securePassword();
  const orginalPassword = Buffer.from(yourPassword);
  //var Hashbuf = Buffer.from(this.password);
  const hash = await pwd.hash(orginalPassword);
  // return hash;
  return await pwd.verify(orginalPassword, hash);
};

userSchema.methods.GenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.SECRETJWT, { expiresIn: "3h" });
};

module.exports = mongoose.model("userModel", userSchema);
