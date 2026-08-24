ASTU Stock Management System
System Architecture Document
Phase 3 — System Analysis and Design

Document: 03-System-Architecture.md
Version:  1.0
Author:   Megersa Tekalign Senbeta
Date:     August 2026

================================================================================

Table of Contents
  1. Overview
  2. Design Goals
  3. Three-Tier Architecture
  4. System Components and Descriptions
  5. Subsystem Decomposition
  6. Hardware–Software Mapping
  7. Component Diagram
  8. Deployment Diagram
  9. System Process Flows
  10. Design Patterns Used

================================================================================

1. Overview
━━━━━━━━━━━

System design transforms the requirements gathered during the analysis phase into a
complete technical blueprint for implementing the ASTU Stock Management System.

The design defines:
  • The overall system architecture and layers
  • The components/subsystems and their responsibilities
  • How components interact with each other
  • The hardware and software required to run the system
  • How the system will be deployed

The proposed system follows a Three-Tier Architecture consisting of:
  1. Presentation Layer  (Frontend — React.js)
  2. Application Layer   (Backend  — Node.js + Express.js)
  3. Data Layer          (Database — PostgreSQL)

================================================================================

2. Design Goals
━━━━━━━━━━━━━━━

  Security       — Protect inventory data through authentication, authorization,
                   encryption, and audit logging.

  Reliability    — Provide accurate and dependable inventory information at all times.

  Scalability    — Support future expansion of users, departments, and inventory volume.

  Maintainability— Modular architecture allowing future updates without full redesign.

  Availability   — System available to authorized users whenever hosting is operational.

  Performance    — Process inventory operations and return responses within 3 seconds.

  Usability      — Simple, role-aware interface requiring minimal training.

  Auditability   — Every significant action recorded for accountability and transparency.

================================================================================

3. Three-Tier Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━

                        ┌─────────────────────────────────────┐
                        │         PRESENTATION LAYER          │
                        │         (React.js Frontend)         │
                        │                                     │
                        │  Browser → React Components         │
                        │  → Pages → Services → API Calls     │
                        └─────────────────┬───────────────────┘
                                          │
                                    REST API (HTTP/HTTPS)
                                    JSON Request / Response
                                          │
                        ┌─────────────────▼───────────────────┐
                        │         APPLICATION LAYER           │
                        │      (Node.js + Express.js)         │
                        │                                     │
                        │  Routes → Controllers → Services    │
                        │  → Middleware (Auth, Validation,    │
                        │    Error Handling, Audit Logging)   │
                        └─────────────────┬───────────────────┘
                                          │
                                   SQL Queries (ORM)
                                          │
                        ┌─────────────────▼───────────────────┐
                        │            DATA LAYER               │
                        │           (PostgreSQL)              │
                        │                                     │
                        │  Tables: users, roles, inventory,   │
                        │  categories, suppliers, warehouses, │
                        │  stock_transactions, audit_logs,    │
                        │  stock_takings                      │
                        └─────────────────────────────────────┘

Layer Responsibilities:

  Presentation Layer
  ──────────────────
  • Renders the user interface based on the Figma design system.
  • Handles user interactions (form submissions, navigation, filtering).
  • Communicates with the backend exclusively through REST API calls.
  • Enforces client-side validation before sending data.
  • Displays loading states, error messages, and success feedback.
  • Implements role-based navigation (different menus per user role).

  Application Layer
  ─────────────────
  • Exposes RESTful API endpoints for all system operations.
  • Authenticates users via JWT (JSON Web Tokens).
  • Authorizes requests based on user role (RBAC).
  • Validates all incoming data before processing.
  • Executes business logic (FIFO calculation, stock level checks, etc.).
  • Records audit log entries for all significant actions.
  • Returns consistent JSON responses with appropriate HTTP status codes.

  Data Layer
  ──────────
  • Persists all application data in PostgreSQL relational tables.
  • Enforces data integrity through foreign keys and constraints.
  • Supports transactions to ensure consistency during stock operations.
  • Never directly accessible from the frontend (only via backend API).

================================================================================

