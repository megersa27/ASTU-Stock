import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { recordAuditLog } from "./auditService.js";

const demoUsers = [
  {
    name: "Megersa Tekalign",
    email: "megersa@astu.edu.et",
    password: "password123",
    role: "storekeeper",
  },
  {
    name: "Almaz Tadesse",
    email: "pao@astu.edu.et",
    password: "password123",
    role: "pao",
  },
  {
    name: "System Administrator",
    email: "admin@astu.edu.et",
    password: "password123",
    role: "admin",
  },
  {
    name: "Chala Kebede",
    email: "accountant@astu.edu.et",
    password: "password123",
    role: "accountant",
  },
];

export const seedDemoUsers = async () => {
  for (const demoUser of demoUsers) {
    const normalizedEmail = demoUser.email.toLowerCase();
    const hashedPassword = await bcrypt.hash(demoUser.password, 10);

    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: demoUser.name,
        password: hashedPassword,
        role: demoUser.role,
        status: "active",
        department: "University Administration",
      },
      create: {
        name: demoUser.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: demoUser.role,
        status: "active",
        department: "University Administration",
      },
    });
  }
};

let users = [
  {
    id: 1,
    fullName: "Megersa Tekalign",
    name: "Megersa Tekalign",
    email: "megersa@astu.edu.et",
    role: "storekeeper",
    department: "Property & Stock Administration",
    phone: "+251 911 001122",
    status: "active",
    createdAt: new Date("2026-08-01T08:00:00Z").toISOString(),
  },
  {
    id: 2,
    fullName: "Almaz Tadesse",
    name: "Almaz Tadesse",
    email: "pao@astu.edu.et",
    role: "pao",
    department: "Property Administration Office",
    phone: "+251 912 334455",
    status: "active",
    createdAt: new Date("2026-08-01T08:00:00Z").toISOString(),
  },
  {
    id: 3,
    fullName: "System Administrator",
    name: "System Administrator",
    email: "admin@astu.edu.et",
    role: "admin",
    department: "ICT Center",
    phone: "+251 913 556677",
    status: "active",
    createdAt: new Date("2026-08-01T08:00:00Z").toISOString(),
  },
  {
    id: 4,
    fullName: "Chala Kebede",
    name: "Chala Kebede",
    email: "accountant@astu.edu.et",
    role: "accountant",
    department: "Finance & Accounts",
    phone: "+251 914 778899",
    status: "active",
    createdAt: new Date("2026-08-05T09:00:00Z").toISOString(),
  },
];
let nextUserId = 5;

export const getAllUsers = async ({ role = "", status = "", page = 1, limit = 20 } = {}) => {
  let list = [...users];

  try {
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        department: true,
        phone: true,
        createdAt: true,
      },
    });
    if (dbUsers && dbUsers.length > 0) {
      const mapped = dbUsers.map((u) => {
        const match = users.find((m) => m.email === u.email || m.id === u.id);
        return {
          id: u.id,
          fullName: u.name,
          name: u.name,
          email: u.email,
          role: u.role || match?.role || "storekeeper",
          department: u.department || match?.department || "University Administration",
          phone: u.phone || match?.phone || "+251 911 000000",
          status: u.status || match?.status || "pending",
          createdAt: u.createdAt,
        };
      });
      list = mapped;
    }
  } catch (err) {
    // fallback to in-memory list
  }

  if (role) {
    list = list.filter((u) => u.role.toLowerCase() === role.toLowerCase());
  }
  if (status) {
    list = list.filter((u) => u.status.toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const approveUserAccount = async (id, adminUser = {}) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.status === "active") {
    return {
      ...user,
      status: "active",
    };
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: "active" },
  });

  await recordAuditLog({
    userId: adminUser.userId,
    action: "APPROVE_USER",
    entityType: "user",
    entityId: updated.id,
    newValues: { status: "active" },
  });

  return {
    id: updated.id,
    fullName: updated.name,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    department: updated.department || "University Administration",
    phone: updated.phone || "",
    status: updated.status,
    createdAt: updated.createdAt,
  };
};

