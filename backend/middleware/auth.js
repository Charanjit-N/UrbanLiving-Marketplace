const jwt=require("jsonwebtoken")
const errorHandler = require("./error");

const verifyToken=async(req,res,next)=>{

    const token = req.cookies.access_token;

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err){
                return next(errorHandler(403,'Forbidden'));
            }
            else{
                req.user=user;
                next();
            }
        })
    }
    else{
        return next(errorHandler(401,'unauthorized'));
    }
}
module.exports= {verifyToken}