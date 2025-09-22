const express=require("express")
const app=express()
const dotenv=require("dotenv").config();
const connectDb=require("./config/connectionDb")
const cors=require("cors")
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const PORT=process.env.PORT || 5000

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

connectDb()

app.use(cors())

app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use(express.static("public"))

//  check endpoint to tell front end whether server is up or not
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/user",require("./routes/user"))
app.use("/flat-pg",require("./routes/flat"))

app.post('/deleteImageFromCloudinary', async (req, res) => {
    const { public_ids } = req.body;

    if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
        return res.status(400).json({ success: false, message: 'An array of public_ids is required' });
    }

    try {
        // Create a promise for each deletion
        const deletePromises = public_ids.map(id => cloudinary.uploader.destroy(id));
        
        // Wait for all deletion promises to resolve
        const results = await Promise.all(deletePromises);

        const allOk = results.every(result => result.result === 'ok');
   
        if (!allOk) {
            console.warn('Some images may not have been deleted:', results);
        }
       res.status(200).json({ success: true, message: 'Images scheduled for deletion' });
    } catch (error) {
        console.error('Cloudinary Deletion Error:', error);
        res.status(500).json({ success: false, message: 'Server error during image deletion.' });
    }
});


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