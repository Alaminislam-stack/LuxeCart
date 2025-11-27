import express from 'express'
import { userAuthMiddelware } from '../middlewares/userAuthMiddelware.js';
import {  clearCart, createCart, getAllCart, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.post("/createCart",userAuthMiddelware, createCart)
router.get("/getCart",userAuthMiddelware, getAllCart)
router.post("/removeFromCart", userAuthMiddelware, removeFromCart)
router.get("/clearCart",userAuthMiddelware, clearCart)

export default router;