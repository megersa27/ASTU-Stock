================================================================================
ASTU STOCK MANAGEMENT SYSTEM
System Architecture — Supplementary Notes

Document: 03-System-Architecture-Notes.md
Phase:    Phase 3 — System Analysis and Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

NOTE: This document is a supplementary reference to 03-System-Architecture.md.
That document contains the full architectural specification including diagrams,
subsystem decomposition, hardware-software mapping, component diagram, and
deployment diagram. This document captures additional architectural decisions,
rationale, and cross-cutting concerns.

================================================================================
TABLE OF CONTENTS

  1.  Three-Tier Architecture Rationale
  2.  Layer Communication Rules
  3.  Technology Selection Rationale
  4.  Separation of Concerns
  5.  Data Flow — Read Operation
  6.  Data Flow — Write Operation
  7.  Authentication Integration Point
  8.  Authorization Integration Point
  9.  Audit Logging Integration Point
  10. Cross-Cutting Concerns
  11. Architecture Decisions Log

================================================================================
1. THREE-TIER ARCHITECTURE RATIONALE
================================================================================

The ASTU Stock Management System uses a three-tier architecture:

  Tier 1 — Presentation Layer   React.js (frontend)
  Tier 2 — Application Layer    Node.js + Express.js (backend API)
  Tier 3 — Data Layer           PostgreSQL (database)

Rationale for this separation:

  Independent development
  The frontend team and backend team can develop simultaneously once the
  API contract (endpoints, request/response format) is agreed upon. Each
  tier can be modified without requiring changes to the other tiers,
  provided the API contract is honoured.

  Security
  The database is never directly accessible from the browser. All access
  to data goes through the backend API, which enforces authentication and
  authorization on every request.

  Maintainability
  Each tier has a clearly defined responsibility. A change to the database
  schema requires changes only to the backend models and services, not to
  the frontend. A change to the UI requires changes only to the frontend.

  Scalability
  Each tier can be scaled independently. If the frontend requires more
  performance, it can be served from a CDN. If the backend requires more
  capacity, more server instances can be added.

================================================================================
2. LAYER COMMUNICATION RULES
================================================================================

  Rule 1: The frontend never queries the database directly.
  Rule 2: The frontend communicates with the backend only via REST API over HTTP/HTTPS.
  Rule 3: All API requests from the frontend carry a JWT token in the
          Authorization header.
  Rule 4: The backend validates authentication and authorization before
          processing any request.
  Rule 5: The backend never returns raw database errors to the frontend.
          All errors are mapped to appropriate HTTP status codes and
          user-readable messages.
  Rule 6: The database is accessible only from the backend application.
          The database port (5432) is not exposed publicly in production.

================================================================================
3. TECHNOLOGY SELECTION RATIONALE
================================================================================

  React.js (Frontend)
  ───────────────────
  Selected for its component-based architecture, large ecosystem, and
  suitability for building complex, data-driven user interfaces.
  React's unidirectional data flow makes the application behaviour
  predictable and easier to debug.

  Node.js + Express.js (Backend)
  ───────────────────────────────
  Selected because it uses JavaScript on both frontend and backend,
  reducing context switching for the development team. Express.js provides
  a minimal and flexible routing layer. The ecosystem provides libraries
  for JWT authentication (jsonwebtoken), password hashing (bcrypt),
  input validation (express-validator), and ORM (Prisma).

  PostgreSQL (Database)
  ──────────────────────
  Selected over document databases because:
    • The FIFO valuation method requires complex joins across batch records
      (stock_transactions table) — relational joins are the natural solution.
    • Stock quantity updates require ACID transactions to maintain consistency
      when multiple operations modify the same inventory record.
    • The 15 MoFED business rules require referential integrity enforced by
      foreign key constraints, which relational databases provide natively.
    • The 9-table schema (users, roles, categories, suppliers, warehouses,
      inventories, stock_transactions, stock_takings, audit_logs) is
      naturally relational — each entity has well-defined relationships
      with others.

  Prisma ORM
  ───────────
  Selected as the database access layer because it provides type-safe
  database queries, automatic migration management, and a readable schema
  definition file (schema.prisma) that serves as the single source of truth
  for the database structure.

  Docker + Docker Compose
  ────────────────────────
  Selected to ensure consistent environments across development and
  production. A single command (docker-compose up) starts all three
  services (frontend, backend, database) in identical configuration.

