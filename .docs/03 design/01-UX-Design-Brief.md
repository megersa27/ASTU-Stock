================================================================================
ASTU STOCK MANAGEMENT SYSTEM
UX Design Brief

Document: 01-UX-Design-Brief.md
Phase:    Phase 2 — UX/UI Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1. UX Vision
  2. Target Users and Roles
  3. Primary User
  4. User Problems Being Solved
  5. UX Goals
  6. Core User Tasks
  7. UX Principles
  8. Accessibility Requirements
  9. Responsive Design Approach
  10. Key UX Scenarios
  11. Role-Based Navigation Design
  12. Design Success Criteria
  13. UX Scope for MVP
  14. Relationship with SRS

================================================================================
1. UX VISION
================================================================================

The ASTU Stock Management System shall provide a simple, clear, efficient, and
reliable experience for managing university inventory. Users shall be able to
perform common inventory operations without unnecessary steps or confusion.

The interface shall make immediately visible to each user:
  • What stock is currently available.
  • Which items are at or below minimum stock level.
  • What stock has been received and issued.
  • What actions are pending approval.
  • What action the user can perform next.

================================================================================
2. TARGET USERS AND ROLES
================================================================================

  ┌─────────────────────────┬──────────────────────────────────────────────────┐
  │ Role                    │ Primary UX Goal                                  │
  ├─────────────────────────┼──────────────────────────────────────────────────┤
  │ Administrator           │ Manage users, roles, and audit logs efficiently  │
  │ PAO                     │ Review and approve transactions quickly;         │
  │                         │ monitor inventory health at a glance             │
  │ Storekeeper             │ Complete receive/issue/transfer tasks with        │
  │                         │ minimum steps; access bin cards instantly        │
  │ Stock Clerk             │ Update records and conduct stock taking easily    │
  │ Accountant              │ Access FIFO valuation and financial reports       │
  │ Department Head         │ Approve departmental requisitions efficiently     │
  │ Security Officer        │ View outgoing transaction and gate pass info      │
  └─────────────────────────┴──────────────────────────────────────────────────┘

================================================================================
3. PRIMARY USER
================================================================================

The Storekeeper is the primary user of the MVP. The core purpose of the system
is stock management, and the Storekeeper performs the highest frequency of
operations. The main application experience is optimized around the Storekeeper
workflow:

  Login → Dashboard → Check Stock → Receive Stock / Issue Stock
  → View Transaction History → Generate Reports

All other role experiences are secondary and built around the same core data
and workflows.

================================================================================
4. USER PROBLEMS BEING SOLVED
================================================================================

  Problem 1 — Manual records
  Stock information is recorded on paper bin cards and stock record cards,
  creating risk of loss, damage, and transcription errors.

  Problem 2 — Difficult stock tracking
  It is not possible to determine real-time stock quantities without
  physically checking paper records.

  Problem 3 — Low-stock visibility
  There is no mechanism to automatically alert users when items fall below
  minimum stock levels.

  Problem 4 — Transaction traceability
  It is difficult to determine who received or issued a specific stock item,
  or when a transaction occurred.

  Problem 5 — Manual report preparation
  Preparing stock reports requires manually compiling data from multiple
  paper records, which is time-consuming and error-prone.

  Problem 6 — FIFO calculation errors
  Applying FIFO valuation manually across multiple receiving batches is
  complex and frequently produces inaccurate results.

  Problem 7 — No approval workflow enforcement
  The paper-based system cannot enforce that stock is only issued after
  an authorized requisition is approved.

================================================================================
5. UX GOALS
================================================================================

  Goal 1 — Simplicity
  Common operations (receive stock, issue stock, search inventory) shall be
  completable in a minimal number of steps with no ambiguity about what
  action to take next.

  Goal 2 — Efficiency
  Frequently performed tasks shall be accessible from the dashboard or the
  primary navigation without requiring multiple clicks to reach.

  Goal 3 — Clarity
  Every button, form field, and status indicator shall have a clear,
  unambiguous label. Users shall understand what an action does before
  performing it.

  Goal 4 — Consistency
  Add, edit, and delete operations shall use consistent form patterns,
  button placement, and confirmation dialogs throughout the application.

  Goal 5 — Error Prevention
  The UI shall prevent common mistakes before they occur. Example: the
  Issue Stock form shall display the available quantity and disable submission
  when the requested quantity exceeds it.

  Goal 6 — Feedback
  Every significant action shall produce immediate visual feedback confirming
  success or clearly describing failure. Users shall never be left uncertain
  whether an action completed.

  Goal 7 — Role Awareness
  Each user role shall see only the navigation items and actions relevant to
  their permitted functions. Cognitive overload from irrelevant features
  shall be eliminated.

  Goal 8 — Transparency
  Every stock movement shall leave a visible, traceable record. The bin card
  shall be accessible directly from the item details page.

  Goal 9 — Accountability
  Actions that cannot be undone (disposal, stock adjustment) shall require
  explicit confirmation with a clear warning message.

