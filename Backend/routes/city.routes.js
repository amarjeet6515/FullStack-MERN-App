const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CityModel } = require("../models/City.model");
require("dotenv").config();

const cityController = Router();

cityController.get("/", async (req, res) => {
  const city = await CityModel.find();
  res.json(city);
});

cityController.get("/:noteId", async (req, res) => {
  const {noteId} = req.params
  const notes = await CityModel.find({ _id: noteId });
  res.json(notes);
});

cityController.post("/create", async (req, res) => {
    const { id, cityname, wishlist, price, terrain, about, image, activity } = req.body;
  console.log(activity)
  const city = new CityModel({
    id,
    cityname,
    wishlist,
    price,
    terrain,
    about,
    image,
    activity
  });
  try {
    await city.save();
    res.json({ message: "city Created" });
  } catch (error) {
    console.log(error);
  }
});

cityController.delete("/delete/:empId", async (req, res) => {
  const { empId } = req.params;
  const deletedEmp = await CityModel.findOneAndDelete({
    _id: empId,
    userId: req.body.userId,
  });
  if (deletedEmp) {
    res.json({ message: "Deleted Successfully" });
  } else {
    res.json({
      message:
        "You are not allow to delete this Employee because its belong to someone else",
    });
  }
});

// cityController.patch("/edit/:empId", async (req, res) => {
//   const { empId } = req.params;
//   const updatedEmp = await EmpModel.findOneAndUpdate(
//     {
//       _id: empId,
//       userId: req.body.userId,
//     },
//     { ...req.body }
//   );
//   if (updatedEmp) {
//     res.json({ message: "Updated Successfully" });
//   } else {
//     res.json({
//       message:
//         "You are not allow to update this employee.",
//     });
//   }
// });

module.exports = { cityController };
