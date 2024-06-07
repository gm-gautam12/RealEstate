import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from 'bcryptjs';


const user = asyncHandler(async (req,res) => {
    res.status(200).json(
        new ApiResponse(200, "Api tested successfully")
    )
})

// form verifyuser we will directly get the user id from req;
const updateUser = asyncHandler(async(req,res,next) => {

   
     if(req.user.id !== req.params.id)
        return next(new ApiError(403,"you are not allowed to update this user"));

    try {
     if(req.body.password)
         req.body.password = bcrypt.hashSync(req.body.password,10);
 
     const user = await User.findByIdAndUpdate(req.params.id,{
         $set:{
             username: req.body.username,
             email: req.body.email,
             password:req.body.password,
             avatar: req.body.avatar,
         }
     },{new:true});
 
     if(!user)
         throw new ApiError(500,"something went wrong while updating user");
 
     const updatedUser = await User.findById(user._id).select("-password");
 
     return res.status(200).json(
         new ApiResponse(200,updatedUser,"user updated successfully")
     )
   } catch (error) {
        next(error);
   }

})

// const updateUser = async (req, res, next) => {
//     if (req.user.id !== req.params.id)
//         return next(ErrorHandler(401, 'You can only update your own account!'));
//       try {
//         if (req.body.password) {
//           req.body.password = bcrypt.hashSync(req.body.password, 10);
//         }
    
//         const updatedUser = await User.findByIdAndUpdate(
//           req.params.id,
//           {
//             $set: {
//               username: req.body.username,
//               email: req.body.email,
//               password: req.body.password,
//               avatar: req.body.avatar,
//             },
//           },
//           { new: true }
//         );
    
//         const { password, ...rest } = updatedUser._doc;
    
//         res.status(200).json(rest);
//       } catch (error) {
//         next(error);
//       }
// };

const deleteUser = asyncHandler(async(req,res,next)=>{

    if(req.user.id !== req.params.id)
        return next(new ApiError(401,"you can only delete your own account"));

    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if(!user)
            throw new ApiError(500,"something went wrong while deleting user");

        return res.clearCookie("accessToken").status(200).json(
            new ApiResponse(200,{},"user deleted successfully")
        );
        
    } catch (error) {
        return next(new ApiError(500,"something went wrong while deleting user"));
    }
})

export {user,updateUser,deleteUser};