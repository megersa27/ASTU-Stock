// Audit Log Service - Immutable audit trail
const inMemoryAuditLogs = [];
let nextLogId = 1;

export const recordAuditLog = async ({
  userId = null,
  action,
  entityType = null,
  entityId = null,
  oldValues = null,
  newValues = null,
  ipAddress = null,
}) => {
  const entry = {
    id: nextLogId++,
    userId: userId || null,
    action,
    entityType,
    entityId,
    oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
    newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
    ipAddress,
    createdAt: new Date().toISOString(),
  };

  inMemoryAuditLogs.unshift(entry);
  return entry;
};

export const getAuditLogs = async ({ userId, action, from, to, page = 1, limit = 50 } = {}) => {
  let logs = [...inMemoryAuditLogs];

  if (userId) {
    logs = logs.filter((log) => log.userId === Number(userId));
  }

  if (action) {
    logs = logs.filter((log) => log.action.toLowerCase() === action.toLowerCase());
  }

  if (from) {
    const fromDate = new Date(from);
    logs = logs.filter((log) => new Date(log.createdAt) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    logs = logs.filter((log) => new Date(log.createdAt) <= toDate);
  }

  const total = logs.length;
  const start = (page - 1) * limit;
  const data = logs.slice(start, start + limit);

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

export const getAuditLogById = async (id) => {
  const log = inMemoryAuditLogs.find((item) => item.id === Number(id));
  if (!log) {
    const error = new Error("Audit log entry not found");
    error.statusCode = 404;
    throw error;
  }
  return log;
};
