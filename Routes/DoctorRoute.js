import { updateDoctor, deleteDoctor, findSingleDoctor,getAllDoctors, getDoctorProfile } from "../Controller/DoctorsController.js";
import express from 'express'
import { authenticate , restrict} from "../auth/verifyToken.js";
import ReviewRoute from './ReviewRoute.js'

const router = express.Router()
router.use('/:doctorId/reviews', ReviewRoute)
router.get('/:id',authenticate,findSingleDoctor)
router.get('/',authenticate,getAllDoctors)
router.delete('/:id',authenticate,restrict(["doctor"]),deleteDoctor)
router.put('/:id',authenticate,restrict(["doctor"]),updateDoctor)
router.get('profile/me',authenticate,restrict(["doctor"]),getDoctorProfile)


export default router