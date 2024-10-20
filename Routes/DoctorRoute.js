import { updateDoctor, deleteDoctor, findSingleDoctor,getAllDoctors, getDoctorProfile } from "../Controller/DoctorsController.js";
import express from 'express'
import { authenticate , restrict} from "../auth/verifyToken.js";
import ReviewRoute from './ReviewRoute.js'

const router = express.Router()
router.use('/:id/reviews', ReviewRoute)
router.get('/:id',authenticate,findSingleDoctor)
router.get('/',authenticate,getAllDoctors)
router.delete('/:id',authenticate,restrict(["Doctor"]),deleteDoctor)
router.put('/:id',authenticate,restrict(["Doctor"]),updateDoctor)
router.get('/profile/me',authenticate,restrict(["Doctor"]),getDoctorProfile)


export default router