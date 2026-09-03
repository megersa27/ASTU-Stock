import { recordAuditLog } from "./auditService.js";

let warehouses = [
  {
    id: 1,
    name: "Main Central Store",
    location: "ASTU Main Campus, Building A",
    description: "Primary storage for general stationery, office consumables, and university supplies",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Engineering & Lab Store",
    location: "Science & Engineering Complex, Block 3",
    description: "Specialized storage for laboratory chemicals, glassware, and engineering equipment",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Maintenance & Technical Store",
    location: "Facilities & Workshop Building",
    description: "Electrical, plumbing, carpentry, and building maintenance materials",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
let nextWarehouseId = 4;

export const getAllWarehouses = async () => {
  return [...warehouses];
};

export const getWarehouseById = async (id) => {
  const warehouse = warehouses.find((w) => w.id === Number(id));
  if (!warehouse) {
    const error = new Error("Warehouse not found");
    error.statusCode = 404;
    throw error;
  }
  return warehouse;
};

export const createWarehouse = async ({ name, location, description }, userId = null) => {
  if (!name || !name.trim()) {
    const error = new Error("Warehouse name is required");
    error.statusCode = 400;
    throw error;
  }

  const existing = warehouses.find(
    (w) => w.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (existing) {
    const error = new Error("Warehouse name already exists");
    error.statusCode = 409;
    throw error;
  }

  const newWarehouse = {
    id: nextWarehouseId++,
    name: name.trim(),
    location: location?.trim() || "",
    description: description?.trim() || "",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  warehouses.push(newWarehouse);

  await recordAuditLog({
    userId,
    action: "CREATE_WAREHOUSE",
    entityType: "warehouse",
    entityId: newWarehouse.id,
    newValues: newWarehouse,
  });

  return newWarehouse;
};

export const updateWarehouse = async (id, { name, location, description, status }, userId = null) => {
  const existing = await getWarehouseById(id);
  const oldValues = { ...existing };

  if (name !== undefined && name.trim()) {
    const duplicate = warehouses.find(
      (w) => w.id !== Number(id) && w.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) {
      const error = new Error("Warehouse name already exists");
      error.statusCode = 409;
      throw error;
    }
    existing.name = name.trim();
  }

  if (location !== undefined) existing.location = location.trim();
  if (description !== undefined) existing.description = description.trim();
  if (status !== undefined) existing.status = status;
  existing.updatedAt = new Date().toISOString();

  await recordAuditLog({
    userId,
    action: "UPDATE_WAREHOUSE",
    entityType: "warehouse",
    entityId: existing.id,
    oldValues,
    newValues: existing,
  });

  return existing;
};

export const deleteWarehouse = async (id, userId = null) => {
  const existing = await getWarehouseById(id);
  warehouses = warehouses.filter((w) => w.id !== Number(id));

  await recordAuditLog({
    userId,
    action: "DELETE_WAREHOUSE",
    entityType: "warehouse",
    entityId: Number(id),
    oldValues: existing,
  });

  return existing;
};
