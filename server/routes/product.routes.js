import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from '../controllers/productController.js';
import { upload } from '../middlewares/multerMiddleware.js';
import { adminAuthMiddleware } from '../middlewares/adminAurhMiddelware.js';

const router = express.Router();

router.post('/productCreate', adminAuthMiddleware, upload.array('images',4), createProduct);
router.get("/getAllProducts", getAllProducts)
router.post("/getProductDetails/:productId", getProductDetails)
router.put(
    "/updateProduct",
    adminAuthMiddleware,
    upload.array('images', 4),
    updateProduct
);
router.post("/deleteProduct", adminAuthMiddleware, deleteProduct)
export default router;