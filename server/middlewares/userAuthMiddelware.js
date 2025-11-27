
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";

export const userAuthMiddelware = asyncHandler((req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new errorHandler("Not authorized, no token", 401));
    }
    const tokenData = jwt.verify(token, process.env.JWTSECRET)
    req.user = tokenData;
    next();
});