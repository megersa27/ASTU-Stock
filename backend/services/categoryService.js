import prisma from "../config/db.js";
import { ASTU_CATEGORIES } from "../utils/constants.js";

// Fallback in-memory categories if database is initializing or seeding
let memoryCategories = ASTU_CATEGORIES.map((cat, index) => ({
  id: index + 1,
  code: cat.code,
  name: cat.name,
  description: cat.description,
  createdAt: new Date().toISOString(),
}));
let nextCatId = memoryCategories.length + 1;

export const getAllCategories = async () => {
  try {
    const cats = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    if (cats && cats.length > 0) {
      return cats;
    }
  } catch (err) {
    // fallback to memory
  }
  return memoryCategories;
};

export const getCategoryById = async (id) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (category) return category;
  } catch (err) {
    // fallback
  }

  const cat = memoryCategories.find((c) => c.id === Number(id));
  if (!cat) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }
  return cat;
};

export const createCategory = async ({ name, code, description }) => {
  if (!name || !name.trim()) {
    const error = new Error("Category name is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    });
    if (existing) {
      const error = new Error("Category already exists");
      error.statusCode = 409;
      throw error;
    }
    return await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });
  } catch (err) {
    if (err.statusCode) throw err;
  }

  const existingMem = memoryCategories.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase() || (code && c.code === code.trim())
  );
  if (existingMem) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  const newCat = {
    id: nextCatId++,
    code: code?.trim() || `44${String(nextCatId).padStart(2, "0")}`,
    name: name.trim(),
    description: description?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  memoryCategories.push(newCat);
  return newCat;
};

export const updateCategory = async (id, { name, code, description }) => {
  const cat = await getCategoryById(id);

  try {
    return await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: name.trim(),
      },
    });
  } catch (err) {
    // fallback
  }

  if (name !== undefined) cat.name = name.trim();
  if (code !== undefined) cat.code = code.trim();
  if (description !== undefined) cat.description = description.trim();
  return cat;
};

export const deleteCategory = async (id) => {
  await getCategoryById(id);

  try {
    const productCount = await prisma.product.count({
      where: {
        categoryId: Number(id),
      },
    });

    if (productCount > 0) {
      const error = new Error("Cannot delete category because it has products assigned");
      error.statusCode = 409;
      throw error;
    }

    return await prisma.category.delete({
      where: { id: Number(id) },
    });
  } catch (err) {
    if (err.statusCode) throw err;
  }

  const cat = memoryCategories.find((c) => c.id === Number(id));
  memoryCategories = memoryCategories.filter((c) => c.id !== Number(id));
  return cat;
};