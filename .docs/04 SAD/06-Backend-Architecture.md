ASTU Stock Management System
Backend Architecture Document
Phase 3 — System Analysis and Design

Document: 06-Backend-Architecture.md
Version:  1.0
Author:   Megersa Tekalign Senbeta
Date:     August 2026

================================================================================

Table of Contents
  1. Overview
  2. Backend Technology Stack
  3. Folder Structure
  4. Layer Responsibilities
  5. REST API Design
  6. Authentication and Authorization Flow
  7. Error Handling Strategy
  8. Audit Logging Strategy
  9. Environment Configuration
  10. Docker Configuration

================================================================================

1. Overview
━━━━━━━━━━━

The backend is a RESTful API server built with Node.js and Express.js.
It serves as the Application Layer in the three-tier architecture, sitting
between the React frontend and the PostgreSQL database.

The backend is responsible for:
  • Authenticating users (JWT)
  • Authorizing requests (RBAC middleware)
  • Validating all incoming data
  • Executing business logic (FIFO, stock level checks, approval workflows)
  • Persisting and retrieving data from PostgreSQL
  • Recording audit log entries for all significant actions
  • Returning consistent JSON responses

================================================================================

2. Backend Technology Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌────────────────────────┬──────────────────────────────────────────────────┐
  │ Technology             │ Purpose                                          │
  ├────────────────────────┼──────────────────────────────────────────────────┤
  │ Node.js                │ JavaScript runtime environment                   │
  │ Express.js             │ Web framework for routing and middleware          │
  │ PostgreSQL             │ Relational database                              │
  │ Prisma ORM             │ Database access and schema management             │
  │ bcrypt                 │ Password hashing                                 │
  │ jsonwebtoken (JWT)     │ Authentication tokens                            │
  │ express-validator      │ Request body validation                          │
  │ dotenv                 │ Environment variable management                  │
  │ cors                   │ Cross-Origin Resource Sharing control            │
  │ helmet                 │ HTTP security headers                            │
  │ morgan                 │ HTTP request logging                             │
  │ Docker                 │ Containerization for consistent environments     │
  └────────────────────────┴──────────────────────────────────────────────────┘

================================================================================

3. Folder Structure
━━━━━━━━━━━━━━━━━━━

  backend/
  │
  ├── config/
  │   ├── db.js              ← Prisma client initialization (prisma/client.js)
  │   └── config.js          ← App configuration (port, JWT secret, etc.)
  │
  ├── prisma/
  │   ├── schema.prisma      ← Single source of truth for database models
  │   ├── seed.js            ← Initial seed data (roles, categories, admin)
  │   └── migrations/        ← Prisma SQL migration history
  │
  ├── middleware/
  │   ├── authMiddleware.js  ← Verifies JWT token on protected routes
  │   ├── roleMiddleware.js  ← Checks user role against allowed roles
  │   ├── validateMiddleware.js ← express-validator error handler
  │   ├── auditMiddleware.js ← Records action to audit_logs using res.locals.auditData
  │   └── errorMiddleware.js ← Centralized error handler (last middleware)
  │
  ├── routes/                ← Express route definitions
  │   ├── authRoutes.js
  │   ├── userRoutes.js
  │   ├── inventoryRoutes.js
  │   ├── categoryRoutes.js
  │   ├── supplierRoutes.js
  │   ├── warehouseRoutes.js
  │   ├── stockRoutes.js
  │   ├── stockTakingRoutes.js
  │   ├── damagedRoutes.js
  │   ├── reportRoutes.js
  │   └── auditRoutes.js
  │
  ├── controllers/           ← Request handlers (thin layer, calls services)
  │   ├── authController.js
  │   ├── userController.js
  │   ├── inventoryController.js
  │   ├── categoryController.js
  │   ├── supplierController.js
  │   ├── warehouseController.js
  │   ├── stockController.js
  │   ├── stockTakingController.js
  │   ├── damagedController.js
  │   ├── reportController.js
  │   └── auditController.js
  │
  ├── services/              ← Business logic layer
  │   ├── authService.js     ← Login, JWT, password hashing
  │   ├── userService.js
  │   ├── inventoryService.js
  │   ├── categoryService.js
  │   ├── supplierService.js
  │   ├── warehouseService.js
  │   ├── stockService.js    ← Receive, Issue, Transfer logic
  │   ├── fifoService.js     ← FIFO valuation engine
  │   ├── stockTakingService.js
  │   ├── damagedService.js
  │   ├── reportService.js
  │   └── auditService.js
  │
  ├── validators/            ← express-validator validation rules
  │   ├── authValidator.js
  │   ├── inventoryValidator.js
  │   └── stockValidator.js
  │
  ├── utils/                 ← Reusable utility functions
  │   ├── generateCode.js    ← Item code / GRN / Voucher number generation
  │   ├── responseHelper.js  ← Standardized API response format
  │   └── dateHelper.js      ← Date formatting utilities
  │
  ├── .env                   ← Environment variables (NOT committed to Git)
  ├── .env.example           ← Template for required environment variables
  ├── .gitignore
  ├── package.json
  ├── Dockerfile
  └── server.js              ← App entry point

