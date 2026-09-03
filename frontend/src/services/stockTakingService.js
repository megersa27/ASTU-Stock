import api from "./api.js";

export const getStockTakings = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/stock-takings${query ? `?${query}` : ""}`);
};

export const getStockTaking = async (id) => {
  return api(`/stock-takings/${id}`);
};

export const createStockTaking = async (data) => {
  return api.post("/stock-takings", data);
};

export const approveStockTaking = async (id, notes = "") => {
  return api.patch(`/stock-takings/${id}/approve`, { notes });
};

export const rejectStockTaking = async (id, notes = "") => {
  return api.patch(`/stock-takings/${id}/reject`, { notes });
};
