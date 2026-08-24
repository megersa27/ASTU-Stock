================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Wireframe Design

Document: 04-Wireframe-Design.md
Phase:    Phase 2 — UX/UI Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1. Overview
  2. Application Shell Layout
  3. WF-001 — Login Page
  4. WF-002 — Dashboard
  5. WF-003 — Inventory List
  6. WF-004 — Add / Edit Inventory Item
  7. WF-005 — Item Details and Bin Card
  8. WF-006 — Receive Stock
  9. WF-007 — Issue Stock
  10. WF-008 — Stock History
  11. WF-009 — Transfer Stock
  12. WF-010 — Stock Taking
  13. WF-011 — Damaged / Obsolete Items
  14. WF-012 — Digital Bin Card View
  15. WF-013 — Audit Log
  16. WF-014 — Warehouse Management
  17. WF-015 — Reports Page
  18. Reusable UI Components
  19. Wireframe-to-React Component Mapping

Figma file: ASTU Stock Management System — UX/UI
Page:       01-Wireframes

================================================================================
1. OVERVIEW
================================================================================

This document defines low-fidelity wireframes for all primary screens of the
ASTU Stock Management System. Wireframes specify layout structure, component
placement, and content hierarchy without defining final colors, typography,
or visual styling.

Wireframes are derived from:
  • User flows in 02-User-Flow-Design.md
  • Information architecture in 03-Information-Architecture-Sitemap.md
  • Functional requirements in Phase 1 SRS

All wireframes are implemented in Figma (page: 01-Wireframes).
Text representations in this document serve as specification references.

================================================================================
2. APPLICATION SHELL LAYOUT
================================================================================

All authenticated pages share a common shell layout:

  ┌──────────────────────────────────────────────────────────────────────┐
  │ HEADER: ASTU Stock Management System           🔔 Alerts | User ▼   │
  ├──────────────────────┬───────────────────────────────────────────────┤
  │                      │                                               │
  │  SIDEBAR             │                                               │
  │  ──────────          │            MAIN CONTENT AREA                 │
  │  Dashboard           │                                               │
  │  Inventory           │            (page-specific content)            │
  │  Stock Management    │                                               │
  │  Stock Taking        │                                               │
  │  Damaged/Obsolete    │                                               │
  │  Warehouses          │                                               │
  │  Suppliers           │                                               │
  │  Reports             │                                               │
  │  Administration      │                                               │
  │  ──────────          │                                               │
  │  Logout              │                                               │
  │                      │                                               │
  └──────────────────────┴───────────────────────────────────────────────┘

Sidebar items are filtered by user role (see 03-Information-Architecture-Sitemap.md).
On screens below 1024px, the sidebar collapses to a hamburger menu.

================================================================================
3. WF-001 — LOGIN PAGE
================================================================================

Route: /login
SRS:   FR-AUTH-001 to FR-AUTH-004

  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │              ASTU STOCK MANAGEMENT SYSTEM                   │
  │              Adama Science and Technology University         │
  │                                                              │
  │        ┌──────────────────────────────────────┐             │
  │        │  Email Address                       │             │
  │        └──────────────────────────────────────┘             │
  │                                                              │
  │        ┌──────────────────────────────────────┐             │
  │        │  Password                     👁     │             │
  │        └──────────────────────────────────────┘             │
  │                                                              │
  │        [              Login               ]                  │
  │                                                              │
  │              Forgot Password?                                │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘

UX Notes:
  • Password field includes show/hide toggle.
  • Login button full-width, primary style.
  • Error state: red border on fields + error message below button.
  • No registration link — accounts are created by Administrator only.

================================================================================
4. WF-002 — DASHBOARD
================================================================================

