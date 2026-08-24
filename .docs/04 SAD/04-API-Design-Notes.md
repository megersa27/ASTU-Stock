================================================================================
ASTU STOCK MANAGEMENT SYSTEM
API Design Specification

Document: 04-API-Design-Notes.md
Phase:    Phase 3 — System Analysis and Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

NOTE: This document defines the REST API contract for the ASTU Stock Management
System. It is the authoritative reference for frontend developers (what to call)
and backend developers (what to implement). Both sides must honour this contract.
The Backend Architecture document (06-Backend-Architecture.md) contains the
implementation structure.

================================================================================
TABLE OF CONTENTS

  1.  API Design Principles
  2.  Base URL and Versioning
  3.  Authentication
  4.  Standard Response Format
  5.  HTTP Status Codes Used
  6.  Authentication Endpoints
  7.  User Management Endpoints
  8.  Inventory Endpoints
  9.  Category Endpoints
  10. Supplier Endpoints
  11. Warehouse Endpoints
  12. Stock Transaction Endpoints
  13. Stock Taking Endpoints
  14. Damaged / Obsolete Endpoints
  15. Report Endpoints
  16. Audit Log Endpoints
  17. Complete Endpoint Reference Table

================================================================================
1. API DESIGN PRINCIPLES
================================================================================

  RESTful resources
  Endpoints are named as plural nouns representing resources.
  HTTP verbs define the action performed on the resource.

  Consistent URL structure
  Collection:    /api/resource              (GET all, POST create)
  Single item:   /api/resource/:id          (GET one, PUT/PATCH update, DELETE)
  Sub-resource:  /api/resource/:id/sub      (GET sub-resource of a parent)

  Filtering and pagination via query parameters
  GET /api/inventory?category=4401&status=available&page=1&limit=20

  Consistent response envelope
  Every response uses the same JSON envelope structure:
  { success, data, message, pagination }

  Meaningful HTTP status codes
  Each response carries the appropriate HTTP status code.
  A 200 OK is never returned for an error.

  Input validation
  All POST and PUT/PATCH requests are validated on the backend before
  any database operation is performed.

  Security
  All endpoints except POST /api/auth/login require authentication.
  Role-based authorization is enforced per endpoint.

================================================================================
2. BASE URL AND VERSIONING
================================================================================

  Development:   http://localhost:5000/api
  Production:    https://<domain>/api

  All endpoint paths in this document are relative to the base URL.
  Example: POST /auth/login means POST http://localhost:5000/api/auth/login

================================================================================
3. AUTHENTICATION
================================================================================

  All protected endpoints require the following HTTP header:

    Authorization: Bearer <JWT_TOKEN>

  The JWT token is obtained from the POST /auth/login response.
  Requests without a valid token receive: 401 Unauthorized.
  Requests with a valid token but insufficient role receive: 403 Forbidden.

================================================================================
4. STANDARD RESPONSE FORMAT
================================================================================

  Success response (single item):
    {
      "success": true,
      "data": { ... },
      "message": "Operation completed successfully."
    }

  Success response (collection):
    {
      "success": true,
      "data": [ ... ],
      "pagination": {
        "total": 245,
        "page": 1,
        "limit": 20,
        "totalPages": 13
      }
    }

  Error response:
    {
      "success": false,
      "message": "Descriptive error message.",
      "errors": [
        { "field": "quantity", "message": "Quantity must be a positive integer." }
      ]
    }

  The "errors" array is included only for validation failures (400).

================================================================================
5. HTTP STATUS CODES USED
================================================================================

  ┌───────┬─────────────────────┬────────────────────────────────────────────┐
  │ Code  │ Status              │ When Used                                  │
  ├───────┼─────────────────────┼────────────────────────────────────────────┤
  │ 200   │ OK                  │ Successful GET, PUT, PATCH, DELETE         │
  │ 201   │ Created             │ Successful POST (resource created)         │
  │ 400   │ Bad Request         │ Validation errors in request body          │
  │ 401   │ Unauthorized        │ Missing or invalid JWT token               │
  │ 403   │ Forbidden           │ Valid token but insufficient role          │
  │ 404   │ Not Found           │ Resource with given ID does not exist      │
  │ 409   │ Conflict            │ Duplicate unique field (item code, email)  │
  │ 422   │ Unprocessable       │ Business rule violation (insufficient qty) │
  │ 500   │ Internal Error      │ Unexpected server error                    │
  └───────┴─────────────────────┴────────────────────────────────────────────┘

