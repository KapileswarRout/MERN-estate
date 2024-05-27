import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
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
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //a unique thing to the user is added to token which is _id in mongoDB 
    //remove sensitive information from raw data
    const {password: pass, ...userWithoutPassword} = validUser._doc 
    res
      .cookie("accessToken", token, { httpOnly: true }) //no other thirdparty app can have acces to our cookie by httpOnly 
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
