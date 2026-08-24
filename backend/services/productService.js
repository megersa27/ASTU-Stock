import prisma from "../config/db.js";

export const createProduct = async ({
  name,
  sku,
  price,
  stock,
  categoryId,
}) => {
  const existingProduct = await prisma.product.findUnique({
    where: { sku },
  });

  if (existingProduct) {
    const error = new Error("Product SKU already exists");
    error.statusCode = 409;
    throw error;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.product.create({
    data: {
      name,
      sku,
      price,
      stock,
      categoryId,
    },
    include: {
      category: true,
    },
  });
};

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const updateProduct = async (
  id,
  { name, sku, price, stock, categoryId }
) => {
  await getProductById(id);

  const existingSku = await prisma.product.findFirst({
    where: {
      sku,
      NOT: {
        id,
      },
    },
  });

  if (existingSku) {
    const error = new Error("Product SKU already exists");
    error.statusCode = 409;
    throw error;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.product.update({
    where: { id },
    data: {
      name,
      sku,
      price,
      stock,
      categoryId,
    },
    include: {
      category: true,
    },
  });
};

export const deleteProduct = async (id) => {
  const product = await getProductById(id);

  await prisma.product.delete({
    where: { id },
  });

  return product;
};