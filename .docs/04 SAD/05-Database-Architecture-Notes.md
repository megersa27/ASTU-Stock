================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Data Architecture and Modeling

Document: 05-Database-Architecture-Notes.md
Phase:    Phase 3 — System Analysis and Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

NOTE: This document is a supplementary reference to 04-Database-Design.md,
which contains the full table definitions, column specifications, FIFO
implementation notes, and index strategy. This document covers data modeling
decisions, entity identification rationale, relationship analysis,
data integrity rules, and the Prisma schema specification.

================================================================================
TABLE OF CONTENTS

  1.  Data Modeling Approach
  2.  Entity Identification
  3.  Entity Descriptions
  4.  Relationship Analysis
  5.  Business Events and Data Changes
  6.  Data Integrity Rules
  7.  FIFO Data Model
  8.  Prisma Schema
  9.  Database Naming Conventions
  10. Migration Strategy

================================================================================
1. DATA MODELING APPROACH
================================================================================

The database is designed using a relational model in PostgreSQL. The design
process followed these steps:

  1. Identified entities from the SRS functional requirements
     and MoFED business rules.
  2. Defined attributes for each entity based on what data the system
     needs to store and what reports need to produce.
  3. Identified relationships between entities.
  4. Applied normalization to eliminate data duplication.
  5. Added integrity constraints (NOT NULL, UNIQUE, FK, CHECK) to enforce
     business rules at the database level.
  6. Designed indexes on frequently queried columns for query performance.

The database design is the authoritative source of truth for the structure
of all data in the system. The Prisma schema (schema.prisma) implements this
design in code and generates the database migration files.

================================================================================
2. ENTITY IDENTIFICATION
================================================================================

Entities were identified by examining:
  • Actors from the SRS (users, suppliers).
  • Resources the system manages (inventory items, warehouses, categories).
  • Events that must be recorded (stock transactions, stock takings, damaged items).
  • Audit requirements (audit logs).
  • Organizational structure (roles).

  ┌────────────────────┬─────────────────────────────────────────────────────┐
  │ Entity             │ Identified From                                     │
  ├────────────────────┼─────────────────────────────────────────────────────┤
  │ roles              │ SRS Section 3.3 (7 user roles)                      │
  │ users              │ SRS Chapter 2 (actors), FR-USER-001                 │
  │ categories         │ MoFED classification codes 4401–4418                │
  │ suppliers          │ SRS Chapter 2 (actors), FR-SUP-001                  │
  │ warehouses         │ FR-WH-001, workflow step 7                          │
  │ inventories        │ FR-INV-001, core system resource                    │
  │ stock_transactions │ BR-05 (every transaction recorded), FR-BIN-001      │
  │ stock_takings      │ BR-09 (annual physical count), FR-STOCK-001         │
  │ damaged_items      │ FR-DAM-001, BR-10 (damaged & obsolete tracking)     │
  │ audit_logs         │ FR-AUDIT-001, BR-03, BR-05, BR-15                   │
  └────────────────────┴─────────────────────────────────────────────────────┘

