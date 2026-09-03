import api from "./api.js";

export const getExpenses = async () => {
  return api("/expenses");
};

export const createExpense = async (expense) => {
  return api("/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });
};

export const updateExpense = async (id, expense) => {
  return api(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(expense),
  });
};

export const deleteExpense = async (id) => {
  return api(`/expenses/${id}`, {
    method: "DELETE",
  });
};