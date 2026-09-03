import {
  getAllProducts,
  getProductById,
  updateProduct,
} from "./productService.js";
import { receiveStock, issueStock } from "./stockService.js";

export const getInventory = async () => {
  return await getAllProducts();
};

export const getInventoryItem = async (id) => {
  return await getProductById(id);
};

export const updateStock = async (id, quantity, type, user = {}) => {
  const item = await getProductById(id);
  const qty = Number(quantity);

  if (type === "in") {
    const res = await receiveStock(
      {
        inventoryId: item.id,
        quantity: qty,
        unitCost: item.price || 100,
        notes: "Direct stock in update",
      },
      user
    );
    return await getProductById(id);
  } else if (type === "out") {
    const res = await issueStock(
      {
        inventoryId: item.id,
        quantity: qty,
        department: "General Requisition",
        recipientName: "Staff",
        notes: "Direct stock out update",
      },
      user
    );
    return await getProductById(id);
  } else {
    const error = new Error("Invalid stock operation");
    error.statusCode = 400;
    throw error;
  }
};