================================================================================
3. ENTITY DESCRIPTIONS
================================================================================

  roles
  ──────
  Stores the 7 system roles. Referenced by users via foreign key.
  Roles do not change during normal system operation — they are seeded
  at deployment time.
  Values: admin, pao, storekeeper, stock_clerk, accountant, dept_head,
          security_officer.

  users
  ──────
  Stores all registered system users. Passwords are stored as bcrypt hashes.
  A user has exactly one role. A user can be deactivated (status = inactive)
  without deleting their record, preserving audit trail integrity.
  The created_by field supports a self-referential relationship allowing
  the system to track which administrator created each user.

  categories
  ───────────
  Stores inventory categories based on the MoFED classification system.
  The code field stores the MoFED 4-digit category number (e.g., 4401).
  Categories are seeded at deployment with the 18 standard MoFED codes.

  suppliers
  ──────────
  Stores external suppliers who deliver goods. A supplier record is required
  before a stock receiving transaction can be recorded.

  warehouses
  ───────────
  Stores physical storage locations. Each inventory item is assigned to
  a primary warehouse location. Stock transfer transactions record movements
  between warehouses.

  inventories
  ────────────
  The central table of the system. Stores all registered inventory items.
  The quantity field holds the current available stock count and is
  automatically updated by stock transaction operations.
  The status field tracks the item lifecycle:
    available → the normal operational state.
    damaged / obsolete → flagged, excluded from available stock.
    disposed → permanently removed from active inventory.
  A CHECK constraint enforces quantity >= 0.

  stock_transactions
  ────────────────────
  Records every stock movement event. This table serves multi-purpose needs:
    1. Transaction history (stock history page).
    2. Bin card data source (digital bin card per item).
    3. FIFO batch tracking (unit_cost & remaining_quantity per RECEIVE transaction).
  The transaction_type field distinguishes: RECEIVE, ISSUE, TRANSFER_OUT,
  TRANSFER_IN, ADJUSTMENT, DISPOSAL.

  stock_takings
  ──────────────
  Records physical stock count sessions submitted by storekeepers for
  PAO approval. The variance field is a computed column:
    variance = physical_quantity - system_quantity.
  Positive variance means surplus was found.
  Negative variance means a deficit was found.

  damaged_items
  ──────────────
  Tracks item damage and obsolescence reports independently from total catalog stock.
  Stores condition ('damaged' or 'obsolete'), affected quantity, reporter, and
  PAO disposal approval status.

  audit_logs
  ───────────
  Immutable record of every significant user action. Written by
  auditMiddleware after successful responses. No UPDATE or DELETE
  operations are permitted on this table. The old_values and new_values
  JSONB columns store the state of the affected record before and after
  the action.

================================================================================
4. RELATIONSHIP ANALYSIS
================================================================================

  One Role → Many Users
  ─────────────────────
  A role can be assigned to many users.
  A user has exactly one role.
  FK: users.role_id → roles.id

  One Category → Many Inventory Items
  ────────────────────────────────────
  A category groups many inventory items.
  An item belongs to exactly one category.
  FK: inventories.category_id → categories.id

  One Warehouse → Many Inventory Items
  ──────────────────────────────────────
  A warehouse stores many items.
  An item is stored in exactly one warehouse (primary location).
  FK: inventories.warehouse_id → warehouses.id

  One Supplier → Many Stock Transactions
  ────────────────────────────────────────
  A supplier can be referenced in many RECEIVE transactions.
  A RECEIVE transaction references one supplier.
  FK: stock_transactions.supplier_id → suppliers.id

  One Inventory Item → Many Stock Transactions
  ──────────────────────────────────────────────
  An item can have many transaction records over time.
  A transaction record references one item.
  FK: stock_transactions.inventory_id → inventories.id

  One Warehouse → Many Stock Transactions (source and destination)
  ─────────────────────────────────────────────────────────────────
  A warehouse can appear as source or destination in many transfer transactions.
  FK: stock_transactions.source_warehouse_id → warehouses.id
  FK: stock_transactions.dest_warehouse_id   → warehouses.id

  One User → Many Stock Transactions (performed_by, approved_by)
  ───────────────────────────────────────────────────────────────
  A user can perform many transactions over time.
  FK: stock_transactions.performed_by → users.id
  FK: stock_transactions.approved_by  → users.id  (nullable)

  One Inventory Item → Many Stock Takings
  ────────────────────────────────────────
  An item can be counted in multiple stock taking sessions over time.
  FK: stock_takings.inventory_id → inventories.id

  One Inventory Item → Many Damaged Items
  ────────────────────────────────────────
  An item can have multiple damaged/obsolete incident reports over time.
  FK: damaged_items.inventory_id → inventories.id

  One User → Many Damaged Items (reported_by, approved_by)
  ────────────────────────────────────────────────────────
  FK: damaged_items.reported_by → users.id
  FK: damaged_items.approved_by → users.id (nullable)

  One User → Many Audit Logs
  ───────────────────────────
  A user's actions are recorded in many audit log entries.
  FK: audit_logs.user_id → users.id

