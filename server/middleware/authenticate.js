const jwt = require("jsonwebtoken");
require('dotenv').config();
const Register = require("../models/registers");

const Authenticate = async (req, res, next) => {
  try {

    const token = req.cookies.token;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);


    const rootUser = await Register.findOne({
      _id: tokenVerify._id,
     
      "tokens.token": token
    });

    if (!rootUser) {
      throw new Error(`User not Found`);
    }

    req.token = token;
    req.rootUser = rootUser;

    req.userID = rootUser._id;

    req.role = rootUser.role;
    req.IsVerified = rootUser.IsVerified;
  
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No Authorization");
    console.log(err);
  }
};



module.exports = Authenticate;
