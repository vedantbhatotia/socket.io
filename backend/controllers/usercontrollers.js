const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const secret = process.env.secret
function generateToken(userId){
    return jwt.sign({userId},secret,{
        expiresIn:"30d"
    })
}
const registerUser = asyncHandler(async (req,res)=>{
    const {name,email,password,pic} = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
    if (user) {
        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token:generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
})
const authUser = asyncHandler(async(req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        if (password === user.password) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

module.exports = {registerUser,authUser};