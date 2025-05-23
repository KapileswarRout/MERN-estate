import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save(); //as this takes time so async await is used
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error); //if error occurs it is passed to the next middleware in the index.js
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body; //destructuring of email password
  try {
    const validUser = await User.findOne({ email }); //findOne method is used on User model to search for the email
    if (!validUser) return next(errorHandler(404, "User not found!")); //middleware uses the custom error to show in UI
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //a unique thing to the user is added to token which is _id in mongoDB
    //remove sensitive information from raw data
    const { password: pass, ...userWithoutPassword } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true }) //no other thirdparty app can have acces to our cookie by httpOnly
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};


export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');  //on clearing of cookie account will signout
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};