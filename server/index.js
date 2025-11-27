import express from 'express'
import 'dotenv/config'
import { errorMeddleware } from './middlewares/error.meddleware.js';
import userRoute from './routes/user.routes.js'
import adminRoute from "./routes/admin.routes.js"
import productRoute from "./routes/product.routes.js"
import categoryRoute from "./routes/category.routes.js"
import cartRoute from './routes/cart.routes.js'
import orderRoute from  "./routes/order.routes.js"
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js';
import cors from "cors";

const app = express()
const port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

connectDB()

app.use(
  cors({
  origin: [process.env.CLIENT_URL],
  credentials: true,
})
)

app.get("/", (req, res) => {
    res.send("server is runing")
})

app.use("/api/v1/user",userRoute)
app.use("/api/v1/admin", adminRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/category", categoryRoute)
app.use("/api/v1/cart", cartRoute)
app.use("/api/v1/order", orderRoute)


app.use(errorMeddleware)

app.listen(port, () => {
    console.log("server runing on",port)
})