================================================================================

4. Layer Responsibilities
━━━━━━━━━━━━━━━━━━━━━━━━━

  Routes (routes/)
  ─────────────────
  Define URL paths, HTTP methods, and middleware chain for each endpoint.
  They do NOT contain business logic.

  Example:
    router.post('/receive',
      authMiddleware,
      roleMiddleware(['admin', 'storekeeper']),
      stockValidator.receive,
      validateMiddleware,
      stockController.receiveStock
    );

  Controllers (controllers/)
  ───────────────────────────
  Handle the HTTP request/response cycle. Extract data from req, call the
  appropriate service, and return the JSON response.
  They do NOT contain business logic or database queries.

  Example:
    async receiveStock(req, res, next) {
      try {
        const result = await stockService.receiveStock(req.body, req.user.id);
        res.status(201).json({ success: true, data: result });
      } catch (error) {
        next(error);
      }
    }

  Services (services/)
  ─────────────────────
  Contain all business logic and database operations.
  This is where FIFO calculation, stock level validation, approval workflows,
  and all complex inventory logic lives.

  Example:
    async receiveStock({ inventoryId, quantity, unitCost, supplierId, ... }, userId) {
      // 1. Validate inventory item exists
      // 2. Create stock_transaction record (type: RECEIVE)
      // 3. Update inventories.quantity += quantity
      // 4. Generate GRN number
      // 5. Return transaction record
    }

  Data Access Layer (Prisma ORM)
  ───────────────────────────────
  Defines database schemas and provides a type-safe interface for querying data.
  prisma/schema.prisma is the single authoritative source of truth for all 10 models:
  Role, User, Category, Supplier, Warehouse, Inventory, StockTransaction,
  StockTaking, DamagedItem, and AuditLog.

  Middleware (middleware/)
  ────────────────────────
  authMiddleware.js
    • Reads JWT from Authorization header: "Bearer <token>"
    • Verifies token with JWT_SECRET from .env
    • Attaches decoded user (id, role) to req.user
    • Returns 401 if token is missing or invalid

  roleMiddleware.js
    • Receives an array of allowed roles
    • Checks req.user.role against allowed roles
    • Returns 403 if role is not permitted

  auditMiddleware.js
    • Executes after the response is completed (res.on('finish'))
    • Extracts audit payload from res.locals.auditData (populated by controllers/services)
    • Writes an immutable audit_logs record with user_id, action, entity_type, entity_id,
      old_values, new_values, and IP address

  errorMiddleware.js
    • Last middleware in the chain
    • Catches all errors passed via next(error)
    • Returns consistent JSON error response:
        { success: false, message: "...", code: 400 }

================================================================================

