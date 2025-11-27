import express from 'express'
import { createUsers, loginUsers, logoutUser, userProfile } from '../controllers/userController.js';
import { userAuthMiddelware } from '../middlewares/userAuthMiddelware.js';

const router = express.Router();

router.post("/createUser", createUsers)
router.post("/loginUser", loginUsers)
router.get("/profile", userAuthMiddelware, userProfile)
router.get("/logoutUser", userAuthMiddelware, logoutUser)

export default router;