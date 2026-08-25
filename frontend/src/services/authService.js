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

export const logout = () => {
  localStorage.removeItem("token");
};