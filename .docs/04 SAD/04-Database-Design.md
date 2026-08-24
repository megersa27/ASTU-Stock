ASTU Stock Management System
Database Design Document
Phase 3 — System Analysis and Design

Document: 04-Database-Design.md
Version:  1.0
Author:   Megersa Tekalign Senbeta
Date:     August 2026

================================================================================

Table of Contents
  1. Overview
  2. Database Selection
  3. Entity Relationship Summary
  4. Table Definitions (10 Tables)
  5. Table Relationships Diagram
  6. Key Constraints and Business Rules
  7. FIFO Implementation Notes
  8. Indexes

================================================================================

1. Overview
━━━━━━━━━━━

The database design defines the structure for storing all data required by the
ASTU Stock Management System. It is based on the entities identified in the SRS
(Section 18) and the business rules from the MoFED Stock Management Manual.

The database uses a relational model in PostgreSQL with foreign key constraints,
CHECK constraints, and transactional consistency to maintain data integrity across
all inventory operations.

================================================================================

2. Database Selection
━━━━━━━━━━━━━━━━━━━━━

  Database: PostgreSQL (with Prisma ORM)
  Reason:
    • Robust support for relational data with complex joins (required for FIFO
      batch tracking and multi-warehouse stock calculations).
    • Strong ACID transaction support — critical for stock quantity integrity.
    • Excellent support for constraints, triggers, and stored functions.
    • Widely used in production enterprise systems.
    • Full compatibility with Node.js via Prisma ORM.

================================================================================

3. Entity Relationship Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  roles          ──< users
  users          ──< stock_transactions    (performed_by, approved_by)
  categories     ──< inventories
  suppliers      ──< stock_transactions    (supplier_id)
  warehouses     ──< inventories           (warehouse_id)
  warehouses     ──< stock_transactions    (source_warehouse_id, dest_warehouse_id)
  inventories    ──< stock_transactions    (inventory_id)
  inventories    ──< stock_takings         (inventory_id)
  inventories    ──< damaged_items         (inventory_id)
  users          ──< damaged_items         (reported_by, approved_by)
  users          ──< audit_logs            (user_id)

  Legend:  ──<  = one-to-many

================================================================================

4. Table Definitions
━━━━━━━━━━━━━━━━━━━━

─────────────────────────────────────────────────────────────
TABLE 1: roles
─────────────────────────────────────────────────────────────
Stores the available user roles in the system.

  Column          Data Type       Constraints
  ──────────────  ────────────    ──────────────────────────────
  id              SERIAL          PRIMARY KEY
  name            VARCHAR(50)     NOT NULL, UNIQUE
                                  -- Values: 'admin', 'pao',
                                  -- 'storekeeper', 'stock_clerk',
                                  -- 'accountant', 'dept_head',
                                  -- 'security_officer'
  description     TEXT            NULL
  created_at      TIMESTAMP       DEFAULT NOW()

  Sample data:
  ┌────┬──────────────────┬────────────────────────────────────────────┐
  │ id │ name             │ description                                │
  ├────┼──────────────────┼────────────────────────────────────────────┤
  │ 1  │ admin            │ Full system access                         │
  │ 2  │ pao              │ Property Administration Officer            │
  │ 3  │ storekeeper      │ Manages stock operations                   │
  │ 4  │ stock_clerk      │ Maintains stock records and reports        │
  │ 5  │ accountant       │ Views financial and valuation reports      │
  │ 6  │ dept_head        │ Approves departmental requisitions         │
  │ 7  │ security_officer │ Monitors goods entry/exit                  │
  └────┴──────────────────┴────────────────────────────────────────────┘


─────────────────────────────────────────────────────────────
TABLE 2: users
─────────────────────────────────────────────────────────────
Stores all registered system users.

  Column          Data Type       Constraints
  ──────────────  ────────────    ──────────────────────────────
  id              SERIAL          PRIMARY KEY
  full_name       VARCHAR(100)    NOT NULL
  email           VARCHAR(150)    NOT NULL, UNIQUE
  password_hash   VARCHAR(255)    NOT NULL
                                  -- bcrypt hashed, never plain text
  role_id         INTEGER         NOT NULL, FK → roles(id)
  department      VARCHAR(100)    NULL
  phone           VARCHAR(20)     NULL
  status          VARCHAR(20)     DEFAULT 'active'
                                  -- Values: 'active', 'inactive'
  created_by      INTEGER         NULL, FK → users(id)
  created_at      TIMESTAMP       DEFAULT NOW()
  updated_at      TIMESTAMP       DEFAULT NOW()

  Business Rule Enforced: BR-15 — Only authorized users can access inventory.
  Security: password_hash must never store plain text (NFR-SEC-003).


