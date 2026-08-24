================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Information Architecture and Sitemap

Document: 03-Information-Architecture-Sitemap.md
Phase:    Phase 2 — UX/UI Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1. Overview
  2. IA Design Principles Applied
  3. Application Sitemap
  4. Primary Navigation Structure
  5. Page Inventory
  6. URL / Route Structure
  7. Role-Based Navigation Map

Draw.io source file: 02-User-Flows/sitemap.drawio

================================================================================
1. OVERVIEW
================================================================================

This document defines the Information Architecture (IA) of the ASTU Stock
Management System. It specifies how the application is organized: which pages
exist, how they relate to each other, how users navigate between them, and
which routes correspond to which pages.

The IA is derived from the functional requirements in the SRS (Phase 1) and
the user flows defined in 02-User-Flow-Design.md.

================================================================================
2. IA DESIGN PRINCIPLES APPLIED
================================================================================

  Grouping by user goal, not by technical implementation.
  Pages and navigation items are grouped by what the user is trying to
  accomplish (e.g., "Stock Management" groups receive, issue, and transfer
  because they are all stock transactions), not by how they are implemented.

  Role-based visibility.
  Navigation items are filtered based on user role. Each role sees only
  the modules they are permitted to access.

  Shallow hierarchy.
  The application uses a maximum of 3 levels: primary navigation area →
  module page → action/detail page. No user task requires more than 3 clicks
  from the dashboard to reach.

  Predictable URL structure.
  URL paths mirror the IA hierarchy, making navigation bookmarkable and
  shareable.

================================================================================
3. APPLICATION SITEMAP
================================================================================

ASTU Stock Management System
│
├── Authentication
│   ├── Login                        /login
│   └── (Logout — action, no page)
│
└── Application (authenticated)
    │
    ├── Dashboard                    /dashboard
    │   ├── Summary Cards
    │   │   (Total Items, Low Stock Alerts, Recent Transactions)
    │   ├── Low Stock Items List
    │   ├── Pending Approvals (PAO view)
    │   └── Quick Action Buttons
    │
    ├── Inventory                    /inventory
    │   ├── Inventory List           /inventory
    │   ├── Add Item                 /inventory/add
    │   ├── Item Details             /inventory/:id
    │   ├── Edit Item                /inventory/:id/edit
    │   └── Bin Card View            /inventory/:id/bin-card
    │
    ├── Categories                   /categories
    │   ├── Category List            /categories
    │   ├── Add Category             /categories/add
    │   └── Edit Category            /categories/:id/edit
    │
    ├── Stock Management             /stock
    │   ├── Receive Stock            /stock/receive
    │   ├── Issue Stock              /stock/issue
    │   ├── Transfer Stock           /stock/transfer
    │   └── Stock History            /stock/history
    │
    ├── Stock Taking                 /stock-taking
    │   ├── Conduct Count            /stock-taking
    │   ├── Pending Approvals        /stock-taking/approvals
    │   └── Reconciliation Report    /stock-taking/report
    │
    ├── Damaged / Obsolete           /damaged
    │   ├── Items List               /damaged
    │   ├── Report Item              /damaged/report
    │   ├── Pending Disposals        /damaged/approvals
    │   └── Disposal History         /damaged/history
    │
    ├── Suppliers                    /suppliers
    │   ├── Supplier List            /suppliers
    │   ├── Add Supplier             /suppliers/add
    │   ├── Supplier Details         /suppliers/:id
    │   └── Edit Supplier            /suppliers/:id/edit
    │
    ├── Warehouses                   /warehouses
    │   ├── Warehouse List           /warehouses
    │   ├── Add Warehouse            /warehouses/add
    │   └── Warehouse Detail         /warehouses/:id
    │       (Shows per-warehouse stock levels)
    │
    ├── Reports                      /reports
    │   ├── Inventory Report         /reports/inventory
    │   ├── Stock Movement Report    /reports/stock-movement
    │   ├── Low Stock Report         /reports/low-stock
    │   ├── FIFO Valuation Report    /reports/fifo
    │   ├── Damaged/Obsolete Report  /reports/damaged
    │   ├── Stock Taking Report      /reports/stock-taking
    │   └── Audit Report             /reports/audit
    │
    └── Administration               /admin
        ├── Users                    /admin/users
        ├── Add User                 /admin/users/add
        ├── Edit User                /admin/users/:id/edit
        ├── Roles                    /admin/roles
        └── Audit Log                /admin/audit-log

