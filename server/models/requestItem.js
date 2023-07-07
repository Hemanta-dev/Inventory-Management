const mongoose = require("mongoose");



const itemRequestSchema  = new mongoose.Schema({
  itemsName: {
    type: String,
    required: true,
    unique: true
  },
  itemsUnits: {
    type: Number,
    required: true,
   
  },
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isApproved:{
    type:Boolean,
    default:false
  }


});


const ItemsRequest = mongoose.model("ItemsRequest", itemRequestSchema );

module.exports = ItemsRequest;