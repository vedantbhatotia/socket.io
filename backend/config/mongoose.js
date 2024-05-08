require('dotenv').config(); 
const mongoose = require("mongoose");
const uri = process.env.MONGO_URL;
const connectDB = async () =>{
  try {
    await mongoose.connect(uri);
    console.log("Pinged your deployment. You successfully connected to DB!");
  } catch(err) {
    console.log(err);
  }
}

module.exports = connectDB;
