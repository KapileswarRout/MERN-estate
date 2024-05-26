import User from "../models/user.model.js";
import bcrypt from 'bcrypt'

export const signup =async (req,res,next)=>{
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    try {
        await newUser.save(); //as this takes time so async await is used
        res.status(201).json("User created successfully")
        
    } catch (error) {
        next(error); //if error occurs it is passed to the next middleware in the index.js
    }

}