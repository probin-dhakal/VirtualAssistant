import express from 'express'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
dotenv.config()
const app=express();


const port = process.env.port

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter);




app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on port ${port}`);
})