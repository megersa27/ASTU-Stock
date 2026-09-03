import {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../services/warehouseService.js";
import { getAllProducts } from "../services/productService.js";

export const getAll = async (req, res, next) => {
  try {
    const warehouses = await getAllWarehouses();
    res.json({
      success: true,
      data: warehouses,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const warehouse = await getWarehouseById(id);
    
    // Fetch items belonging to this warehouse
    const allProducts = await getAllProducts();
    const items = allProducts.filter((p) => p.warehouseId === id || !p.warehouseId && id === 1);

    res.json({
      success: true,
      data: {
        warehouse,
        items,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, location, description } = req.body;
    const warehouse = await createWarehouse(
      { name, location, description },
      req.user?.userId
    );
    res.status(201).json({
      success: true,
      data: warehouse,
      message: "Warehouse created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, location, description, status } = req.body;
    const warehouse = await updateWarehouse(
      id,
      { name, location, description, status },
      req.user?.userId
    );
    res.json({
      success: true,
      data: warehouse,
      message: "Warehouse updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const warehouse = await deleteWarehouse(id, req.user?.userId);
    res.json({
      success: true,
      data: warehouse,
      message: "Warehouse deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
