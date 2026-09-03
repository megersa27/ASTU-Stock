import {
    getInventory,
    getInventoryItem,
    updateStock,
  } from "../services/inventoryService.js";
  
  export const getAll = async (req, res, next) => {
    try {
      const inventory = await getInventory();
  
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  };
  
  export const getOne = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const product = await getInventoryItem(id);
  
      res.json(product);
    } catch (error) {
      next(error);
    }
  };
  
  export const changeStock = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { quantity, type } = req.body;
  
      if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
          error: "Quantity must be a positive integer",
        });
      }
  
      if (!["in", "out"].includes(type)) {
        return res.status(400).json({
          error: "Stock type must be 'in' or 'out'",
        });
      }
  
      const product = await updateStock(
        id,
        Number(quantity),
        type
      );
  
      res.json({
        message:
          type === "in"
            ? "Stock increased successfully"
            : "Stock decreased successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  };