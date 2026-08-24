================================================================================
ASTU STOCK MANAGEMENT SYSTEM
User Flow Design

Document: 02-User-Flow-Design.md
Phase:    Phase 2 — UX/UI Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1. Overview
  2. Notation
  3. User Flow Inventory
  4. UF-001 — Login
  5. UF-002 — Add Inventory Item
  6. UF-003 — Receive Stock
  7. UF-004 — Issue Stock
  8. UF-005 — Search Inventory
  9. UF-006 — View Low Stock / Dashboard
  10. UF-007 — Generate Report
  11. UF-008 — Administrator Creates User
  12. UF-009 — Transfer Stock
  13. UF-010 — Conduct Physical Stock Taking
  14. UF-011 — Manage Damaged / Obsolete Items
  15. UF-012 — View Digital Bin Card
  16. UF-013 — View Audit Log

Draw.io source files are located in:
  phase-2-ux-ui-design/02-User-Flows/

================================================================================
1. OVERVIEW
================================================================================

This document defines all user flows for the ASTU Stock Management System.
Each flow describes the sequence of steps a specific user role follows to
complete a task, including decision points, alternative paths, and error states.

User flows are the bridge between the SRS use cases (Phase 1) and the wireframe
designs (04-Wireframe-Design.md). Every flow maps to one or more use cases and
functional requirements.

================================================================================
2. NOTATION
================================================================================

  ○  Start / End point
  ▭  Screen or action step
  ◇  Decision point
  ↓  Direction of flow
  ├── YES / NO branch paths

================================================================================
3. USER FLOW INVENTORY
================================================================================

  ┌─────────┬──────────────────────────────────────┬──────────────┬──────────┐
  │ ID      │ User Flow                            │ Actor        │ Priority │
  ├─────────┼──────────────────────────────────────┼──────────────┼──────────┤
  │ UF-001  │ Login                                │ All users    │ Must     │
  │ UF-002  │ Add Inventory Item                   │ Storekeeper  │ Must     │
  │ UF-003  │ Receive Stock                        │ Storekeeper  │ Must     │
  │ UF-004  │ Issue Stock                          │ Storekeeper  │ Must     │
  │ UF-005  │ Search Inventory                     │ All users    │ Must     │
  │ UF-006  │ View Low Stock / Dashboard           │ All users    │ Must     │
  │ UF-007  │ Generate Report                      │ Auth. users  │ Must     │
  │ UF-008  │ Administrator Creates User           │ Admin        │ Must     │
  │ UF-009  │ Transfer Stock                       │ Storekeeper  │ Must     │
  │ UF-010  │ Conduct Physical Stock Taking        │ Storekeeper  │ Must     │
  │ UF-011  │ Manage Damaged / Obsolete Items      │ Storekeeper  │ Must     │
  │ UF-012  │ View Digital Bin Card                │ Storekeeper  │ Must     │
  │ UF-013  │ View Audit Log                       │ Admin / PAO  │ Must     │
  └─────────┴──────────────────────────────────────┴──────────────┴──────────┘

SRS References: UC-001 through UC-020, FR-AUTH through FR-AUDIT.
Draw.io files:  02-User-Flows/UF-001.drawio through UF-013.drawio

================================================================================
4. UF-001 — LOGIN
================================================================================

Actor:          All users
SRS Reference:  UC-001, FR-AUTH-001 to FR-AUTH-004

  ○ Start
    ↓
  ▭ Open Login Page
    ↓
  ▭ Enter email and password
    ↓
  ▭ Submit login form
    ↓
  ◇ Are credentials valid?
    │
    ├── NO
    │    ↓
    │  ▭ Display error message ("Invalid email or password")
    │    ↓
    │  ▭ User corrects credentials
    │    └────────────────────────→ Enter email and password
    │
    └── YES
         ↓
       ◇ Is account active?
         │
         ├── NO
         │    ↓
         │  ▭ Display error ("Account is inactive. Contact administrator.")
         │    ↓
         │  ○ End
         │
         └── YES
              ↓
            ▭ Identify user role
              ↓
            ▭ Redirect to role-appropriate dashboard
              ↓
            ○ End

