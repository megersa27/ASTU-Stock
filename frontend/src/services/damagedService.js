import api from "./api.js";

export const getDamagedItems = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/damaged${query ? `?${query}` : ""}`);
};

export const getDamagedItem = async (id) => {
  return api(`/damaged/${id}`);
};

export const reportDamagedItem = async (data) => {
  return api.post("/damaged", data);
};

export const approveDisposal = async (id, notes = "") => {
  return api.patch(`/damaged/${id}/approve-disposal`, { notes });
};

export const rejectDisposal = async (id, notes = "") => {
  return api.patch(`/damaged/${id}/reject-disposal`, { notes });
};
