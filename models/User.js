const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
fullName:{
    type:String,
},
email:{
    type:String,
    lowercase:true,
    unique:true
},
password:{
    type:String,
},
image:{
    type:String
},
userRole:{
    type:String,
    enum:["user","admin","superUser"],
    default:"user"
}


},

{timestamps:true})


module.exports = mongoose.model("User",userSchema)