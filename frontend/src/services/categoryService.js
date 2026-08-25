import api from "./api.js";

export const getCategories = async () => {
  return api("/categories");
};

export const createCategory = async (name) => {
  return api("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const updateCategory = async (id, name) => {
  return api(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
};

export const deleteCategory = async (id) => {
  return api(`/categories/${id}`, {
    method: "DELETE",
  });
};