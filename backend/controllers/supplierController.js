import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/supplierService.js";

export const getAll = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const suppliers = await getAllSuppliers({ search, status });
    res.json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await getSupplierById(id);
    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, contactPerson, phone, email, address } = req.body;
    const supplier = await createSupplier(
      { name, contactPerson, phone, email, address },
      req.user?.userId
    );
    res.status(201).json({
      success: true,
      data: supplier,
      message: "Supplier registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, contactPerson, phone, email, address, status } = req.body;
    const supplier = await updateSupplier(
      id,
      { name, contactPerson, phone, email, address, status },
      req.user?.userId
    );
    res.json({
      success: true,
      data: supplier,
      message: "Supplier updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await deleteSupplier(id, req.user?.userId);
    res.json({
      success: true,
      data: supplier,
      message: "Supplier removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
