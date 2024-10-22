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
      required:true
    

     

     
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
    select: "name photo",
  });
  
  next();
});






// ReviewSchema.statics.calcAverageRatings = async function(doctorId) {
//   try {
//     const stats = await this.aggregate([
//       {
//         $match: { doctor: doctorId }
//       },
//       {
//         $group: {
//           _id: "$doctor", // Correctly grouping by doctor
//           numOfRating: { $sum: 1 },
//           avg: { $avg: "$rating" }
//         }
//       }
//     ]);
//     console.log("$doctor")

//     // Handle the case when there are no ratings
//     if (stats.length > 0) {
//       console.log(stats);
//       // Optionally update the Doctor model with these stats
//       // Example:
//       // await Doctor.findByIdAndUpdate(doctorId, {
//       //   ratingsQuantity: stats[0].numOfRating,
//       //   ratingsAverage: stats[0].avgRating
//       // });
//     } else {
//       console.log("No ratings found for this doctor.");
//       // Optionally reset ratings for the doctor
//       // await Doctor.findByIdAndUpdate(doctorId, {
//       //   ratingsQuantity: 0,
//       //   ratingsAverage: 0
//       // });
//     }
//   } catch (error) {
//     console.error('Error calculating average ratings:', error);
//   }
// };

// // Post middleware to calculate average rating after saving a review
// ReviewSchema.post('save', function() {
//   this.constructor.calcAverageRatings(this.doctor);
// });

// // Post middleware to calculate average rating after removing a review
// ReviewSchema.post('remove', function() {
//   this.constructor.calcAverageRatings(this.doctor);
// });

// // Post middleware for updating a review (using findOneAndUpdate)
// ReviewSchema.post('findOneAndUpdate', async function(doc) {
//   if (doc) {
//     await this.model.calcAverageRatings(doc.doctor);
//   }
// });




 export default mongoose.model("Review", ReviewSchema);
