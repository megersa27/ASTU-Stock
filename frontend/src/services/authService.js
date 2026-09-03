import api from "./api.js";

export const register = async (userData) => {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  localStorage.setItem("token", data.token);

  return data;
};

export const getMe = async () => {
  return api("/auth/me");
};

export const forgotPassword = async (email) => {
  return api("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async ({ email, token, newPassword }) => {
  return api("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, token, newPassword }),
  });
};

export const logout = () => {
  localStorage.removeItem("token");
};