Route: /dashboard
SRS:   FR-DASH-001 to FR-DASH-006

  ┌─────────────────────────────────────────────────────────────────────┐
  │ Dashboard                                                           │
  ├─────────────────────────────────────────────────────────────────────┤
  │                                                                     │
  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │
  │  │ Total Items │  │ Total Stock │  │  Low Stock  │  │ Pending  │  │
  │  │     450     │  │    3,250    │  │     12      │  │Approvals │  │
  │  │             │  │             │  │   ⚠ Alert   │  │    3     │  │
  │  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘  │
  │                                                       (PAO only)    │
  │  Quick Actions:                                                      │
  │  [ + Receive Stock ]  [ + Issue Stock ]  [ + Add Item ]             │
  │                                                                     │
  │  Low Stock Items                                                    │
  │  ┌─────────────────────────────────────────────────────────────┐   │
  │  │ Item          │ Available │ Minimum │ Status                 │   │
  │  │ Printer Paper │ 5         │ 20      │ ⚠ Low                  │   │
  │  │ A4 Notebook   │ 8         │ 20      │ ⚠ Low                  │   │
  │  └─────────────────────────────────────────────────────────────┘   │
  │                                                                     │
  │  Recent Transactions                                                │
  │  ┌─────────────────────────────────────────────────────────────┐   │
  │  │ Date     │ Item          │ Type    │ Qty │ User              │   │
  │  │ Aug 1    │ Printer Paper │ RECEIVE │ 100 │ Megersa T.        │   │
  │  │ Aug 2    │ A4 Notebook   │ ISSUE   │  20 │ Megersa T.        │   │
  │  └─────────────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────────────┘

UX Notes:
  • "Pending Approvals" card shown to PAO and Administrator only.
  • Low-stock items table limited to top 5; "View All" link to /reports/low-stock.
  • Quick Action buttons link directly to relevant pages.

================================================================================
5. WF-003 — INVENTORY LIST
================================================================================

Route: /inventory
SRS:   FR-INV-001 to FR-INV-009

  ┌─────────────────────────────────────────────────────────────────────┐
  │ Inventory                                        [ + Add Item ]     │
  ├─────────────────────────────────────────────────────────────────────┤
  │  [ Search by name or item code... ]  [ Category ▼ ] [ Status ▼ ]   │
  │                                                                     │
  │  ┌──────────────────────────────────────────────────────────────┐   │
  │  │ Item Code │ Name           │ Category │ Qty  │ Status │ ...  │   │
  │  ├──────────────────────────────────────────────────────────────┤   │
  │  │ 4401-001  │ Printer Paper  │ Office   │ 120  │ OK     │ ⋮    │   │
  │  │ 4401-002  │ A4 Notebook    │ Office   │  15  │ ⚠ Low  │ ⋮    │   │
  │  │ 4403-001  │ LED Bulb       │ Electric │  50  │ OK     │ ⋮    │   │
  │  └──────────────────────────────────────────────────────────────┘   │
  │                                                                     │
  │             [← Prev]   Page 1 of 8   [Next →]                      │
  └─────────────────────────────────────────────────────────────────────┘

UX Notes:
  • Row action menu (⋮) contains: View Details, Edit, View Bin Card.
  • Low-stock rows highlighted with light yellow background.
  • Status badge: green "OK" / amber "⚠ Low" / red "Critical".
  • Search is debounced (queries after user stops typing).
  • Pagination: 20 items per page default.

================================================================================
6. WF-004 — ADD / EDIT INVENTORY ITEM
================================================================================

Route: /inventory/add | /inventory/:id/edit
SRS:   FR-INV-001 to FR-INV-006

  ┌─────────────────────────────────────────────────────┐
  │ Add Inventory Item                                  │
  ├─────────────────────────────────────────────────────┤
  │                                                     │
  │  Item Name *                                        │
  │  [ _______________________________________ ]        │
  │                                                     │
  │  Item Code *                                        │
  │  [ _______________________________________ ]        │
  │                                                     │
  │  Category *                                         │
  │  [ Select Category ▼ ]                              │
  │                                                     │
  │  Warehouse *                                        │
  │  [ Select Warehouse ▼ ]                             │
  │                                                     │
  │  Unit *          Minimum Level    Reorder Level     │
  │  [ Select ▼ ]    [ ______ ]       [ ______ ]        │
  │                                                     │
  │  Maximum Level   Safety Stock                       │
  │  [ ______ ]      [ ______ ]                         │
  │                                                     │
  │  Description                                        │
  │  [ ____________________________________________ ]   │
  │                                                     │
  │  [ Cancel ]                    [ Save Item ]        │
  └─────────────────────────────────────────────────────┘

