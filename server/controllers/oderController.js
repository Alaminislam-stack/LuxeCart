import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createOder = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    items,
    name,
    email,
    phoneNumber,
    address,
    city,
    zipCode,
    totalAmount,
    paymentMethod
  } = req.body;
  
  if (!userId) {
    return next(new errorHandler("invaild user", 404));
  }
  if (!items) {
    return next(new errorHandler("invaild data", 404));
  }
  if (
    !name ||
    !email ||
    !phoneNumber ||
    !address ||
    !city ||
    !zipCode ||
    !totalAmount ||
    !paymentMethod
  ) {
    return next(new errorHandler("All fields are required", 404));
  }

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      name,
      email,
      phoneNumber,
      address,
      city,
      zipCode,
      paymentMethod,
      items: {
        create: items, // এখন Type match করছে
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              imageUrl: true, // যদি একটাই ছবি থাকে
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Order Create successful",
    order,
  });
});

export const getAllOrder = asyncHandler(async (req, res, next) => {
  const orders = await prisma.order.findMany({
    orderBy: { orderDate: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, imageUrl: true },
          },
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Order fach successful",
    orders,
  });
});

export const getAllOrderByUserId = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, imageUrl: true },
          },
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Order fach successful",
    orders,
  });
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, imageUrl: true },
          },
        },
      },
    },
  });

  if (!order) {
    return next(new errorHandler("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "order fach byID successful",
    order,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId, status } = req.body;

  const validStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!validStatuses.includes(status)) {
    return next(new errorHandler("Invalid status value.", 404));
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  res.status(200).json({
    success: true,
    message: "Order status updated successfully.",
    updatedOrder,
  });
});
