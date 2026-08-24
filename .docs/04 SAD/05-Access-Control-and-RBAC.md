ASTU Stock Management System
Access Control and RBAC Document
Phase 3 — System Analysis and Design

Document: 05-Access-Control-and-RBAC.md
Version:  1.0
Author:   Megersa Tekalign Senbeta
Date:     August 2026

================================================================================

Table of Contents
  1. Overview
  2. Role Definitions
  3. Permission Matrix (All Modules)
  4. API Endpoint Access Control
  5. Frontend Navigation by Role
  6. Implementation Notes

================================================================================

1. Overview
━━━━━━━━━━━

The ASTU Stock Management System implements Role-Based Access Control (RBAC)
as required by:
  • FR-ROLE-001 / FR-ROLE-002 (Functional Requirements)
  • BR-03 — Only authorized personnel can approve inventory transactions.
  • BR-15 — Only authorized users can access inventory information.
  • NFR-SEC-002 — The system shall implement role-based access control.

RBAC ensures that each user can only access the functionality their role permits.
This prevents unauthorized access to sensitive inventory operations and data.

================================================================================

2. Role Definitions
━━━━━━━━━━━━━━━━━━━

  ┌──────────────────┬─────────────────────────────────────────────────────────┐
  │ Role             │ Description and Primary Responsibilities                │
  ├──────────────────┼─────────────────────────────────────────────────────────┤
  │ Administrator    │ Full system access. Manages users, roles, and system    │
  │                  │ configuration. Views audit logs.                        │
  ├──────────────────┼─────────────────────────────────────────────────────────┤
  │ PAO              │ Property Administration Officer. Approves stock          │
  │ (pao)            │ requests, disposals, stock adjustments. Views all       │
  │                  │ reports and audit trail. Highest inventory authority.   │
  ├──────────────────┼─────────────────────────────────────────────────────────┤
  │ Storekeeper      │ Day-to-day inventory operations. Receives stock, issues  │
  │ (storekeeper)    │ stock, transfers stock, manages bin cards and items.    │
  ├──────────────────┼─────────────────────────────────────────────────────────┤
  │ Stock Clerk      │ Supports storekeeper. Updates stock records, conducts   │
  │ (stock_clerk)    │ physical counts, prepares reports.                      │
  ├──────────────────┼─────────────────────────────────────────────────────────┤
  │ Accountant       │ Views financial reports and FIFO valuation data.        │
  │ (accountant)     │ No write access to inventory operations.                │
  ├──────────────────┼─────────────────────────────────────────────────────────┤
  │ Department Head  │ Approves requisitions from their department.            │
  │ (dept_head)      │ Views stock availability for planning purposes.         │
  ├──────────────────┼─────────────────────────────────────────────────────────┤
  │ Security Officer │ Views gate pass / outgoing materials information.       │
  │ (security_officer│ Read-only access to outgoing transactions.              │
  └──────────────────┴─────────────────────────────────────────────────────────┘

================================================================================

3. Permission Matrix
━━━━━━━━━━━━━━━━━━━━

Legend:
  ✓  = Full access (read + write)
  R  = Read only
  A  = Approve only
  -  = No access

  ┌──────────────────────────────┬───────┬─────┬───────┬───────┬──────┬───────┬──────────┐
  │ Module / Action              │ Admin │ PAO │ Store │ Clerk │ Acct │ Dept  │ Security │
  │                              │       │     │ keep  │       │      │ Head  │ Officer  │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ AUTHENTICATION               │       │     │       │       │      │       │          │
  │  Login / Logout              │  ✓    │  ✓  │   ✓   │   ✓   │  ✓   │   ✓   │    ✓     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ DASHBOARD                    │       │     │       │       │      │       │          │
  │  View dashboard              │  ✓    │  ✓  │   ✓   │   ✓   │  ✓   │   ✓   │    ✓     │
  │  View pending approvals      │  ✓    │  ✓  │   -   │   -   │  -   │   ✓   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ INVENTORY MANAGEMENT         │       │     │       │       │      │       │          │
  │  View inventory list         │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    -     │
  │  Add inventory item          │  ✓    │  ✓  │   ✓   │   -   │  -   │   -   │    -     │
  │  Edit inventory item         │  ✓    │  ✓  │   ✓   │   -   │  -   │   -   │    -     │
  │  Delete inventory item       │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  │  View item details           │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    -     │
  │  View bin card               │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ CATEGORIES                   │       │     │       │       │      │       │          │
  │  View categories             │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    -     │
  │  Add / Edit / Delete         │  ✓    │  ✓  │   ✓   │   -   │  -   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ STOCK TRANSACTIONS           │       │     │       │       │      │       │          │
  │  Receive stock               │  ✓    │  R  │   ✓   │   -   │  -   │   -   │    -     │
  │  Issue stock                 │  ✓    │  A  │   ✓   │   -   │  -   │   -   │    -     │
  │  Transfer stock              │  ✓    │  A  │   ✓   │   -   │  -   │   -   │    -     │
  │  View stock history          │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    R     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ STOCK TAKING                 │       │     │       │       │      │       │          │
  │  Conduct physical count      │  ✓    │  -  │   ✓   │   ✓   │  -   │   -   │    -     │
  │  Submit for approval         │  ✓    │  -  │   ✓   │   ✓   │  -   │   -   │    -     │
  │  Approve stock adjustment    │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  │  View reconciliation report  │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ DAMAGED / OBSOLETE           │       │     │       │       │      │       │          │
  │  Report damaged/obsolete     │  ✓    │  -  │   ✓   │   ✓   │  -   │   -   │    -     │
  │  Approve disposal            │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  │  View damaged/obsolete list  │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ SUPPLIERS                    │       │     │       │       │      │       │          │
  │  View suppliers              │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   -   │    -     │
  │  Add / Edit suppliers        │  ✓    │  ✓  │   ✓   │   -   │  -   │   -   │    -     │
  │  Delete suppliers            │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ WAREHOUSES                   │       │     │       │       │      │       │          │
  │  View warehouses             │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   -   │    -     │
  │  Add / Edit warehouses       │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ REPORTS                      │       │     │       │       │      │       │          │
  │  Inventory report            │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    -     │
  │  Stock movement report       │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    -     │
  │  Low stock report            │  ✓    │  ✓  │   ✓   │   ✓   │  -   │   R   │    -     │
  │  FIFO valuation report       │  ✓    │  ✓  │   -   │   -   │  ✓   │   -   │    -     │
  │  Damaged/obsolete report     │  ✓    │  ✓  │   ✓   │   ✓   │  -   │   -   │    -     │
  │  Stock taking report         │  ✓    │  ✓  │   ✓   │   ✓   │  -   │   -   │    -     │
  │  Audit report                │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ USER MANAGEMENT              │       │     │       │       │      │       │          │
  │  View users                  │  ✓    │  R  │   -   │   -   │  -   │   -   │    -     │
  │  Add / Edit / Deactivate     │  ✓    │  -  │   -   │   -   │  -   │   -   │    -     │
  │  Assign roles                │  ✓    │  -  │   -   │   -   │  -   │   -   │    -     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ AUDIT LOG                    │       │     │       │       │      │       │          │
  │  View audit log              │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  │  Export audit report         │  ✓    │  ✓  │   -   │   -   │  -   │   -   │    -     │
  └──────────────────────────────┴───────┴─────┴───────┴───────┴──────┴───────┴──────────┘

================================================================================

4. API Endpoint Access Control
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every protected API endpoint must pass through:
  1. authMiddleware   — verifies the JWT token is valid
  2. roleMiddleware   — checks the user's role has permission for this endpoint

  Example Express middleware usage:
  ─────────────────────────────────

  // Only storekeeper and admin can receive stock
  router.post('/api/stock/receive',
    authMiddleware,
    roleMiddleware(['admin', 'storekeeper']),
    stockController.receiveStock
  );

  // Only PAO and admin can approve stock adjustments
  router.patch('/api/stock-takings/:id/approve',
    authMiddleware,
    roleMiddleware(['admin', 'pao']),
    stockTakingController.approve
  );

  // Only admin can manage users
  router.post('/api/users',
    authMiddleware,
    roleMiddleware(['admin']),
    userController.create
  );

  // Accountant and PAO/admin can view FIFO report
  router.get('/api/reports/fifo',
    authMiddleware,
    roleMiddleware(['admin', 'pao', 'accountant']),
    reportController.fifoValuation
  );

================================================================================

5. Frontend Navigation by Role
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The sidebar navigation must show only the modules relevant to each role.

  Administrator:
  ─────────────
  Dashboard | Inventory | Stock | Stock Taking | Damaged/Obsolete |
  Warehouses | Suppliers | Reports (all) | Users | Audit Log

  PAO:
  ────
  Dashboard | Inventory (view) | Stock (view/approve) | Stock Taking (approve) |
  Damaged/Obsolete (approve) | Warehouses (view) | Suppliers (view) |
  Reports (all) | Users (view) | Audit Log

  Storekeeper:
  ────────────
  Dashboard | Inventory | Stock (receive/issue/transfer) | Stock Taking (conduct) |
  Damaged/Obsolete (report) | Warehouses (view) | Suppliers | Reports (operational)

  Stock Clerk:
  ────────────
  Dashboard | Inventory (view) | Stock (view history) | Stock Taking (conduct) |
  Damaged/Obsolete (report/view) | Reports (operational)

  Accountant:
  ───────────
  Dashboard | Inventory (view) | Reports (FIFO + movement)

  Department Head:
  ────────────────
  Dashboard | Inventory (view) | Stock History (view) | Reports (inventory/low stock)

  Security Officer:
  ─────────────────
  Dashboard | Stock History (outgoing only)

================================================================================

6. Implementation Notes
━━━━━━━━━━━━━━━━━━━━━━━

  JWT Token Structure:
  ─────────────────────
  The JWT payload should include:
    {
      "userId": 5,
      "email": "megersa@astu.edu.et",
      "role": "storekeeper",
      "iat": 1722480000,
      "exp": 1722566400
    }

  roleMiddleware Implementation:
  ────────────────────────────────
  const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: 'Access denied. Insufficient permissions.'
        });
      }
      next();
    };
  };

  Frontend Route Guard:
  ──────────────────────
  React routes must also be protected. An unauthenticated user who manually
  enters a URL like /admin/users must be redirected to /login.
  An authenticated user who lacks the required role must see a 403 page,
  not a blank screen or crash.

================================================================================
END OF DOCUMENT
================================================================================
