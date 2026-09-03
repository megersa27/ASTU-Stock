import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";

export const create = async (req, res, next) => {
  try {
    const {
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
    } = req.body;

    if (!name || (!sku && !itemCode) || categoryId === undefined) {
      return res.status(400).json({
        success: false,
        error: "Item Name, SKU / Item Code, and Category are required",
      });
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        success: false,
        error: "Price cannot be negative",
      });
    }

    const currentStock = stock !== undefined ? stock : quantity;
    if (currentStock !== undefined && Number(currentStock) < 0) {
      return res.status(400).json({
        success: false,
        error: "Stock quantity cannot be negative",
      });
    }

    const product = await createProduct(
      {
        name: name.trim(),
        sku: (sku || itemCode).trim(),
        itemCode: (sku || itemCode).trim(),
        price: Number(price || 0),
        stock: currentStock === undefined ? 0 : Number(currentStock),
        quantity: currentStock === undefined ? 0 : Number(currentStock),
        categoryId: Number(categoryId),
        warehouseId: warehouseId ? Number(warehouseId) : 1,
        unit: unit?.trim() || "pcs",
        minimumLevel: minimumLevel !== undefined ? Number(minimumLevel) : 10,
        maximumLevel: maximumLevel !== undefined ? Number(maximumLevel) : 500,
        reorderLevel: reorderLevel !== undefined ? Number(reorderLevel) : 20,
        safetyStock: safetyStock !== undefined ? Number(safetyStock) : 5,
        description: description?.trim() || "",
      },
      req.user?.userId
    );

    res.status(201).json({
      success: true,
      data: product,
      message: "Inventory item registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductById(id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const {
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
    } = req.body;

    const currentStock = stock !== undefined ? stock : quantity;

    const product = await updateProduct(
      id,
      {
        name: name ? name.trim() : undefined,
        sku: (sku || itemCode) ? (sku || itemCode).trim() : undefined,
        itemCode: (sku || itemCode) ? (sku || itemCode).trim() : undefined,
        price: price !== undefined ? Number(price) : undefined,
        stock: currentStock !== undefined ? Number(currentStock) : undefined,
        quantity: currentStock !== undefined ? Number(currentStock) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
        warehouseId: warehouseId !== undefined ? Number(warehouseId) : undefined,
        unit: unit ? unit.trim() : undefined,
        minimumLevel: minimumLevel !== undefined ? Number(minimumLevel) : undefined,
        maximumLevel: maximumLevel !== undefined ? Number(maximumLevel) : undefined,
        reorderLevel: reorderLevel !== undefined ? Number(reorderLevel) : undefined,
        safetyStock: safetyStock !== undefined ? Number(safetyStock) : undefined,
        description: description !== undefined ? description.trim() : undefined,
        status,
      },
      req.user?.userId
    );

    res.json({
      success: true,
      data: product,
      message: "Inventory item updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await deleteProduct(id, req.user?.userId);

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};