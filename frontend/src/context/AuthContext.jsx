import { createContext, useEffect, useState } from "react";
import {
  login as loginService,
  register as registerService,
  getMe,
  logout as logoutService,
} from "../services/authService.js";
import { updateProfile as updateProfileService } from "../services/userService.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (credentials) => {
    const data = await loginService(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await registerService(userData);
    return data;
  };

  const refreshUser = async () => {
    const currentUser = await getMe();
    setUser(currentUser);
    return currentUser;
  };

  const updateProfile = async (profileData) => {
    const data = await updateProfileService(profileData);
    const nextUser = data?.user || data?.data || { ...user, ...profileData };
    setUser(nextUser);
    return data;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};