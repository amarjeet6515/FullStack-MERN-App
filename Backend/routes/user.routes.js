const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");
require("dotenv").config();

const userController = Router();

userController.post("/signup", (req, res) => {
  const {fullName, email, password, } = req.body;
  bcrypt.hash(password, 5, async function (err, hash) {
    if (err) {
      res.send("Something went wrong, please try again later");
    }
    const user = new UserModel({
      fullName,
      email,
      password: hash
    });
    await user.save();
    res.json({message:"Signup successful"});
  });
});

userController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  console.log(user);
  if(!user){
    res.json({msg:"User not found"})
  }
  else{
    const hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        res.send("Something went wrong, please try again later");
      }
      if (result) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({message:"Login Successful",token})
      } else {
        res.status(404).json({message:"Invalid credentials, please signup if you haven't"});
      }
    });
  }
 
});

module.exports = { userController };
