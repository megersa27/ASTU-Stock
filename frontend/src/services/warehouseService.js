import api from "./api.js";

export const getWarehouses = async () => {
  return api("/warehouses");
};

export const getWarehouse = async (id) => {
  return api(`/warehouses/${id}`);
};

export const createWarehouse = async (warehouseData) => {
  return api.post("/warehouses", warehouseData);
};

export const updateWarehouse = async (id, warehouseData) => {
  return api.put(`/warehouses/${id}`, warehouseData);
};

export const deleteWarehouse = async (id) => {
  return api.delete(`/warehouses/${id}`);
};
