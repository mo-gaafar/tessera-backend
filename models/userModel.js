const mongoose = require("mongoose");
// // const usersRoute = require('../router/userRouter');
// const router=express.Router()
const bcrypt = require("bcryptjs");
const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxlength: 32,
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
  },
  { timestamps: true }
);

// const User= mongoose.model('User',UserSchema);

// module.exports= User;
// module.exports=router;
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  //this.password = await bcrypt.hash(this.password, 10);
  this.password = passwordEncryption(this.password); // import here
});

//verify passsword

UserSchema.methods.comparePassword = async function (yourPassword) {
  //return await bcrypt.compare(yourPassword, this.password);

  const pwd = securePassword();
  const orginalPassword = Buffer.from(yourPassword);
  //var Hashbuf = Buffer.from(this.password);
  const hash = await pwd.hash(orginalPassword);

  return await pwd.verify(orginalPassword, hash);
};

UserSchema.methods.GenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.SECRETJWT, { expiresIn: "3h" });
};

module.exports = mongoose.model("userModel", UserSchema);
