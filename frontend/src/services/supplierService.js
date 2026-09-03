import api from "./api.js";

export const getSuppliers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/suppliers${query ? `?${query}` : ""}`);
};

export const getSupplier = async (id) => {
  return api(`/suppliers/${id}`);
};

export const createSupplier = async (supplierData) => {
  return api.post("/suppliers", supplierData);
};

export const updateSupplier = async (id, supplierData) => {
  return api.put(`/suppliers/${id}`, supplierData);
};

export const deleteSupplier = async (id) => {
  return api.delete(`/suppliers/${id}`);
};
