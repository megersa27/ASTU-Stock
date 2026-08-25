import api from "./api.js";

export const getProducts = async () => {
  return api("/products");
};

export const getProduct = async (id) => {
  return api(`/products/${id}`);
};

export const createProduct = async (productData) => {
  return api("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  return api(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return api(`/products/${id}`, {
    method: "DELETE",
  });
};