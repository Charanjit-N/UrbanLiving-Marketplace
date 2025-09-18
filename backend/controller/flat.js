const flats=require("../models/flat")
const errorHandler = require('../middleware/error');


const addFlat = async (req,res,next)=>{
    try{
        const flatData = req.body;

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


const getFlats = async (req,res,next)=>{
    try{
        const limit = parseInt(req.query.limit) || 5;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            offer = {$in : [true,false]};
        }

        let furnished = req.query.furnished;
        if(furnished===undefined || furnished==='false'){
            furnished = {$in : [false,true]};
        }

        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = {$in : [false,true]};
        }

        let type = req.query.type;
        if(type === undefined || type === 'all-type'){
            type = {$in : ['sale','rent']};
        }

        let category = req.query.category;
        if(category === undefined || category === 'all-category'){
            category = {$in : ['apartment','pg']};
        }

        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const fetechedFlats = await flats.find({
            name : {$regex : searchTerm, $options : 'i'},
            offer,
            furnished,
            parking,
            type,
            category,
        }).sort({[sort]: order}).limit(limit).skip(startIndex);

        return res.status(200).json(fetechedFlats);



    }catch(err){
        next(err);
    }
}



module.exports={addFlat,deleteFlat,updateFlat,getFlat,getFlats};