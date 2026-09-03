import {
    registerUser,
    loginUser,
    getUserById,
    requestPasswordReset,
    resetPassword,
  } from "../services/authService.js";
  
  export const register = async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Name, email and password are required",
        });
      }
  
      const user = await registerUser({
        name,
        email,
        password,
        role,
      });
  
      res.status(201).json({
        message: "Registration submitted. Your account is pending administrator approval.",
        user,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const login = async (req, res, next) => {
    try {
      const { email, password, remember } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const result = await loginUser({
        email,
        password,
        remember: Boolean(remember),
      });

      res.json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const getMe = async (req, res, next) => {
    try {
      const user = await getUserById(req.user.userId);
  
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  export const forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await requestPasswordReset({ email });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  export const resetPasswordRequest = async (req, res, next) => {
    try {
      const { email, token, newPassword } = req.body;
      const result = await resetPassword({ email, token, newPassword });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };