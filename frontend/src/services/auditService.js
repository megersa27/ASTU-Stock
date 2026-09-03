import api from "./api.js";

export const getAuditLogs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/audit-logs${query ? `?${query}` : ""}`);
};

export const getAuditLog = async (id) => {
  return api(`/audit-logs/${id}`);
};
