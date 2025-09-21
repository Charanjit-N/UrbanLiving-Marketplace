const express=require("express")
const router=express.Router()
const {userSignUp,userLogin,google,userLogout,getUser,deleteUser,updateUser, getFlatsListedByUser}=require("../controller/user")

const {verifyToken} = require("../middleware/auth");

router.post("/signup",userSignUp)
router.post("/login",userLogin)
router.post("/google",google);
router.get("/logout",userLogout)

router.get("/:id",verifyToken, getUser);
router.put("/update/:id",verifyToken,updateUser);
router.delete("/delete/:id",verifyToken,deleteUser);
router.get("/listings/:id",verifyToken,getFlatsListedByUser);


module.exports=router