import User from '../models/UserSchema.js'
import Booking from '../models/BookingSchema.js'
import DoctorSchema from '../models/DoctorSchema.js'

export const updateUser=async (req,res)=>{
    const id = req.params.id
    try{

        const updatedUser=await User.findByIdAndUpdate(id , {$set:req.body},{new:true})
        res.status(200).json({sucess:true,message:'sucessfully updated',data:updatedUser})
    }catch(err){
        res.status(500).json({success:false,message:'updated func failed'})   
    }
}



//...........................................................................................................


export const deleteUser=async (req,res)=>{
    const id = req.params.id
    try{

        await User.findByIdAndDelete(id , )
        res.status(200).json({sucess:true,message:'sucessfully deleted'})
    }catch(err){
        res.status(500).json({success:false,message:'delete func failed'})   
    }
}

//................................................................................................................

export const findSingleUser=async (req,res)=>{
    const id = req.params.id
    try{

        const userSingle=await User.findById(id).select("-password")
        res.status(200).json({success:true,message:'sucessfully find User',data:userSingle})
    }catch(err){
        res.status(404).json({success:false,message:'finding failed'})   
    }
}



//................................................................................................................

export const getAllUsers=async (req,res)=>{ 
    
    try{

        const allUsers=await User.find({}).select("-password")
        res.status(200).json({sucess:true,message:'sucessfully updated',data:allUsers})
    }catch(err){
        console.log(err)
        res.status(404).json({success:false,message:'users getting failed'})   
    }
}

export const getUserProfile=async(req,res)=>{
    // console.log("..............................................")
    const userId = req.userId
    // console.log(userId)
    
    try{
        const user=await User.findById(userId)
        if(!user){
            res.status(404).json({sucess:false,message:"user not found"})
        }
        const {password,...rest}=user._doc
        console.log("hello",{hello:{...rest}})
        
        return res.status(200).json({sucess:true,message:"sucessFull",message:"profile info is getting",data:{...rest}})
        
    }catch(err){
        console.log(err)
        
        return res.status(500).json({sucess:false,message:"something wrong cannot get"})}
}

export const getAppointment=async (req,res)=>{
    try{

        const bookings =await Booking.find({user:req.userId})
        const doctorsId =bookings.map(el=>el.doctor.id)
        const doctor =await DoctorSchema.find({_id:{$in:doctorsId }}).select('-password')
        return res.status(200).json({sucess:true,message:"Appoint found",data:doctor})

    }catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:"Appontment not found"})
        
    }

}










