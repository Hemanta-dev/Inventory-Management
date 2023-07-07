const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  tokens: []
});

//we are genrating token
userSchema.methods.generateAuthToken = async function() {
  try {
    let tokenEmcee = jwt.sign(
      { _id: this._id, email: this.email, role:  this.role, isApproved: this.isApproved}, 
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: tokenEmcee });
    await this.save();
    return tokenEmcee;
  } catch (err) {
    console.log(err);
  }
}

const User = mongoose.model("User", userSchema);

module.exports = User;
