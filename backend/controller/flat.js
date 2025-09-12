const flats=require("../models/flat")
const errorHandler = require('../middleware/error');


const addFlat = async (req,res,next)=>{
    try{
        const flatData = req.body;

        // Securely setting the who listed to the currently logged-in user
        flatData.listedBy = req.user.id; 

        const newFlat = await flats.create(flatData);
        return res.status(201).json(newFlat)
    }
    catch(err){
        next(err);
    }
}


const deleteFlat = async (req,res,next)=>{
    try{
        const flat = await flats.findById(req.params.id);
        if(!flat){
            return next(errorHandler(404,'flat not found !'));
        }

        if(req.user.id !== flat.listedBy){
            return next(errorHandler(401,'You can only delete your own flat or PG listing !'));
        }

        await flats.findByIdAndDelete(req.params.id);
        res.status(200).json('flat has been deleted successfully');
    }
    catch(err){
        next(err);
    }
};





const updateFlat = async (req,res,next)=>{
    try{

        const flat = await flats.findById(req.params.id);
        if(!flat){
            return next(errorHandler(404,'flat not found !'));  
        }
    
        if(req.user.id !== flat.listedBy){
            return next(errorHandler(401,'You can only update your own flat or PG listing'));
        }
        
        const updatedFlat = await flats.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new : true}
        );
        res.status(200).json(updatedFlat);
    
    }
    catch(err){
        next(err);
    }
}


const getFlat = async (req,res,next)=>{
    try{
        const flat = await flats.findById(req.params.id);

        if(!flat){
            return next(errorHandler(404,'flat not found !'));
        }

        res.status(200).json(flat);
    }
    catch(err){
        next(err);
    }
}


const getFlats=async(req,res)=>{
    const allFlats=await flats.find()
    return res.json(allFlats)
}


module.exports={addFlat,deleteFlat,updateFlat,getFlat,getFlats};