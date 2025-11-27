import { asyncHandler } from "../utils/asyncHedler.js"
import { errorHandler } from '../utils/errorHendler.js'
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const jwtSecret = process.env.JWTSECRET || 'nalkdfjhoeirqo39304'

export const createAdmin = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body
  if (!email || !name || !password) {
    return next(new errorHandler("All fields are required", 400));
  }

  const existingAdmin = await prisma.admin.findFirst();
  if (existingAdmin) {
    return next(new errorHandler("Admin already exists", 400));
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const admin = await prisma.admin.create({
    data: { email, name, passwordHash }
  })

  res.status(200).json({
    success: true,
    message: "admin create successful",
    user: admin,
  });

})


export const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new errorHandler("All fields are required", 400));
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });
  if (!admin) {
    return next(new errorHandler("Admin Not Found", 404));
  }

  const isMach = await bcrypt.compare(password, admin.passwordHash)
  if (!isMach) {
    return next(new errorHandler("Admin Not Found"), 404)
  }


  const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, {
    expiresIn: "7d",
  })

  res.cookie("adminToken", token, {
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "admin login successful",
    user: admin,
  });

})


export const getAdminProfile = asyncHandler(async (req, res, next) => {

  const adminId = req.admin.id

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!admin) {
    return next(new errorHandler("Admin Not Found", 404));
  }

  const { passwordHash: _, ...profileWithoutPassword } = admin;

  res.status(200).json({
    success: true,
    message: "admin profile fach successful",
    admin: profileWithoutPassword,
  });

})

export const logoutAdmin = asyncHandler(async (req, res, next) => {

  const adminId = req.admin.id

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!admin) {
    return next(new errorHandler("Admin Not Found", 404));
  }


  res.cookie("adminToken", "", {
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: "admin logout successful",
  });

})