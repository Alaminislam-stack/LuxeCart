import express from 'express'
import { createAdmin, getAdminProfile, loginAdmin, logoutAdmin } from '../controllers/adminController.js';
import { adminAuthMiddleware } from '../middlewares/adminAurhMiddelware.js';

const router = express.Router();

router.post("/createAdmin", createAdmin)
router.post("/loginAdmin", loginAdmin)
router.get("/getAdminProfile", adminAuthMiddleware, getAdminProfile)
router.get("/logoutAdmin", adminAuthMiddleware, logoutAdmin)

export default router;