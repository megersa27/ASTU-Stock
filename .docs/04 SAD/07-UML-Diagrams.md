================================================================================
ASTU STOCK MANAGEMENT SYSTEM
UML Diagrams

Document: 07-UML-Diagrams.md
Phase:    Phase 3 — System Analysis and Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1.  Overview
  2.  Entity Relationship Diagram (ERD)
  3.  Class Diagram
  4.  Sequence Diagram — Login
  5.  Sequence Diagram — Receive Stock
  6.  Sequence Diagram — Issue Stock (with FIFO)
  7.  Sequence Diagram — Stock Taking Approval
  8.  Activity Diagram — Stock Issuing Process
  9.  State Chart Diagram — Inventory Item Lifecycle
  10. Draw.io and Diagram Tool Instructions

================================================================================
1. OVERVIEW
================================================================================

This document defines all UML diagrams for the ASTU Stock Management System.
Each diagram is specified in textual notation for implementation in Draw.io.
The corresponding Draw.io files are stored in:

  phase-3-system-analysis-design/diagrams/

  ┌──────────────────────────────────┬────────────────────────────────────────┐
  │ Diagram                          │ Draw.io File                           │
  ├──────────────────────────────────┼────────────────────────────────────────┤
  │ Entity Relationship Diagram      │ diagrams/ERD.drawio                    │
  │ Class Diagram                    │ diagrams/ClassDiagram.drawio           │
  │ Sequence — Login                 │ diagrams/Seq-Login.drawio              │
  │ Sequence — Receive Stock         │ diagrams/Seq-ReceiveStock.drawio       │
  │ Sequence — Issue Stock (FIFO)    │ diagrams/Seq-IssueStock.drawio         │
  │ Sequence — Stock Taking Approval │ diagrams/Seq-StockTaking.drawio        │
  │ Activity — Stock Issuing         │ diagrams/Activity-IssueStock.drawio    │
  │ State Chart — Item Lifecycle     │ diagrams/StateChart-Inventory.drawio   │
  └──────────────────────────────────┴────────────────────────────────────────┘

SRS Reference: Chapter 3 (System Model), Chapter 4 (System Design)

================================================================================
2. ENTITY RELATIONSHIP DIAGRAM (ERD)
================================================================================

Draw.io file: diagrams/ERD.drawio

The ERD represents the 9 database tables and their relationships.
Each entity is drawn as a rectangle with its attributes listed.
Primary keys are underlined. Foreign keys are marked with (FK).

──────────────────────────────────────────────────────────────────────────────
ENTITIES AND ATTRIBUTES
──────────────────────────────────────────────────────────────────────────────

┌─────────────────────────────┐
│ roles                       │
├─────────────────────────────┤
│ PK  id          SERIAL      │
│     name        VARCHAR(50) │
│     description TEXT        │
│     created_at  TIMESTAMP   │
└─────────────────────────────┘

┌─────────────────────────────────┐
│ users                           │
├─────────────────────────────────┤
│ PK  id            SERIAL        │
│     full_name     VARCHAR(100)  │
│     email         VARCHAR(150)  │
│     password_hash VARCHAR(255)  │
│ FK  role_id       INTEGER       │
│     department    VARCHAR(100)  │
│     phone         VARCHAR(20)   │
│     status        VARCHAR(20)   │
│ FK  created_by    INTEGER       │
│     created_at    TIMESTAMP     │
│     updated_at    TIMESTAMP     │
└─────────────────────────────────┘

┌──────────────────────────────┐
│ categories                   │
├──────────────────────────────┤
│ PK  id          SERIAL       │
│     code        VARCHAR(10)  │
│     name        VARCHAR(100) │
│     description TEXT         │
│     created_at  TIMESTAMP    │
└──────────────────────────────┘

