const mongoose = require('mongoose')




const lidhumeDb = async () =>{

try {
const conn = await mongoose.connect(process.env.DATABASE_URL)
console.log("database u lidh me sukses")

} catch (err) {
    console.log(err)
    process.exit(1)
}


}


module.exports = lidhumeDb