================================================================================
6. CORE USER TASKS
================================================================================

  Authentication:
    Login, logout.

  Inventory:
    View inventory list, add item, edit item, search, filter,
    view item details, view bin card.

  Stock Transactions:
    Receive stock (with GRN), issue stock (with Issue Voucher),
    transfer stock between warehouses, view stock history.

  Stock Control:
    Monitor reorder levels and safety stock, view low-stock alerts.

  Stock Taking:
    Conduct physical count, submit for PAO approval, view reconciliation report.

  Damaged / Obsolete:
    Report damaged/obsolete items, PAO approves disposal, view disposal history.

  Warehouse Management:
    Register warehouses, view per-warehouse stock levels.

  Reports:
    Inventory, stock movement, low stock, FIFO valuation, damaged/obsolete,
    stock taking, audit report.

  Administration:
    Manage users and roles, view audit log.

================================================================================
7. UX PRINCIPLES
================================================================================

  Visibility
  Important information shall be immediately visible without requiring the
  user to navigate away from the current screen. Example: low-stock count
  displayed on the dashboard card.

  Consistency
  Buttons, forms, navigation, tables, icons, colors, and spacing shall be
  consistent across all modules. An action that looks the same shall
  behave the same.

  Error Prevention
  Invalid states shall be prevented at the UI level before reaching the
  backend. Example: the Issue Stock form shall not allow submission when
  the entered quantity exceeds available stock.

  Feedback
  Every save, update, delete, or approval action shall display an immediate
  success or error notification. Loading states shall be shown during
  all asynchronous operations.

  Recognition Over Recall
  Dropdowns and search-assisted selectors shall be used wherever possible
  instead of free-text fields for structured data such as item selection,
  category, supplier, and warehouse.

  User Control
  Every form shall include a Cancel button. Destructive actions (delete,
  dispose, adjust) shall require a confirmation dialog before execution.

================================================================================
8. ACCESSIBILITY REQUIREMENTS
================================================================================

  • All text shall meet minimum contrast ratios for readability.
  • All form fields shall have visible, descriptive labels.
  • Status indicators shall not rely on color alone. Text labels shall
    accompany color-coded status badges.
    Example: use "⚠ Low Stock" not just a red indicator.
  • All interactive elements shall be keyboard-accessible.
  • Focus states shall be clearly visible for keyboard navigation.
  • Error messages shall be descriptive and associated with the relevant
    form field.

================================================================================
9. RESPONSIVE DESIGN APPROACH
================================================================================

The application is primarily intended for desktop and laptop use in the
university store environment.

Design priority order:
  1. Desktop (1366px and above) — primary design target.
  2. Tablet (768px–1365px) — sidebar collapsible.
  3. Mobile (below 768px) — basic layout adapts; complex data tables
     scroll horizontally.

Full mobile equivalence for complex data-intensive pages (bin cards,
transaction history, stock taking) is not required for Version 1.

================================================================================
10. KEY UX SCENARIOS
================================================================================

  Scenario 1 — Storekeeper Receives Stock
  ─────────────────────────────────────────
  Login → Dashboard → Stock Management → Receive Stock
  → Select item → Select supplier → Enter quantity and unit cost
  → Enter date → Confirm → GRN generated → Stock updated.

  Scenario 2 — Storekeeper Issues Stock
  ───────────────────────────────────────
  Login → Dashboard → Stock Management → Issue Stock
  → Select item (available quantity displayed) → Enter quantity
  → Select department → Enter recipient → Confirm
  → Issue Voucher generated → Stock decreased.

  Scenario 3 — PAO Reviews Pending Approvals
  ────────────────────────────────────────────
  Login → Dashboard (pending approvals count visible)
  → Stock Taking → Pending Approvals
  → Review item, system quantity, physical quantity, variance, notes
  → Approve or Reject → System updates accordingly.

  Scenario 4 — Storekeeper Views Bin Card
  ─────────────────────────────────────────
  Login → Inventory → Select item → Item Details
  → View Bin Card → See all IN/OUT transactions with running balance
  → Filter by date range if needed → Print or export.

  Scenario 5 — PAO Reviews Audit Trail
  ──────────────────────────────────────
  Login → Administration → Audit Log
  → Filter by date, user, or action type
  → Click entry to see old value vs new value
  → Export audit report.

  Scenario 6 — Accountant Views FIFO Valuation
  ──────────────────────────────────────────────
  Login → Reports → FIFO Valuation Report
  → View per-item batch breakdown with unit costs and remaining quantities
  → View total inventory value.

