# RBAC Matrix

This document maps API endpoints to allowed roles after the recent RBAC updates.

## Roles

- `admin` — System Administrator
- `pao` — PAO Officer
- `storekeeper` — Storekeeper / Stock Clerk
- `stock_clerk` — Stock Clerk
- `accountant` — Accountant
- `dept_head` — Department Head
- `security_officer` — Security Officer

## API endpoints (summary)

- `POST /api/auth/register` — public
- `POST /api/auth/login` — public
- `POST /api/auth/forgot-password` — public
- `POST /api/auth/reset-password` — public
- `GET /api/auth/me` — authenticated (any role)

- `GET /api/users` — `admin`, `pao`
- `GET /api/users/:id` — `admin`, `pao`
- `POST /api/users` — `admin`
- `PUT /api/users/:id` — `admin`
- `PATCH /api/users/:id/deactivate` — `admin`

- `GET /api/categories` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `accountant`, `dept_head`
- `POST /api/categories` — `admin`, `storekeeper`
- `PUT /api/categories/:id` — `admin`, `storekeeper`
- `DELETE /api/categories/:id` — `admin`

- `GET /api/products` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `accountant`, `dept_head`
- `POST /api/products` — `admin`, `storekeeper`
- `PUT /api/products/:id` — `admin`, `storekeeper`
- `DELETE /api/products/:id` — `admin`

- `GET /api/inventory` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `accountant`, `dept_head`
- `PUT /api/inventory/:id/stock` — `admin`, `pao`, `storekeeper`

- `POST /api/stock-takings` — `admin`, `storekeeper`, `stock_clerk`
- `GET /api/stock-takings` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `dept_head`
- `GET /api/stock-takings/:id` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `dept_head`
- `PATCH /api/stock-takings/:id/approve` — `admin`, `pao`, `dept_head`
- `PATCH /api/stock-takings/:id/reject` — `admin`, `pao`, `dept_head`

- `POST /api/damaged` — `admin`, `storekeeper`, `stock_clerk`
- `GET /api/damaged` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `dept_head`, `accountant`
- `GET /api/damaged/:id` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `dept_head`, `accountant`
- `PATCH /api/damaged/:id/approve-disposal` — `admin`, `pao`, `dept_head`
- `PATCH /api/damaged/:id/reject-disposal` — `admin`, `pao`, `dept_head`

- `POST /api/stock/receive` — `admin`, `storekeeper`
- `POST /api/stock/issue` — `admin`, `pao`, `storekeeper`
- `POST /api/stock/transfer` — `admin`, `pao`, `storekeeper`
- `GET /api/stock/history` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `accountant`, `dept_head`, `security_officer`
- `GET /api/stock/bin-card/:id` — `admin`, `pao`, `storekeeper`, `stock_clerk`, `accountant`, `dept_head`, `security_officer`

- `GET /api/reports/*` — roles vary; generally `admin`, `pao`, and reporting roles (storekeeper, stock_clerk, accountant, dept_head) as appropriate

- `GET /api/audit-logs` — `admin`, `pao`

If you want this exported as CSV or a per-route JSON file, I can produce that as well.
