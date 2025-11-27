import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinaryUpload.js";

const prisma = new PrismaClient();

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, categoryId } = req.body;
  const adminId = req.admin.id;

  const localImageFiles = req.files;

  console.log(name, description, price, stock, categoryId, localImageFiles);

  if (!name || !price || !stock) {
    return next(
      new errorHandler(
        "Product name, price, stock, and category are required",
        400
      )
    );
  }

  if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
    return next(new errorHandler("Invalid price or stock value", 400));
  }

  if (!localImageFiles || localImageFiles.length === 0) {
    return next(
      new errorHandler("At least one product image is required", 400)
    );
  }

  const uploadPromises = localImageFiles.map((file) =>
    uploadOnCloudinary(file.path)
  );

  const cloudinaryResponses = await Promise.all(uploadPromises);

  // কোনো আপলোড ব্যর্থ হলে (null রিটার্ন হলে)
  const validImageUrls = cloudinaryResponses
    .filter((response) => response && response.secure_url) // শুধুমাত্র সফল রেসপন্সগুলি ফিল্টার করুন
    .map((response) => response.secure_url);
  if (validImageUrls.length === 0) {
    return next(
      new errorHandler("Image upload failed. Please try again.", 500)
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl: validImageUrls,
      categoryId,
      adminId,
    },
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  const query = {
    include: {
      category: true,
    },
  };

  if (search) {
    query.where = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const products = await prisma.product.findMany(query);

  if (!products.length) {
    // If searching, return empty array instead of 404 to allow "no results" UI
    if (search) {
      return res.status(200).json({
        success: true,
        count: 0,
        products: [],
      });
    }
    return next(new errorHandler("No products found", 404));
  }

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

export const getProductDetails = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  if (!product) {
    return next(new errorHandler(`Product not found with ID: ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, categoryId, productId, featured } =
    req.body;

  const localImageFiles = req.files;

  const updateData = {};

  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (categoryId) updateData.categoryId = categoryId;
  if (featured !== undefined) {
    updateData.featured = featured === "true" || featured === true;
  }
  if (price) updateData.price = parseFloat(price);
  if (stock) updateData.stock = parseInt(stock);

  if (localImageFiles && localImageFiles.length > 0) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true },
    });

    if (!existingProduct) {
      return next(
        new errorHandler(`Product not found with ID: ${productId}`, 404)
      );
    }

    const uploadPromises = localImageFiles.map((file) =>
      uploadOnCloudinary(file.path)
    );
    const cloudinaryResponses = await Promise.all(uploadPromises);

    const newImageUrls = cloudinaryResponses
      .filter((response) => response && response.secure_url)
      .map((response) => response.secure_url);

    if (newImageUrls.length > 0) {
      updateData.imageUrl = [...existingProduct.imageUrl, ...newImageUrls];

      existingProduct.imageUrl.forEach((url) => {
        deleteFromCloudinary(url);
      });
    }
  }

  if (Object.keys(updateData).length === 0) {
    return next(new errorHandler("No valid update data provided", 400));
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return next(
        new errorHandler(`Product not found with ID: ${productId}`, 404)
      );
    }
    next(error);
  }
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return next(new errorHandler(`Product not found with ID: ${id}`, 404));
    }
    next(error);
  }
});