Postcondition: User is authenticated and views their dashboard.

================================================================================
5. UF-002 — ADD INVENTORY ITEM
================================================================================

Actor:          Storekeeper
SRS Reference:  UC-004, FR-INV-001 to FR-INV-006

  ○ Start
    ↓
  ▭ Dashboard → Inventory → Click "+ Add Item"
    ↓
  ▭ Add Item form displayed
    ↓
  ▭ Enter item details:
    Name, item code, category, warehouse, unit,
    minimum level, maximum level, reorder level, description
    ↓
  ▭ Submit form
    ↓
  ◇ Are required fields valid?
    │
    ├── NO
    │    ↓
    │  ▭ Display field-level validation errors
    │    ↓
    │  ▭ User corrects input
    │    └────────────────────────→ Submit form
    │
    └── YES
         ↓
       ◇ Does item code already exist?
         │
         ├── YES
         │    ↓
         │  ▭ Display error ("Item code already exists")
         │    ↓
         │  ▭ User enters a different item code
         │    └────────────────────────→ Submit form
         │
         └── NO
              ↓
            ▭ Save item to database
              ↓
            ▭ Display success notification
              ↓
            ▭ Return to Inventory List
              ↓
            ○ End

Postcondition: New item appears in the inventory list.

================================================================================
6. UF-003 — RECEIVE STOCK
================================================================================

Actor:          Storekeeper
SRS Reference:  UC-008, FR-REC-001 to FR-REC-006
Business Rules: BR-02, BR-05, BR-07, BR-08

  ○ Start
    ↓
  ▭ Dashboard → Stock Management → Receive Stock
    ↓
  ▭ Receive Stock form displayed
    ↓
  ▭ Select inventory item
  ▭ Select supplier
  ▭ Enter quantity
  ▭ Enter unit cost
  ▭ Enter receiving date
  ▭ Enter reference number (optional)
    ↓
  ▭ Submit form
    ↓
  ◇ Are all required fields valid?
    │
    ├── NO
    │    ↓
    │  ▭ Display field-level validation errors
    │    ↓
    │  ▭ User corrects input
    │    └────────────────────────→ Submit form
    │
    └── YES
         ↓
       ▭ Create RECEIVE stock transaction record
         ↓
       ▭ Increase inventory quantity
         ↓
       ▭ Record unit cost for FIFO batch tracking
         ↓
       ▭ Generate Goods Receiving Note (GRN)
         ↓
       ▭ Record audit log entry
         ↓
       ▭ Display success confirmation with GRN reference
         ↓
       ▭ Update bin card
         ↓
       ○ End

Postcondition: Inventory quantity increased. GRN generated. Transaction recorded
in stock history and bin card.

================================================================================
7. UF-004 — ISSUE STOCK
================================================================================

Actor:          Storekeeper
SRS Reference:  UC-009, FR-ISS-001 to FR-ISS-007
Business Rules: BR-04, BR-05, BR-07, BR-08

  ○ Start
    ↓
  ▭ Dashboard → Stock Management → Issue Stock
    ↓
  ▭ Issue Stock form displayed
    ↓
  ▭ Select inventory item
    (System displays current available quantity)
  ▭ Enter quantity to issue
  ▭ Select department
  ▭ Enter recipient name
  ▭ Enter issue date
    ↓
  ▭ Submit form
    ↓
  ◇ Is requested quantity ≤ available quantity?
    │
    ├── NO
    │    ↓
    │  ▭ Display error:
    │    "Insufficient stock. Available: X. Requested: Y."
    │    ↓
    │  ▭ User reduces quantity or cancels
    │    └────────────────────────→ Enter quantity to issue
    │
    └── YES
         ↓
       ▭ Apply FIFO logic (deduct from oldest batch first)
         ↓
       ▭ Create ISSUE stock transaction record
         ↓
       ▭ Decrease inventory quantity
         ↓
       ▭ Generate Issue Voucher
         ↓
       ▭ Record audit log entry
         ↓
       ▭ Display success confirmation with Issue Voucher reference
         ↓
       ▭ Update bin card
         ↓
       ○ End

