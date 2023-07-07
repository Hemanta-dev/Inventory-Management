require("dotenv").config();
const express = require('express');

const bodyParser = require('body-parser');
const cors = require("cors");




const cookieParser = require("cookie-parser");


const app = express();
const PORT = 5000;


const connection = require("./db");
const Register = require("./models/registers");

const port = process.env.PORT || 8080;

// Increase the payload size limit
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as per your needs

// Middleware
app.use(express.json());
app.use(cookieParser());
//db connection
connection();
app.use(express.json());
app.use(require('./router/auth'));









app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

