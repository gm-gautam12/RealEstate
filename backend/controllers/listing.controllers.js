import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Listing } from "../models/listing.model.js";


const createListing = asyncHandler(async (req, res, next) => {
        try {
            const listing = await Listing.create(req.body);
            console.log(req.body);
            return res.status(201).json(
                new ApiResponse(200,listing,"listing created successfully")
              // listing
            )
        } catch (error) {
                throw new ApiError(500,error)
        }
})

const deleteListing = asyncHandler(async(req,res) => {

        const listing = await Listing.findById(req.params.id);

        if(!listing)
          throw new ApiError(404,"listing not found");

        if(req.user.id !== listing.userRef)
            throw new ApiError(403,"you can only delete your own listing");

        try {

         await Listing.findByIdAndDelete(req.params.id);
        
         res.status(200).json(
                new ApiResponse(200,{},"listing deleted successfully")
         )
        } catch (error) {
            throw new ApiError(500,error);
        }
})

const updateListing = asyncHandler(async(req,res) => {

  const listing = await Listing.findById(req.params.id);

  if(!listing){
    throw new ApiError(404,"listing not found");
  }

  if(req.user.id !== listing.userRef)
      throw new ApiError(403,"you can only update your own listing");

  try {

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );

    res.status(200).json(
      new ApiResponse(200,updatedListing,"listing updated successfully")
    )
    
  } catch (error) {
    throw new ApiError(500,error);
  }

})

const getListing = asyncHandler(async(req,res) => {

 try {
   const listing = await Listing.findById(req.params.id);
   if(!listing)
     throw new ApiError(404,"listing not found");
 
   res.status(200).json(
     new ApiResponse(200,listing,"listing fetched successfully")
   )
 } catch (error) {
   throw new ApiError(500,error);
 }
})

const getListings = asyncHandler(async(req,res) => {

  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
  
    let offer = req.query.offer;
  
    if(offer === undefined || offer === "false")
      offer = {$in:[false,true]};
  
    let furnished = req.query.furnished;

    if(furnished === undefined || furnished === "false")
      furnished = {$in:[false,true]};

    let parking = req.query.parking;

    if(parking === undefined || parking === "false")
      parking = {$in:[false,true]};

    let type = req.query.type;

    if(type === undefined || type === "all")
      type = {$in:["sell","rent"]};

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";


    const listing = await Listing.find({
      name:{$regex:searchTerm,$options:"i"},
      offer,
      furnished,
      parking,
      type
    }).sort({[sort]:order}).limit(limit).skip(startIndex);


    return res.status(200).json(
      new ApiResponse(200,listing,"listings fetched successfully")
    )

  } catch (error) {
    throw new ApiError(500,error);
  }

})

export { createListing,deleteListing,updateListing,getListing,getListings };