================================================================================
4. PRIMARY NAVIGATION STRUCTURE
================================================================================

The application uses a persistent left sidebar navigation visible on all
authenticated pages.

  Sidebar Navigation Items (Storekeeper view — representative):
  ┌─────────────────────────────┐
  │ ASTU Stock Management       │
  ├─────────────────────────────┤
  │ 🏠 Dashboard                │
  │ 📦 Inventory                │
  │ 🔄 Stock Management         │
  │ 📋 Stock Taking             │
  │ ⚠  Damaged / Obsolete       │
  │ 🏢 Warehouses               │
  │ 🏭 Suppliers                │
  │ 📊 Reports                  │
  └─────────────────────────────┘
  (Administration hidden for Storekeeper role)

  Additional items shown for Administrator / PAO:
  │ 👥 Administration           │
  │    ├── Users                │
  │    ├── Roles                │
  │    └── Audit Log            │

Navigation items are rendered conditionally based on the authenticated user's
role. See Section 7 for the complete role-based navigation map.

================================================================================
5. PAGE INVENTORY
================================================================================

  ┌────────┬─────────────────────────────────┬───────────────────────────────┬──────────────────────┬──────────┐
  │ ID     │ Page                            │ Route                         │ Primary Role         │ Priority │
  ├────────┼─────────────────────────────────┼───────────────────────────────┼──────────────────────┼──────────┤
  │ PG-001 │ Login                           │ /login                        │ All                  │ Must     │
  │ PG-002 │ Dashboard                       │ /dashboard                    │ All                  │ Must     │
  │ PG-003 │ Inventory List                  │ /inventory                    │ Storekeeper          │ Must     │
  │ PG-004 │ Add Inventory Item              │ /inventory/add                │ Storekeeper          │ Must     │
  │ PG-005 │ Item Details                    │ /inventory/:id                │ Storekeeper          │ Must     │
  │ PG-006 │ Edit Inventory Item             │ /inventory/:id/edit           │ Storekeeper          │ Must     │
  │ PG-007 │ Bin Card View                   │ /inventory/:id/bin-card       │ Storekeeper / Clerk  │ Must     │
  │ PG-008 │ Category List                   │ /categories                   │ Storekeeper          │ Must     │
  │ PG-009 │ Receive Stock                   │ /stock/receive                │ Storekeeper          │ Must     │
  │ PG-010 │ Issue Stock                     │ /stock/issue                  │ Storekeeper          │ Must     │
  │ PG-011 │ Transfer Stock                  │ /stock/transfer               │ Storekeeper          │ Must     │
  │ PG-012 │ Stock History                   │ /stock/history                │ Storekeeper          │ Must     │
  │ PG-013 │ Conduct Stock Taking            │ /stock-taking                 │ Storekeeper / Clerk  │ Must     │
  │ PG-014 │ Stock Taking Approvals          │ /stock-taking/approvals       │ PAO                  │ Must     │
  │ PG-015 │ Damaged / Obsolete Items List   │ /damaged                      │ Storekeeper / PAO    │ Must     │
  │ PG-016 │ Report Damaged Item             │ /damaged/report               │ Storekeeper          │ Must     │
  │ PG-017 │ Pending Disposals               │ /damaged/approvals            │ PAO                  │ Must     │
  │ PG-018 │ Supplier List                   │ /suppliers                    │ Storekeeper          │ Must     │
  │ PG-019 │ Add/Edit Supplier               │ /suppliers/add, /:id/edit     │ Storekeeper          │ Must     │
  │ PG-020 │ Warehouse List                  │ /warehouses                   │ Admin / PAO          │ Must     │
  │ PG-021 │ Warehouse Detail                │ /warehouses/:id               │ Admin / PAO          │ Must     │
  │ PG-022 │ Inventory Report                │ /reports/inventory            │ All authorized       │ Must     │
  │ PG-023 │ Stock Movement Report           │ /reports/stock-movement       │ All authorized       │ Must     │
  │ PG-024 │ Low Stock Report                │ /reports/low-stock            │ Storekeeper / PAO    │ Must     │
  │ PG-025 │ FIFO Valuation Report           │ /reports/fifo                 │ Accountant / PAO     │ Must     │
  │ PG-026 │ Damaged/Obsolete Report         │ /reports/damaged              │ PAO / Admin          │ Must     │
  │ PG-027 │ Stock Taking Report             │ /reports/stock-taking         │ PAO / Management     │ Must     │
  │ PG-028 │ Audit Report                    │ /reports/audit                │ Admin / PAO          │ Must     │
  │ PG-029 │ User Management                 │ /admin/users                  │ Administrator        │ Must     │
  │ PG-030 │ Audit Log                       │ /admin/audit-log              │ Admin / PAO          │ Must     │
  └────────┴─────────────────────────────────┴───────────────────────────────┴──────────────────────┴──────────┘

