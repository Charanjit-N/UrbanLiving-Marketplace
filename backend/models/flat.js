const mongoose=require("mongoose")

const flatSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    address:{
        type : String,
        required : true,
    },
    description : {
        type: String,
        required: true,
    },
    category: {
        type : String,
        required : true,
    },
    type:{
        type : String,
        required : true,

    },
    offer : {
        type: Boolean,
        required : true,
    },
    regularPrice: {
        type : Number,
        required : true,
    },
    discountPrice : {
        type : Number,
        required : true,
    },
    
    bhk : {
        type : Number,
        required : true,
    },
    furnished : {
        type : Boolean,
        required: true,
    },
    parkingSpace : {
        type : Boolean,
        required : true,
    },
    messFacility : {
        type : Boolean,
        required : true,
    },
    sharing : {
        type : Number,
        required : true,
    },
    
    
    imageUrls : {
        type : Array,
        required : true,
    },
   
    listedBy:{
        type : String ,
        required : true,
    }
},{timestamps:true}
)

module.exports=mongoose.model("Flats",flatSchema)