UX Notes:
  • Fields marked * are required; validation fires on blur and on submit.
  • Item code field validates uniqueness against the database on blur.
  • Category dropdown populated from MoFED classification codes (4401–4418).
  • Save button shows loading spinner during API call.

================================================================================
7. WF-005 — ITEM DETAILS
================================================================================

Route: /inventory/:id
SRS:   FR-INV-002, FR-BIN-001

  ┌─────────────────────────────────────────────────────────────────────┐
  │ Printer Paper (4401-001)                   [ Edit ] [ Bin Card ]   │
  ├─────────────────────────────────────────────────────────────────────┤
  │  Category:     Office Supplies (4401)                               │
  │  Warehouse:    Main Store                                           │
  │  Unit:         Ream                                                 │
  │  Status:       ⚠ Low Stock                                          │
  │                                                                     │
  │  ┌──────────────────┬──────────────────────────────┐               │
  │  │ Current Qty      │  15                          │               │
  │  │ Minimum Level    │  20    ← Below minimum       │               │
  │  │ Maximum Level    │ 500                          │               │
  │  │ Reorder Level    │  30                          │               │
  │  │ Safety Stock     │  10                          │               │
  │  └──────────────────┴──────────────────────────────┘               │
  │                                                                     │
  │  [ Report as Damaged ]   [ Report as Obsolete ]                    │
  │                                                                     │
  │  Recent Transactions (last 5)                                       │
  │  ┌───────────────────────────────────────────────────┐             │
  │  │ Date  │ Type    │ Qty  │ Balance │ Reference       │             │
  │  │ Aug 1 │ RECEIVE │ 100  │ 120     │ GRN-001         │             │
  │  │ Aug 3 │ ISSUE   │  20  │ 100     │ IV-001          │             │
  │  └───────────────────────────────────────────────────┘             │
  │  [ View Full Bin Card ]                                             │
  └─────────────────────────────────────────────────────────────────────┘

================================================================================
8. WF-006 — RECEIVE STOCK
================================================================================

Route: /stock/receive
SRS:   FR-REC-001 to FR-REC-006

  ┌─────────────────────────────────────────────────────┐
  │ Receive Stock                                       │
  ├─────────────────────────────────────────────────────┤
  │                                                     │
  │  Item *                                             │
  │  [ Search and select inventory item ▼ ]             │
  │                                                     │
  │  Supplier *                                         │
  │  [ Select Supplier ▼ ]                              │
  │                                                     │
  │  Quantity *          Unit Cost (ETB) *              │
  │  [ __________ ]      [ ____________ ]               │
  │                                                     │
  │  Receiving Date *    Reference Number               │
  │  [ __________ ]      [ ____________ ]               │
  │                                                     │
  │  Notes                                              │
  │  [ ____________________________________________ ]   │
  │                                                     │
  │  [ Cancel ]                 [ Receive Stock ]       │
  └─────────────────────────────────────────────────────┘

UX Notes:
  • Unit cost is required for FIFO batch tracking.
  • Upon success: toast notification "Stock received. GRN-XXX generated."
  • GRN reference displayed with a print/view link in the success message.

================================================================================
9. WF-007 — ISSUE STOCK
================================================================================

Route: /stock/issue
SRS:   FR-ISS-001 to FR-ISS-007

  ┌─────────────────────────────────────────────────────┐
  │ Issue Stock                                         │
  ├─────────────────────────────────────────────────────┤
  │                                                     │
  │  Item *                                             │
  │  [ Search and select inventory item ▼ ]             │
  │  Available Stock: 120 units                         │
  │                                                     │
  │  Quantity *                                         │
  │  [ __________ ]                                     │
  │  ⚠  Only 120 units available.   ← shown if exceeded │
  │                                                     │
  │  Department *                                       │
  │  [ Select Department ▼ ]                            │
  │                                                     │
  │  Recipient Name *    Issue Date *                   │
  │  [ _____________ ]   [ _________ ]                  │
  │                                                     │
  │  Purpose / Notes                                    │
  │  [ ____________________________________________ ]   │
  │                                                     │
  │  [ Cancel ]                   [ Issue Stock ]       │
  └─────────────────────────────────────────────────────┘

