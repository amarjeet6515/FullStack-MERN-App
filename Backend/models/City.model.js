const mongoose = require("mongoose");


const activitySchema = new mongoose.Schema({
    title: String,
    price: Number,
    location: String,
    image: String,
    review: Number
  });
  
  const citySchema = new mongoose.Schema({
    id: Number,
    cityname: String,
    wishlist: String,
    price: Number,
    terrain: String,
    about: String,
    image: String,
    activity:[activitySchema]
  });
  
const CityModel = mongoose.model("city", citySchema);


module.exports = {
    CityModel
}