import api from "./api.js";

export const receiveStock = async (data) => {
  return api.post("/stock/receive", data);
};

export const issueStock = async (data) => {
  return api.post("/stock/issue", data);
};

export const transferStock = async (data) => {
  return api.post("/stock/transfer", data);
};

export const getStockHistory = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/stock/history${query ? `?${query}` : ""}`);
};

export const getBinCard = async (inventoryId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/stock/bin-card/${inventoryId}${query ? `?${query}` : ""}`);
};
