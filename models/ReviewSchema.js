import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Doctor"   
     
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    
    },
    reviewText: {
      type: String,
      required: false,
      ref:"Review",
     
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
      default: 0,
    },
    
  },
  { timestamps: true }
);




  ReviewSchema.pre(/^find/, function(next) {
    this.populate({
      path: "user",
      select: "name photo"
    });
    next();
});






// ReviewSchema.statics.calcAverageRatings = async function(doctorid){
//   const stats = await this.aggregate([{
//     $match:{doctor:doctorid}
  
//   },{
//     $group:{id:"$doctor"},
//     numOfRating:{$sum:1},
//     avgRating:{$avg:'$rating'}
//   }]) 
//   console.log(stats)
// }
// ReviewSchema.post('save',function(){
//   this.constructor.calcAverageRatings(this.doctor)
// })



 export default mongoose.model("Review", ReviewSchema);
