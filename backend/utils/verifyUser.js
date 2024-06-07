import jwt from 'jsonwebtoken'; 
import { ApiError } from './ApiError.js';


export const verifyToken = (req,res,next) => {

    const token = req.cookies.accessToken;

    if(!token)
        return next(new ApiError(401,"Unauthorized access"));

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err)
            return next(new ApiError(403,"frobidden access"));

        req.user = user;
        next();
    });
};