================================================================================
6. AUTHENTICATION ENDPOINTS
================================================================================

  POST /auth/login
  ─────────────────
  Description:  Authenticate a user and receive a JWT token.
  Auth:         Public (no token required)
  Request body:
    { "email": "string", "password": "string" }
  Success 200:
    {
      "success": true,
      "data": {
        "token": "eyJhbGci...",
        "user": { "id": 1, "fullName": "Megersa T.", "role": "storekeeper" }
      }
    }
  Errors:
    401 — Invalid email or password.
    401 — Account is inactive.

  POST /auth/logout
  ──────────────────
  Description:  Invalidate the current session (client clears token).
  Auth:         Required
  Success 200:  { "success": true, "message": "Logged out successfully." }

  GET /auth/me
  ─────────────
  Description:  Return the currently authenticated user's profile.
  Auth:         Required
  Success 200:  { "success": true, "data": { id, fullName, email, role, department } }

================================================================================
7. USER MANAGEMENT ENDPOINTS
================================================================================

  Allowed roles: Administrator only (write). PAO (read).

  GET /users
  ───────────
  Description:  Return all registered users.
  Auth:         Required — admin, pao
  Query params: ?status=active|inactive&role=storekeeper&page=1&limit=20
  Success 200:  { success, data: [ user objects ], pagination }

  POST /users
  ────────────
  Description:  Create a new user account.
  Auth:         Required — admin
  Request body:
    {
      "fullName": "string",
      "email": "string",
      "password": "string",
      "roleId": number,
      "department": "string"
    }
  Success 201:  { success, data: { id, fullName, email, role } }
  Errors:       400 validation | 409 email already exists

  GET /users/:id
  ───────────────
  Description:  Return a single user by ID.
  Auth:         Required — admin, pao
  Success 200:  { success, data: user object }
  Errors:       404 not found

  PUT /users/:id
  ───────────────
  Description:  Update a user's information.
  Auth:         Required — admin
  Request body: { fullName, email, roleId, department } (all optional)
  Success 200:  { success, data: updated user }
  Errors:       400 | 404

  PATCH /users/:id/deactivate
  ────────────────────────────
  Description:  Deactivate a user account (soft delete).
  Auth:         Required — admin
  Success 200:  { success, message: "User deactivated." }
  Errors:       404

================================================================================
8. INVENTORY ENDPOINTS
================================================================================

  GET /inventory
  ───────────────
  Description:  Return all inventory items with optional filters.
  Auth:         Required — all roles (read) / storekeeper, pao, admin (write)
  Query params: ?category=4401&warehouse=1&status=available&search=paper
                &page=1&limit=20
  Success 200:  { success, data: [ inventory objects ], pagination }

  POST /inventory
  ────────────────
  Description:  Register a new inventory item.
  Auth:         Required — admin, pao, storekeeper
  Request body:
    {
      "itemCode": "string",
      "name": "string",
      "description": "string",
      "categoryId": number,
      "warehouseId": number,
      "unit": "string",
      "minimumLevel": number,
      "maximumLevel": number,
      "reorderLevel": number,
      "safetyStock": number
    }
  Success 201:  { success, data: created item }
  Errors:       400 | 409 item code already exists

  GET /inventory/:id
  ───────────────────
  Description:  Return a single inventory item by ID.
  Auth:         Required — all roles
  Success 200:  { success, data: item object with category and warehouse }
  Errors:       404

  PUT /inventory/:id
  ───────────────────
  Description:  Update an inventory item's details.
  Auth:         Required — admin, pao, storekeeper
  Request body: Any subset of inventory fields (excluding quantity).
  Success 200:  { success, data: updated item }
  Errors:       400 | 404

  DELETE /inventory/:id
  ──────────────────────
  Description:  Remove an inventory item (only if quantity = 0).
  Auth:         Required — admin, pao
  Success 200:  { success, message: "Item deleted." }
  Errors:       404 | 422 cannot delete item with remaining stock

  GET /inventory/:id/bin-card
  ────────────────────────────
  Description:  Return the digital bin card for an inventory item.
                Shows every receive, issue, and adjustment transaction
                with running balance.
  Auth:         Required — admin, pao, storekeeper, stock_clerk, accountant
  Query params: ?from=2026-01-01&to=2026-12-31
  Success 200:
    {
      "success": true,
      "data": {
        "item": { id, itemCode, name, unit },
        "currentBalance": 120,
        "entries": [
          {
            "date": "2026-08-01",
            "referenceNumber": "GRN-001",
            "type": "RECEIVE",
            "quantityIn": 100,
            "quantityOut": null,
            "balance": 100,
            "remarks": "Received from ABC Suppliers"
          }
        ]
      }
    }

