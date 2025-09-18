const User = require("../models/user");
const errorHandler = require("../middleware/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const flats = require("../models/flat");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const userSignUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email and password are required" });
  }
  let userObj1 = await User.findOne({ username });
  if (userObj1) {
    return res.status(400).json({ error: "Username already exists" });
  }
  let userObj2 = await User.findOne({ email });
  if (userObj2) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, email, password: hashedPassword });
    res
      .json({
        message: "user created successfully",
      })
      .status(201);
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password both required" });
    }
    let user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, ...remain } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(remain);
    } else {
      return res.status(400).json({ error: "Invaild credientials" });
    }
  } catch (err) {
    next(err);
  }
};

const userLogout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user has been logged out !");
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    // validating mongodb user id first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(404, "User not found"));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "user not found"));
    }
    const { password: pass, ...remain } = user._doc;
    return res.status(200).json(remain);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;

  if (req.user.id !== id)
    return next(errorHandler(401, "You can update only your own account !!"));

  // validating mongodb user id first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(404, "User not found"));
  }

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password: req.body.password,
          username: req.body.username,
          avatar: req.body.avatar,
          email: req.body.email,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));

  try {

    const userListings = await flats.find({ listedBy: req.params.id });

    if (userListings && userListings.length > 0) {
      const publicIdsToDelete = userListings.flatMap((listing) =>
        listing.imageInfo.map((image) => image.public_id)
      );

      // Delete all images from Cloudinary in a single bulk operation
      if (publicIdsToDelete.length > 0) {
        // Use 'delete_resources' for efficient bulk deletion
        await cloudinary.api.delete_resources(publicIdsToDelete);
      }

      // Delete all the listings from the database
      await flats.deleteMany({ listedBy: req.params.id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res
      .status(200)
      .json({success: true, message:"user has been deleted and his listed flats also deleted!"});
  } catch (err) {
    next(err);
  }
};

const getFlatsListedByUser = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const userListedflats = await flats.find({ listedBy: req.params.id });
      res.status(200).json(userListedflats);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings"));
  }
};

module.exports = {
  userSignUp,
  userLogin,
  userLogout,
  getUser,
  deleteUser,
  updateUser,
  getFlatsListedByUser,
};
