import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    }
}, {timestamps:true});  //timestamps add two extra feature one is the time of creation and other is the time of update of user

const User = mongoose.model('User', userSchema);

export default User;