import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const admin = req.admin;
  if (!admin) {
    return next(new errorHandler("Unauthraig", 404));
  }
  if (!name) {
    return next(new errorHandler("Category name missing", 404));
  }

  const category = await prisma.category.create({
    data: { name },
  });

  res.status(200).json({
    success: true,
    message: "category create successful",
    category,
  });
});

export const getAllCategorys = asyncHandler(async (req, res, next) => {
  const categorys = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  if (!categorys) {
    return new errorHandler("Category not found");
  }

  res.status(200).json({
    success: true,
    message: "category fach successful",
    categorys,
  });
});

export const deleteCategorys = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    return new errorHandler("Category not found");
  }

  await prisma.category.delete({
    where: { id: category.id },
  });

  res.status(200).json({
    success: true,
    message: "category delete successful",
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id, name } = req.body;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return new errorHandler("Category not found");
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name },
  });

  res.status(200).json({
    success: true,
    message: "category update successful",
    category: updatedCategory,
  });
});
