const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//Register
 const register = async (req,res) =>{
 // console.log(req.body)
  //console.log(req.file)
    const exist = await User.exists({email:req.body.email})
    if(exist) {
    return res.status(201).send("Emaili ekziston eshte i regjistruar")
    }
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(req.body.password,salt)

    const newUser = User({
        fullName:req.body.fullName,
        email:req.body.email,
        password:hashPass, 
        image:req.file.filename
    })
const savedUser = await newUser.save()   
res.status(200).send({message:"Perdoruesi u regjistrua me sukses"})
 res.status(200).send()
  } catch (err) {
    console.log(err)
  }
}

//Login
const login = async (req,res) =>{
 
try {
    const user = await User.findOne({email:req.body.email}).lean()
    if(!user){
     return res.status(404).send({message:"Ky email nuk ekziston ne database"})
    }
       //nese kemi nje user
       if(!(await bcrypt.compare(req.body.password,user.password))){
        return res.status(404).send({message:"Passwordi i gabuar"})
       }
       //krijojme token
       const token = jwt.sign({
        _id:user._id,
        fullName:user.fullName,
        email:user.email
       },process.env.SEC_RET)
        res.cookie('jwt',token,{http:true,maxAge:24 * 24 * 60 * 1000 })
        return res.status(200).send({message:"Indetifikimi u krye me sukses"})
} catch (err) {
    console.log(err)
    return res.status(501).json({message:"Dicka shkoj keq"})
}
}

//User
const user = async (req,res) =>{
//console.log("backend get user",req.cookies)
try {
  
const biskotat = req.cookies["jwt"]

const verifiko = jwt.verify(biskotat,process.env.SEC_RET)
if(!verifiko) {
  return res.status(502).send("Dicka shkoj keq")
}

const user = await User.findOne({_id:verifiko._id}).select("-password").lean()
res.status(200).send(user)
} catch (err) {
  console.log(err)
  return res.status(501).send({message:"Dicka shkoj keq  "})
}

}

//Logout
const logout = (req,res) =>{

  //res.cookie('jwt',token,{http:true,maxAge:24 * 24 * 60 * 1000 })
res.cookie("jwt","",{maxAge:0})
 res.status(201).send({message:"Logout ju u shkeputet"})
}



//Edit
const edit = async (req,res) =>{
  //const {} req.body
  try {
    const updatedUser = {
    fullName:req.body.fullName,
    email:req.body.email,
 
    }

    let query = {
      _id:req.params.id
    }
    const updateNow = await User.findOneAndUpdate(query,updatedUser)
    if(updateNow){
      return res.status(201).send("Te dhenat u perditesuan")
    } else {
res.status(501).send("Te dhenat nuk u perditesuan")
    }
    } catch (error) {
    res.status(500).send(error)
    }




  //pasojme cookie qe e marim nga frontend ne nje constance 
//const biskotat = req.cookies["jwt"]
//verifikojme cookie duke perdorur fjalen kyce ne env seccret
//const verifiko = jwt.verify(biskotat,process.env.SEC_RET)
 //const userEdit = await User.findById(req.params.id)
 //console.log(req.body)
 //console.log(userEdit.password,)
 //console.log(verifiko._id,"verifiko")
 //console.log(req.params.id,"req.params.id")
//try {
  //const updatedUser = await User.findByIdAndUpdate(req.params.id,{
   // $set:req.body
  //},{new:true})
//res.status(201).json({message:"Te dhenat u perditesuan"})
//console.log(req.body)
//} catch (err) {
//console.log(err)
//return res.status(501).send(err)
//}
}

 
//Delete      
const deleteId = async (req,res) =>{
try {
  const user = await User.findOne({_id:req.params.id}).lean()
  if(!user){
   return res.status(404).send({message:"Ndodhi nje gabim"})
  }

     if(!(await bcrypt.compare(req.body.password,user.password))){
     return res.status(404).send({message:"Passwordi i gabuar"})
     }
     User.findOneAndDelete({_id:req.params.id})
     .then((success) => res.json(success)) 
     .catch((err) => console.log(err))
} catch (err) {
  res.status(500).json(err)

}
}

//Edit Pass
const editPass = async  (req,res) =>{
try {
  const salt = await bcrypt.genSalt(10)
  const hashPass = await bcrypt.hash(req.body.password,salt)

} catch (err) {

}
}


module.exports = {
    register,
    login,
    user,
    logout,
    edit,
    deleteId,
    editPass
  
}