┌──────────────────────────────┐
│ suppliers                    │
├──────────────────────────────┤
│ PK  id             SERIAL    │
│     name           VARCHAR   │
│     contact_person VARCHAR   │
│     phone          VARCHAR   │
│     email          VARCHAR   │
│     address        TEXT      │
│     status         VARCHAR   │
│     created_at     TIMESTAMP │
└──────────────────────────────┘

┌──────────────────────────────┐
│ warehouses                   │
├──────────────────────────────┤
│ PK  id          SERIAL       │
│     name        VARCHAR(100) │
│     location    VARCHAR(200) │
│     description TEXT         │
│     status      VARCHAR(20)  │
│     created_at  TIMESTAMP    │
└──────────────────────────────┘

┌──────────────────────────────────┐
│ inventories                      │
├──────────────────────────────────┤
│ PK  id              SERIAL       │
│     item_code       VARCHAR(20)  │
│     name            VARCHAR(150) │
│     description     TEXT         │
│ FK  category_id     INTEGER      │
│ FK  warehouse_id    INTEGER      │
│     unit            VARCHAR(30)  │
│     quantity        INTEGER      │
│     minimum_level   INTEGER      │
│     maximum_level   INTEGER      │
│     reorder_level   INTEGER      │
│     safety_stock    INTEGER      │
│     unit_cost       DECIMAL      │
│     status          VARCHAR(20)  │
│ FK  created_by      INTEGER      │
│     created_at      TIMESTAMP    │
│     updated_at      TIMESTAMP    │
└──────────────────────────────────┘

┌────────────────────────────────────┐
│ stock_transactions                 │
├────────────────────────────────────┤
│ PK  id                  SERIAL     │
│     transaction_type    VARCHAR    │
│ FK  inventory_id        INTEGER    │
│     quantity            INTEGER    │
│     unit_cost           DECIMAL    │
│     total_value         DECIMAL    │
│ FK  source_warehouse_id INTEGER    │
│ FK  dest_warehouse_id   INTEGER    │
│ FK  supplier_id         INTEGER    │
│     department          VARCHAR    │
│     recipient_name      VARCHAR    │
│     reference_number    VARCHAR    │
│ FK  approved_by         INTEGER    │
│ FK  performed_by        INTEGER    │
│     transaction_date    DATE       │
│     notes               TEXT       │
│     created_at          TIMESTAMP  │
└────────────────────────────────────┘

┌──────────────────────────────────┐
│ stock_takings                    │
├──────────────────────────────────┤
│ PK  id                SERIAL     │
│ FK  inventory_id      INTEGER    │
│     system_quantity   INTEGER    │
│     physical_quantity INTEGER    │
│     variance          INTEGER    │
│ FK  counted_by        INTEGER    │
│ FK  approved_by       INTEGER    │
│     status            VARCHAR    │
│     notes             TEXT       │
│     count_date        DATE       │
│     approved_at       TIMESTAMP  │
│     created_at        TIMESTAMP  │
└──────────────────────────────────┘

┌──────────────────────────────┐
│ audit_logs                   │
├──────────────────────────────┤
│ PK  id           SERIAL      │
│ FK  user_id      INTEGER     │
│     action       VARCHAR(50) │
│     entity_type  VARCHAR(50) │
│     entity_id    INTEGER     │
│     old_values   JSONB       │
│     new_values   JSONB       │
│     ip_address   VARCHAR(45) │
│     created_at   TIMESTAMP   │
└──────────────────────────────┘

