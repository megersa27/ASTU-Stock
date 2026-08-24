================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Technical Requirements Specification
Phase 3 — System Analysis and Design

Document: 01-Technical-Requirements.md
Version:  1.0
Status:   Approved
Author:   Megersa Tekalign Senbeta
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1. Purpose and System Overview
  2. Approved Technology Stack
  3. Frontend Technical Requirements
  4. Backend & API Technical Requirements
  5. Database Technical Requirements
  6. Security & Access Control Requirements
  7. Performance & Reliability Requirements
  8. Deployment & DevOps Requirements
  9. Cross-Reference to Architecture Documents

================================================================================
1. PURPOSE AND SYSTEM OVERVIEW
================================================================================

This document translates the functional and non-functional requirements from the
Software Requirements Specification (SRS) into concrete, measurable technical
specifications. It serves as the engineering blueprint for backend and frontend
developers, database administrators, and DevOps engineers.

The ASTU Stock Management System is structured as a three-tier web application:
  • Presentation Layer:  React.js (Vite) + Tailwind CSS SPA
  • Application Layer:   Node.js + Express.js REST API
  • Data Layer:          PostgreSQL relational database (via Prisma ORM)

================================================================================
2. APPROVED TECHNOLOGY STACK
================================================================================

  ┌───────────────────────────┬───────────────────────────────────────────────┐
  │ Category                  │ Technology & Rationale                        │
  ├───────────────────────────┼───────────────────────────────────────────────┤
  │ UI / UX Design            │ Figma (Design System, Wireframes & Prototypes)│
  │ Frontend Framework        │ React.js (Vite)                               │
  │ Frontend Styling          │ Tailwind CSS (Utility-first responsive styles)│
  │ Routing & State           │ React Router DOM v6, React Context API, Axios │
  │ Backend Runtime           │ Node.js (v18+ LTS)                            │
  │ Web Framework             │ Express.js (RESTful API routing & middleware) │
  │ Database                  │ PostgreSQL (ACID compliant relational DB)     │
  │ Data Access / ORM         │ Prisma ORM (Type-safe migrations & client)    │
  │ Authentication            │ JWT (JSON Web Tokens) + bcrypt (10 rounds)    │
  │ Request Validation        │ express-validator                             │
  │ Testing                   │ Vitest / Jest (Unit tests) + Postman (API)    │
  │ Version Control           │ Git + GitHub                                  │
  │ Containerization          │ Docker + Docker Compose (Multi-container)     │
  └───────────────────────────┴───────────────────────────────────────────────┘

  Database Selection Note:
  PostgreSQL is selected because:
    • Relational integrity and ACID transactions guarantee stock quantity accuracy.
    • Complex joins are essential for FIFO batch calculations and bin card audits.
    • Relational foreign keys and CHECK constraints enforce business rules.

================================================================================
3. FRONTEND TECHNICAL REQUIREMENTS
================================================================================

  TR-FE-01
    The frontend shall be developed using React.js bootstrapped with Vite.

  TR-FE-02
    The frontend shall strictly implement the approved Figma Design System,
    color tokens, typography, and component hierarchy.

  TR-FE-03
    The frontend shall communicate with the backend exclusively via REST APIs
    using Axios with centralized request and response interceptors.

  TR-FE-04
    The Axios request interceptor shall automatically attach the JWT token
    (`Authorization: Bearer <token>`) from localStorage to all protected calls.

  TR-FE-05
    The Axios response interceptor shall catch 401 Unauthorized responses and
    automatically redirect expired sessions to the `/login` page.

  TR-FE-06
    The frontend shall provide comprehensive client-side form validation,
    real-time error messages, and disabled submit states while pending.

  TR-FE-07
    The application shall implement persistent layout shells (`DashboardLayout`
    and `AuthLayout`) with responsive sidebar navigation tailored to the user's role.

  TR-FE-08
    The UI shall display skeleton loaders or spinners during async data fetches
    and display user-friendly Toast notifications on operation completion.

================================================================================
4. BACKEND & API TECHNICAL REQUIREMENTS
================================================================================

  TR-BE-01
    The backend shall be developed using Node.js and Express.js adhering to a
    layered architecture (routes → controllers → services → Prisma ORM).

  TR-BE-02
    The backend shall expose RESTful API endpoints adhering to standard JSON
    envelopes: `{ success: boolean, data: any, message?: string, pagination?: object }`.

  TR-BE-03
    The backend shall validate all incoming request bodies using `express-validator`
    rules before executing controller actions.

  TR-BE-04
    The backend shall implement centralized error handling middleware (`errorMiddleware.js`)
    returning standardized HTTP status codes (200, 201, 400, 401, 403, 404, 409, 422, 500).

  TR-BE-05
    The backend shall implement a dedicated FIFO valuation engine (`fifoService.js`)
    that calculates cost of goods issued by consuming oldest RECEIVE batches first.

  TR-BE-06
    The backend shall wrap all inventory-modifying operations (receive, issue, transfer,
    stock adjustment) inside atomic PostgreSQL transactions (`prisma.$transaction`).

  TR-BE-07
    The backend shall implement `auditMiddleware` that records immutable entries
    to `audit_logs` using pre/post state captured in `res.locals.auditData`.

  TR-BE-08
    The backend shall automatically generate formatted reference codes:
    Goods Receiving Notes (`GRN-YYYYMMDD-XXX`) and Issue Vouchers (`IV-YYYYMMDD-XXX`).

  TR-BE-09
    The backend shall implement physical stock taking and damaged item approval
    workflows requiring PAO authorization before applying quantity adjustments.