================================================================================
9. CATEGORY ENDPOINTS
================================================================================

  GET /categories
  ────────────────
  Description:  Return all inventory categories (MoFED codes 4401–4418).
  Auth:         Required — all roles
  Success 200:  { success, data: [ category objects ] }

  POST /categories
  ─────────────────
  Description:  Create a new category.
  Auth:         Required — admin, pao, storekeeper
  Request body: { "code": "string", "name": "string", "description": "string" }
  Success 201:  { success, data: created category }
  Errors:       400 | 409 code already exists

  PUT /categories/:id
  ────────────────────
  Description:  Update a category.
  Auth:         Required — admin, pao, storekeeper
  Success 200:  { success, data: updated category }
  Errors:       400 | 404

  DELETE /categories/:id
  ───────────────────────
  Description:  Delete a category (only if no items are assigned to it).
  Auth:         Required — admin
  Success 200:  { success, message: "Category deleted." }
  Errors:       404 | 422 category has items assigned

================================================================================
10. SUPPLIER ENDPOINTS
================================================================================

  GET /suppliers
  ───────────────
  Description:  Return all suppliers with optional search.
  Auth:         Required — admin, pao, storekeeper, stock_clerk, accountant
  Query params: ?search=abc&status=active
  Success 200:  { success, data: [ supplier objects ] }

  POST /suppliers
  ────────────────
  Description:  Register a new supplier.
  Auth:         Required — admin, pao, storekeeper
  Request body:
    {
      "name": "string",
      "contactPerson": "string",
      "phone": "string",
      "email": "string",
      "address": "string"
    }
  Success 201:  { success, data: created supplier }
  Errors:       400

  GET /suppliers/:id
  ───────────────────
  Description:  Return a single supplier by ID.
  Auth:         Required — admin, pao, storekeeper, stock_clerk
  Success 200:  { success, data: supplier object }
  Errors:       404

  PUT /suppliers/:id
  ───────────────────
  Description:  Update supplier information.
  Auth:         Required — admin, pao, storekeeper
  Success 200:  { success, data: updated supplier }
  Errors:       400 | 404

  DELETE /suppliers/:id
  ──────────────────────
  Description:  Remove a supplier (only if no transactions reference it).
  Auth:         Required — admin, pao
  Success 200:  { success, message: "Supplier removed." }
  Errors:       404 | 422

================================================================================
11. WAREHOUSE ENDPOINTS
================================================================================

  GET /warehouses
  ────────────────
  Description:  Return all warehouses.
  Auth:         Required — all roles
  Success 200:  { success, data: [ warehouse objects ] }

  POST /warehouses
  ─────────────────
  Description:  Register a new warehouse.
  Auth:         Required — admin, pao
  Request body: { "name": "string", "location": "string", "description": "string" }
  Success 201:  { success, data: created warehouse }
  Errors:       400 | 409 name already exists

  GET /warehouses/:id
  ────────────────────
  Description:  Return a warehouse with its current stock levels.
  Auth:         Required — all roles
  Success 200:
    {
      "success": true,
      "data": {
        "warehouse": { id, name, location },
        "items": [
          { id, itemCode, name, quantity, minimumLevel, status }
        ]
      }
    }
  Errors:       404

