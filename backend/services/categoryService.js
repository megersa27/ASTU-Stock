import prisma from "../config/db.js";

export const createCategory = async ({ name }) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  return await prisma.category.create({
    data: {
      name,
    },
  });
};

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const updateCategory = async (id, { name }) => {
  const category = await getCategoryById(id);

  const existingCategory = await prisma.category.findFirst({
    where: {
      name,
      NOT: {
        id: category.id,
      },
    },
  });

  if (existingCategory) {
    const error = new Error("Category name already exists");
    error.statusCode = 409;
    throw error;
  }

  return await prisma.category.update({
    where: { id },
    data: {
      name,
    },
  });
};

export const deleteCategory = async (id) => {
  await getCategoryById(id);

  const productCount = await prisma.product.count({
    where: {
      categoryId: id,
    },
  });

  if (productCount > 0) {
    const error = new Error(
      "Cannot delete category because it has products"
    );
    error.statusCode = 409;
    throw error;
  }

  return await prisma.category.delete({
    where: { id },
  });
};