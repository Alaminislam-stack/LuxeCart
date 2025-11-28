import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWTSECRET || "nalkdfjhoeirqo39304";

export const createUsers = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return next(new errorHandler("All fields are required", 400));
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    return next(new errorHandler("User already exists", 400));
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });

  res.status(200).json({
    success: true,
    message: "user create successful",
    user: user,
  });
});

export const loginUsers = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorHandler("All fields are required", 400));
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return next(new errorHandler("User Not Found", 404));
  }

  const isMach = await bcrypt.compare(password, user.passwordHash);
  if (!isMach) {
    return next(new errorHandler("Uasr Not Found"), 404);
  }

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "user login successful",
    user: user,
  });
});

export const userProfile = asyncHandler(async (req, res, next) => {
  const userid = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      carts: true,
      orders: true,
    },
  });
  if (!user) {
    return next(new errorHandler("User Not Found", 404));
  }

  const { passwordHash: _, ...profileWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: "user profile fach successful",
    user: profileWithoutPassword,
  });
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return next(new errorHandler("User Not Found", 404));
  }

  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: "user logout successful",
  });
});
