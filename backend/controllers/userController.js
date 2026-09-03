import {
  getAllUsers,
  getUserById,
  createUserAccount,
  updateUserAccount,
  deactivateUserAccount,
  approveUserAccount,
} from "../services/userService.js";

export const getAll = async (req, res, next) => {
  try {
    const { role, status, page, limit } = req.query;
    const result = await getAllUsers({ role, status, page, limit });
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await getUserById(id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { fullName, name, email, password, role, department, phone } = req.body;
    const user = await createUserAccount(
      { fullName, name, email, password, role, department, phone },
      req.user
    );
    res.status(201).json({
      success: true,
      data: user,
      message: "User account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { fullName, name, email, role, department, phone, status } = req.body;
    const user = await updateUserAccount(
      id,
      { fullName, name, email, role, department, phone, status },
      req.user
    );
    res.json({
      success: true,
      data: user,
      message: "User account updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deactivate = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await deactivateUserAccount(id, req.user);
    res.json({
      success: true,
      data: user,
      message: "User account deactivated",
    });
  } catch (error) {
    next(error);
  }
};

export const approve = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await approveUserAccount(id, req.user);
    res.json({
      success: true,
      data: user,
      message: "User account approved",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCurrentProfile = async (req, res, next) => {
  try {
    const id = Number(req.user.userId);
    const { fullName, name, email, role, department, phone } = req.body;

    const user = await updateUserAccount(
      id,
      { fullName, name, email, role, department, phone },
      req.user
    );

    res.json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