================================================================================
5. BUSINESS EVENTS AND DATA CHANGES
================================================================================

This section maps the key business events from the stock management
workflow to the specific database changes each event causes.

  Event: Stock Received
  ─────────────────────
  Table changes:
    stock_transactions  → INSERT  (type: RECEIVE, quantity, remaining_quantity = quantity, unit_cost, supplier_id)
    inventories         → UPDATE  quantity = quantity + received_quantity
    audit_logs          → INSERT  (action: RECEIVE_STOCK)

  Event: Stock Issued
  ────────────────────
  Table changes:
    stock_transactions  → INSERT  (type: ISSUE, quantity, dept, recipient, reference_number)
    stock_transactions  → UPDATE  remaining_quantity on RECEIVE batches (FIFO)
    inventories         → UPDATE  quantity = quantity - issued_quantity
    audit_logs          → INSERT  (action: ISSUE_STOCK)

  Event: Stock Transferred
  ─────────────────────────
  Table changes:
    stock_transactions  → INSERT  (type: TRANSFER_OUT, source_warehouse_id)
    stock_transactions  → INSERT  (type: TRANSFER_IN,  dest_warehouse_id)
    inventories         → UPDATE  source warehouse record quantity decreases
    inventories         → UPDATE  destination warehouse record quantity increases
    audit_logs          → INSERT  (action: TRANSFER_STOCK)

  Event: Stock Taking Approved
  ─────────────────────────────
  Table changes:
    stock_transactions  → INSERT  (type: ADJUSTMENT, old qty → new qty)
    inventories         → UPDATE  quantity = physical_quantity
    stock_takings       → UPDATE  status = 'approved', approved_by, approved_at
    audit_logs          → INSERT  (action: APPROVE_ADJUSTMENT)

  Event: Damaged Item Reported
  ─────────────────────────────
  Table changes:
    damaged_items       → INSERT  (inventory_id, quantity_affected, condition, reported_by, status: 'pending')
    audit_logs          → INSERT  (action: REPORT_DAMAGED)

  Event: Disposal Approved
  ─────────────────────────
  Table changes:
    damaged_items       → UPDATE  status = 'disposed', approved_by, approved_at
    stock_transactions  → INSERT  (type: DISPOSAL, quantity: quantity_affected)
    inventories         → UPDATE  quantity = quantity - quantity_affected
    audit_logs          → INSERT  (action: APPROVE_DISPOSAL)

All events that modify inventory quantity are wrapped in a PostgreSQL
transaction via prisma.$transaction to guarantee atomicity. If any step fails,
all changes within that transaction are rolled back.

================================================================================
6. DATA INTEGRITY RULES
================================================================================

Enforced at database level:

  inventories.item_code     UNIQUE — implements BR-01
  inventories.quantity      CHECK (quantity >= 0) — prevents negative stock
  users.email               UNIQUE — prevents duplicate accounts
  roles.name                UNIQUE — prevents duplicate role names
  categories.code           UNIQUE — prevents duplicate MoFED codes

Enforced at application layer:

  Stock cannot be issued without available quantity (BR-04).
  A transfer source and destination cannot be the same warehouse.
  An approved stock taking cannot be approved again.
  An approved disposal cannot be reversed.
  Audit logs cannot be updated or deleted.

Referential integrity:

  All foreign key relationships enforce referential integrity.
  Cascading deletes are NOT used for any table. Deletion of a referenced
  record (e.g., a category that has items assigned) is prevented by
  application-level validation before the DELETE is attempted.

================================================================================
7. FIFO DATA MODEL
================================================================================

The FIFO (First In, First Out) valuation method requires tracking the
unit cost of each individual receiving batch.