UX Notes:
  • "Available Stock" label updates dynamically when item is selected.
  • Inline validation shows quantity error immediately, does not wait for submit.
  • Issue Stock button is disabled when quantity > available.

================================================================================
10. WF-008 — STOCK HISTORY
================================================================================

Route: /stock/history
SRS:   FR-INV-002, FR-TRACK

  ┌─────────────────────────────────────────────────────────────────────┐
  │ Stock History                                                       │
  ├─────────────────────────────────────────────────────────────────────┤
  │  [ Search item... ]  [ Type ▼ ]  [ From Date ]  [ To Date ]        │
  │                                                                     │
  │  ┌──────────────────────────────────────────────────────────────┐   │
  │  │ Date     │ Item          │ Type    │ Qty │ Ref.    │ User     │   │
  │  ├──────────────────────────────────────────────────────────────┤   │
  │  │ Aug 1    │ Printer Paper │ RECEIVE │ 100 │ GRN-001 │ Megersa  │   │
  │  │ Aug 2    │ A4 Notebook   │ ISSUE   │  20 │ IV-001  │ Megersa  │   │
  │  │ Aug 3    │ LED Bulb      │ TRANSFER│  10 │ TR-001  │ Sara M.  │   │
  │  └──────────────────────────────────────────────────────────────┘   │
  │             [← Prev]   Page 1 of 12   [Next →]                     │
  └─────────────────────────────────────────────────────────────────────┘

UX Notes:
  • Transaction type color-coded: RECEIVE (green), ISSUE (orange),
    TRANSFER (blue), ADJUSTMENT (yellow).
  • Click any row to view full transaction detail.

================================================================================
11. WF-009 — TRANSFER STOCK
================================================================================

Route: /stock/transfer
SRS:   FR-TRANS-001 to FR-TRANS-006

  ┌─────────────────────────────────────────────────────┐
  │ Transfer Stock                                      │
  ├─────────────────────────────────────────────────────┤
  │                                                     │
  │  Source Warehouse *                                 │
  │  [ Select Source Warehouse ▼ ]                      │
  │                                                     │
  │  Destination Warehouse *                            │
  │  [ Select Destination Warehouse ▼ ]                 │
  │                                                     │
  │  Item *                                             │
  │  [ Search and select inventory item ▼ ]             │
  │  Available at Source: 80 units                      │
  │                                                     │
  │  Transfer Quantity *   Transfer Date *              │
  │  [ ___________ ]       [ __________ ]               │
  │                                                     │
  │  Notes                                              │
  │  [ ____________________________________________ ]   │
  │                                                     │
  │  [ Cancel ]              [ Confirm Transfer ]       │
  └─────────────────────────────────────────────────────┘

UX Notes:
  • "Available at Source" updates dynamically when item is selected.
  • Confirm Transfer button disabled if quantity > available at source.
  • Destination cannot equal source — validated on selection.

================================================================================
12. WF-010 — STOCK TAKING
================================================================================

Route: /stock-taking
SRS:   FR-STOCK-001 to FR-STOCK-009

Storekeeper View:
  ┌─────────────────────────────────────────────────────────────────────┐
  │ Stock Taking                        [ Submit for Approval ]        │
  ├─────────────────────────────────────────────────────────────────────┤
  │  [ Search item... ]  [ Category ▼ ]                                 │
  │                                                                     │
  │  ┌────────────────────────────────────────────────────────────┐    │
  │  │ Item Code │ Item Name      │ Sys. Qty │ Physical │ Variance │    │
  │  ├────────────────────────────────────────────────────────────┤    │
  │  │ 4401-001  │ Printer Paper  │  120     │ [____]   │  —       │    │
  │  │ 4401-002  │ A4 Notebook    │  200     │ [____]   │  —       │    │
  │  │ 4401-003  │ Stapler        │   20     │  20      │  0  ✓    │    │
  │  └────────────────────────────────────────────────────────────┘    │
  │                                                                     │
  │  Notes / Reason for Discrepancy:                                    │
  │  [ _______________________________________________ ]                │
  └─────────────────────────────────────────────────────────────────────┘

