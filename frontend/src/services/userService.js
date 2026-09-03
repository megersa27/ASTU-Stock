import api from "./api.js";

export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/users${query ? `?${query}` : ""}`);
};

export const getUser = async (id) => {
  return api(`/users/${id}`);
};

export const createUser = async (userData) => {
  return api.post("/users", userData);
};

export const updateUser = async (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

export const updateProfile = async (userData) => {
  return api.patch("/users/me", userData);
};

export const approveUser = async (id) => {
  return api.patch(`/users/${id}/approve`);
};

export const deactivateUser = async (id) => {
  return api.patch(`/users/${id}/deactivate`);
};
