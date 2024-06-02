import { ApiError } from "./ApiError.js";
import jwt from "jsonwebtoken";

const verifyUser =  (req, res, next) => {

   /* This code snippet is a part of a function called `verifyUser` that is used to check if a user is
   authorized to access a particular resource. */
    const token  = req.cookies.accessToken;
    if(!token)
    return next(new ApiError(401,"unauthirized access"));

    jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
        if(err)
            return next(new ApiError(403,"forbidden"));

        req.user = user;
        next();

    })
}

export default verifyUser;