================================================================================
6. URL / ROUTE STRUCTURE
================================================================================

All routes follow RESTful conventions. Frontend routes mirror the sitemap.

  /login
  /dashboard

  /inventory
  /inventory/add
  /inventory/:id
  /inventory/:id/edit
  /inventory/:id/bin-card

  /categories
  /categories/add
  /categories/:id/edit

  /stock/receive
  /stock/issue
  /stock/transfer
  /stock/history

  /stock-taking
  /stock-taking/approvals
  /stock-taking/report

  /damaged
  /damaged/report
  /damaged/approvals
  /damaged/history

  /suppliers
  /suppliers/add
  /suppliers/:id
  /suppliers/:id/edit

  /warehouses
  /warehouses/add
  /warehouses/:id

  /reports/inventory
  /reports/stock-movement
  /reports/low-stock
  /reports/fifo
  /reports/damaged
  /reports/stock-taking
  /reports/audit

  /admin/users
  /admin/users/add
  /admin/users/:id/edit
  /admin/roles
  /admin/audit-log

Protected routes: All routes except /login require a valid JWT.
Unauthorized routes: Users accessing a route outside their role permissions
are redirected to a 403 page.

================================================================================
7. ROLE-BASED NAVIGATION MAP
================================================================================

  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Module             │ Admin │ PAO │ Store │ Clerk │ Acct │ Dept │ Secu  │
  ├─────────────────────────────────────────────────────────────────────────┤
  │ Dashboard          │  ✓    │  ✓  │   ✓   │   ✓   │  ✓   │  ✓   │  ✓   │
  │ Inventory          │  ✓    │  ✓  │   ✓   │   ✓   │  R   │  R   │  —   │
  │ Bin Card           │  ✓    │  ✓  │   ✓   │   ✓   │  R   │  —   │  —   │
  │ Categories         │  ✓    │  ✓  │   ✓   │   —   │  R   │  —   │  —   │
  │ Stock – Receive    │  ✓    │  —  │   ✓   │   —   │  —   │  —   │  —   │
  │ Stock – Issue      │  ✓    │  —  │   ✓   │   —   │  —   │  —   │  —   │
  │ Stock – Transfer   │  ✓    │  —  │   ✓   │   —   │  —   │  —   │  —   │
  │ Stock – History    │  ✓    │  ✓  │   ✓   │   ✓   │  R   │  R   │  R   │
  │ Stock Taking       │  ✓    │  A  │   ✓   │   ✓   │  —   │  —   │  —   │
  │ Damaged/Obsolete   │  ✓    │  A  │   ✓   │   ✓   │  R   │  —   │  —   │
  │ Suppliers          │  ✓    │  ✓  │   ✓   │   R   │  R   │  —   │  —   │
  │ Warehouses         │  ✓    │  ✓  │   R   │   R   │  R   │  —   │  —   │
  │ Reports – Inventory│  ✓    │  ✓  │   ✓   │   ✓   │  R   │  R   │  —   │
  │ Reports – FIFO     │  ✓    │  ✓  │   —   │   —   │  ✓   │  —   │  —   │
  │ Reports – Audit    │  ✓    │  ✓  │   —   │   —   │  —   │  —   │  —   │
  │ Admin – Users      │  ✓    │  R  │   —   │   —   │  —   │  —   │  —   │
  │ Admin – Audit Log  │  ✓    │  ✓  │   —   │   —   │  —   │  —   │  —   │
  └─────────────────────────────────────────────────────────────────────────┘

  Legend: ✓ = Full access | R = Read only | A = Approve only | — = No access

================================================================================
END OF DOCUMENT
================================================================================