5. REST API Design
━━━━━━━━━━━━━━━━━━

  API Base URL: /api

  Naming Conventions:
    • Use plural nouns for resources: /inventory, /users, /suppliers
    • Use HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE
    • Nested routes for sub-resources: /inventory/:id/bin-card
    • Use query parameters for filtering: /inventory?category=4401&status=available

  Key API Endpoints:

  Authentication:
  ┌──────────────────────────────┬────────────┬──────────────────────────────┐
  │ Endpoint                     │ Method     │ Description                  │
  ├──────────────────────────────┼────────────┼──────────────────────────────┤
  │ /api/auth/login              │ POST       │ Login, returns JWT token     │
  │ /api/auth/logout             │ POST       │ Logout (client clears token) │
  │ /api/auth/me                 │ GET        │ Get current user profile     │
  └──────────────────────────────┴────────────┴──────────────────────────────┘

  Inventory:
  ┌──────────────────────────────┬────────────┬──────────────────────────────┐
  │ /api/inventory               │ GET        │ List all items (+ filters)   │
  │ /api/inventory               │ POST       │ Create new item              │
  │ /api/inventory/:id           │ GET        │ Get single item details      │
  │ /api/inventory/:id           │ PUT        │ Update item                  │
  │ /api/inventory/:id           │ DELETE     │ Delete item                  │
  │ /api/inventory/:id/bin-card  │ GET        │ Get bin card for item        │
  └──────────────────────────────┴────────────┴──────────────────────────────┘

  Stock Transactions:
  ┌──────────────────────────────┬────────────┬──────────────────────────────┐
  │ /api/stock/receive           │ POST       │ Record stock receipt         │
  │ /api/stock/issue             │ POST       │ Record stock issue           │
  │ /api/stock/transfer          │ POST       │ Transfer between warehouses  │
  │ /api/stock/history           │ GET        │ Stock transaction history    │
  └──────────────────────────────┴────────────┴──────────────────────────────┘

  Stock Taking:
  ┌──────────────────────────────┬────────────┬──────────────────────────────┐
  │ /api/stock-takings           │ POST       │ Submit physical count        │
  │ /api/stock-takings           │ GET        │ List all counts (+ filters)  │
  │ /api/stock-takings/:id       │ GET        │ Get single count record      │
  │ /api/stock-takings/:id/approve│ PATCH     │ PAO approves adjustment      │
  │ /api/stock-takings/:id/reject │ PATCH     │ PAO rejects adjustment       │
  └──────────────────────────────┴────────────┴──────────────────────────────┘

  Reports:
  ┌──────────────────────────────┬────────────┬──────────────────────────────┐
  │ /api/reports/inventory       │ GET        │ Inventory summary report     │
  │ /api/reports/stock-movement  │ GET        │ Stock movement report        │
  │ /api/reports/low-stock       │ GET        │ Low stock report             │
  │ /api/reports/fifo            │ GET        │ FIFO valuation report        │
  │ /api/reports/damaged         │ GET        │ Damaged/obsolete report      │
  │ /api/reports/stock-taking    │ GET        │ Reconciliation report        │
  │ /api/reports/audit           │ GET        │ Audit activity report        │
  └──────────────────────────────┴────────────┴──────────────────────────────┘

  Standard Response Format:
  ──────────────────────────
  Success:
    {
      "success": true,
      "data": { ... },
      "message": "Stock received successfully."
    }

  Error:
    {
      "success": false,
      "message": "Insufficient stock. Available: 15, Requested: 20.",
      "code": 400
    }

================================================================================

6. Authentication and Authorization Flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Login Flow:
  ────────────
  1. Client sends POST /api/auth/login { email, password }
  2. authService finds user by email in database.
  3. authService compares password with bcrypt hash.
  4. If valid: generate JWT containing { userId, role, email }.
  5. Return JWT token to client.
  6. Client stores token (localStorage or httpOnly cookie).

  Protected Request Flow:
  ────────────────────────
  1. Client sends request with header: Authorization: Bearer <token>
  2. authMiddleware extracts and verifies token.
  3. authMiddleware attaches decoded user to req.user.
  4. roleMiddleware checks req.user.role against allowed roles.
  5. If permitted: request proceeds to controller.
  6. If not permitted: 403 Forbidden response returned.

  JWT Configuration:
  ───────────────────
  JWT_SECRET=<strong_random_secret>   (in .env, never committed to Git)
  Token expiry: 24 hours (configurable)
  Algorithm: HS256

================================================================================

