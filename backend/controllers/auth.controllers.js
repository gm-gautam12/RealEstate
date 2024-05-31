import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';




const signup = asyncHandler( async(req,res) => {

    const {username,email,password} = req.body;

    const hashPassword = await bcrypt.hash(password,10);

    if(!username || !email ||!password)
        throw new ApiError(400,"please fill all the required fields");

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    });

    if(existedUser)
        throw new ApiError(404,"user already exist");

    const user = await User.create({
        username:username.toLowerCase(),
        email,
        password:hashPassword
    });

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser)
        throw new ApiError(500,"user not registered, something went wrong while registering user");

    return res.status(200).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})
  
    


export {signup};