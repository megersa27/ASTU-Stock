import api from "./api.js";

export const getSales = async () => {
  return api("/sales");
};

export const getSale = async (id) => {
  return api(`/sales/${id}`);
};

export const createSale = async (items) => {
  return api("/sales", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
};