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


const signin = asyncHandler(async(req,res)=> {

    const {email,password} = req.body;

    if(!email || !password)
        throw new ApiError(400,"please fill all the required fields");

    const user = await User.findOne({email});

    if(!user)
        throw new ApiError(404,"user does not exist");

    const isPasswordValid = bcrypt.compareSync(password,user.password);

    if(!isPasswordValid)
        throw new ApiError(401,"password is incorrect");

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

const googleOAuth = asyncHandler(async(req,res)=>{

    try {
        const user = await User.findOne({ email:req.body.email });
        if(user){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            const exisitedUser = await User.findById(user._id).select("-password");

        const options = {
            httpOnly:true,
            secure:true,
        }

        return res.status(200).cookie("accessToken",token,options).json(
            new ApiResponse(200,exisitedUser,"User logged in successfully")
        )
        }
        else{
          const generatedPasword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // 16 characters password
          const hashPassword = bcrypt.hashSync(generatedPasword,10);

          const newUser = await User.create({
                username:req.body.username.toLowerCase()+Math.random().toString(36).slice(-4),
                email:req.body.email,
                password:hashPassword,
                avatar:req.body.photo
          })

          const newToken = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
          const newCreatedUser = await User.findById(newUser._id).select("-password");
          const options = {
            httpOnly:true,
            secure:true,
        }
          res.status(200).cookie("accessToken",newToken,options).json(
            new ApiResponse(200,newCreatedUser,"User registered and logged in successfully")
          )
        }
    } catch (error) {
       next(error);
    }
})

// const googleOAuth = async (req, res, next) => {
//     try {
//       const user = await User.findOne({ email: req.body.email });
//       if (user) {
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//         const { password: pass, ...rest } = user._doc;
//         res
//           .cookie('access_token', token, { httpOnly: true })
//           .status(200)
//           .json(rest);
//       } else {
//         const generatedPassword =
//           Math.random().toString(36).slice(-8) +
//           Math.random().toString(36).slice(-8);
//         const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
//         const newUser = new User({
//           username:
//             req.body.name.split(' ').join('').toLowerCase() +
//             Math.random().toString(36).slice(-4),
//           email: req.body.email,
//           password: hashedPassword,
//           avatar: req.body.photo,
//         });
//         await newUser.save();
//         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//         const { password: pass, ...rest } = newUser._doc;
//         res
//           .cookie('access_token', token, { httpOnly: true })
//           .status(200)
//           .json(rest);
//       }
//     } catch (error) {
//       next(error);
//     }
//   };
  
    


export {signup,signin,googleOAuth};