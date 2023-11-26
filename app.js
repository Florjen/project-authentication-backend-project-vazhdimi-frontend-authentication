const express = require("express")
const cors = require("cors")
const cookies = require("cookie-parser")
require("dotenv").config()
//Inicializimi i route api/user
const apiUser = require("./routes/users")
//Inicializimi i database
const lidhumeDb = require('./db')
lidhumeDb()

const app = express()

//Middleware
app.use(express.static('public'))
app.use(cookies())
app.use(cors({
    origin:"http://localhost:3000",credentials:true
}))
app.use(express.json())

//Route api/user
app.use('/api/users',apiUser)


app.get('/',(req,res) =>{
    res.send("Homepage")
})


const PORT = process.env.PORT || 5002
app.listen(PORT,() =>{
    console.log("Serveri eshte ne porten",PORT)
})