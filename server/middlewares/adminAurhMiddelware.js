
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";

export const adminAuthMiddleware = asyncHandler((req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new errorHandler("Not authorized, no token", 401));
    }
    const tokenData = jwt.verify(token, process.env.JWTSECRET)
    req.admin = tokenData;
    next();
});