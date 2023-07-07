const mongoose = require("mongoose");



const itemSchema = new mongoose.Schema({
  itemsName: {
    type: String,
    required: true,
    unique: true
  },
  itemsUnits: {
    type: Number,
    required: true,
   
  },
  damageItemsUnits: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String, // Assuming you store the file path or URL as a string
    // required: true,
  },
  selectedFileName: {
    type: String, // Assuming you store the file path or URL as a string
    // required: true,
  },
  remarks: {
    type: String,
    required: true,
  },

});


const Items = mongoose.model("Items", itemSchema );

module.exports = Items;