================================================================================
12. STOCK TRANSACTION ENDPOINTS
================================================================================

  POST /stock/receive
  ────────────────────
  Description:  Record stock received from a supplier.
                Increases inventory quantity.
                Generates a Goods Receiving Note (GRN).
                Records unit cost for FIFO batch tracking.
  Auth:         Required — admin, storekeeper
  Request body:
    {
      "inventoryId": number,
      "supplierId": number,
      "quantity": number,
      "unitCost": number,
      "transactionDate": "YYYY-MM-DD",
      "referenceNumber": "string (optional)",
      "notes": "string (optional)"
    }
  Success 201:
    {
      "success": true,
      "data": {
        "transactionId": number,
        "grnNumber": "GRN-20260801-001",
        "newQuantity": number
      }
    }
  Errors:       400 | 404 item not found | 404 supplier not found

  POST /stock/issue
  ──────────────────
  Description:  Record stock issued to a department.
                Applies FIFO logic to calculate cost.
                Decreases inventory quantity.
                Generates an Issue Voucher.
  Auth:         Required — admin, storekeeper
  Request body:
    {
      "inventoryId": number,
      "quantity": number,
      "department": "string",
      "recipientName": "string",
      "transactionDate": "YYYY-MM-DD",
      "notes": "string (optional)"
    }
  Success 201:
    {
      "success": true,
      "data": {
        "transactionId": number,
        "voucherNumber": "IV-20260801-001",
        "newQuantity": number,
        "costOfGoodsIssued": number
      }
    }
  Errors:       400 | 404 | 422 insufficient stock

  POST /stock/transfer
  ─────────────────────
  Description:  Transfer stock between two warehouses.
                Decreases source warehouse quantity.
                Increases destination warehouse quantity.
  Auth:         Required — admin, storekeeper
  Request body:
    {
      "inventoryId": number,
      "sourceWarehouseId": number,
      "destWarehouseId": number,
      "quantity": number,
      "transactionDate": "YYYY-MM-DD",
      "notes": "string (optional)"
    }
  Success 201:
    {
      "success": true,
      "data": {
        "transactionId": number,
        "sourceNewQuantity": number,
        "destNewQuantity": number
      }
    }
  Errors:       400 | 404 | 422 insufficient stock | 422 same warehouse

  GET /stock/history
  ───────────────────
  Description:  Return stock transaction history with filters.
  Auth:         Required — admin, pao, storekeeper, stock_clerk, accountant,
                           dept_head, security_officer
  Query params: ?inventoryId=1&type=RECEIVE|ISSUE|TRANSFER_OUT|TRANSFER_IN
                &from=2026-01-01&to=2026-12-31&page=1&limit=20
  Success 200:  { success, data: [ transaction objects ], pagination }

================================================================================
13. STOCK TAKING ENDPOINTS
================================================================================

  POST /stock-takings
  ────────────────────
  Description:  Submit a physical stock count for PAO approval.
  Auth:         Required — admin, storekeeper, stock_clerk
  Request body:
    {
      "inventoryId": number,
      "physicalQuantity": number,
      "notes": "string (optional)"
    }
  Success 201:
    {
      "success": true,
      "data": {
        "stockTakingId": number,
        "systemQuantity": number,
        "physicalQuantity": number,
        "variance": number,
        "status": "pending"
      }
    }
  Errors:       400 | 404

  GET /stock-takings
  ───────────────────
  Description:  Return all stock taking records.
  Auth:         Required — admin, pao, storekeeper, stock_clerk
  Query params: ?status=pending|approved|rejected&page=1&limit=20
  Success 200:  { success, data: [ stock taking objects ], pagination }

  GET /stock-takings/:id
  ───────────────────────
  Description:  Return a single stock taking record.
  Auth:         Required — admin, pao, storekeeper, stock_clerk
  Success 200:  { success, data: stock taking object with item details }
  Errors:       404

  PATCH /stock-takings/:id/approve
  ──────────────────────────────────
  Description:  PAO approves a stock adjustment.
                Updates inventory quantity to physical count value.
                Creates an ADJUSTMENT stock transaction.
  Auth:         Required — admin, pao
  Request body: { "notes": "string (optional)" }
  Success 200:
    {
      "success": true,
      "data": { "newQuantity": number, "adjustmentTransactionId": number }
    }
  Errors:       404 | 422 already approved/rejected

  PATCH /stock-takings/:id/reject
  ─────────────────────────────────
  Description:  PAO rejects a stock adjustment.
  Auth:         Required — admin, pao
  Request body: { "notes": "string — reason for rejection" }
  Success 200:  { success, message: "Stock taking rejected." }
  Errors:       404 | 422 already approved/rejected