Postcondition: Inventory quantity decreased. Issue Voucher generated.
Transaction recorded in stock history and bin card. FIFO cost recorded.

================================================================================
8. UF-005 — SEARCH INVENTORY
================================================================================

Actor:          All authorized users
SRS Reference:  FR-INV-007, FR-INV-008

  ○ Start
    ↓
  ▭ Inventory List page
    ↓
  ▭ Enter search term in search field
    (or select filter: category, warehouse, status)
    ↓
  ▭ System queries inventory
    ↓
  ◇ Results found?
    │
    ├── NO
    │    ↓
    │  ▭ Display "No items found matching your search."
    │    ↓
    │  ▭ User clears search or changes filters
    │    └────────────────────────→ Enter search term
    │
    └── YES
         ↓
       ▭ Display filtered inventory list
         ↓
       ▭ User selects an item to view details (optional)
         ↓
       ○ End

================================================================================
9. UF-006 — VIEW LOW STOCK / DASHBOARD
================================================================================

Actor:          All authorized users
SRS Reference:  FR-DASH-001 to FR-DASH-006, FR-CTRL-002, FR-CTRL-003

  ○ Start
    ↓
  ▭ User logs in
    ↓
  ▭ Dashboard displayed:
    - Total inventory items count
    - Available stock summary
    - Low-stock alert count
    - Recent transactions
    - Pending approvals (PAO view)
    ↓
  ◇ Are there low-stock items?
    │
    ├── NO
    │    ↓
    │  ▭ Dashboard shows "All stock levels are healthy"
    │    ↓
    │  ○ End
    │
    └── YES
         ↓
       ▭ Dashboard displays low-stock items list with counts
         ↓
       ▭ User clicks an item to view details (optional)
         ↓
       ○ End

================================================================================
10. UF-007 — GENERATE REPORT
================================================================================

Actor:          Authorized users (role-dependent)
SRS Reference:  UC-013, FR-REPORT-001 to FR-REPORT-009

  ○ Start
    ↓
  ▭ Dashboard → Reports
    ↓
  ▭ Select report type from dropdown:
    Inventory | Stock Movement | Low Stock | FIFO Valuation |
    Damaged/Obsolete | Stock Taking | Audit Report
    ↓
  ▭ Select date range filter (optional)
  ▭ Apply additional filters (category, warehouse, etc.)
    ↓
  ▭ Click "Generate Report"
    ↓
  ◇ Is data available for selected criteria?
    │
    ├── NO
    │    ↓
    │  ▭ Display "No data found for the selected criteria."
    │    ↓
    │  ▭ User adjusts filters
    │    └────────────────────────→ Click "Generate Report"
    │
    └── YES
         ↓
       ▭ Display report results
         ↓
       ▭ User clicks Export or Print (optional)
         ↓
       ○ End

================================================================================
11. UF-008 — ADMINISTRATOR CREATES USER
================================================================================

Actor:          Administrator
SRS Reference:  UC-003, FR-USER-001 to FR-USER-007

  ○ Start
    ↓
  ▭ Administration → Users → Click "+ Add User"
    ↓
  ▭ Add User form displayed
    ↓
  ▭ Enter full name, email, password, department
  ▭ Select role
    ↓
  ▭ Submit form
    ↓
  ◇ Are required fields valid?
    │
    ├── NO
    │    ↓
    │  ▭ Display validation errors
    │    ↓
    │  ▭ User corrects input
    │    └────────────────────────→ Submit form
    │
    └── YES
         ↓
       ◇ Does email already exist?
         │
         ├── YES
         │    ↓
         │  ▭ Display error ("Email already registered")
         │    ↓
         │  ▭ User enters different email
         │    └────────────────────────→ Submit form
         │
         └── NO
              ↓
            ▭ Hash password with bcrypt
              ↓
            ▭ Save user to database
              ↓
            ▭ Record audit log entry
              ↓
            ▭ Display success notification
              ↓
            ▭ Return to Users list
              ↓
            ○ End

Postcondition: New user can log in with the assigned role.

