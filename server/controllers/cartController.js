import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!userId) {
    return next(new errorHandler("invaild user", 404));
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
});

if (!existingItem) {
  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity: quantity > 0 ? quantity : 1, 
    },
  });

  return res.json({
    success: true,
    message: "Product added to cart",
    item: newItem,
  });
}

const newQuantity = existingItem.quantity + quantity;

    if (newQuantity <= 0) {
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    return res.json({
      success: true,
      message: "Product removed from cart",
    });
  }        

  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      data: { quantity: existingItem.quantity + quantity },
    });

    return res.json({
      success: true,
      message: "cart updated",
      item: updatedItem,
    });
  }


  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  res.status(200).json({
    success: true,
    message: "cart create successful",
    newItem,
  });
});

export const getAllCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const carts = await prisma.cart.findUnique({
    where: { userId: userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!carts) {
    return new errorHandler("Cart not found");
  }

  res.status(200).json({
    success: true,
    message: "cart fach successful",
    carts,
  });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    return new errorHandler("Cart not found");
  }

  await prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Product Remove successful",
  });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    return new errorHandler("Cart not found");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

 return res.status(200).json({
    success: true,
    message: "clear cart successful",
  });
});