─────────────────────────────────────────────────────────────
TABLE 3: categories
─────────────────────────────────────────────────────────────
Stores inventory item categories based on the MoFED classification codes.

  Column          Data Type       Constraints
  ──────────────  ────────────    ──────────────────────────────
  id              SERIAL          PRIMARY KEY
  code            VARCHAR(10)     NOT NULL, UNIQUE
                                  -- e.g. '4401', '4402' (MoFED codes)
  name            VARCHAR(100)    NOT NULL, UNIQUE
  description     TEXT            NULL
  created_at      TIMESTAMP       DEFAULT NOW()
  updated_at      TIMESTAMP       DEFAULT NOW()

  Sample data (MoFED stock classification codes):
  ┌────┬───────┬──────────────────────────────────────────┐
  │ id │ code  │ name                                     │
  ├────┼───────┼──────────────────────────────────────────┤
  │ 1  │ 4401  │ Office Supplies and Stationery           │
  │ 2  │ 4402  │ Cleaning and Hygiene Materials           │
  │ 3  │ 4403  │ Electrical and Lighting Materials        │
  │ 4  │ 4404  │ Plumbing and Sanitation Materials        │
  │ 5  │ 4405  │ Construction and Maintenance Materials   │
  │ 6  │ 4406  │ Laboratory Supplies                      │
  │ 7  │ 4407  │ Medical Supplies                         │
  │ 8  │ 4408  │ Agricultural Materials                   │
  │ 9  │ 4409  │ Fuel and Lubricants                      │
  │ 10 │ 4410  │ Spare Parts and Accessories              │
  └────┴───────┴──────────────────────────────────────────┘


─────────────────────────────────────────────────────────────
TABLE 4: suppliers
─────────────────────────────────────────────────────────────
Stores registered suppliers who deliver goods to the organization.

  Column          Data Type       Constraints
  ──────────────  ────────────    ──────────────────────────────
  id              SERIAL          PRIMARY KEY
  name            VARCHAR(150)    NOT NULL
  contact_person  VARCHAR(100)    NULL
  phone           VARCHAR(20)     NULL
  email           VARCHAR(150)    NULL
  address         TEXT            NULL
  status          VARCHAR(20)     DEFAULT 'active'
  created_at      TIMESTAMP       DEFAULT NOW()
  updated_at      TIMESTAMP       DEFAULT NOW()


─────────────────────────────────────────────────────────────
TABLE 5: warehouses
─────────────────────────────────────────────────────────────
Stores physical storage locations where inventory is kept.

  Column          Data Type       Constraints
  ──────────────  ────────────    ──────────────────────────────
  id              SERIAL          PRIMARY KEY
  name            VARCHAR(100)    NOT NULL, UNIQUE
  location        VARCHAR(200)    NULL
  description     TEXT            NULL
  status          VARCHAR(20)     DEFAULT 'active'
                                  -- Values: 'active', 'inactive'
  created_at      TIMESTAMP       DEFAULT NOW()
  updated_at      TIMESTAMP       DEFAULT NOW()


─────────────────────────────────────────────────────────────
TABLE 6: inventories
─────────────────────────────────────────────────────────────
Stores all registered inventory items. Central table of the system.

  Column              Data Type       Constraints
  ──────────────────  ────────────    ──────────────────────────────
  id                  SERIAL          PRIMARY KEY
  item_code           VARCHAR(20)     NOT NULL, UNIQUE
                                      -- e.g. '4401-001' (MoFED format)
  name                VARCHAR(150)    NOT NULL
  description         TEXT            NULL
  category_id         INTEGER         NOT NULL, FK → categories(id)
  warehouse_id        INTEGER         NOT NULL, FK → warehouses(id)
  unit                VARCHAR(30)     NOT NULL
                                      -- e.g. 'pcs', 'box', 'kg', 'ltr'
  quantity            INTEGER         NOT NULL DEFAULT 0
                                      CHECK (quantity >= 0)
  minimum_level       INTEGER         NOT NULL DEFAULT 0
  maximum_level       INTEGER         NULL
  reorder_level       INTEGER         NULL
  safety_stock        INTEGER         NULL
  unit_cost           DECIMAL(12,2)   NULL
                                      -- latest unit cost (FIFO tracked in transactions)
  status              VARCHAR(20)     DEFAULT 'available'
                                      -- Values: 'available', 'reserved',
                                      -- 'damaged', 'obsolete', 'disposed'
  created_by          INTEGER         NOT NULL, FK → users(id)
  created_at          TIMESTAMP       DEFAULT NOW()
  updated_at          TIMESTAMP       DEFAULT NOW()

  Business Rules Enforced:
    BR-01 — unique item_code constraint
    BR-14 — minimum_level, reorder_level, safety_stock fields
    FR-CTRL-002 — quantity < minimum_level triggers low-stock alert
    FR-DAM-002  — status field tracks item lifecycle states


