const mongoose=require("mongoose")

const connectDb=async()=>{
    await mongoose.connect(process.env.MONGODBATLAS_CONNECTION_STRING)
    .then(()=>console.log("DB connected..."))
}

module.exports=connectDb