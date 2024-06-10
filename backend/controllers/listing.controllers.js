import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Listing } from "../models/listing.model.js";


const createListing = asyncHandler(async (req, res, next) => {
        try {
            const listing = await Listing.create(req.body);
            return res.status(201).json(
                new ApiResponse(201, listing, "Listing created successfully")
            )
        } catch (error) {
                throw new ApiError(500,error)
        }
})

export { createListing };