================================================================================
4. SEPARATION OF CONCERNS
================================================================================

Each layer of the architecture has exactly one primary responsibility.

  Presentation Layer (React)
  ───────────────────────────
  Responsibility: Render the user interface and collect user input.
  It does not contain business logic or database queries.

  Application Layer (Express)
  ────────────────────────────
  Responsibility: Process requests, enforce business rules, coordinate
  data access. It does not contain HTML rendering or raw SQL queries.

  Data Layer (PostgreSQL via Prisma)
  ────────────────────────────────────
  Responsibility: Persist and retrieve data with integrity constraints.
  It does not contain application logic.

Within the Application Layer, concerns are further separated:

  Routes       → Define which handler processes each endpoint.
  Controllers  → Handle HTTP request/response cycle.
  Services     → Contain all business logic.
  Models       → Define database schema and query interface.
  Middleware   → Handle cross-cutting concerns (auth, validation, audit).

================================================================================
5. DATA FLOW — READ OPERATION
================================================================================

Example: Storekeeper requests the inventory list.

  Step 1   User clicks "Inventory" in the sidebar.
  Step 2   React Router renders InventoryListPage.
  Step 3   useEffect calls inventoryService.getAll().
  Step 4   inventoryService sends: GET /api/inventory
           with Authorization: Bearer <token> header.
  Step 5   Express authMiddleware verifies the JWT token.
  Step 6   Express roleMiddleware confirms the role is permitted.
  Step 7   inventoryController calls inventoryService.findAll().
  Step 8   inventoryService queries PostgreSQL via Prisma.
  Step 9   PostgreSQL returns inventory rows.
  Step 10  Service returns data to controller.
  Step 11  Controller returns: 200 OK { success: true, data: [...] }
  Step 12  React updates InventoryListPage state with the data.
  Step 13  InventoryTable component renders the rows.

================================================================================
6. DATA FLOW — WRITE OPERATION
================================================================================

Example: Storekeeper receives stock.

  Step 1   Storekeeper completes the Receive Stock form and submits.
  Step 2   React validates required fields on the client side.
  Step 3   ReceiveStockPage calls stockService.receive(formData).
  Step 4   stockService sends: POST /api/stock/receive { ... }
           with Authorization: Bearer <token> header.
  Step 5   Express authMiddleware verifies the JWT token.
  Step 6   Express roleMiddleware confirms role is storekeeper or admin.
  Step 7   Express validateMiddleware checks all required fields.
  Step 8   stockController calls stockService.receiveStock(data).
  Step 9   stockService begins a PostgreSQL transaction:
             a. INSERT into stock_transactions (type: RECEIVE).
             b. UPDATE inventories SET quantity = quantity + received.
             c. Record unit_cost for FIFO batch.
             d. Generate GRN reference number.
           COMMIT transaction.
  Step 10  auditMiddleware inserts a record into audit_logs.
  Step 11  Controller returns: 201 Created { success: true, data: grn }
  Step 12  React displays success toast with GRN reference.
  Step 13  React refreshes the inventory quantity display.

================================================================================
7. AUTHENTICATION INTEGRATION POINT
================================================================================

Authentication is enforced at the boundary between the frontend and backend.

  Frontend side:
    • JWT token stored in localStorage after successful login.
    • Axios request interceptor attaches token to every API request.
    • Axios response interceptor handles 401 by logging the user out.
    • PrivateRoute guard redirects unauthenticated users to /login.

  Backend side:
    • authMiddleware applied to every protected route.
    • authMiddleware verifies the JWT signature using JWT_SECRET.
    • authMiddleware attaches decoded user (id, role) to req.user.
    • Returns 401 Unauthorized if token is missing, expired, or invalid.

  Integration point:
    Authorization: Bearer <JWT_TOKEN>   header on every API request.

================================================================================
8. AUTHORIZATION INTEGRATION POINT
================================================================================