================================================================================
14. DAMAGED / OBSOLETE ENDPOINTS
================================================================================

  POST /damaged
  ──────────────
  Description:  Flag an inventory item as damaged or obsolete.
                Changes item status. Excludes from available stock.
  Auth:         Required — admin, pao, storekeeper, stock_clerk
  Request body:
    {
      "inventoryId": number,
      "condition": "damaged | obsolete",
      "quantityAffected": number,
      "description": "string"
    }
  Success 201:  { success, data: damaged record }
  Errors:       400 | 404

  GET /damaged
  ─────────────
  Description:  Return all damaged/obsolete records.
  Auth:         Required — admin, pao, storekeeper, stock_clerk, accountant
  Query params: ?status=pending|approved|disposed&condition=damaged|obsolete
  Success 200:  { success, data: [ damaged records ] }

  PATCH /damaged/:id/approve-disposal
  ─────────────────────────────────────
  Description:  PAO approves disposal of a damaged/obsolete item.
                Changes item status to "disposed".
                Reduces inventory quantity.
  Auth:         Required — admin, pao
  Success 200:  { success, message: "Disposal approved." }
  Errors:       404 | 422 already disposed

  PATCH /damaged/:id/reject-disposal
  ────────────────────────────────────
  Description:  PAO rejects disposal. Item status reverts to "available".
  Auth:         Required — admin, pao
  Request body: { "notes": "string" }
  Success 200:  { success, message: "Disposal rejected. Item restored." }
  Errors:       404

================================================================================
15. REPORT ENDPOINTS
================================================================================

  All report endpoints return filtered, aggregated data for display and export.
  All support ?from=YYYY-MM-DD&to=YYYY-MM-DD date range filtering.

  GET /reports/inventory
  ───────────────────────
  Description:  Inventory summary report.
  Auth:         Required — admin, pao, storekeeper, stock_clerk, accountant,
                           dept_head
  Query params: ?category=4401&warehouse=1&status=available

  GET /reports/stock-movement
  ────────────────────────────
  Description:  All stock transactions in a date range.
  Auth:         Required — admin, pao, storekeeper, stock_clerk, accountant,
                           dept_head, security_officer

  GET /reports/low-stock
  ───────────────────────
  Description:  Items at or below minimum stock level.
  Auth:         Required — admin, pao, storekeeper, stock_clerk, dept_head

  GET /reports/fifo
  ──────────────────
  Description:  FIFO valuation report.
                Shows per-item batch breakdown, remaining quantities,
                unit costs, and total inventory value.
  Auth:         Required — admin, pao, accountant

  GET /reports/damaged
  ─────────────────────
  Description:  All damaged and obsolete items report.
  Auth:         Required — admin, pao, storekeeper, stock_clerk

  GET /reports/stock-taking
  ──────────────────────────
  Description:  Stock taking and reconciliation report.
  Auth:         Required — admin, pao, storekeeper, stock_clerk

  GET /reports/audit
  ───────────────────
  Description:  Audit activity report for a date range.
  Auth:         Required — admin, pao
  Query params: ?userId=1&action=ISSUE_STOCK

================================================================================
16. AUDIT LOG ENDPOINTS
================================================================================

  GET /audit-logs
  ────────────────
  Description:  Return audit log entries with filters.
  Auth:         Required — admin, pao
  Query params: ?userId=1&action=ISSUE_STOCK&from=2026-01-01&to=2026-12-31
                &page=1&limit=50
  Success 200:  { success, data: [ audit log objects ], pagination }

  GET /audit-logs/:id
  ────────────────────
  Description:  Return a single audit log entry with full detail
                (old_values, new_values).
  Auth:         Required — admin, pao
  Success 200:  { success, data: audit log entry with full detail }
  Errors:       404

  Note: No POST, PUT, PATCH, or DELETE endpoints exist for audit logs.
  Audit logs are append-only and written exclusively by auditMiddleware.

