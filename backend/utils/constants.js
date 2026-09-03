export const ROLES = {
  ADMIN: "admin",
  PAO: "pao",
  STOREKEEPER: "storekeeper",
  STOCK_CLERK: "stock_clerk",
  ACCOUNTANT: "accountant",
  DEPT_HEAD: "dept_head",
  SECURITY_OFFICER: "security_officer",
};

export const TRANSACTION_TYPES = {
  RECEIVE: "RECEIVE",
  ISSUE: "ISSUE",
  TRANSFER_OUT: "TRANSFER_OUT",
  TRANSFER_IN: "TRANSFER_IN",
  ADJUSTMENT: "ADJUSTMENT",
  DISPOSAL: "DISPOSAL",
};

export const ITEM_CONDITIONS = {
  DAMAGED: "damaged",
  OBSOLETE: "obsolete",
};

export const ITEM_STATUS = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  DAMAGED: "damaged",
  OBSOLETE: "obsolete",
  DISPOSED: "disposed",
};

export const ASTU_CATEGORIES = [
  { code: "4401", name: "Office Supplies and Stationery", description: "Paper, pens, toner, office materials" },
  { code: "4402", name: "Cleaning and Hygiene Materials", description: "Detergents, soaps, sanitation products" },
  { code: "4403", name: "Electrical and Lighting Materials", description: "Bulbs, cables, circuit breakers, fixtures" },
  { code: "4404", name: "Plumbing and Sanitation Materials", description: "Pipes, fittings, valves, sanitary ware" },
  { code: "4405", name: "Construction and Maintenance Materials", description: "Cement, paint, timber, hardware" },
  { code: "4406", name: "Laboratory Supplies", description: "Chemicals, glassware, reagents, consumables" },
  { code: "4407", name: "Medical Supplies", description: "First aid, clinical equipment, medical consumables" },
  { code: "4408", name: "Agricultural Materials", description: "Seeds, fertilizers, tools, farming inputs" },
  { code: "4409", name: "Fuel and Lubricants", description: "Diesel, petrol, engine oils, grease" },
  { code: "4410", name: "Spare Parts and Accessories", description: "Vehicle parts, machinery spares" },
];
