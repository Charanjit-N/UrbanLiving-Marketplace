const express=require("express")
const router=express.Router();
const { addFlat,deleteFlat,updateFlat,getFlat,getFlats} = require("../controller/flat")
const {verifyToken} = require("../middleware/auth")


router.post("/create",verifyToken,addFlat);
router.put("/update/:id",verifyToken,updateFlat);
router.delete("/delete/:id",verifyToken,deleteFlat);
router.get("/:id",getFlat);
router.get("/",getFlats);

module.exports=router