const mongoose=require("mongoose")

const flatSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    address:{
        type : String,
        required : true,
    },
    contact : {
        type: String,
        required: true,
    },
    apartmentNumber : {
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
    bhk : {
        type : Number,
        required : true,
    },
    sharing : {
        type : Number,
        required : true,
    },
    parking : {
        type : Boolean,
        required : true,
    },
    furnished : {
        type : Boolean,
        required: true,
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
    imageInfo : {
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