================================================================================
17. COMPLETE ENDPOINT REFERENCE TABLE
================================================================================

  ┌─────────────────────────────────────────┬────────┬──────────────────────────────┐
  │ Endpoint                                │ Method │ Allowed Roles                │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /auth/login                             │ POST   │ Public                       │
  │ /auth/logout                            │ POST   │ All authenticated            │
  │ /auth/me                                │ GET    │ All authenticated            │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /users                                  │ GET    │ admin, pao                   │
  │ /users                                  │ POST   │ admin                        │
  │ /users/:id                              │ GET    │ admin, pao                   │
  │ /users/:id                              │ PUT    │ admin                        │
  │ /users/:id/deactivate                   │ PATCH  │ admin                        │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /inventory                              │ GET    │ All authenticated            │
  │ /inventory                              │ POST   │ admin, pao, storekeeper      │
  │ /inventory/:id                          │ GET    │ All authenticated            │
  │ /inventory/:id                          │ PUT    │ admin, pao, storekeeper      │
  │ /inventory/:id                          │ DELETE │ admin, pao                   │
  │ /inventory/:id/bin-card                 │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk, accountant      │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /categories                             │ GET    │ All authenticated            │
  │ /categories                             │ POST   │ admin, pao, storekeeper      │
  │ /categories/:id                         │ PUT    │ admin, pao, storekeeper      │
  │ /categories/:id                         │ DELETE │ admin                        │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /suppliers                              │ GET    │ All except security_officer  │
  │ /suppliers                              │ POST   │ admin, pao, storekeeper      │
  │ /suppliers/:id                          │ GET    │ All except security_officer  │
  │ /suppliers/:id                          │ PUT    │ admin, pao, storekeeper      │
  │ /suppliers/:id                          │ DELETE │ admin, pao                   │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /warehouses                             │ GET    │ All authenticated            │
  │ /warehouses                             │ POST   │ admin, pao                   │
  │ /warehouses/:id                         │ GET    │ All authenticated            │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /stock/receive                          │ POST   │ admin, storekeeper           │
  │ /stock/issue                            │ POST   │ admin, storekeeper           │
  │ /stock/transfer                         │ POST   │ admin, storekeeper           │
  │ /stock/history                          │ GET    │ All authenticated            │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /stock-takings                          │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk                  │
  │ /stock-takings                          │ POST   │ admin, storekeeper,          │
  │                                         │        │ stock_clerk                  │
  │ /stock-takings/:id                      │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk                  │
  │ /stock-takings/:id/approve              │ PATCH  │ admin, pao                   │
  │ /stock-takings/:id/reject               │ PATCH  │ admin, pao                   │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /damaged                                │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk, accountant      │
  │ /damaged                                │ POST   │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk                  │
  │ /damaged/:id/approve-disposal           │ PATCH  │ admin, pao                   │
  │ /damaged/:id/reject-disposal            │ PATCH  │ admin, pao                   │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /reports/inventory                      │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk, accountant,     │
  │                                         │        │ dept_head                    │
  │ /reports/stock-movement                 │ GET    │ All authenticated            │
  │ /reports/low-stock                      │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk, dept_head       │
  │ /reports/fifo                           │ GET    │ admin, pao, accountant       │
  │ /reports/damaged                        │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk                  │
  │ /reports/stock-taking                   │ GET    │ admin, pao, storekeeper,     │
  │                                         │        │ stock_clerk                  │
  │ /reports/audit                          │ GET    │ admin, pao                   │
  ├─────────────────────────────────────────┼────────┼──────────────────────────────┤
  │ /audit-logs                             │ GET    │ admin, pao                   │
  │ /audit-logs/:id                         │ GET    │ admin, pao                   │
  └─────────────────────────────────────────┴────────┴──────────────────────────────┘

================================================================================
END OF DOCUMENT
================================================================================
