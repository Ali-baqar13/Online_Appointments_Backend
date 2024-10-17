import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Review from "../models/ReviewSchema.js";
export const updateDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      sucess: true,
      message: "sucessfully updated",
      data: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "updated func failed" });
  }
};

//...........................................................................................................

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ sucess: true, message: "sucessfully deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "delete func failed" });
  }
};

//................................................................................................................

export const findSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    console.log(id);
    const DoctorSingle = await Doctor.findById({ _id: id })
      .populate("reviews")
      .select("-password")
      .exec();
    const reviews = await Review.find();
    console.log(reviews);
    // console.log("single doc",DoctorSingle)
    res.status(200).json({
      sucess: true,
      message: "sucessfully find Doctor",
      data: DoctorSingle,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ success: false, message: "finding failed" });
  }
};

//

//................................................................................................................

export const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctor = null;
    if (query) {
      doctor = await Doctor.find({
        isApproved: "approved",
        $or: [
         { name: { $regex: new RegExp(query, "i") }},
           { specialization: { $regex:   new RegExp(query, "i")  } },
        ],
      }).select("-password");
    } else {
      doctor = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res
      .status(200)
      .json({ sucess: true, message: "sucessfully updated", data: doctor });
  } catch (err) {
    console.log(err)
    res.status(404).json({ success: false, message: "Doctors getting failed" });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId =  req.userId;
  
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({ success: false, message: "doctor not found" });
    }
    console.log("start");

    const {...rest } = doctor._doc;
   
    console.log({ ...rest });

    const appointments = await Booking.find({ doctor: doctorId });

    return res.status(200).json({
      sucess: true,
      message: "sucessFull",
      message: "profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ sucess: false, message: "something wrong cannot get" });
  }
};
