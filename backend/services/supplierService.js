import { recordAuditLog } from "./auditService.js";

// In-memory / data store for suppliers
let suppliers = [
  {
    id: 1,
    name: "Ethio Stationery Suppliers",
    contactPerson: "Abebe Bekele",
    phone: "+251 911 234567",
    email: "contact@ethiostationery.com",
    address: "Adama, Kebele 04",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Oromia Electrical Materials Enterprise",
    contactPerson: "Tolosa Desta",
    phone: "+251 922 345678",
    email: "info@oromiaelectrical.com",
    address: "Adama, Industrial Zone",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Rift Valley Laboratory & Chemical Supplies",
    contactPerson: "Sara Mohammed",
    phone: "+251 933 456789",
    email: "sales@riftvalleylab.com",
    address: "Addis Ababa, Bole",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
let nextSupplierId = 4;

export const getAllSuppliers = async ({ search = "", status = "" } = {}) => {
  let result = [...suppliers];
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (sup) =>
        sup.name.toLowerCase().includes(s) ||
        sup.contactPerson?.toLowerCase().includes(s) ||
        sup.phone?.includes(s) ||
        sup.email?.toLowerCase().includes(s)
    );
  }
  if (status) {
    result = result.filter((sup) => sup.status === status);
  }
  return result;
};

export const getSupplierById = async (id) => {
  const supplier = suppliers.find((s) => s.id === Number(id));
  if (!supplier) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }
  return supplier;
};

export const createSupplier = async ({ name, contactPerson, phone, email, address }, userId = null) => {
  if (!name || !name.trim()) {
    const error = new Error("Supplier name is required");
    error.statusCode = 400;
    throw error;
  }

  const newSupplier = {
    id: nextSupplierId++,
    name: name.trim(),
    contactPerson: contactPerson?.trim() || "",
    phone: phone?.trim() || "",
    email: email?.trim() || "",
    address: address?.trim() || "",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  suppliers.push(newSupplier);

  await recordAuditLog({
    userId,
    action: "CREATE_SUPPLIER",
    entityType: "supplier",
    entityId: newSupplier.id,
    newValues: newSupplier,
  });

  return newSupplier;
};

export const updateSupplier = async (id, { name, contactPerson, phone, email, address, status }, userId = null) => {
  const existing = await getSupplierById(id);
  const oldValues = { ...existing };

  if (name !== undefined) existing.name = name.trim();
  if (contactPerson !== undefined) existing.contactPerson = contactPerson.trim();
  if (phone !== undefined) existing.phone = phone.trim();
  if (email !== undefined) existing.email = email.trim();
  if (address !== undefined) existing.address = address.trim();
  if (status !== undefined) existing.status = status;
  existing.updatedAt = new Date().toISOString();

  await recordAuditLog({
    userId,
    action: "UPDATE_SUPPLIER",
    entityType: "supplier",
    entityId: existing.id,
    oldValues,
    newValues: existing,
  });

  return existing;
};

export const deleteSupplier = async (id, userId = null) => {
  const existing = await getSupplierById(id);
  suppliers = suppliers.filter((s) => s.id !== Number(id));

  await recordAuditLog({
    userId,
    action: "DELETE_SUPPLIER",
    entityType: "supplier",
    entityId: Number(id),
    oldValues: existing,
  });

  return existing;
};