─────────────────────────────────────────────────────────────
TABLE 7: stock_transactions
─────────────────────────────────────────────────────────────
Records every stock movement. Central transaction log of the system.
Also serves as the data source for the digital bin card and FIFO calculation.

  Column                Data Type       Constraints
  ────────────────────  ────────────    ──────────────────────────────
  id                    SERIAL          PRIMARY KEY
  transaction_type      VARCHAR(20)     NOT NULL
                                        -- Values: 'RECEIVE', 'ISSUE',
                                        -- 'TRANSFER_OUT', 'TRANSFER_IN',
                                        -- 'ADJUSTMENT', 'DISPOSAL'
  inventory_id          INTEGER         NOT NULL, FK → inventories(id)
  quantity              INTEGER         NOT NULL CHECK (quantity > 0)
  remaining_quantity    INTEGER         NULL
                                        -- For RECEIVE batches: tracks available qty for FIFO.
                                        -- Initialized to quantity; decremented by ISSUEs.
  unit_cost             DECIMAL(12,2)   NULL
                                        -- Required for RECEIVE (FIFO batch cost)
  total_value           DECIMAL(14,2)   NULL
                                        -- quantity × unit_cost
  source_warehouse_id   INTEGER         NULL, FK → warehouses(id)
                                        -- For TRANSFER_OUT and ISSUE
  dest_warehouse_id     INTEGER         NULL, FK → warehouses(id)
                                        -- For TRANSFER_IN and RECEIVE
  supplier_id           INTEGER         NULL, FK → suppliers(id)
                                        -- Required for RECEIVE
  department            VARCHAR(100)    NULL
                                        -- Required for ISSUE
  recipient_name        VARCHAR(100)    NULL
                                        -- Required for ISSUE
  reference_number      VARCHAR(50)     NULL
                                        -- GRN, Issue Voucher, or Requisition Slip number
  approved_by           INTEGER         NULL, FK → users(id)
  performed_by          INTEGER         NOT NULL, FK → users(id)
  transaction_date      DATE            NOT NULL DEFAULT CURRENT_DATE
  notes                 TEXT            NULL
  created_at            TIMESTAMP       DEFAULT NOW()

  Business Rules Enforced:
    BR-05 — Every transaction must be recorded.
    BR-07 — Stock records updated on every receive/issue.
    BR-08 — unit_cost & remaining_quantity per batch enable FIFO valuation.
    FR-BIN-001 — This table IS the bin card data source.

  FIFO Note:
    When issuing, the backend queries RECEIVE transactions ordered by
    transaction_date ASC, id ASC (oldest first) where remaining_quantity > 0,
    and deducts quantities batch by batch until the requested issue quantity
    is fulfilled.


─────────────────────────────────────────────────────────────
TABLE 8: stock_takings
─────────────────────────────────────────────────────────────
Records physical stock count sessions and reconciliation results.

  Column              Data Type       Constraints
  ──────────────────  ────────────    ──────────────────────────────
  id                  SERIAL          PRIMARY KEY
  inventory_id        INTEGER         NOT NULL, FK → inventories(id)
  system_quantity     INTEGER         NOT NULL
                                      -- Snapshot of system qty at time of count
  physical_quantity   INTEGER         NOT NULL
                                      -- Actual count by storekeeper
  variance            INTEGER         GENERATED ALWAYS AS
                                      (physical_quantity - system_quantity) STORED
                                      -- Positive = surplus, Negative = deficit
  counted_by          INTEGER         NOT NULL, FK → users(id)
  approved_by         INTEGER         NULL, FK → users(id)
  status              VARCHAR(20)     DEFAULT 'pending'
                                      -- Values: 'pending', 'approved', 'rejected'
  notes               TEXT            NULL
  count_date          DATE            NOT NULL DEFAULT CURRENT_DATE
  approved_at         TIMESTAMP       NULL
  created_at          TIMESTAMP       DEFAULT NOW()

  Business Rule Enforced: BR-09 — Annual physical stock taking.


