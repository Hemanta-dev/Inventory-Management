const jwt = require("jsonwebtoken");
require('dotenv').config();
const Register = require("../models/registers");


const Authenticateadmin = async (req, res, next) => {
 
  try {
    const token = req.headers.authorization;

    // remove breaer from token 
    const formattedToken = token.replace(/^Bearer\s/, '');

    console.log(formattedToken ,"555555555555555555555555555555555555");

    if (!token) {
      return res.status(401).send("Unauthorized: No Authorization");
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(formattedToken, process.env.SECRET_KEY);

    
    const role = decodedToken.role;

    console.log(role,"99999999999999999999999999999");

    req.role = role;
    



    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No Authorization");
    console.log(err);
  }
};

module.exports = Authenticateadmin;
