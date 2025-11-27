import express from "express";
import {
  createCategory,
  getAllCategorys,
  deleteCategorys,
  updateCategory,
} from "../controllers/categoryController.js";
import { adminAuthMiddleware } from "../middlewares/adminAurhMiddelware.js";

const router = express.Router();

router.post("/createCategory", adminAuthMiddleware, createCategory);
router.get("/getCaregory", getAllCategorys);
router.post("/deleteCategory", adminAuthMiddleware, deleteCategorys);
router.put("/updateCategory", adminAuthMiddleware, updateCategory);

export default router;
