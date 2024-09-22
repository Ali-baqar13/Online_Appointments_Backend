import { updateUser, deleteUser, findSingleUser,getAllUsers, getUserProfile, getAppointment } from "../Controller/UserController.js";
import express from 'express'

import { authenticate , restrict } from "../auth/verifyToken.js";

const router = express.Router()

router.get('/:id',authenticate,restrict(["patient"]),findSingleUser)
router.get('/',getAllUsers)
router.delete('/:id',restrict(["patient"]),deleteUser)
router.put('/:id',authenticate,restrict(["patient"]),updateUser)
router.get('/profile/me',authenticate,restrict(["patient"]), getUserProfile)
router.get('/appointment/myappointment',authenticate,restrict(["patient"]), getAppointment)

export default router