const mongoose = require("mongoose");
/**
 * this is a token model that is created once user signed in succefully using google or facebook 
 * it stores the token generated and it also stores the id the user signed in and the expire date.
 * So that we could link the user signing token with its user.
 */
const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    expiredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
