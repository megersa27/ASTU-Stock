import {
    registerUser,
    loginUser,
    getUserById,
  } from "../services/authService.js";
  
  export const register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Name, email and password are required",
        });
      }
  
      const user = await registerUser({
        name,
        email,
        password,
      });
  
      res.status(201).json({
        message: "Registration successful",
        user,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }
  
      const result = await loginUser({
        email,
        password,
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