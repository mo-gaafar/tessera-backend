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
  this.password = await passwordEncryption(this.password);
});

// //verify passsword

// userSchema.methods.GenerateToken = function () {
//   return jwt.sign({ id: this.id }, process.env.SECRETJWT, { expiresIn: "3h" });
// };

module.exports = mongoose.model("userModel", userSchema);
