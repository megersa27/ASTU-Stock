import prisma from "../config/db.js";
import { recordAuditLog } from "./auditService.js";

// =========================================================
// MEMORY FALLBACK PRODUCTS
// =========================================================

let memoryProducts = [
  {
    id: 1,
    name: "A4 Printing Paper (80gsm)",
    sku: "4401-001",
    price: 450,
    stock: 120,
    unit: "Ream",
    minimumLevel: 20,
    maximumLevel: 500,
    reorderLevel: 40,
    safetyStock: 15,
    categoryId: 1,
    warehouseId: 1,
    description: "High quality white A4 printing and photocopy paper",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Ballpoint Pen (Blue, Box of 50)",
    sku: "4401-002",
    price: 350,
    stock: 15,
    unit: "Box",
    minimumLevel: 20,
    maximumLevel: 200,
    reorderLevel: 30,
    safetyStock: 10,
    categoryId: 1,
    warehouseId: 1,
    description: "Standard blue ink ballpoint pens for office use",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Heavy Duty Floor Detergent 5L",
    sku: "4402-001",
    price: 800,
    stock: 45,
    unit: "Bottle",
    minimumLevel: 10,
    maximumLevel: 100,
    reorderLevel: 20,
    safetyStock: 5,
    categoryId: 2,
    warehouseId: 1,
    description: "Multi-surface cleaning chemical for campus facilities",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "LED Ceiling Tube Light 18W",
    sku: "4403-001",
    price: 280,
    stock: 8,
    unit: "pcs",
    minimumLevel: 25,
    maximumLevel: 200,
    reorderLevel: 35,
    safetyStock: 10,
    categoryId: 3,
    warehouseId: 3,
    description: "Energy efficient LED replacement tube light",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Lab Safety Goggles & Eyewash",
    sku: "4406-001",
    price: 650,
    stock: 60,
    unit: "pcs",
    minimumLevel: 15,
    maximumLevel: 150,
    reorderLevel: 25,
    safetyStock: 10,
    categoryId: 6,
    warehouseId: 2,
    description: "Chemical splash resistant eye protection goggles",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

let nextProductId = 6;

// =========================================================
// HELPERS
// =========================================================

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const toInteger = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isInteger(number) ? number : fallback;
};

const getStatus = (
  stock,
  minimumLevel = 10,
  storedStatus = "active"
) => {
  if (storedStatus === "inactive") {
    return "inactive";
  }

  const quantity = Math.max(0, toNumber(stock, 0));
  const minimum = Math.max(0, toNumber(minimumLevel, 10));

  if (quantity <= 0) {
    return "critical";
  }

  if (quantity <= minimum) {
    return "low";
  }

  return "available";
};

const formatProduct = (product, options = {}) => {
  const minimumLevel = toNumber(
    product.minimumLevel ?? options.minimumLevel,
    10
  );

  const maximumLevel = toNumber(
    product.maximumLevel ?? options.maximumLevel,
    500
  );

  const reorderLevel = toNumber(
    product.reorderLevel ?? options.reorderLevel,
    20
  );

  const safetyStock = toNumber(
    product.safetyStock ?? options.safetyStock,
    5
  );

  const warehouseId = toInteger(
    product.warehouseId ?? options.warehouseId,
    1
  );

  const unit = product.unit ?? options.unit ?? "pcs";

  const description =
    product.description ?? options.description ?? "";

  return {
    ...product,

    unit,

    warehouseId,

    minimumLevel,

    maximumLevel,

    reorderLevel,

    safetyStock,

    description,

    status: getStatus(
      product.stock,
      minimumLevel,
      product.status
    ),
  };
};

// =========================================================
// CREATE PRODUCT
// =========================================================

export const createProduct = async (
  {
    name,
    sku,
    itemCode,
    price,
    stock,
    quantity,
    categoryId,
    warehouseId,
    unit,
    minimumLevel,
    maximumLevel,
    reorderLevel,
    safetyStock,
    description,
  },
  userId = null
) => {
  const actualName = String(name ?? "").trim();

  const actualSku = String(
    sku ?? itemCode ?? ""
  ).trim();

  const actualPrice =
    price !== undefined
      ? Number(price)
      : 0;

  const actualStock =
    stock !== undefined
      ? Number(stock)
      : quantity !== undefined
        ? Number(quantity)
        : 0;

  const catId = Number(categoryId);

  const whId =
    warehouseId !== undefined
      ? Number(warehouseId)
      : 1;

  const minLvl =
    minimumLevel !== undefined
      ? Number(minimumLevel)
      : 10;

  const maxLvl =
    maximumLevel !== undefined
      ? Number(maximumLevel)
      : 500;

  const reorderLvl =
    reorderLevel !== undefined
      ? Number(reorderLevel)
      : 20;

  const safety =
    safetyStock !== undefined
      ? Number(safetyStock)
      : 5;

  // -------------------------------------------------------
  // VALIDATION
  // -------------------------------------------------------

  if (!actualName) {
    const error = new Error(
      "Product name is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!actualSku) {
    const error = new Error(
      "SKU / Item Code is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(actualPrice) ||
    actualPrice < 0
  ) {
    const error = new Error(
      "Invalid product price"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isInteger(actualStock) ||
    actualStock < 0
  ) {
    const error = new Error(
      "Stock must be a non-negative integer"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isInteger(catId) ||
    catId <= 0
  ) {
    const error = new Error(
      "Valid categoryId is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(minLvl) ||
    minLvl < 0
  ) {
    const error = new Error(
      "Minimum level must be a non-negative number"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(maxLvl) ||
    maxLvl < minLvl
  ) {
    const error = new Error(
      "Maximum level must be greater than or equal to minimum level"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(reorderLvl) ||
    reorderLvl < 0
  ) {
    const error = new Error(
      "Reorder level must be a non-negative number"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(safety) ||
    safety < 0
  ) {
    const error = new Error(
      "Safety stock must be a non-negative number"
    );
    error.statusCode = 400;
    throw error;
  }

  // =======================================================
  // DATABASE
  // =======================================================

  try {
    const existing =
      await prisma.product.findUnique({
        where: {
          sku: actualSku,
        },
      });

    if (existing) {
      const error = new Error(
        "Product SKU / Item Code already exists"
      );
      error.statusCode = 409;
      throw error;
    }

    const data = {
      name: actualName,
      sku: actualSku,
      price: actualPrice,
      stock: actualStock,
      categoryId: catId,
      status: "active",
    };

    // Add optional database fields only when they exist
    if (unit !== undefined) {
      data.unit = String(unit);
    }

    if (warehouseId !== undefined) {
      data.warehouseId = whId;
    }

    if (minimumLevel !== undefined) {
      data.minimumLevel = minLvl;
    }

    if (maximumLevel !== undefined) {
      data.maximumLevel = maxLvl;
    }

    if (reorderLevel !== undefined) {
      data.reorderLevel = reorderLvl;
    }

    if (safetyStock !== undefined) {
      data.safetyStock = safety;
    }

    if (description !== undefined) {
      data.description =
        String(description).trim();
    }

    const created =
      await prisma.product.create({
        data,
        include: {
          category: true,
        },
      });

    const result = formatProduct(
      created,
      {
        unit: unit || "pcs",
        warehouseId: whId,
        minimumLevel: minLvl,
        maximumLevel: maxLvl,
        reorderLevel: reorderLvl,
        safetyStock: safety,
        description:
          description !== undefined
            ? String(description).trim()
            : "",
      }
    );

    await recordAuditLog({
      userId,
      action: "CREATE_INVENTORY_ITEM",
      entityType: "product",
      entityId: created.id,
      newValues: result,
    });

    return result;

  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    console.error(
      "Database product creation failed:",
      err.message
    );
  }

  // =======================================================
  // MEMORY FALLBACK
  // =======================================================

  const existingMem =
    memoryProducts.find(
      (product) => product.sku === actualSku
    );

  if (existingMem) {
    const error = new Error(
      "Product SKU / Item Code already exists"
    );
    error.statusCode = 409;
    throw error;
  }

  const newProduct = {
    id: nextProductId++,
    name: actualName,
    sku: actualSku,
    price: actualPrice,
    stock: actualStock,
    unit: unit || "pcs",
    warehouseId: whId,
    categoryId: catId,
    minimumLevel: minLvl,
    maximumLevel: maxLvl,
    reorderLevel: reorderLvl,
    safetyStock: safety,
    description:
      description !== undefined
        ? String(description).trim()
        : "",
    status: getStatus(
      actualStock,
      minLvl,
      "active"
    ),
    createdAt:
      new Date().toISOString(),
  };

  memoryProducts.unshift(newProduct);

  await recordAuditLog({
    userId,
    action: "CREATE_INVENTORY_ITEM",
    entityType: "product",
    entityId: newProduct.id,
    newValues: newProduct,
  });

  return newProduct;
};

// =========================================================
// GET ALL PRODUCTS
// =========================================================

export const getAllProducts = async () => {
  try {
    const products =
      await prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return products
      .filter(
        (product) =>
          product.status !== "inactive"
      )
      .map((product) =>
        formatProduct(product)
      );

  } catch (err) {
    console.error(
      "getAllProducts error:",
      err.message
    );

    return memoryProducts
      .filter(
        (product) =>
          product.status !== "inactive"
      )
      .map((product) =>
        formatProduct(product)
      );
  }
};

// =========================================================
// GET PRODUCT BY ID
// =========================================================

export const getProductById = async (id) => {
  const productId = Number(id);

  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    const error = new Error(
      "Invalid product ID"
    );
    error.statusCode = 400;
    throw error;
  }

  try {
    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          category: true,
        },
      });

    if (product) {
      return formatProduct(product);
    }

  } catch (err) {
    console.error(
      "Failed to get product from database:",
      err.message
    );
  }

  const memoryProduct =
    memoryProducts.find(
      (product) =>
        product.id === productId
    );

  if (!memoryProduct) {
    const error = new Error(
      "Product not found"
    );
    error.statusCode = 404;
    throw error;
  }

  return formatProduct(memoryProduct);
};

// =========================================================
// UPDATE PRODUCT
// =========================================================

export const updateProduct = async (
  id,
  {
    name,
    sku,
    itemCode,
    price,
    stock,
    quantity,
    categoryId,
    warehouseId,
    unit,
    minimumLevel,
    maximumLevel,
    reorderLevel,
    safetyStock,
    description,
    status,
  },
  userId = null
) => {
  const productId = Number(id);

  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    const error = new Error(
      "Invalid product ID"
    );
    error.statusCode = 400;
    throw error;
  }

  const existing =
    await getProductById(productId);

  const oldValues = {
    ...existing,
  };

  const actualName =
    name !== undefined
      ? String(name).trim()
      : existing.name;

  const actualSku =
    sku !== undefined ||
    itemCode !== undefined
      ? String(
          sku ?? itemCode ?? ""
        ).trim()
      : existing.sku;

  const actualPrice =
    price !== undefined
      ? Number(price)
      : Number(existing.price);

  const actualStock =
    stock !== undefined
      ? Number(stock)
      : quantity !== undefined
        ? Number(quantity)
        : Number(existing.stock);

  const actualCategoryId =
    categoryId !== undefined
      ? Number(categoryId)
      : Number(existing.categoryId);

  const actualMinimumLevel =
    minimumLevel !== undefined
      ? Number(minimumLevel)
      : Number(existing.minimumLevel ?? 10);

  const actualMaximumLevel =
    maximumLevel !== undefined
      ? Number(maximumLevel)
      : Number(existing.maximumLevel ?? 500);

  const actualReorderLevel =
    reorderLevel !== undefined
      ? Number(reorderLevel)
      : Number(existing.reorderLevel ?? 20);

  const actualSafetyStock =
    safetyStock !== undefined
      ? Number(safetyStock)
      : Number(existing.safetyStock ?? 5);

  const actualWarehouseId =
    warehouseId !== undefined
      ? Number(warehouseId)
      : Number(existing.warehouseId ?? 1);

  const actualUnit =
    unit !== undefined
      ? String(unit)
      : existing.unit ?? "pcs";

  const actualDescription =
    description !== undefined
      ? String(description).trim()
      : existing.description ?? "";

  // -------------------------------------------------------
  // VALIDATION
  // -------------------------------------------------------

  if (!actualName) {
    const error = new Error(
      "Product name is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!actualSku) {
    const error = new Error(
      "SKU / Item Code is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(actualPrice) ||
    actualPrice < 0
  ) {
    const error = new Error(
      "Invalid product price"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isInteger(actualStock) ||
    actualStock < 0
  ) {
    const error = new Error(
      "Stock must be a non-negative integer"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isInteger(actualCategoryId) ||
    actualCategoryId <= 0
  ) {
    const error = new Error(
      "Valid categoryId is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(actualMinimumLevel) ||
    actualMinimumLevel < 0
  ) {
    const error = new Error(
      "Minimum level must be a non-negative number"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(actualMaximumLevel) ||
    actualMaximumLevel < actualMinimumLevel
  ) {
    const error = new Error(
      "Maximum level must be greater than or equal to minimum level"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(actualReorderLevel) ||
    actualReorderLevel < 0
  ) {
    const error = new Error(
      "Reorder level must be a non-negative number"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isFinite(actualSafetyStock) ||
    actualSafetyStock < 0
  ) {
    const error = new Error(
      "Safety stock must be a non-negative number"
    );
    error.statusCode = 400;
    throw error;
  }

  // =======================================================
  // DATABASE UPDATE
  // =======================================================

  try {
    if (actualSku !== existing.sku) {
      const duplicate =
        await prisma.product.findFirst({
          where: {
            sku: actualSku,
            NOT: {
              id: productId,
            },
          },
        });

      if (duplicate) {
        const error = new Error(
          "Product SKU / Item Code already exists"
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const data = {
      name: actualName,
      sku: actualSku,
      price: actualPrice,
      stock: actualStock,
      categoryId: actualCategoryId,
      status:
        status !== undefined
          ? String(status)
          : existing.status === "inactive"
            ? "inactive"
            : "active",
    };

    if (unit !== undefined) {
      data.unit = actualUnit;
    }

    if (warehouseId !== undefined) {
      data.warehouseId = actualWarehouseId;
    }

    if (minimumLevel !== undefined) {
      data.minimumLevel = actualMinimumLevel;
    }

    if (maximumLevel !== undefined) {
      data.maximumLevel = actualMaximumLevel;
    }

    if (reorderLevel !== undefined) {
      data.reorderLevel = actualReorderLevel;
    }

    if (safetyStock !== undefined) {
      data.safetyStock = actualSafetyStock;
    }

    if (description !== undefined) {
      data.description = actualDescription;
    }

    const updated =
      await prisma.product.update({
        where: {
          id: productId,
        },
        data,
        include: {
          category: true,
        },
      });

    const result =
      formatProduct(updated, {
        unit: actualUnit,
        warehouseId: actualWarehouseId,
        minimumLevel: actualMinimumLevel,
        maximumLevel: actualMaximumLevel,
        reorderLevel: actualReorderLevel,
        safetyStock: actualSafetyStock,
        description: actualDescription,
      });

    await recordAuditLog({
      userId,
      action: "UPDATE_INVENTORY_ITEM",
      entityType: "product",
      entityId: updated.id,
      oldValues,
      newValues: result,
    });

    return result;

  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    console.error(
      "Database product update failed:",
      err.message
    );
  }

  // =======================================================
  // MEMORY FALLBACK
  // =======================================================

  const memoryProduct =
    memoryProducts.find(
      (product) =>
        product.id === productId
    );

  if (!memoryProduct) {
    const error = new Error(
      "Product not found"
    );
    error.statusCode = 404;
    throw error;
  }

  if (
    actualSku !== memoryProduct.sku
  ) {
    const duplicate =
      memoryProducts.find(
        (product) =>
          product.sku === actualSku &&
          product.id !== productId
      );

    if (duplicate) {
      const error = new Error(
        "Product SKU / Item Code already exists"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  memoryProduct.name = actualName;
  memoryProduct.sku = actualSku;
  memoryProduct.price = actualPrice;
  memoryProduct.stock = actualStock;
  memoryProduct.categoryId =
    actualCategoryId;
  memoryProduct.warehouseId =
    actualWarehouseId;
  memoryProduct.unit =
    actualUnit;
  memoryProduct.minimumLevel =
    actualMinimumLevel;
  memoryProduct.maximumLevel =
    actualMaximumLevel;
  memoryProduct.reorderLevel =
    actualReorderLevel;
  memoryProduct.safetyStock =
    actualSafetyStock;
  memoryProduct.description =
    actualDescription;

  if (status !== undefined) {
    memoryProduct.status =
      String(status);
  }

  memoryProduct.status = getStatus(
    memoryProduct.stock,
    memoryProduct.minimumLevel,
    memoryProduct.status
  );

  await recordAuditLog({
    userId,
    action: "UPDATE_INVENTORY_ITEM",
    entityType: "product",
    entityId: memoryProduct.id,
    oldValues,
    newValues: memoryProduct,
  });

  return memoryProduct;
};

// =========================================================
// DELETE / DEACTIVATE PRODUCT
// =========================================================

export const deleteProduct = async (
  id,
  userId = null
) => {
  const productId = Number(id);

  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    const error = new Error(
      "Invalid product ID"
    );
    error.statusCode = 400;
    throw error;
  }

  const existing =
    await getProductById(productId);

  // -------------------------------------------------------
  // Never delete product with remaining stock
  // -------------------------------------------------------

  if (Number(existing.stock) > 0) {
    const error = new Error(
      "Cannot delete item with remaining stock. Please issue or adjust stock to 0 first."
    );
    error.statusCode = 422;
    throw error;
  }

  // =======================================================
  // DATABASE
  // =======================================================

  try {
    const saleItemCount =
      await prisma.saleItem.count({
        where: {
          productId,
        },
      });

    // Product used in sales -> deactivate
    if (saleItemCount > 0) {
      const deactivated =
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            status: "inactive",
          },
          include: {
            category: true,
          },
        });

      const result =
        formatProduct(deactivated);

      await recordAuditLog({
        userId,
        action:
          "DEACTIVATE_INVENTORY_ITEM",
        entityType: "product",
        entityId: productId,
        oldValues: existing,
        newValues: result,
      });

      return {
        ...result,
        message:
          "Product deactivated successfully because it has existing sales records.",
      };
    }

    // No sales -> physical delete
    const deleted =
      await prisma.product.delete({
        where: {
          id: productId,
        },
        include: {
          category: true,
        },
      });

    await recordAuditLog({
      userId,
      action:
        "DELETE_INVENTORY_ITEM",
      entityType: "product",
      entityId: productId,
      oldValues: existing,
    });

    return {
      ...deleted,
      message:
        "Product deleted successfully",
    };

  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    if (err.code === "P2025") {
      const error = new Error(
        "Product not found"
      );
      error.statusCode = 404;
      throw error;
    }

    if (err.code === "P2003") {
      const error = new Error(
        "Cannot delete this product because it is referenced by existing transaction records."
      );
      error.statusCode = 409;
      throw error;
    }

    console.error(
      "Database product deletion failed:",
      err.message
    );
  }

  // =======================================================
  // MEMORY FALLBACK
  // =======================================================

  const memoryIndex =
    memoryProducts.findIndex(
      (product) =>
        product.id === productId
    );

  if (memoryIndex === -1) {
    const error = new Error(
      "Product not found"
    );
    error.statusCode = 404;
    throw error;
  }

  const memoryProduct =
    memoryProducts[memoryIndex];

  // Memory products cannot know sale history,
  // so safely remove only when stock is zero.
  memoryProducts.splice(
    memoryIndex,
    1
  );

  await recordAuditLog({
    userId,
    action:
      "DELETE_INVENTORY_ITEM",
    entityType: "product",
    entityId: productId,
    oldValues: memoryProduct,
  });

  return {
    ...memoryProduct,
    message:
      "Product deleted successfully",
  };
};