PAO Approval View (/stock-taking/approvals):
  ┌─────────────────────────────────────────────────────┐
  │ Stock Adjustment — Pending Approval                 │
  ├─────────────────────────────────────────────────────┤
  │  Item:             Printer Paper (4401-001)         │
  │  System Quantity:  120                              │
  │  Physical Count:   115                              │
  │  Variance:         -5  ⚠                            │
  │  Submitted by:     Megersa Tekalign                 │
  │  Date:             2026-08-05                       │
  │  Notes:            "5 units found damaged."         │
  │                                                     │
  │  [ Reject ]              [ Approve Adjustment ]     │
  └─────────────────────────────────────────────────────┘

UX Notes:
  • Variance column: green for 0, amber for positive, red for negative.
  • Physical quantity is editable inline in the table row.
  • PAO approval view shows clear before/after values.

================================================================================
13. WF-011 — DAMAGED / OBSOLETE ITEMS
================================================================================

Route: /damaged
SRS:   FR-DAM-001 to FR-DAM-006

List Page:
  ┌─────────────────────────────────────────────────────────────────────┐
  │ Damaged / Obsolete Items         [ + Report Damaged/Obsolete ]     │
  ├─────────────────────────────────────────────────────────────────────┤
  │  ┌──────────────────────────────────────────────────────────────┐   │
  │  │ Item      │ Condition │ Qty │ Reported By │ Status           │   │
  │  ├──────────────────────────────────────────────────────────────┤   │
  │  │ Monitor   │ Damaged   │  2  │ Megersa T.  │ Pending Approval │   │
  │  │ Old Desk  │ Obsolete  │  5  │ Sara M.     │ Approved         │   │
  │  └──────────────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────────────┘

Report Form (/damaged/report):
  ┌─────────────────────────────────────────────────────┐
  │ Report Damaged / Obsolete Item                      │
  ├─────────────────────────────────────────────────────┤
  │  Item *                                             │
  │  [ Select Inventory Item ▼ ]                        │
  │                                                     │
  │  Condition *                                        │
  │  ( ● ) Damaged     ( ○ ) Obsolete                   │
  │                                                     │
  │  Quantity Affected *                                │
  │  [ __________ ]                                     │
  │                                                     │
  │  Description / Reason *                             │
  │  [ ____________________________________________ ]   │
  │                                                     │
  │  [ Cancel ]                    [ Submit Report ]    │
  └─────────────────────────────────────────────────────┘

UX Notes:
  • Status badges: amber "Pending Approval", green "Approved", grey "Disposed".
  • Dispose action requires explicit confirmation modal.

================================================================================
14. WF-012 — DIGITAL BIN CARD VIEW
================================================================================

Route: /inventory/:id/bin-card
SRS:   FR-BIN-001 to FR-BIN-005

  ┌─────────────────────────────────────────────────────────────────────┐
  │ Bin Card — Printer Paper (4401-001)           [Print] [Export]     │
  ├─────────────────────────────────────────────────────────────────────┤
  │  [ From: _________ ]  [ To: _________ ]  [ Apply Filter ]          │
  │                                                                     │
  │  ┌──────────┬──────────┬──────────┬───────────┬─────────┬────────┐  │
  │  │ Date     │ Ref. No. │ Qty In   │ Qty Out   │ Balance │ Remark │  │
  │  ├──────────┼──────────┼──────────┼───────────┼─────────┼────────┤  │
  │  │ Aug 01   │ GRN-001  │   100    │     —     │   100   │ Recvd  │  │
  │  │ Aug 02   │ IV-001   │    —     │    20     │    80   │ CSE    │  │
  │  │ Aug 03   │ GRN-002  │    50    │     —     │   130   │ Recvd  │  │
  │  │ Aug 04   │ IV-002   │    —     │    10     │   120   │ Admin  │  │
  │  └──────────┴──────────┴──────────┴───────────┴─────────┴────────┘  │
  │                                                                     │
  │  Current Balance: 120 units                                         │
  └─────────────────────────────────────────────────────────────────────┘

