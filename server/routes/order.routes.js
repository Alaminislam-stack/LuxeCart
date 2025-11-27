import express from 'express'
import { userAuthMiddelware } from '../middlewares/userAuthMiddelware.js';
import { adminAuthMiddleware } from '../middlewares/adminAurhMiddelware.js';
import { createOder, getAllOrder, getAllOrderByUserId, getOrderById, updateOrderStatus } from '../controllers/oderController.js';

const router = express.Router();

router.post("/createOder", userAuthMiddelware, createOder)
router.get("/getAllOrders", adminAuthMiddleware ,getAllOrder)
router.post("/orderGetByIb/:orderId", userAuthMiddelware, getOrderById)
router.post("/updateOrderState", adminAuthMiddleware, updateOrderStatus)
router.get("/getAllOrderByUserId", userAuthMiddelware, getAllOrderByUserId)

export default router;