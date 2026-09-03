import api from "./api.js";

export const getDashboardReport = async () => {
  return api("/reports/dashboard");
};

export const getInventoryReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/reports/inventory${query ? `?${query}` : ""}`);
};

export const getStockMovementReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/reports/stock-movement${query ? `?${query}` : ""}`);
};

export const getLowStockReport = async () => {
  return api("/reports/low-stock");
};

export const getFifoValuationReport = async () => {
  return api("/reports/fifo");
};

export const getDamagedReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/reports/damaged${query ? `?${query}` : ""}`);
};

export const getStockTakingReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/reports/stock-taking${query ? `?${query}` : ""}`);
};

export const getAuditReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/reports/audit${query ? `?${query}` : ""}`);
};