================================================================================
5. DATABASE TECHNICAL REQUIREMENTS
================================================================================

  TR-DB-01
    The system shall use PostgreSQL managed through Prisma ORM schemas and migrations.

  TR-DB-02
    The database schema shall implement all 10 core tables:
    `roles`, `users`, `categories`, `suppliers`, `warehouses`, `inventories`,
    `stock_transactions`, `stock_takings`, `damaged_items`, `audit_logs`.

  TR-DB-03
    Inventory records shall enforce a global `UNIQUE` constraint on `item_code`
    and a `CHECK (quantity >= 0)` constraint preventing negative inventory.

  TR-DB-04
    The `stock_transactions` table shall store `unit_cost` and `remaining_quantity`
    for each `RECEIVE` batch to support accurate FIFO consumption and valuation reports.

  TR-DB-05
    The `damaged_items` table shall record damaged/obsolete quantities, inspection
    descriptions, and PAO disposal approval statuses independently of catalog stock.

  TR-DB-06
    The `audit_logs` table shall be append-only. No `UPDATE` or `DELETE` operations
    shall ever be executed on audit records.

  TR-DB-07
    Database indexes shall be created on all foreign keys, status flags, item codes,
    and composite lookup columns (`idx_stock_transactions_fifo`).

================================================================================
6. SECURITY & ACCESS CONTROL REQUIREMENTS
================================================================================

  TR-SEC-01
    All API endpoints except `POST /api/auth/login` shall require a valid JWT token.

  TR-SEC-02
    User passwords shall be hashed with bcrypt using a minimum salt cost of 10 rounds.
    Plain-text passwords shall never be saved or logged.

  TR-SEC-03
    The backend shall enforce Role-Based Access Control (RBAC) on every route using
    `roleMiddleware([allowedRoles])` against the 7 defined system roles.

  TR-SEC-04
    Sensitive credentials (database URL, JWT secret, ports) shall be stored exclusively
    in `.env` files and strictly excluded from Git repositories via `.gitignore`.

  TR-SEC-05
    The backend shall incorporate security headers (`helmet`) and configure Cross-Origin
    Resource Sharing (`cors`) restricted to the authorized frontend domain.

================================================================================
7. PERFORMANCE & RELIABILITY REQUIREMENTS
================================================================================

  TR-PERF-01
    Standard inventory and transaction queries shall execute in under 200ms under normal load.

  TR-PERF-02
    All large record sets (inventory list, stock history, audit logs) shall support
    backend pagination with configurable page and limit parameters.

  TR-REL-01
    The system shall maintain 99.9% uptime during operational university hours.

  TR-REL-02
    Database connection pooling shall be managed via Prisma to efficiently handle
    concurrent user sessions without connection starvation.

================================================================================
8. DEPLOYMENT & DEVOPS REQUIREMENTS
================================================================================

  TR-DEV-01
    The codebase shall be managed under Git version control with clean branching
    and standard commit message conventions.

  TR-DEV-02
    Multi-container configuration shall be provided via `docker-compose.yml` defining
    three services: `frontend`, `backend`, and `db` (PostgreSQL with persistent volume).

  TR-DEV-03
    A database seed script (`prisma/seed.js`) shall be provided to populate default
    roles, standard MoFED category codes (4401–4418), and initial admin accounts.

  TR-DEV-04
    A template `.env.example` file shall be committed to Git documenting all
    required environment variables.

================================================================================
9. CROSS-REFERENCE TO ARCHITECTURE DOCUMENTS
================================================================================

  The detailed designs for each technical requirement are located in:

  02-Frontend-Architecture.md     — React directory layout, component & route architecture
  03-System-Architecture.md       — Three-tier design, layer interactions & deployment diagram
  04-Database-Design.md           — 10 tables, schema definitions, constraints, FIFO & indexes
  05-Database-Architecture-Notes. — Prisma schema, entity lifecycle, and migration strategy
  05-Access-Control-and-RBAC.md   — 7-role permission matrix, endpoint & UI access control
  06-Backend-Architecture.md      — Express structure, service layer, FIFO engine & audit flow
  07-UML-Diagrams.md              — ERD, Class, Sequence, Activity & State Chart diagrams
  08-Authentication-Authorization — JWT token lifecycle, bcrypt hashing & route protection

================================================================================
END OF TECHNICAL REQUIREMENTS SPECIFICATION
================================================================================
