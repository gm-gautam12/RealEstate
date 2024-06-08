import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createListing = asyncHandler(async (req, res, next) => {
        res.status(200).json(new ApiResponse(200, "Listing Created"));
})

export { createListing };


