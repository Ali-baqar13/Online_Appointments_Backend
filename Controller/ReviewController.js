import Review from '../models/ReviewSchema.js'
import Doctor from '../models/DoctorSchema.js'



export const getAllReviews=async(req,res)=>{
    

    try{

        const review=await Review.find({})
        res.status(200).json({sucess:true,message:"Review Found",data:review})
        console.log(review)

    }catch(err){

        res.status(404).json({sucess:false,message:"Review not Found"})

    }
};


// create Review.....

export const createReview=async(req,res)=> {
    console.log("err1")

    if( !req.body.doctor) req.params.userId
    console.log("err2")
    if( !req.body.user) req.params.doctorId
    console.log("err3")
    const doctor=await Doctor.findById(req.params.doctorId);
    // const newReview=new Review(req.body)
    const newReview = new Review({
        ...req.body,          // Spread the request body to include the review data
        doctor: req.params.doctorId // Add the doctor ID to the review
      });
      
  
    console.log("req",req.params.doctorId)
    console.log("doctor",doctor)

    try{
        console.log("err4")
        const savedReview =await newReview.save()
        console.log("err5")
        await Doctor.findByIdAndUpdate(
            req.params.doctorId,
            {
                $push: { reviews: savedReview._id }, // Push the review ID to reviews array
            }
            //   { new: true }
            // req.params.doctorId,{
            //     $push:{reviews: savedReview._id,doctorId:doctor._id}
            // }
        )
        res.status(200).json({sucess:true,message:"Review Submit",data:savedReview})

    }catch(err){
        console.log(err)
        res.status(500).json({sucess:false,message:"submission failed"})


    }

    
}