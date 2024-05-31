import mongoose from "mongoose";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const user = asyncHandler(async (req,res) => {
    res.status(200).json(
        new ApiResponse(200, "Api tested successfully")
    )
})

export {user};