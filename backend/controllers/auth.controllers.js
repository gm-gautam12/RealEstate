import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';




const signup = asyncHandler( async(req,res) => {

    const {username,email,password} = req.body;

    const hashPassword = await bcrypt.hash(password,10);

    if(!username || !email ||!password)
        //throw new ApiError(400,"please fill all the required fields");
      return res.status(401).json(new ApiResponse(401,null,"please fill all the required fields"));

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    });

    if(existedUser)
        //throw new ApiError(404,"user already exist");
      return res.status(401).json(new ApiResponse(401,null,"user already exist"));

    const user = await User.create({
        username:username.toLowerCase(),
        email,
        password:hashPassword
    });

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser)
       // throw new ApiError(500,"user not registered, something went wrong while registering user");
          return res.status(500).json(new ApiResponse(500,null,"user not registered, something went wrong while registering user"));
    return res.status(200).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})


const signin = asyncHandler(async(req,res)=> {

    const {email,password} = req.body;

    if(!email || !password)
        //throw new ApiError(400,"please fill all the required fields");
      return res.status(401).json(new ApiResponse(401,null,"please fill all the required fields"));

    const user = await User.findOne({email});

    if(!user)
       // throw new ApiError(404,"user does not exist");
      return res.status(401).json(new ApiResponse(401,null,"user does not exist"));

    const isPasswordValid = bcrypt.compareSync(password,user.password);

    if(!isPasswordValid)
        //throw new ApiError(401,"password is incorrect");
      return res.status(401).json(new ApiResponse(401,null,"password is incorrect"));

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

    const loggedInUser = await User.findById(user._id).select("-password");

     const options = {
        httpOnly:true,
        secure:true,
     }

     return res.status(200).cookie("accessToken",token,options).json(
        new ApiResponse(200,{
            user: loggedInUser,token
        },"User logged in successfully")
     )
})  


const googleOAuth = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('accessToken', token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie('accessToken', token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };
  

  const signOut = asyncHandler(async(req,res) => {

    res.clearCookie("accessToken").json(
      new ApiResponse(200,{},"user signed out successfully")
    );

  })
    


export { signup,signin,googleOAuth,signOut };