Authorization is enforced at the route level in the backend.

  roleMiddleware(allowedRoles) is applied per route:

    router.post('/stock/receive',
      authMiddleware,
      roleMiddleware(['admin', 'storekeeper']),
      stockController.receiveStock
    );

  If the authenticated user's role is not in allowedRoles:
    → Returns 403 Forbidden.

  The frontend enforces authorization at the navigation level:
    • Sidebar items are filtered by role.
    • PrivateRoute checks role before rendering a protected page.

  Backend authorization is the authoritative check. Frontend role filtering
  is a UX convenience only — it cannot be relied upon for security.

================================================================================
9. AUDIT LOGGING INTEGRATION POINT
================================================================================

Audit logging is implemented as Express middleware applied after successful
responses on all significant routes.

  auditMiddleware runs on res.on('finish') — after the response is sent.
  It reads req.user, req.method, req.path, req.body, and res.statusCode.
  For successful write operations (2xx responses), it creates an audit_logs
  record with: user_id, action, entity_type, entity_id, old_values,
  new_values, ip_address, created_at.

  Audit logs are append-only. No UPDATE or DELETE is ever executed on
  the audit_logs table. This is enforced at the service layer.

  Significant actions logged:
    LOGIN, LOGOUT, CREATE_USER, UPDATE_USER, DEACTIVATE_USER,
    ADD_INVENTORY, UPDATE_INVENTORY, DELETE_INVENTORY,
    RECEIVE_STOCK, ISSUE_STOCK, TRANSFER_STOCK,
    CONDUCT_STOCK_TAKING, APPROVE_ADJUSTMENT, REJECT_ADJUSTMENT,
    REPORT_DAMAGED, APPROVE_DISPOSAL, REJECT_DISPOSAL.

================================================================================
10. CROSS-CUTTING CONCERNS
================================================================================

Cross-cutting concerns are addressed by middleware applied globally or
per-route in the Express application.

  ┌──────────────────────────────┬──────────────────────────────────────────────┐
  │ Concern                      │ Implementation                               │
  ├──────────────────────────────┼──────────────────────────────────────────────┤
  │ Authentication               │ authMiddleware on all protected routes        │
  │ Authorization                │ roleMiddleware per route                      │
  │ Input validation             │ express-validator + validateMiddleware        │
  │ Audit logging                │ auditMiddleware on write routes               │
  │ Error handling               │ errorMiddleware (last in chain)               │
  │ CORS                         │ cors() middleware with CLIENT_URL whitelist   │
  │ Security headers             │ helmet() middleware                           │
  │ Request logging              │ morgan() middleware (development only)        │
  │ Environment configuration    │ dotenv, all secrets in .env                  │
  └──────────────────────────────┴──────────────────────────────────────────────┘

================================================================================
11. ARCHITECTURE DECISIONS LOG
================================================================================

  ADR-001  PostgreSQL over MongoDB
  Decision: PostgreSQL is used as the database.
  Rationale: FIFO valuation, ACID transactions, relational integrity.
  See: Section 3 — Technology Selection Rationale.

  ADR-002  Prisma as ORM
  Decision: Prisma is used as the database access layer.
  Rationale: Type-safe queries, migration management, readable schema.

  ADR-003  JWT for authentication
  Decision: JWT stored in localStorage, attached via Axios interceptor.
  Rationale: Stateless authentication compatible with REST API.
  Trade-off: localStorage is accessible to JavaScript; httpOnly cookies
  would be more secure. This can be revisited in Version 2.

  ADR-004  React Context for global state
  Decision: React Context API used for authentication state.
  Rationale: Sufficient for the current scope. No external state library
  dependency. React Query may be added in Version 2 for server state.

  ADR-005  Monorepo structure
  Decision: frontend/ and backend/ coexist in one Git repository.
  Rationale: Simplifies development, deployment, and code review for
  a small team during the internship period.

  ADR-006  Docker Compose for development and deployment
  Decision: Docker Compose defines all three services.
  Rationale: Consistent environments. Single-command startup. Eliminates
  "works on my machine" problems.

================================================================================
END OF DOCUMENT
================================================================================