──────────────────────────────────────────────────────────────────────────────
RELATIONSHIPS
──────────────────────────────────────────────────────────────────────────────

  roles            1 ──────────────< N  users                (role_id)
  users            1 ──────────────< N  users                (created_by, self-ref)
  users            1 ──────────────< N  stock_transactions   (performed_by)
  users            1 ──────────────< N  stock_transactions   (approved_by)
  users            1 ──────────────< N  stock_takings        (counted_by)
  users            1 ──────────────< N  stock_takings        (approved_by)
  users            1 ──────────────< N  audit_logs           (user_id)
  users            1 ──────────────< N  inventories          (created_by)
  categories       1 ──────────────< N  inventories          (category_id)
  warehouses       1 ──────────────< N  inventories          (warehouse_id)
  warehouses       1 ──────────────< N  stock_transactions   (source_warehouse_id)
  warehouses       1 ──────────────< N  stock_transactions   (dest_warehouse_id)
  suppliers        1 ──────────────< N  stock_transactions   (supplier_id)
  inventories      1 ──────────────< N  stock_transactions   (inventory_id)
  inventories      1 ──────────────< N  stock_takings        (inventory_id)

  Notation: 1 = one side | < N = many side (crow's foot in Draw.io)

================================================================================
3. CLASS DIAGRAM
================================================================================

Draw.io file: diagrams/ClassDiagram.drawio

The class diagram represents the backend service layer classes, their
attributes, methods, and relationships.

──────────────────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────┐
│                       User                          │
├─────────────────────────────────────────────────────┤
│ - id: number                                        │
│ - fullName: string                                  │
│ - email: string                                     │
│ - passwordHash: string                              │
│ - roleId: number                                    │
│ - department: string                                │
│ - status: 'active' | 'inactive'                     │
│ - createdAt: Date                                   │
├─────────────────────────────────────────────────────┤
│ + findById(id): User                                │
│ + findByEmail(email): User                          │
│ + create(data): User                                │
│ + update(id, data): User                            │
│ + deactivate(id): void                              │
└─────────────────────────────────────────────────────┘
             △ (has)
             │
┌─────────────────────────────────────────────────────┐
│                       Role                          │
├─────────────────────────────────────────────────────┤
│ - id: number                                        │
│ - name: string                                      │
│ - description: string                               │
├─────────────────────────────────────────────────────┤
│ + findAll(): Role[]                                 │
│ + findById(id): Role                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    Inventory                        │
├─────────────────────────────────────────────────────┤
│ - id: number                                        │
│ - itemCode: string                                  │
│ - name: string                                      │
│ - categoryId: number                                │
│ - warehouseId: number                               │
│ - unit: string                                      │
│ - quantity: number                                  │
│ - minimumLevel: number                              │
│ - reorderLevel: number                              │
│ - safetyStock: number                               │
│ - status: 'available'|'damaged'|'obsolete'|...      │
├─────────────────────────────────────────────────────┤
│ + findAll(filters): Inventory[]                     │
│ + findById(id): Inventory                           │
│ + create(data): Inventory                           │
│ + update(id, data): Inventory                       │
│ + delete(id): void                                  │
│ + isLowStock(): boolean                             │
└─────────────────────────────────────────────────────┘
     ◇ (belongs to)              ◇ (belongs to)
          │                           │
┌─────────────────┐       ┌─────────────────────┐
│    Category     │       │     Warehouse        │
├─────────────────┤       ├─────────────────────┤
│ - id: number    │       │ - id: number         │
│ - code: string  │       │ - name: string       │
│ - name: string  │       │ - location: string   │
├─────────────────┤       │ - status: string     │
│ + findAll()     │       ├─────────────────────┤
│ + create(data)  │       │ + findAll()          │
│ + update(id,d)  │       │ + findById(id)       │
└─────────────────┘       │ + create(data)       │
                          └─────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  StockTransaction                   │
├─────────────────────────────────────────────────────┤
│ - id: number                                        │
│ - transactionType: 'RECEIVE'|'ISSUE'|'TRANSFER_OUT' │
│                   |'TRANSFER_IN'|'ADJUSTMENT'       │
│ - inventoryId: number                               │
│ - quantity: number                                  │
│ - unitCost: number                                  │
│ - totalValue: number                                │
│ - sourceWarehouseId: number                         │
│ - destWarehouseId: number                           │
│ - supplierId: number                                │
│ - department: string                                │
│ - recipientName: string                             │
│ - referenceNumber: string                           │
│ - performedBy: number                               │
│ - transactionDate: Date                             │
├─────────────────────────────────────────────────────┤
│ + findByInventory(inventoryId): Transaction[]       │
│ + findByType(type): Transaction[]                   │
│ + create(data): Transaction                         │
│ + getBinCard(inventoryId): BinCardEntry[]           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   FIFOService                       │
├─────────────────────────────────────────────────────┤
│ - (no instance state — stateless service)           │
├─────────────────────────────────────────────────────┤
│ + calculateIssue(inventoryId, qty): FIFOResult      │
│ + getInventoryValue(inventoryId): number            │
│ + getValuationReport(): ValuationRow[]              │
│                                                     │
│ // FIFOResult: { batches: BatchDeduction[],         │
│ //              totalCost: number }                 │
│ // BatchDeduction: { batchId, qty, unitCost }       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   StockTaking                       │
├─────────────────────────────────────────────────────┤
│ - id: number                                        │
│ - inventoryId: number                               │
│ - systemQuantity: number                            │
│ - physicalQuantity: number                          │
│ - variance: number                                  │
│ - countedBy: number                                 │
│ - approvedBy: number                                │
│ - status: 'pending'|'approved'|'rejected'           │
├─────────────────────────────────────────────────────┤
│ + create(data): StockTaking                         │
│ + findPending(): StockTaking[]                      │
│ + approve(id, paoId): void                          │
│ + reject(id, paoId, reason): void                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    AuditLog                         │
├─────────────────────────────────────────────────────┤
│ - id: number                                        │
│ - userId: number                                    │
│ - action: string                                    │
│ - entityType: string                                │
│ - entityId: number                                  │
│ - oldValues: object                                 │
│ - newValues: object                                 │
│ - createdAt: Date                                   │
├─────────────────────────────────────────────────────┤
│ + record(data): void                                │
│ + findAll(filters): AuditLog[]                      │
│ + findByUser(userId): AuditLog[]                    │
│ // NOTE: No update() or delete() methods exist.    │
└─────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────────────────────────
CLASS RELATIONSHIPS SUMMARY
──────────────────────────────────────────────────────────────────────────────

  User          <>────── Role             (association: User has one Role)
  Inventory     <>────── Category         (association: Inventory belongs to Category)
  Inventory     <>────── Warehouse        (association: Inventory belongs to Warehouse)
  StockTransaction <>─── Inventory        (association: Transaction is for Inventory)
  StockTransaction <>─── User             (performed_by, approved_by)
  StockTransaction <>─── Supplier         (receipt transactions)
  StockTransaction <>─── Warehouse        (source/destination)
  FIFOService   ────────> StockTransaction (uses: reads RECEIVE batches)
  FIFOService   ────────> Inventory        (uses: updates quantity)
  StockTaking   <>─────── Inventory        (association)
  StockTaking   <>─────── User             (counted_by, approved_by)
  AuditLog      <>─────── User             (user_id)

================================================================================
4. SEQUENCE DIAGRAM — LOGIN
================================================================================

Draw.io file: diagrams/Seq-Login.drawio

Actors / Participants (left to right):
  User | Browser (React) | AuthController | AuthService | Database | AuditLog

──────────────────────────────────────────────────────────────────────────────

  User              Browser           AuthController    AuthService      DB            AuditLog
   │                   │                    │                │            │                │
   │──POST /login──────>│                   │                │            │                │
   │  {email, password} │                   │                │            │                │
   │                   │──validateInput()──>│                │            │                │
   │                   │                    │──login(data)──>│            │                │
   │                   │                    │                │──findByEmail()──────────────>│
   │                   │                    │                │            │                │
   │                   │                    │                │<────────── user record ──────│
   │                   │                    │                │            │                │
   │                   │                    │           [user not found]  │                │
   │                   │                    │<── 401 Unauthorized ────────│                │
   │                   │<──────────────── error response ────│            │                │
   │<──────────────── "Invalid credentials" │                │            │                │
   │                   │                    │                │            │                │
   │                   │                    │           [user found]      │                │
   │                   │                    │                │──bcrypt.compare(pw, hash)   │
   │                   │                    │                │            │                │
   │                   │                    │           [password wrong]  │                │
   │                   │<──────────────── 401 error ─────────│            │                │
   │                   │                    │                │            │                │
   │                   │                    │           [password correct] │               │
   │                   │                    │                │──checkStatus() ─────────────>│
   │                   │                    │           [inactive user]   │                │
   │                   │<──────────────── 401 error ─────────│            │                │
   │                   │                    │           [active user]     │                │
   │                   │                    │                │──jwt.sign({userId, role})    │
   │                   │                    │                │──record(LOGIN)──────────────>│
   │                   │                    │<── token ──────│            │                │
   │                   │<── 200 {token, user} │              │            │                │
   │<── redirect to /dashboard ─────────────│               │            │                │

──────────────────────────────────────────────────────────────────────────────

================================================================================
5. SEQUENCE DIAGRAM — RECEIVE STOCK
================================================================================

Draw.io file: diagrams/Seq-ReceiveStock.drawio

Actors / Participants:
  Storekeeper | React UI | StockController | StockService | DB | AuditLog

──────────────────────────────────────────────────────────────────────────────

  Storekeeper     React UI         StockController    StockService       DB           AuditLog
      │               │                  │                  │              │               │
      │──fills form──>│                  │                  │              │               │
      │               │──POST /stock/────>│                  │              │               │
      │               │   receive         │                  │              │               │
      │               │   {itemId,        │                  │              │               │
      │               │    supplierId,    │──authMiddleware()│              │               │
      │               │    qty,           │──roleMiddleware()│              │               │
      │               │    unitCost,...}  │──validateInput() │              │               │
      │               │                  │──receiveStock()─>│              │               │
      │               │                  │                  │──findById(itemId)────────────>│
      │               │                  │                  │<───────── inventory ──────────│
      │               │                  │                  │──findById(supplierId)─────────>│
      │               │                  │                  │<───────── supplier ───────────│
      │               │                  │                  │──BEGIN TRANSACTION            │
      │               │                  │                  │──INSERT stock_transaction─────>│
      │               │                  │                  │   (type:RECEIVE, qty, cost)   │
      │               │                  │                  │──UPDATE inventories───────────>│
      │               │                  │                  │   SET qty = qty + received    │
      │               │                  │                  │──generateGRN()               │
      │               │                  │                  │──COMMIT TRANSACTION           │
      │               │                  │                  │──record(RECEIVE_STOCK)───────>│
      │               │                  │<── result ───────│              │               │
      │               │<── 201 {grn,─────│                  │              │               │
      │               │    transaction}  │                  │              │               │
      │<── success ───│                  │                  │              │               │
      │    GRN-XXX     │                  │                  │              │               │

──────────────────────────────────────────────────────────────────────────────

================================================================================
6. SEQUENCE DIAGRAM — ISSUE STOCK (WITH FIFO)
================================================================================

Draw.io file: diagrams/Seq-IssueStock.drawio

Actors / Participants:
  Storekeeper | React UI | StockController | StockService | FIFOService | DB | AuditLog

──────────────────────────────────────────────────────────────────────────────

  Storekeeper  React UI    StockController  StockService   FIFOService     DB       AuditLog
      │            │              │               │              │           │           │
      │─fill form─>│              │               │              │           │           │
      │            │─POST /stock/─>│               │              │           │           │
      │            │   issue       │               │              │           │           │
      │            │   {itemId,    │─authMiddleware│              │           │           │
      │            │    qty,       │─roleMiddleware│              │           │           │
      │            │    dept,      │─validateInput │              │           │           │
      │            │    recipient} │─issueStock()─>│              │           │           │
      │            │               │               │─getAvailQty()────────────>│           │
      │            │               │               │<──────────── qty ─────────│           │
      │            │               │               │              │           │           │
      │            │               │         [qty requested > available]      │           │
      │            │               │<── 422 Insufficient Stock ───│           │           │
      │            │<── error msg ─│               │              │           │           │
      │            │               │         [qty OK]             │           │           │
      │            │               │               │─calculateIssue(itemId,qty)>│          │
      │            │               │               │              │─SELECT RECEIVE batches │
      │            │               │               │              │  ORDER BY date ASC     │
      │            │               │               │              │<── batches ────────────│
      │            │               │               │              │─deduct FIFO batches    │
      │            │               │               │<── FIFOResult │           │           │
      │            │               │               │  {batches, totalCost}     │           │
      │            │               │               │─BEGIN TRANSACTION         │           │
      │            │               │               │─INSERT stock_transaction──>│           │
      │            │               │               │   (type:ISSUE, qty, FIFO) │           │
      │            │               │               │─UPDATE inventories────────>│           │
      │            │               │               │   SET qty = qty - issued  │           │
      │            │               │               │─UPDATE RECEIVE batch      │           │
      │            │               │               │   remaining quantities────>│           │
      │            │               │               │─generateIssueVoucher()    │           │
      │            │               │               │─COMMIT TRANSACTION        │           │
      │            │               │               │─record(ISSUE_STOCK)──────────────────>│
      │            │               │<── result ────│              │           │           │
      │            │<── 201 {voucherRef} ──────────│              │           │           │
      │<── success ─│              │               │              │           │           │

──────────────────────────────────────────────────────────────────────────────

================================================================================
7. SEQUENCE DIAGRAM — STOCK TAKING APPROVAL
================================================================================

Draw.io file: diagrams/Seq-StockTaking.drawio

Actors / Participants:
  Storekeeper | PAO | React UI | StockTakingController | StockTakingService | DB | AuditLog

──────────────────────────────────────────────────────────────────────────────

  Storekeeper   PAO       React UI     StockTakingCtrl   StockTakingSvc    DB       AuditLog
      │          │            │               │                │            │           │
      │─submit──>│            │               │                │            │           │
      │  count   │─POST /stock│               │                │            │           │
      │          │  -takings  │               │                │            │           │
      │          │  {itemId,  │─authMiddleware│                │            │           │
      │          │   physQty, │─roleMiddleware│                │            │           │
      │          │   notes}   │─create()─────>│                │            │           │
      │          │            │               │─getSystemQty()──────────────>│           │
      │          │            │               │<──────────────── sysQty ────│           │
      │          │            │               │─INSERT stock_takings────────>│           │
      │          │            │               │   {status:'pending', ...}   │           │
      │          │            │               │─record(STOCK_TAKING_SUBMIT)────────────>│
      │          │            │<── 201 ───────│                │            │           │
      │<─ success│            │               │                │            │           │
      │          │            │               │                │            │           │
      │    [PAO opens pending approvals]       │                │            │           │
      │          │─PATCH /stock               │                │            │           │
      │          │  -takings/:id/approve      │                │            │           │
      │          │            │─authMiddleware│                │            │           │
      │          │            │─roleMiddleware│                │            │           │
      │          │            │   ['pao','admin']              │            │           │
      │          │            │─approve(id)──>│                │            │           │
      │          │            │               │─findById(id)───────────────>│           │
      │          │            │               │<─────────────── stockTaking ─│           │
      │          │            │               │─BEGIN TRANSACTION           │           │
      │          │            │               │─UPDATE inventories.qty──────>│           │
      │          │            │               │   = physical_quantity       │           │
      │          │            │               │─INSERT stock_transaction────>│           │
      │          │            │               │   (type: ADJUSTMENT)        │           │
      │          │            │               │─UPDATE stock_takings────────>│           │
      │          │            │               │   SET status = 'approved'   │           │
      │          │            │               │─COMMIT TRANSACTION          │           │
      │          │            │               │─record(APPROVE_ADJUSTMENT)────────────>│
      │          │            │<── 200 ───────│                │            │           │
      │          │<── success ─│              │                │            │           │

──────────────────────────────────────────────────────────────────────────────

================================================================================
8. ACTIVITY DIAGRAM — STOCK ISSUING PROCESS
================================================================================

Draw.io file: diagrams/Activity-IssueStock.drawio

This diagram shows the complete activity flow for the stock issuing process,
including all decision points and parallel actions.

──────────────────────────────────────────────────────────────────────────────

  ○ Start
    ↓
  [Storekeeper opens Issue Stock form]
    ↓
  [Selects inventory item]
    ↓
  [System displays available quantity]
    ↓
  [Storekeeper enters quantity, department, recipient]
    ↓
  [Submits form]
    ↓
  <Validate required fields?>
    │
    ├── INVALID → [Display validation errors] → Loop back to form
    │
    └── VALID
         ↓
  <Requested quantity ≤ available quantity?>
    │
    ├── NO → [Display "Insufficient Stock" error] → Loop back to form
    │
    └── YES
         ↓
  [Apply FIFO logic]
  [Identify oldest batch(es) to deduct from]
    ↓
  [Begin database transaction]
    ↓
  ──────────────────────────────────────── (parallel actions) ─────
  │                          │                          │
  ▼                          ▼                          ▼
  [Insert ISSUE              [Update inventory          [Update RECEIVE
   transaction record]        quantity (decrease)]       batch remaining qty]
  │                          │                          │
  ──────────────────────────────────────── (join) ──────────────────
    ↓
  [Commit transaction]
    ↓
  [Generate Issue Voucher with unique reference number]
    ↓
  [Record audit log entry]
    ↓
  [Return success response with voucher reference]
    ↓
  [Frontend displays success notification]
    ↓
  ○ End

──────────────────────────────────────────────────────────────────────────────

================================================================================
9. STATE CHART DIAGRAM — INVENTORY ITEM LIFECYCLE
================================================================================

Draw.io file: diagrams/StateChart-Inventory.drawio

This diagram shows all possible states of an inventory item and the valid
transitions between those states.

──────────────────────────────────────────────────────────────────────────────

  States:
    Created     — Item has been registered in the system but not yet verified.
    Available   — Item is in stock and available for issuing.
    Reserved    — Item is reserved for an approved requisition but not yet issued.
    Issued      — Item has been issued to a department.
    Damaged     — Item has been flagged as damaged by the Storekeeper.
    Obsolete    — Item has been flagged as no longer in use.
    Disposed    — Item has been approved for removal from inventory by PAO.

  Transitions:
  ──────────────────────────────────────────────────────────────────────────

  ○ Initial
    ↓
  ┌─────────┐
  │ Created │ ──── item registered ────────────────────────────────────────>
  └─────────┘                                                               │
                                                                            ↓
                                                                    ┌───────────┐
                                                             ┌──────│ Available │──────┐
                                                             │      └───────────┘      │
                                                             │            │             │
                                                    receive  │            │ reserve     │ flag damaged
                                                    stock    │            ↓             │
                                                             │      ┌──────────┐        │
                                                             │      │ Reserved │        │
                                                             │      └──────────┘        │
                                                             │            │             │
                                                             │            │ issue       │
                                                             │            ↓             ↓
                                                             │      ┌────────┐    ┌──────────┐
                                                             │      │ Issued │    │ Damaged  │──┐
                                                             │      └────────┘    └──────────┘  │
                                                             │            │             │        │ PAO
                                                             │     return │             │ flag   │ approve
                                                             └────────────┘          obsolete    │ disposal
                                                                                       │        │
                                                                                       ↓        │
                                                                                ┌──────────┐    │
                                                                                │ Obsolete │────┘
                                                                                └──────────┘
                                                                                       │
                                                                                PAO approves
                                                                                  disposal
                                                                                       ↓
                                                                                ┌──────────┐
                                                                                │ Disposed │
                                                                                └──────────┘
                                                                                       │
                                                                                       ↓ ○ Final

  Transition Table:
  ┌──────────────┬──────────────────────────────┬──────────────┬─────────────────────────────┐
  │ From State   │ Trigger                      │ To State     │ Actor                        │
  ├──────────────┼──────────────────────────────┼──────────────┼─────────────────────────────┤
  │ Created      │ Item saved to database       │ Available    │ System                       │
  │ Available    │ Stock received               │ Available    │ Storekeeper (qty increases)  │
  │ Available    │ Requisition approved         │ Reserved     │ PAO                          │
  │ Reserved     │ Item issued                  │ Issued       │ Storekeeper                  │
  │ Issued       │ Item returned to store       │ Available    │ Storekeeper                  │
  │ Available    │ Flagged as damaged           │ Damaged      │ Storekeeper                  │
  │ Available    │ Flagged as obsolete          │ Obsolete     │ Storekeeper                  │
  │ Damaged      │ Flagged as obsolete          │ Obsolete     │ Storekeeper                  │
  │ Damaged      │ PAO approves disposal        │ Disposed     │ PAO                          │
  │ Obsolete     │ PAO approves disposal        │ Disposed     │ PAO                          │
  │ Damaged      │ PAO rejects disposal         │ Available    │ PAO                          │
  └──────────────┴──────────────────────────────┴──────────────┴─────────────────────────────┘

================================================================================
10. DRAW.IO AND DIAGRAM TOOL INSTRUCTIONS
================================================================================

All diagrams in this document are to be implemented in Draw.io and saved in:
  phase-3-system-analysis-design/diagrams/

10.1 Draw.io Setup

  1. Open app.diagrams.net (Draw.io web) or the VS Code Draw.io extension.
  2. Create a new diagram for each file listed in Section 1.
  3. Save each file with the exact filename shown in the table.

10.2 ERD Implementation in Draw.io

  1. Use the "Entity" shape from the Entity Relationship shape library.
  2. Add each table from Section 2 as a separate entity box.
  3. Add attributes inside each box with PK/FK labels.
  4. Connect related entities with crow's foot notation connectors:
     - One side: single vertical bar (|)
     - Many side: crow's foot (three lines)
  5. Label each relationship line with the foreign key column name.

10.3 Class Diagram Implementation in Draw.io

  1. Use the UML shape library.
  2. Draw each class from Section 3 as a UML class box (3 compartments:
     name, attributes, methods).
  3. Connect classes with appropriate UML relationships:
     - Association: solid line with arrow
     - Dependency (uses): dashed line with arrow
     - Aggregation: solid line with open diamond
  4. Mark visibility: + (public), - (private), # (protected).

10.4 Sequence Diagram Implementation in Draw.io

  1. Use the UML shape library.
  2. Place each participant as a lifeline box at the top.
  3. Draw activation bars on each lifeline.
  4. Use solid arrows for synchronous calls (method calls).
  5. Use dashed arrows for return messages.
  6. Use combined fragments (alt, loop, par) for conditional and
     parallel logic.
  7. Label every arrow with the method name and parameters shown
     in Sections 4–7.

10.5 Activity Diagram Implementation in Draw.io

  1. Use filled circle for start node, circle-in-circle for end node.
  2. Use rounded rectangles for activity steps.
  3. Use diamonds for decision nodes with YES/NO labels on branches.
  4. Use thick horizontal bars for parallel fork and join nodes.
  5. Arrows indicate flow direction.

10.6 State Chart Implementation in Draw.io

  1. Use rounded rectangles for states.
  2. Use filled circle for initial pseudostate.
  3. Use circle-in-circle for final state.
  4. Use labeled arrows for transitions showing trigger event and
     actor in brackets: event [guard] / action

================================================================================
END OF DOCUMENT
================================================================================
