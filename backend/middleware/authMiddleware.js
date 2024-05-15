const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const secret = process.env.secret
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        // console.log(secret)
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        req.user = await User.findById(decoded.userId).select("-password");
        // console.log(req.user)
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
  
  module.exports = { protect };