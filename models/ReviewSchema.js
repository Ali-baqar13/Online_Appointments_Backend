import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true, // Ensure a doctor is always specified
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure a user is always specified
    },
    reviewText: {
      type: String,
      required: true, // Review text is mandatory
      maxlength: 500, // Limit review text length if desired
    },
    rating: {
      type: Number,
      required: true, // Rating is mandatory
      min: 0,
      max: 5,
      default: 0, // Default rating is 0
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation date
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Middleware to populate user information on find queries
ReviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: "name photo", // Only retrieve name and photo
  });
  next();
});

// Static method to calculate average ratings for a doctor
ReviewSchema.statics.calcAverageRatings = async function(doctorId) {
  try {
    const stats = await this.aggregate([
      {
        $match: { doctor: doctorId }, // Filter reviews by doctor ID
      },
      {
        $group: {
          _id: "$doctor", // Group by doctor
          totalRating: { $sum: 1 }, // Count total ratings
          averageRating: { $avg: "$rating" }, // Calculate average rating
        },
      },
    ]);

    // Handle cases with or without ratings
    if (stats.length > 0) {
      console.log(stats);
      // Optionally update Doctor model with new ratings
      await mongoose.model("Doctor").findByIdAndUpdate(doctorId, {
        totalRating: stats[0].totalRating,
        averageRating: stats[0].averageRating,
      });
    } else {
      console.log("No ratings found for this doctor.");
      // Optional: Reset doctor's ratings
      await mongoose.model("Doctor").findByIdAndUpdate(doctorId, {
        totalRating: 0,
        averageRating: 0,
      });
    }
  } catch (error) {
    console.error('Error calculating average ratings:', error);
  }
};

// Post middleware to recalculate average rating after saving a review
ReviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.doctor);
});

// Post middleware to recalculate average rating after removing a review
ReviewSchema.post('remove', function() {
  this.constructor.calcAverageRatings(this.doctor);
});

// Post middleware for updating a review
ReviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await this.model.calcAverageRatings(doc.doctor);
  }
});

// Export the Review model
export default mongoose.model("Review", ReviewSchema);