================================================================================
12. UF-009 — TRANSFER STOCK
================================================================================

Actor:          Storekeeper
SRS Reference:  UC-010, FR-TRANS-001 to FR-TRANS-006
Business Rules: BR-05, BR-07

  ○ Start
    ↓
  ▭ Dashboard → Stock Management → Transfer Stock
    ↓
  ▭ Transfer Stock form displayed
    ↓
  ▭ Select source warehouse
  ▭ Select destination warehouse
  ▭ Select inventory item
    (System displays available quantity at source warehouse)
  ▭ Enter transfer quantity
  ▭ Enter transfer date
  ▭ Enter notes (optional)
    ↓
  ▭ Submit form
    ↓
  ◇ Source ≠ destination warehouse?
    │
    ├── NO (same warehouse selected)
    │    ↓
    │  ▭ Display error ("Source and destination cannot be the same")
    │    ↓
    │  ▭ User corrects selection
    │    └────────────────────────→ Select destination warehouse
    │
    └── YES
         ↓
       ◇ Is transfer quantity ≤ source available quantity?
         │
         ├── NO
         │    ↓
         │  ▭ Display error:
         │    "Insufficient stock at source. Available: X."
         │    ↓
         │  ▭ User reduces quantity or cancels
         │    └────────────────────────→ Enter transfer quantity
         │
         └── YES
              ↓
            ▭ Create TRANSFER_OUT transaction (source warehouse)
              ↓
            ▭ Create TRANSFER_IN transaction (destination warehouse)
              ↓
            ▭ Decrease source warehouse quantity
              ↓
            ▭ Increase destination warehouse quantity
              ↓
            ▭ Record audit log entry
              ↓
            ▭ Display success confirmation
              ↓
            ○ End

Postcondition: Stock quantities updated at both warehouses. Transfer recorded.

================================================================================
13. UF-010 — CONDUCT PHYSICAL STOCK TAKING
================================================================================

Actor:          Storekeeper / Stock Clerk (count); PAO (approval)
SRS Reference:  UC-014, UC-015, FR-STOCK-001 to FR-STOCK-009
Business Rules: BR-09, BR-12

  ○ Start
    ↓
  ▭ Stock Taking module
    ↓
  ▭ Stock taking list displayed
    (Shows: item, system quantity, physical quantity field, variance)
    ↓
  ▭ User selects item and enters physical count quantity
    ↓
  ▭ System calculates and displays variance:
    Variance = Physical Quantity − System Quantity
    ↓
  ◇ Variance = 0?
    │
    ├── YES (no discrepancy)
    │    ↓
    │  ▭ Record count as matched (no adjustment required)
    │    ↓
    │  ▭ Display "Count matches system record"
    │    ↓
    │  ○ End
    │
    └── NO (discrepancy found)
         ↓
       ▭ User enters explanation / reason for discrepancy
         ↓
       ▭ User submits count for PAO approval
         ↓
       ▭ PAO receives pending approval notification on dashboard
         ↓
       ▭ PAO reviews: item, system qty, physical qty, variance, reason
         ↓
       ◇ PAO approves?
         │
         ├── NO (rejected)
         │    ↓
         │  ▭ Record returned to storekeeper with PAO comments
         │    ↓
         │  ▭ Storekeeper reviews and resubmits
         │    └────────────────────────→ User enters explanation
         │
         └── YES (approved)
              ↓
            ▭ System updates inventory quantity to physical count value
              ↓
            ▭ Create ADJUSTMENT stock transaction record
              ↓
            ▭ Record audit log entry
              ↓
            ▭ Generate reconciliation report
              ↓
            ○ End

Postcondition: Inventory quantity corrected. Reconciliation report generated.
Adjustment recorded in audit log.

================================================================================
14. UF-011 — MANAGE DAMAGED / OBSOLETE ITEMS
================================================================================

Actor:          Storekeeper (report); PAO (approve disposal)
SRS Reference:  UC-016, UC-017, FR-DAM-001 to FR-DAM-006
Business Rules: BR-10, BR-03