7. Error Handling Strategy
━━━━━━━━━━━━━━━━━━━━━━━━━━

  All errors are passed to the centralized errorMiddleware via next(error).

  Error Types and HTTP Status Codes:
  ┌─────────────────────────────┬──────┬────────────────────────────────────┐
  │ Error Type                  │ Code │ Example                            │
  ├─────────────────────────────┼──────┼────────────────────────────────────┤
  │ Validation error            │ 400  │ "quantity must be a positive int"  │
  │ Authentication failure      │ 401  │ "Invalid or expired token"         │
  │ Authorization failure       │ 403  │ "Access denied"                    │
  │ Resource not found          │ 404  │ "Inventory item not found"         │
  │ Business rule violation     │ 422  │ "Insufficient stock"               │
  │ Duplicate record            │ 409  │ "Item code already exists"         │
  │ Internal server error       │ 500  │ "Unexpected error occurred"        │
  └─────────────────────────────┴──────┴────────────────────────────────────┘

  Business rule violations (422) examples:
    • Issuing more stock than available
    • Issuing without approved requisition
    • Transferring to same source and destination warehouse
    • Trying to dispose an item without PAO approval

================================================================================

8. Audit Logging Strategy
━━━━━━━━━━━━━━━━━━━━━━━━━

  Audit logs are written AUTOMATICALLY by the auditMiddleware.
  To ensure accurate capture of pre-update and post-update state, the controller or service
  sets `res.locals.auditData` before sending the response:

  res.locals.auditData = {
    action:      'ISSUE_STOCK',
    entity_type: 'stock_transaction',
    entity_id:   result.transactionId,
    old_values:  { quantity: previousQty },
    new_values:  { quantity: newQty }
  };

  Actions logged automatically:
    LOGIN, LOGOUT, CREATE_USER, UPDATE_USER, DEACTIVATE_USER,
    ADD_INVENTORY, UPDATE_INVENTORY, DELETE_INVENTORY,
    RECEIVE_STOCK, ISSUE_STOCK, TRANSFER_STOCK,
    CONDUCT_STOCK_TAKING, APPROVE_STOCK_ADJUSTMENT,
    REPORT_DAMAGED, APPROVE_DISPOSAL,
    ADD_SUPPLIER, UPDATE_SUPPLIER, ADD_WAREHOUSE

  The auditMiddleware captures req.user.id and req.ip automatically upon res.on('finish'),
  persisting the record to PostgreSQL via Prisma.

  IMPORTANT: Audit logs are append-only.
  The auditService must NEVER call UPDATE or DELETE on audit_logs.

================================================================================

9. Environment Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  .env.example (safe to commit — no real values):
  ─────────────────────────────────────────────────
  # Server
  PORT=5000
  NODE_ENV=development

  # Database
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=astu_stock
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password

  # JWT
  JWT_SECRET=your_jwt_secret_here
  JWT_EXPIRES_IN=24h

  # CORS
  CLIENT_URL=http://localhost:3000

  .env (actual values — NEVER commit to Git):
  ────────────────────────────────────────────
  Listed in .gitignore. Contains real credentials.

================================================================================

10. Docker Configuration
━━━━━━━━━━━━━━━━━━━━━━━━

  Dockerfile (backend):
  ──────────────────────
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 5000
  CMD ["node", "server.js"]

  docker-compose.yml (development):
  ───────────────────────────────────
  version: '3.8'
  services:

    frontend:
      build: ./frontend
      ports:
        - "3000:3000"
      depends_on:
        - backend

    backend:
      build: ./backend
      ports:
        - "5000:5000"
      environment:
        - DB_HOST=db
        - DB_PORT=5432
        - DB_NAME=astu_stock
        - DB_USER=postgres
        - DB_PASSWORD=postgres
        - JWT_SECRET=dev_secret_change_in_production
      depends_on:
        - db

    db:
      image: postgres:15-alpine
      environment:
        POSTGRES_DB: astu_stock
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: postgres
      volumes:
        - pgdata:/var/lib/postgresql/data
      ports:
        - "5432:5432"

  volumes:
    pgdata:

================================================================================
END OF DOCUMENT
================================================================================
