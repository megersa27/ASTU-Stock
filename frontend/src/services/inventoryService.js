import api from "./api.js";

export const getInventory = async () => {
  return api("/inventory");
};

export const getInventoryItem = async (id) => {
  return api(`/inventory/${id}`);
};

export const updateStock = async (id, quantity, type) => {
  return api(`/inventory/${id}/stock`, {
    method: "PUT",
    body: JSON.stringify({
      quantity,
      type,
    }),
  });
};