Item lifecycle: Available → Damaged/Obsolete → Disposed

  ○ Start
    ↓
  ▭ Inventory List → Select item → Item Details
    ↓
  ▭ Click "Report as Damaged" or "Report as Obsolete"
    ↓
  ▭ Report form displayed
  ▭ Enter quantity affected and reason/description
    ↓
  ▭ Submit report
    ↓
  ▭ Item status changes: Available → Damaged / Obsolete
  ▭ Item excluded from active stock calculations
  ▭ Record audit log entry
    ↓
  ▭ PAO receives pending disposal notification on dashboard
    ↓
  ▭ PAO reviews: item, condition, quantity, reason, reported by
    ↓
  ◇ PAO approves disposal?
    │
    ├── NO (rejected)
    │    ↓
    │  ▭ Item status reverts to Available
    │    ↓
    │  ▭ Storekeeper notified of rejection
    │    ↓
    │  ○ End
    │
    └── YES (approved)
         ↓
       ▭ Confirmation dialog displayed:
         "This will permanently remove the item from active inventory."
         ↓
       ▭ PAO confirms
         ↓
       ▭ Item status changes to Disposed
         ↓
       ▭ Inventory quantity reduced
         ↓
       ▭ Record audit log entry
         ↓
       ▭ Generate disposal report
         ↓
       ○ End

Postcondition: Item removed from active inventory. Disposal recorded in audit log.

================================================================================
15. UF-012 — VIEW DIGITAL BIN CARD
================================================================================

Actor:          Storekeeper / Stock Clerk
SRS Reference:  UC-011, FR-BIN-001 to FR-BIN-005
Business Rules: BR-06, BR-07

  ○ Start
    ↓
  ▭ Inventory List → Select item → Item Details page
    ↓
  ▭ Click "View Bin Card"
    ↓
  ▭ Bin Card page displayed:
    ┌──────────┬────────────┬──────────┬───────────┬─────────┬─────────┐
    │ Date     │ Ref. No.   │ Qty In   │ Qty Out   │ Balance │ Remarks │
    ├──────────┼────────────┼──────────┼───────────┼─────────┼─────────┤
    │ Aug 1    │ GRN-001    │ 100      │ —         │ 100     │ Received│
    │ Aug 2    │ IV-001     │ —        │ 20        │ 80      │ CSE Dept│
    └──────────┴────────────┴──────────┴───────────┴─────────┴─────────┘
    Current Balance: [X units]
    ↓
  ◇ User wants to filter by date range?
    │
    ├── YES
    │    ↓
    │  ▭ User enters From date and To date
    │    ↓
    │  ▭ System filters and displays filtered bin card
    │
    └── NO
         ↓
       ▭ Full bin card displayed
    ↓
  ▭ User clicks Print or Export (optional)
    ↓
  ○ End

================================================================================
16. UF-013 — VIEW AUDIT LOG
================================================================================

Actor:          Administrator / PAO
SRS Reference:  UC-019, FR-AUDIT-001 to FR-AUDIT-005
Business Rules: BR-03, BR-05, BR-15

  ○ Start
    ↓
  ▭ Administration → Audit Log
    ↓
  ▭ Audit Log list displayed:
    ┌─────────────────────┬──────────────┬────────────┬──────────────────┐
    │ Timestamp           │ User         │ Action     │ Summary          │
    ├─────────────────────┼──────────────┼────────────┼──────────────────┤
    │ 2026-08-01 09:15    │ Megersa T.   │ ISSUE      │ Paper × 20       │
    │ 2026-08-01 10:30    │ Admin        │ USER_CREATE│ User: John D.    │
    └─────────────────────┴──────────────┴────────────┴──────────────────┘
    ↓
  ▭ User applies filters (date range, user, action type)
    ↓
  ▭ System refreshes list with filtered results
    ↓
  ▭ User clicks an entry to view full detail:
    (old value vs new value, entity affected, IP address)
    ↓
  ▭ User clicks Export Audit Report (optional)
    ↓
  ○ End

Note: Audit log page is READ-ONLY. No edit, delete, or modification actions
are available on this page.

================================================================================
END OF DOCUMENT
================================================================================
