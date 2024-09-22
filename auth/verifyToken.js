import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

//Authentication by generating JWT tokens....

export const authenticate = async (req, res, next) => {
  // get tokem headers

  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ sucess: false, message: "no Tken, authentication denied" });
  }
  try {
    // console.log(authToken)

    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return response.status(401).json({ message: "token Expired" });
    }
    return res.status(401).json({ sucess: false, message: "invalid token" });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is missing" });
  }

  try {
    var user;
    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    try {
      if (!roles.includes(user.role)) {
        return res
          .status(401)
          .json({ sucess: false, message: "you are not autherized" });
      }
    } catch (err) {
      console.log(err);
    }

    next();
  } catch (err) {
    console.log(err);
  }
};