─────────────────────────────────────────────────────────────
TABLE 9: audit_logs
─────────────────────────────────────────────────────────────
Immutable record of every significant user action in the system.

  Column          Data Type       Constraints
  ──────────────  ────────────    ──────────────────────────────
  id              SERIAL          PRIMARY KEY
  user_id         INTEGER         NULL, FK → users(id)
                                  -- NULL if system-generated action
  action          VARCHAR(50)     NOT NULL
                                  -- e.g. 'LOGIN', 'LOGOUT', 'RECEIVE_STOCK',
                                  -- 'ISSUE_STOCK', 'UPDATE_INVENTORY',
                                  -- 'DELETE_INVENTORY', 'TRANSFER_STOCK',
                                  -- 'STOCK_ADJUSTMENT', 'CREATE_USER',
                                  -- 'APPROVE_DISPOSAL'
  entity_type     VARCHAR(50)     NULL
                                  -- e.g. 'inventory', 'user', 'stock_transaction'
  entity_id       INTEGER         NULL
                                  -- ID of the affected record
  old_values      JSONB           NULL
                                  -- State before the action
  new_values      JSONB           NULL
                                  -- State after the action
  ip_address      VARCHAR(45)     NULL
  created_at      TIMESTAMP       DEFAULT NOW()

  IMPORTANT: No UPDATE or DELETE operations are ever permitted on this table.
  It is append-only. This is enforced at the application layer and should be
  enforced with a PostgreSQL trigger if possible.

  Business Rules Enforced:
    BR-03, BR-05, BR-15 — Accountability, transparency, and traceability.
    FR-AUDIT-003 — Audit logs are read-only.


─────────────────────────────────────────────────────────────
TABLE 10: damaged_items
─────────────────────────────────────────────────────────────
Tracks damaged and obsolete item reports and disposal approval lifecycle.

  Column              Data Type       Constraints
  ──────────────────  ────────────    ──────────────────────────────
  id                  SERIAL          PRIMARY KEY
  inventory_id        INTEGER         NOT NULL, FK → inventories(id)
  condition           VARCHAR(20)     NOT NULL
                                      -- Values: 'damaged', 'obsolete'
  quantity_affected   INTEGER         NOT NULL CHECK (quantity_affected > 0)
  description         TEXT            NULL
  reported_by         INTEGER         NOT NULL, FK → users(id)
  status              VARCHAR(20)     DEFAULT 'pending'
                                      -- Values: 'pending', 'approved', 'rejected', 'disposed'
  approved_by         INTEGER         NULL, FK → users(id)
  approved_at         TIMESTAMP       NULL
  created_at          TIMESTAMP       DEFAULT NOW()
  updated_at          TIMESTAMP       DEFAULT NOW()

  Business Rules Enforced:
    BR-10 — Damaged and obsolete items must be inspected and approved by PAO before disposal.

================================================================================

5. Table Relationships Diagram
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  roles
    │ 1
    │
    └──────────────────< users (role_id)
                           │ 1
                           │
             ┌─────────────┼─────────────────────────┐
             │             │                         │
             │ performed_by│ created_by              │ reported_by / approved_by
             │             │                         │
             ▼ N           │                         ▼ N
    stock_transactions     │                   damaged_items
             │             │                         │
       ┌─────┤             │                         │
       │ N   │             │                         │
       │     │             ▼ N                       │
    inventory_id ─────> inventories (id) 1 ──────────┼──< stock_takings (inventory_id)
       │                    │                        │
       │               ┌────┤                        │
       │               │    │                        │
       │      category_id   warehouse_id             │
       │               │    │                        │
       │               ▼ 1  ▼ 1                      ▼ N
       │          categories  warehouses       inventory_id
       │                        │ 1
       │                        │
       └──── source/dest ────────┘ N

  audit_logs
    └── user_id ──────────> users (id)

================================================================================

