import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import  authRouter from './routes/auth.routes.js';
import listingRouter from './routes/listing.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';



dotenv.config();

mongoose.connect(process.env.MONGO).then( ()=> {
    console.log("Connection to MongoDB Successfull");
}).catch((err)=>{
    console.log(err);
})


const __dirname = path.resolve();


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})


app.use("/api/user",userRouter);

app.use("/api/auth",authRouter);

app.use("/api/listing",listingRouter);


app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})