================================================================================
11. ROLE-BASED NAVIGATION DESIGN
================================================================================

Each user role shall see a navigation menu limited to their permitted modules.

  Administrator:
    Dashboard | Inventory | Stock | Stock Taking | Damaged/Obsolete |
    Warehouses | Suppliers | Reports (all) | Users | Audit Log

  PAO:
    Dashboard | Inventory (view) | Stock (view/approve) |
    Stock Taking (approve) | Damaged/Obsolete (approve) |
    Warehouses | Suppliers | Reports (all) | Audit Log

  Storekeeper:
    Dashboard | Inventory | Stock (receive/issue/transfer) |
    Stock Taking (conduct) | Damaged/Obsolete (report) |
    Warehouses | Suppliers | Reports (operational)

  Stock Clerk:
    Dashboard | Inventory (view) | Stock (view history) |
    Stock Taking (conduct) | Reports (operational)

  Accountant:
    Dashboard | Inventory (view) | Reports (FIFO + movement)

  Department Head:
    Dashboard | Inventory (view) | Stock History | Reports (inventory)

  Security Officer:
    Dashboard | Stock History (outgoing only)

================================================================================
12. DESIGN SUCCESS CRITERIA
================================================================================

  • Users can identify the primary navigation items within 30 seconds of
    first login.
  • A Storekeeper can complete a stock receiving transaction without assistance
    after basic training.
  • A PAO can see all pending approvals immediately upon login without
    navigating to a sub-menu.
  • Low-stock items are identifiable from the dashboard without opening the
    inventory list.
  • The bin card for any item is reachable in 2 clicks from the inventory list.
  • Error messages clearly identify which field is invalid and why.
  • All destructive actions are guarded by a confirmation dialog.
  • The interface is consistent: the same action type looks and behaves the
    same on every page.

================================================================================
13. UX SCOPE FOR MVP
================================================================================

  Included in MVP UX:
    Login, Dashboard (role-specific), Inventory management, Bin card view,
    Receive stock, Issue stock, Stock transfer, Stock history, Stock taking,
    Damaged/obsolete management, Warehouse management, Supplier management,
    Category management, All core reports, User management, Audit log,
    Role-based navigation.

  Excluded from MVP UX:
    AI assistant or forecasting interface.
    Barcode scanner interface.
    Mobile application.
    Advanced analytics dashboards.
    External ERP integration screens.

================================================================================
14. RELATIONSHIP WITH SRS
================================================================================

All UX design decisions are derived from and traceable to requirements in the
Software Requirements Specification (Phase 1).

  ┌─────────────────────────────┬──────────────────────────────────────────┐
  │ SRS Requirement             │ UX Design Element                        │
  ├─────────────────────────────┼──────────────────────────────────────────┤
  │ FR-AUTH-001 to 007          │ Login page design, session handling       │
  │ FR-DASH-001 to 006          │ Dashboard layout and role-specific cards  │
  │ FR-INV-001 to 009           │ Inventory list, add/edit forms, search    │
  │ FR-BIN-001 to 005           │ Bin card view with date filter and print  │
  │ FR-REC-001 to 006           │ Receive stock form and GRN confirmation   │
  │ FR-ISS-001 to 007           │ Issue stock form with availability check  │
  │ FR-TRANS-001 to 006         │ Transfer stock form with warehouse select │
  │ FR-STOCK-001 to 009         │ Stock taking module and PAO approval view │
  │ FR-DAM-001 to 006           │ Damaged/obsolete report form and list     │
  │ FR-FIFO-001 to 005          │ FIFO valuation report (Accountant view)   │
  │ FR-AUDIT-001 to 005         │ Audit log page with filters and detail    │
  │ FR-ROLE-001 to 002          │ Role-based navigation and access guards   │
  └─────────────────────────────┴──────────────────────────────────────────┘

================================================================================
END OF DOCUMENT
================================================================================
