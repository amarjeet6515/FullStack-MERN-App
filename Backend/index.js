const express = require('express');
const {userController} = require("./routes/user.routes")
const {connection} = require("./config/db")
const {cityController}= require("./routes/city.routes")
const {authenticate} = require('./middlewares/authentication')
const cors = require('cors')

const app = express();
require('dotenv').config()
app.use(cors())

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.use("/user", userController);

app.use(authenticate);

app.use("/city", cityController);



connection.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`listening on ${process.env.PORT}`);
    })
})