UX Notes:
  • Qty In rows: light green background.
  • Qty Out rows: light red background.
  • Balance column always visible; summary shown at bottom.
  • Print/Export prominent for paper-based reporting needs.

================================================================================
15. WF-013 — AUDIT LOG
================================================================================

Route: /admin/audit-log
SRS:   FR-AUDIT-001 to FR-AUDIT-005

  ┌─────────────────────────────────────────────────────────────────────┐
  │ Audit Log                                       [Export Report]    │
  ├─────────────────────────────────────────────────────────────────────┤
  │  [From: _____] [To: _____] [User ▼] [Action Type ▼] [Apply]       │
  │                                                                     │
  │  ┌────────────────────────┬───────────────┬────────────┬──────────┐ │
  │  │ Timestamp              │ User          │ Action     │ Summary  │ │
  │  ├────────────────────────┼───────────────┼────────────┼──────────┤ │
  │  │ 2026-08-01 09:15:33    │ Megersa T.    │ ISSUE      │ Paper×20 │ │
  │  │ 2026-08-01 10:30:12    │ Admin         │ USER_CREATE│ John D.  │ │
  │  └────────────────────────┴───────────────┴────────────┴──────────┘ │
  │             [← Prev]   Page 1 of 24   [Next →]                     │
  └─────────────────────────────────────────────────────────────────────┘

Detail Modal (on row click):
  ┌─────────────────────────────────────────────────────┐
  │ Audit Log Entry                            [Close]  │
  ├─────────────────────────────────────────────────────┤
  │  Timestamp:  2026-08-01 09:15:33                    │
  │  User:       Megersa Tekalign (Storekeeper)         │
  │  Action:     ISSUE STOCK                            │
  │  Item:       Printer Paper (4401-001)               │
  │  Before:     Quantity = 140                         │
  │  After:      Quantity = 120                         │
  │  Department: CSE                                    │
  │  Recipient:  Dr. Abebe W.                           │
  │  Reference:  IV-001                                 │
  └─────────────────────────────────────────────────────┘

UX Notes:
  • No edit, delete, or modify actions on this page.
  • Action type color-coded: RECEIVE (green), ISSUE (orange),
    TRANSFER (blue), ADJUSTMENT (yellow), DELETE (red).
  • Paginated — large log histories load in pages.

================================================================================
16. WF-014 — WAREHOUSE MANAGEMENT
================================================================================

Route: /warehouses
SRS:   FR-WH-001 to FR-WH-004

List Page:
  ┌─────────────────────────────────────────────────────────────────────┐
  │ Warehouses                                  [ + Add Warehouse ]    │
  ├─────────────────────────────────────────────────────────────────────┤
  │  ┌────────────────────────────────────────────────────────────┐    │
  │  │ Name           │ Location       │ Items Stored │ Status    │    │
  │  ├────────────────────────────────────────────────────────────┤    │
  │  │ Main Store     │ Building A     │ 245          │ Active    │    │
  │  │ Lab Store      │ Science Block  │  87          │ Active    │    │
  │  └────────────────────────────────────────────────────────────┘    │
  └─────────────────────────────────────────────────────────────────────┘

Warehouse Detail (/warehouses/:id):
  ┌─────────────────────────────────────────────────────────────────────┐
  │ Main Store — Stock Levels                                           │
  ├─────────────────────────────────────────────────────────────────────┤
  │  ┌────────────────────────────────────────────────────────────┐    │
  │  │ Item Code  │ Item Name     │ Qty  │ Min Level │ Status     │    │
  │  ├────────────────────────────────────────────────────────────┤    │
  │  │ 4401-001   │ Printer Paper │ 120  │  20       │ OK         │    │
  │  │ 4401-002   │ A4 Notebook   │  15  │  20       │ ⚠ Low      │    │
  │  └────────────────────────────────────────────────────────────┘    │
  └─────────────────────────────────────────────────────────────────────┘

================================================================================
17. WF-015 — REPORTS PAGE
================================================================================