4. System Components and Descriptions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌──────────────────────────────┬────────────────────────────────────────────────┐
  │ Component                    │ Description                                    │
  ├──────────────────────────────┼────────────────────────────────────────────────┤
  │ User Interface Component     │ React pages and components visible to the user │
  │ Authentication Component     │ JWT login, logout, token verification          │
  │ User Management Component    │ CRUD for users and role assignments            │
  │ Inventory Component          │ Add, update, delete, search inventory items    │
  │ Stock Transaction Component  │ Receive, issue, transfer stock operations      │
  │ Stock Control Component      │ Min/max/reorder/safety stock monitoring        │
  │ Stock Taking Component       │ Physical count, variance, reconciliation       │
  │ Damaged/Obsolete Component   │ Flag, report, and dispose damaged items        │
  │ Bin Card Component           │ Digital bin card per item (transaction history)│
  │ FIFO Engine Component        │ Calculates inventory valuation using FIFO      │
  │ Supplier Component           │ Supplier registration and management           │
  │ Warehouse Component          │ Warehouse registration and stock per location  │
  │ Reporting Component          │ Generate all inventory and management reports  │
  │ Audit Component              │ Record and display immutable audit log entries │
  │ Database Component           │ PostgreSQL tables and query layer              │
  └──────────────────────────────┴────────────────────────────────────────────────┘

================================================================================

5. Subsystem Decomposition
━━━━━━━━━━━━━━━━━━━━━━━━━━

  Authentication Subsystem
  ─────────────────────────
  Responsible for: Login, Logout, JWT token generation and verification,
  Password hashing (bcrypt), Session management, Role identification.

  User Management Subsystem
  ──────────────────────────
  Responsible for: User registration, User update, Role assignment,
  Permission management, Account deactivation.

  Inventory Management Subsystem
  ───────────────────────────────
  Responsible for: Item registration, Item update, Item deletion,
  Category management, Item code generation, Inventory search and filtering.

  Stock Transaction Subsystem
  ────────────────────────────
  Responsible for: Stock receiving (with GRN), Stock issuing (with Issue Voucher),
  Stock transfer between warehouses, Transaction history tracking,
  Automatic quantity updates on every transaction.

  Stock Control Subsystem
  ────────────────────────
  Responsible for: Minimum/maximum/reorder/safety stock level management,
  Low-stock alert generation, Reorder report generation.

  Stock Taking Subsystem
  ───────────────────────
  Responsible for: Physical count recording, Variance calculation,
  PAO approval workflow, Stock adjustment application,
  Reconciliation report generation.

  Damaged/Obsolete Subsystem
  ───────────────────────────
  Responsible for: Damaged/obsolete item reporting, Item state transitions,
  PAO disposal approval, Disposal recording, Disposal report generation.

  FIFO Valuation Subsystem
  ─────────────────────────
  Responsible for: Tracking unit cost per batch received,
  Deducting from oldest batch first on issue, Calculating current inventory value,
  Generating FIFO valuation reports for the Accountant.

  Supplier Management Subsystem
  ──────────────────────────────
  Responsible for: Supplier registration, Supplier update, Supplier search,
  Linking suppliers to stock receiving transactions.

  Warehouse Management Subsystem
  ───────────────────────────────
  Responsible for: Warehouse registration, Per-warehouse stock view,
  Stock transfer between warehouses.

  Reporting Subsystem
  ────────────────────
  Responsible for: Inventory report, Stock movement report, Low stock report,
  FIFO valuation report, Damaged/obsolete report, Stock taking report,
  Audit report, Export to PDF/Excel.

  Audit Subsystem
  ────────────────
  Responsible for: Automatic recording of all significant user actions,
  Immutable audit log storage, Audit log filtering and viewing,
  Audit report generation for PAO and Administrator.

================================================================================

