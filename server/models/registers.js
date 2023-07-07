const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoose = require("mongoose");

const bcrypt = require('bcryptjs');

const employeeSchema =  new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
    ,   
    confirmPassword:{
        type:String,
        required:true
    },
    location:{
        type:String,
      
    },
    role: {
        type: String,
        default: 'user' // Default role is set to 'user'
    },
  
    isApproved: {
      type: Boolean,
      default: false
    } , 
 
  
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})



//we are genrating token
employeeSchema.methods.generateAuthToken = async function() {
    try {
      let tokenEmcee = jwt.sign(
        { _id: this._id, role:  this.role, email: this.email, isApproved: this.isApproved}, 
        process.env.SECRET_KEY
      );
      this.tokens = this.tokens.concat({ token: tokenEmcee });
      await this.save();
      return tokenEmcee;
    } catch (err) {
      console.log(err);
    }
  }

const Register  = new mongoose.model("Inventory",employeeSchema);
//collections should in singular 

module.exports = Register;