Route: /reports/:type
SRS:   FR-REPORT-001 to FR-REPORT-009

  ┌─────────────────────────────────────────────────────────────────────┐
  │ Reports                                                             │
  ├─────────────────────────────────────────────────────────────────────┤
  │  Report Type *                                                      │
  │  [ Inventory Report ▼ ]                                             │
  │                                                                     │
  │  Date Range               Category        Warehouse                 │
  │  [ From ]  [ To ]         [ All ▼ ]        [ All ▼ ]               │
  │                                                                     │
  │  [ Generate Report ]                                                │
  │                                                                     │
  │  ┌─────────────────────────────────────────────────────────────┐   │
  │  │  Report Results                                             │   │
  │  │                                                             │   │
  │  │  [Report table content displayed here]                      │   │
  │  │                                                             │   │
  │  └─────────────────────────────────────────────────────────────┘   │
  │                                                                     │
  │  [ Export PDF ]   [ Export Excel ]   [ Print ]                     │
  └─────────────────────────────────────────────────────────────────────┘

================================================================================
18. REUSABLE UI COMPONENTS
================================================================================

The following components are used across multiple pages and shall be defined
in the Figma Design System (page: 02-Design-System) and implemented as
reusable React components.

  ┌──────────────────────────┬──────────────────────────────────────────────┐
  │ Component                │ Variants / States                            │
  ├──────────────────────────┼──────────────────────────────────────────────┤
  │ Button                   │ Primary, Secondary, Danger, Disabled,        │
  │                          │ Loading spinner state                        │
  │ Input Field              │ Default, Focus, Error, Disabled              │
  │ Dropdown / Select        │ Default, Open, Selected, Disabled            │
  │ Data Table               │ Default, Sortable columns, Empty state       │
  │ Pagination               │ Page numbers, Prev/Next buttons              │
  │ Status Badge             │ OK (green), Low (amber), Critical (red),     │
  │                          │ Pending (yellow), Disposed (grey)            │
  │ Toast Notification       │ Success, Error, Warning, Info                │
  │ Modal / Dialog           │ Confirmation, Detail view, Form modal        │
  │ Card (summary)           │ Icon, Value, Label, Trend indicator          │
  │ Search Input             │ With clear button, debounced                 │
  │ Loading Spinner          │ Full-page, inline, button state              │
  │ Empty State              │ Illustration + message + action button       │
  │ Form Validation Error    │ Field-level error message (red text)         │
  └──────────────────────────┴──────────────────────────────────────────────┘

================================================================================
19. WIREFRAME-TO-REACT COMPONENT MAPPING
================================================================================

  ┌────────────────────────────────┬────────────────────────────────────────┐
  │ Wireframe Element              │ React Component                        │
  ├────────────────────────────────┼────────────────────────────────────────┤
  │ Application shell              │ <AppLayout>                            │
  │ Left sidebar                   │ <Sidebar>                              │
  │ Top header                     │ <Header>                               │
  │ Dashboard summary cards        │ <SummaryCard>                          │
  │ Inventory table                │ <InventoryTable>                       │
  │ Add/edit item form             │ <InventoryForm>                        │
  │ Receive stock form             │ <ReceiveStockForm>                     │
  │ Issue stock form               │ <IssueStockForm>                       │
  │ Transfer stock form            │ <TransferStockForm>                    │
  │ Stock history table            │ <StockHistoryTable>                    │
  │ Stock taking table             │ <StockTakingTable>                     │
  │ PAO approval modal             │ <ApprovalModal>                        │
  │ Bin card table                 │ <BinCardTable>                         │
  │ Audit log table                │ <AuditLogTable>                        │
  │ Reports page                   │ <ReportsPage>                          │
  │ Warehouse list + detail        │ <WarehouseList>, <WarehouseDetail>     │
  │ Confirmation dialog            │ <ConfirmDialog>                        │
  │ Pagination controls            │ <Pagination>                           │
  │ Status badge                   │ <StatusBadge>                          │
  │ Toast notification             │ <Toast>                                │
  └────────────────────────────────┴────────────────────────────────────────┘

================================================================================
END OF DOCUMENT
================================================================================
