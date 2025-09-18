const express=require("express")
const router=express.Router();
const { addFlat,deleteFlat,updateFlat,getFlat,getFlats} = require("../controller/flat")
const {verifyToken} = require("../middleware/auth")


router.post("/add",verifyToken,addFlat);
router.post("/update/:id",verifyToken,updateFlat);
router.delete("/delete/:id",verifyToken,deleteFlat);
router.get("/get/:id",getFlat);
router.get("/get",getFlats);

module.exports=router