export const getUserById = async (id) => {
  const dbUser = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!dbUser) {
    const user = users.find((u) => u.id === Number(id));
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  return {
    id: dbUser.id,
    fullName: dbUser.name,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    department: dbUser.department || "University Administration",
    phone: dbUser.phone || "",
    status: dbUser.status,
    createdAt: dbUser.createdAt,
  };
};

export const createUserAccount = async (
  { fullName, name, email, password, role = "storekeeper", department, phone, status = "active" },
  adminUser = {}
) => {
  const actualName = (fullName || name || "").trim();
  const actualEmail = (email || "").trim().toLowerCase();

  if (!actualName || !actualEmail || !password) {
    const error = new Error("Full name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  const existingMem = users.find((u) => u.email.toLowerCase() === actualEmail);
  if (existingMem) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        name: actualName,
        email: actualEmail,
        password: hashedPassword,
        role: role || "storekeeper",
        status: status || "active",
        department: department || "University Administration",
        phone: phone || "",
      },
    });

    const newUser = {
      id: created.id,
      fullName: actualName,
      name: actualName,
      email: actualEmail,
      role: role || "storekeeper",
      department: department || "University Administration",
      phone: phone || "",
      status: created.status || "active",
      createdAt: created.createdAt,
    };

    users.push(newUser);

    await recordAuditLog({
      userId: adminUser.userId,
      action: "CREATE_USER",
      entityType: "user",
      entityId: newUser.id,
      newValues: {
        name: actualName,
        email: actualEmail,
        role,
        department,
        status,
      },
    });

    return newUser;
  } catch (err) {
    if (err.statusCode) throw err;
  }

  // Memory fallback
  const newUser = {
    id: nextUserId++,
    fullName: actualName,
    name: actualName,
    email: actualEmail,
    role: role || "storekeeper",
    department: department || "University Administration",
    phone: phone || "",
    status: status || "active",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  await recordAuditLog({
    userId: adminUser.userId,
    action: "CREATE_USER",
    entityType: "user",
    entityId: newUser.id,
    newValues: {
      name: actualName,
      email: actualEmail,
      role,
      department,
      status,
    },
  });

  return newUser;
};

export const updateUserAccount = async (
  id,
  { fullName, name, email, role, department, phone, status },
  adminUser = {}
) => {
  const dbUser = await prisma.user.findUnique({ where: { id: Number(id) } });
  const user = await getUserById(id);
  const oldValues = { ...user };

  const nextName = (fullName || name || user.name || "").trim();
  const nextEmail = email ? email.trim().toLowerCase() : user.email;
  const nextDepartment = department !== undefined ? department.trim() : user.department;
  const nextPhone = phone !== undefined ? phone.trim() : user.phone;
  const nextRole = role !== undefined ? role : user.role;
  const nextStatus = status !== undefined ? status : user.status;

  user.fullName = nextName;
  user.name = nextName;
  user.email = nextEmail;
  user.role = nextRole;
  user.department = nextDepartment;
  user.phone = nextPhone;
  user.status = nextStatus;

  if (dbUser) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        name: nextName,
        email: nextEmail,
        role: nextRole,
        department: nextDepartment,
        phone: nextPhone,
        status: nextStatus,
      },
    });
  }

  await recordAuditLog({
    userId: adminUser.userId,
    action: "UPDATE_USER",
    entityType: "user",
    entityId: user.id,
    oldValues,
    newValues: user,
  });

  return user;
};

export const deactivateUserAccount = async (id, adminUser = {}) => {
  const dbUser = await prisma.user.findUnique({ where: { id: Number(id) } });
  const user = await getUserById(id);
  user.status = "inactive";

  if (dbUser) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { status: "inactive" },
    });
  }

  await recordAuditLog({
    userId: adminUser.userId,
    action: "DEACTIVATE_USER",
    entityType: "user",
    entityId: user.id,
    newValues: { status: "inactive" },
  });

  return user;
};
