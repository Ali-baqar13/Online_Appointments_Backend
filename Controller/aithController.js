
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateTokens=user=>{
    return jwt.sign({id:user.id, role:user.role},process.env.JWT_SECRET_KEY)
} 
export const register = async(req,res)=>{
    const {email , name, role ,password, photo, gender}=req.body
    try{

        let user=null ;
        if(role==='patient'){user=await User.findOne({email})}
        else if(role==='doctor'){user=await User.findOne({email})}

        if(user){
            return res.status(400).json({message:'user already exists'})
        }
        const salt =await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        if (role ==='patient'){
            user = new User ({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role,
            })
        }

        if (role ==='Doctor'){
            user = new Doctor ({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }
        await user.save()
        res.status(200).json({sucess:true,message:'User Sucessful created'})


    }
    catch(err){
        console.log(err)
        res.status(500).json({sucess:false,message:"User cann't created"})        

    }
};


export const Login = async(req,res)=>{
    const {email, password }= req.body;
   
    
    try{
        
        let user = null
        const patient=await User.findOne({email}) 

        const doctor=await Doctor.findOne({email}) 
        if(patient){
            user=patient

        }
        if(doctor){
            user=doctor
        }
        if( !user ){
            return res.status(404).json({message:"user not exists"})
        }
        console.log("uesr",user)
        const isPassword =  bcrypt.compare(req.body.password,user.password)
    
        if(!isPassword){return res.status(400).json({status:"false",message:"wrong email or password"})}
        const token=generateTokens(user)
        const {password, role, appointment, ...rest}=user._doc
        console.log("role=",role)
       console.log("rest",{...rest})
        return res.status(200).json({status:true,message:"sucessful",token,role,data:{...rest}})
        
    }
    // get take tokens
    
    catch(err){
        console.log("error",err)
        return res.status(500).json({message:"Invalid"})
        
    }
}