Implementation in stock_transactions table:

  Every RECEIVE transaction stores:
    inventory_id        — which item was received
    quantity            — how many units were received
    unit_cost           — cost per unit at time of receiving
    remaining_quantity  — how many units from this batch remain (starts = quantity)
    transaction_date    — when received (determines FIFO order)

  When stock is issued, the backend:
    1. Queries all RECEIVE transactions for the item WHERE remaining_quantity > 0,
       ordered by transaction_date ASC, id ASC (oldest first).
    2. Deducts from each batch sequentially until the issued quantity is satisfied.
    3. Updates remaining_quantity on each consumed batch.
    4. Calculates cost of goods issued = sum(deducted_qty × unit_cost per batch).

  Example:

  Batches on file (oldest first):
    Batch 1: received 100 units @ 25.00 ETB, remaining = 80
    Batch 2: received  50 units @ 27.00 ETB, remaining = 50

  Issue request: 90 units

  FIFO deduction:
    From Batch 1: deduct 80 units @ 25.00 = 2,000.00 ETB. Batch 1 remaining = 0.
    From Batch 2: deduct 10 units @ 27.00 =   270.00 ETB. Batch 2 remaining = 40.

  Total cost of goods issued: 2,270.00 ETB
  Remaining inventory value:  40 × 27.00 = 1,080.00 ETB

================================================================================
8. PRISMA SCHEMA
================================================================================

The Prisma schema file (backend/prisma/schema.prisma) implements all 10
database tables. It is the single source of truth for the database structure.

Key schema conventions:
  • All primary keys use autoincrement Int.
  • Timestamps use DateTime @default(now()) and @updatedAt.
  • JSONB fields use Json type.
  • Enums are defined for transaction_type, item status, and condition.
  • All foreign key relations are explicitly defined with @relation.

Prisma migration workflow:

  Development:   npx prisma migrate dev --name <description>
                 Creates and applies a new migration file.

  Production:    npx prisma migrate deploy
                 Applies all pending migrations.

  Reset (dev):   npx prisma migrate reset
                 Drops and recreates the database (development only).

  Schema sync:   npx prisma generate
                 Regenerates the Prisma Client after schema changes.

  Seed:          npx prisma db seed
                 Populates roles and categories with initial data.

================================================================================
9. DATABASE NAMING CONVENTIONS
================================================================================

  Tables:       snake_case plural nouns        stock_transactions, audit_logs, damaged_items
  Columns:      snake_case                     unit_cost, created_at, role_id, remaining_quantity
  Primary keys: id (SERIAL / autoincrement)
  Foreign keys: <referenced_table_singular>_id  category_id, warehouse_id
  Timestamps:   created_at, updated_at, approved_at
  Booleans:     prefixed with is_              is_active (if used)
  Enums:        UPPER_CASE values              RECEIVE, ISSUE, TRANSFER_OUT

================================================================================
10. MIGRATION STRATEGY
================================================================================

Database schema changes are managed through Prisma migrations.

  Development workflow:
    1. Modify backend/prisma/schema.prisma.
    2. Run: npx prisma migrate dev --name <description>
    3. Prisma generates a SQL migration file in prisma/migrations/.
    4. Migration is applied to the development database automatically.
    5. Prisma Client is regenerated automatically.

  Migration file naming convention:
    YYYYMMDDHHMMSS_<description>
    Example: 20260801120000_init_schema

  Production deployment:
    1. All migration files are committed to Git.
    2. On deployment: npx prisma migrate deploy applies pending migrations.
    3. The database is never modified manually in production.

  Seed data:
    A seed script (prisma/seed.js) populates the following tables on
    first deployment:
      roles:       7 roles (admin, pao, storekeeper, stock_clerk,
                   accountant, dept_head, security_officer)
      categories:  18 MoFED classification codes (4401–4418)
      users:       1 default administrator account

================================================================================
END OF DOCUMENT
================================================================================