6. Hardware–Software Mapping
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Hardware Requirements
  ──────────────────────
  ┌───────────────────┬──────────────────────────────────────────┐
  │ Component         │ Specification                            │
  ├───────────────────┼──────────────────────────────────────────┤
  │ Processor         │ Intel Core i5 or equivalent / above      │
  │ RAM               │ 8 GB minimum (16 GB recommended)         │
  │ Storage           │ 256 GB SSD minimum                       │
  │ Network           │ Ethernet or Wi-Fi (stable internet)      │
  │ Display           │ 1366 × 768 resolution or higher          │
  └───────────────────┴──────────────────────────────────────────┘

  Software Requirements
  ──────────────────────
  ┌───────────────────────┬──────────────────────────────────────┐
  │ Component             │ Technology                           │
  ├───────────────────────┼──────────────────────────────────────┤
  │ Operating System      │ Windows 10+ / Ubuntu Linux 20.04+    │
  │ Frontend              │ React.js / Next.js                   │
  │ Backend               │ Node.js + Express.js                 │
  │ Database              │ PostgreSQL                           │
  │ Authentication        │ JWT (JSON Web Tokens) + bcrypt       │
  │ API Testing           │ Postman                              │
  │ Design Tool           │ Figma                                │
  │ IDE                   │ Visual Studio Code                   │
  │ Version Control       │ Git + GitHub                         │
  │ Containerization      │ Docker + Docker Compose              │
  │ Documentation         │ Microsoft Word / Markdown            │
  └───────────────────────┴──────────────────────────────────────┘

  Hardware–Software Mapping Diagram
  ───────────────────────────────────

  ┌──────────────────────────────────────────────────────────────────┐
  │  CLIENT MACHINE (User's Computer / Browser)                      │
  │  Hardware: i5+, 8GB RAM, Network                                 │
  │  Software: Web Browser (Chrome/Firefox/Edge)                     │
  │                    │                                             │
  │            React.js Frontend                                     │
  └──────────────────────────────┬───────────────────────────────────┘
                                 │ HTTPS REST API
  ┌──────────────────────────────▼───────────────────────────────────┐
  │  APPLICATION SERVER                                              │
  │  Hardware: i5+, 8GB RAM, 256GB SSD                               │
  │  Software: Node.js + Express.js                                  │
  │            Docker Container                                      │
  └──────────────────────────────┬───────────────────────────────────┘
                                 │ SQL Queries
  ┌──────────────────────────────▼───────────────────────────────────┐
  │  DATABASE SERVER                                                 │
  │  Hardware: i5+, 8GB RAM, 256GB SSD                               │
  │  Software: PostgreSQL                                            │
  │            Docker Container                                      │
  └──────────────────────────────────────────────────────────────────┘

================================================================================

7. Component Diagram
━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────────────────────────────────────┐
  │                        React Frontend                               │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
  │  │  Auth    │ │Inventory │ │  Stock   │ │Suppliers │ │ Reports  │ │
  │  │Component │ │Component │ │Component │ │Component │ │Component │ │
  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
  └───────┼────────────┼────────────┼────────────┼────────────┼────────┘
          │            │            │            │            │
          └────────────┴────────────┴────────────┴────────────┘
                                    │
                              REST API (HTTPS)
                                    │
  ┌─────────────────────────────────▼───────────────────────────────────┐
  │                       Express.js Backend                            │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
  │  │  Auth    │ │Inventory │ │  Stock   │ │Suppliers │ │ Reports  │ │
  │  │  Router  │ │  Router  │ │  Router  │ │  Router  │ │  Router  │ │
  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
  │       │            │            │            │            │         │
  │  ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ │
  │  │  Auth    │ │Inventory │ │  Stock   │ │Supplier  │ │ Report   │ │
  │  │Controller│ │Controller│ │Controller│ │Controller│ │Controller│ │
  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
  │       │            │            │            │            │         │
  │  ┌────▼────────────▼────────────▼────────────▼────────────▼───────┐ │
  │  │               Middleware Layer                                  │ │
  │  │   authMiddleware | validateMiddleware | auditMiddleware         │ │
  │  │   errorHandler   | rateLimiter        | corsMiddleware          │ │
  │  └───────────────────────────────────┬─────────────────────────────┘ │
  └──────────────────────────────────────┼─────────────────────────────────┘
                                         │
  ┌──────────────────────────────────────▼─────────────────────────────────┐
  │                          PostgreSQL Database                           │
  │   users │ roles │ inventory │ categories │ suppliers │ warehouses      │
  │   stock_transactions │ audit_logs │ stock_takings                      │
  └────────────────────────────────────────────────────────────────────────┘

================================================================================

8. Deployment Diagram
━━━━━━━━━━━━━━━━━━━━━

  Development Environment:
  ─────────────────────────

  Developer Machine
  │
  ├── Docker Compose
  │   ├── frontend container  (React dev server — port 3000)
  │   ├── backend container   (Express API    — port 5000)
  │   └── db container        (PostgreSQL     — port 5432)
  │
  └── GitHub (version control)

  Production Environment:
  ────────────────────────

  ┌──────────────────────────────────────────────────────────────────┐
  │  User's Web Browser                                              │
  │  https://astu-stock.example.com                                  │
  └───────────────────────────┬──────────────────────────────────────┘
                              │ HTTPS
  ┌───────────────────────────▼──────────────────────────────────────┐
  │  Web Server / Reverse Proxy (Nginx)                              │
  │  • Serves React build (static files)                             │
  │  • Proxies /api/* requests to Express backend                    │
  │  • Handles SSL termination                                       │
  └───────────────────────────┬──────────────────────────────────────┘
                              │
  ┌───────────────────────────▼──────────────────────────────────────┐
  │  Application Server (Docker Container)                           │
  │  • Node.js + Express.js                                          │
  │  • PORT 5000 (internal)                                          │
  │  • Reads environment variables from .env                         │
  └───────────────────────────┬──────────────────────────────────────┘
                              │
  ┌───────────────────────────▼──────────────────────────────────────┐
  │  Database Server (Docker Container)                              │
  │  • PostgreSQL                                                    │
  │  • PORT 5432 (internal only, not exposed publicly)               │
  │  • Persistent volume for data storage                            │
  └──────────────────────────────────────────────────────────────────┘

  Deployment Flow:
  ─────────────────
  Developer commits code
       ↓
  GitHub repository
       ↓
  docker-compose build
       ↓
  docker-compose up
       ↓
  System running in containers
       ↓
  Accessible via browser

================================================================================

9. System Process Flows
━━━━━━━━━━━━━━━━━━━━━━━

  General Request Flow:
  ──────────────────────
  1. User interacts with React UI (click, form submit).
  2. React component calls a service function (e.g., inventoryService.getAll()).
  3. Service sends HTTP request to Express API endpoint.
  4. Express middleware validates the JWT token (authentication).
  5. Express middleware checks the user's role (authorization).
  6. Express middleware validates the request body (input validation).
  7. Controller calls the appropriate service/business logic.
  8. Service executes SQL query against PostgreSQL.
  9. Result returned through controller → API response (JSON).
  10. React updates the UI based on the response.
  11. Audit middleware records the action to audit_logs table.

  Stock Receiving Process:
  ─────────────────────────
  1. Storekeeper submits receive stock form (item, supplier, quantity, unit cost).
  2. Backend validates the request and verifies authentication.
  3. Backend checks item exists and supplier is registered.
  4. Backend creates a stock_transaction record (type: RECEIVE).
  5. Backend increases inventory quantity.
  6. Backend records unit cost for FIFO batch tracking.
  7. Backend generates a Goods Receiving Note (GRN).
  8. Audit log entry created.
  9. Success response returned to frontend.

  Stock Issuing Process with FIFO:
  ──────────────────────────────────
  1. Storekeeper submits issue stock form (item, quantity, department, recipient).
  2. Backend validates request and checks available quantity ≥ requested quantity.
  3. Backend applies FIFO logic: deduct from oldest batch first.
  4. Backend creates a stock_transaction record (type: ISSUE).
  5. Backend decreases inventory quantity.
  6. Backend generates an Issue Voucher.
  7. Audit log entry created.
  8. Success response returned to frontend.

================================================================================

10. Design Patterns Used
━━━━━━━━━━━━━━━━━━━━━━━━

  MVC (Model-View-Controller) — Backend
  The Express backend follows MVC:
    Model      → Database tables and ORM models
    View       → JSON API responses
    Controller → Route handler functions

  Component-Based Architecture — Frontend
  React uses reusable components:
    Pages      → Full screen views
    Components → Reusable UI building blocks
    Services   → API communication layer

  Repository Pattern — Backend
  Service layer abstracts database operations from controllers,
  making it easy to change the database layer without touching business logic.

  Middleware Chain — Backend
  Express middleware handles cross-cutting concerns:
    authMiddleware    → Verifies JWT on every protected route
    roleMiddleware    → Checks user role permission
    validateMiddleware→ Validates request body
    auditMiddleware   → Records action to audit log
    errorMiddleware   → Centralized error handling

================================================================================
END OF DOCUMENT
================================================================================
