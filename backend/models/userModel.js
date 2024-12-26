const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        unique:false
    },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Date
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    contact:{
        type:String
    },
    address:{
        type:String
    },
    image:{
        type:String
    }

})

const User = new mongoose.model("User",userSchema);

module.exports = User;