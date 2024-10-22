import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import auth from './Routes/auth.js'
// import crypto from 'crypto'
import UserRoute from './Routes/UserRoute.js'
import ReviewRoute from './Routes/ReviewRoute.js'
import DoctorRoute from './Routes/DoctorRoute.js'





dotenv.config()
const app=express()
const port =process.env.PORT || 8000



const corsOption ={
    orgin:true
}

app.get('/',(req, res)=>{
    res.send('Api is working')
})
//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOption ))
app.use('/api/v1/auth',auth) //domain .../register or /login
app.use('/api/v1/user',UserRoute)
app.use('/api/v1/doctor',DoctorRoute)
app.use('/api/v1/review',ReviewRoute)

//connect database\)/;

mongoose.set('strictQuery',false)
const connecteddb=async()=>{
    try{
       await  mongoose.connect(process.env.MONG_URL,{serverSelectionTimeoutMS: 5000})
       console.log('MongoDb database is connected')
    }catch(err){
      console.log("error in connecting")
    }
}



app.listen(port,()=>{
    connecteddb();
    console.log('server is running at port no: '+ port)
})
