const express=require("express")
const app=express()
const dotenv=require("dotenv").config();
const connectDb=require("./config/connectionDb")
const cors=require("cors")
const cookieParser = require('cookie-parser');

const PORT=process.env.PORT

connectDb()

app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use(express.static("public"))

app.use("/user",require("./routes/user"))
app.use("/flat-pg",require("./routes/flat"))


// error handling middleware , to convert to json format
app.use((err, req, res, next) => {
    // Set a default status code and message if they don't exist on the error object
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send the response as JSON
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });
});


app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})