6. Key Constraints and Business Rules
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌──────────────────────────────────────────────────────────────────────────┐
  │ Business Rule │ Database Enforcement                                     │
  ├──────────────────────────────────────────────────────────────────────────┤
  │ BR-01         │ inventories.item_code UNIQUE constraint                  │
  │ BR-02         │ Application layer: status check before storage           │
  │ BR-03         │ audit_logs records every approval action                 │
  │ BR-04         │ Application layer: record approved requisition ref num   │
  │ BR-05         │ stock_transactions: every operation creates a record     │
  │ BR-06         │ stock_transactions: bin card derived from this table     │
  │ BR-07         │ Application layer: quantity updated on every transaction │
  │ BR-08         │ unit_cost & remaining_quantity in stock_transactions     │
  │ BR-09         │ stock_takings table supports physical counts             │
  │ BR-10         │ damaged_items table tracks condition & PAO disposal flow │
  │ BR-11         │ reference_number column in stock_transactions (gate pass)│
  │ BR-12         │ stock_takings.variance + adjustment via ADJUSTMENT type  │
  │ BR-13         │ stock_transactions.department + recipient_name           │
  │ BR-14         │ inventories: minimum_level, reorder_level, safety_stock  │
  │ BR-15         │ users.status = 'active' check in auth middleware         │
  └──────────────────────────────────────────────────────────────────────────┘

================================================================================

7. FIFO Implementation Notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIFO (First In, First Out) is the mandatory valuation method per BR-08 and the
MoFED Stock Management Manual.

How FIFO Works in This Database:

  1. Every RECEIVE transaction stores:
       inventory_id, quantity, remaining_quantity (= quantity), unit_cost, transaction_date

  2. When stock is ISSUED, the backend runs this logic:

       -- Get all RECEIVE batches with available stock for this item, oldest first
       SELECT id, remaining_quantity, unit_cost
       FROM stock_transactions
       WHERE inventory_id = :item_id
         AND transaction_type = 'RECEIVE'
         AND remaining_quantity > 0
       ORDER BY transaction_date ASC, id ASC;

       -- Deduct from each batch sequentially until issue quantity is satisfied
       -- Update remaining_quantity on each consumed batch
       -- Record cost of goods issued (COGS) for the Accountant

  3. The FIFO Valuation Report shows:
       • Each batch: date received, quantity remaining, unit cost, batch value
       • Total inventory value = sum of (remaining_quantity × unit_cost) per batch
       • Cost of goods issued = sum of (issued_qty × unit_cost) per batch consumed

  Example:
  ┌──────────┬────────────┬──────┬────────────┬──────────────────┐
  │ Date     │ Type       │ Qty  │ Unit Cost  │ Remaining Qty    │
  ├──────────┼────────────┼──────┼────────────┼──────────────────┤
  │ Aug 1    │ RECEIVE    │ 100  │ 25.00 ETB  │ 80  (20 used)    │
  │ Aug 5    │ RECEIVE    │  50  │ 27.00 ETB  │ 50  (untouched)  │
  │ Aug 2    │ ISSUE  -20 │  20  │ deducted from Aug 1 batch     │
  └──────────┴────────────┴──────┴────────────┴──────────────────┘
  Current inventory value = (80 × 25.00) + (50 × 27.00) = 3,350 ETB

================================================================================

8. Indexes
━━━━━━━━━━━

  -- Frequently queried columns should be indexed for performance

  CREATE INDEX idx_inventories_category     ON inventories(category_id);
  CREATE INDEX idx_inventories_warehouse    ON inventories(warehouse_id);
  CREATE INDEX idx_inventories_status       ON inventories(status);
  CREATE INDEX idx_inventories_item_code    ON inventories(item_code);

  CREATE INDEX idx_stock_transactions_item  ON stock_transactions(inventory_id);
  CREATE INDEX idx_stock_transactions_type  ON stock_transactions(transaction_type);
  CREATE INDEX idx_stock_transactions_date  ON stock_transactions(transaction_date);
  CREATE INDEX idx_stock_transactions_fifo  ON stock_transactions(inventory_id, transaction_type, remaining_quantity);

  CREATE INDEX idx_damaged_items_inventory  ON damaged_items(inventory_id);
  CREATE INDEX idx_damaged_items_status     ON damaged_items(status);

  CREATE INDEX idx_audit_logs_user          ON audit_logs(user_id);
  CREATE INDEX idx_audit_logs_action        ON audit_logs(action);
  CREATE INDEX idx_audit_logs_created_at    ON audit_logs(created_at);

  CREATE INDEX idx_stock_takings_inventory  ON stock_takings(inventory_id);
  CREATE INDEX idx_stock_takings_status     ON stock_takings(status);

================================================================================
END OF DOCUMENT
================================================================================
