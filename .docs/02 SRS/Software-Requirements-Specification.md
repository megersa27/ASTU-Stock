================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Software Requirements Specification (SRS)

Project:  ASTU Stock Management System
Document: Software Requirements Specification
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  Chapter 1  — Introduction
  Chapter 2  — Overall Description of the Existing System
  Chapter 3  — Overall Description of the Proposed System
  Chapter 4  — Functional Requirements
  Chapter 5  — Non-Functional Requirements
  Chapter 6  — User Stories
  Chapter 7  — Use Cases
  Chapter 8  — Business Rules
  Chapter 9  — Data Requirements
  Chapter 10 — External Interface Requirements
  Chapter 11 — Acceptance Criteria
  Chapter 12 — Product Backlog
  Chapter 13 — Requirement Prioritization
  Chapter 14 — Requirement Traceability Matrix

================================================================================
CHAPTER 1 — INTRODUCTION
================================================================================

1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and
non-functional requirements of the ASTU Stock Management System. It serves as
the authoritative reference for system design, implementation, testing, and
acceptance activities throughout the project lifecycle.

1.2 Project Overview

The ASTU Stock Management System is a web-based application that automates
inventory management for Adama Science and Technology University. The system
replaces manual paper-based stock management with a centralized digital platform
supporting stock receiving, issuing, transfer, tracking, valuation, stock taking,
reconciliation, and reporting.

1.3 Scope

Version 1 of the system includes:

  • User authentication and role-based access control.
  • Dashboard with real-time inventory summary.
  • Inventory management.
  • Category management.
  • Supplier management.
  • Warehouse management.
  • Stock receiving with GRN generation.
  • Stock issuing with Issue Voucher generation.
  • Stock transfer between warehouses.
  • Stock taking and reconciliation.
  • Damaged and obsolete item management.
  • FIFO inventory valuation.
  • Bin card management.
  • Report generation.
  • Audit logging.

1.4 Intended Audience

  • Project supervisor and university advisor.
  • System analysts and architects.
  • Backend and frontend developers.
  • UI/UX designers.
  • Software testers.
  • System administrators.
  • University stakeholders.

1.5 Definitions and Acronyms

  ┌────────────┬─────────────────────────────────────────────────────────────┐
  │ Term       │ Definition                                                  │
  ├────────────┼─────────────────────────────────────────────────────────────┤
  │ SRS        │ Software Requirements Specification                         │
  │ SDLC       │ Software Development Life Cycle                             │
  │ RBAC       │ Role-Based Access Control                                   │
  │ FIFO       │ First In, First Out (inventory valuation method)            │
  │ PAO        │ Property Administration Officer                             │
  │ GRN        │ Goods Receiving Note                                        │
  │ FR         │ Functional Requirement                                      │
  │ NFR        │ Non-Functional Requirement                                  │
  │ BR         │ Business Rule                                               │
  │ UC         │ Use Case                                                    │
  │ API        │ Application Programming Interface                           │
  │ JWT        │ JSON Web Token                                              │
  │ CRUD       │ Create, Read, Update, Delete                                │
  │ MoFED      │ Ministry of Finance and Economic Development (Ethiopia)     │
  └────────────┴─────────────────────────────────────────────────────────────┘

1.6 References

  1. Ministry of Finance and Economic Development (MoFED). Stock Management
     Manual. Addis Ababa, Ethiopia, 2010.
  2. IEEE Computer Society. IEEE Recommended Practice for Software Requirements
     Specifications (IEEE 830-1998).
  3. Ian Sommerville. Software Engineering, 10th Edition. Pearson, 2015.

================================================================================
CHAPTER 2 — OVERALL DESCRIPTION OF THE EXISTING SYSTEM
================================================================================

2.1 Description

The existing inventory management system is based on manual procedures and
paper-based documentation following the MoFED Stock Management Manual. Departments
request materials using paper requisition forms. Storekeepers record all stock
movements using bin cards, stock record cards, goods receiving notes, and issue
vouchers.

2.2 Major Functions of the Existing System

  • Registration and classification of inventory items.
  • Receiving and inspection of goods from suppliers.
  • Storage and arrangement of inventory in warehouses.
  • Issuing materials to departments against approved requisitions.
  • Recording stock movement using bin cards and stock record cards.
  • Conducting annual physical stock taking and reconciliation.
  • Preparing inventory reports.
  • Managing damaged and obsolete items.
  • Monitoring minimum and maximum stock levels.

2.3 Actors in the Current System

  Property Administration Officer (PAO):
  Supervises all inventory activities. Approves stock requests, transfers, and
  reports. Holds the highest level of authority over inventory operations.

  Storekeeper:
  Receives, stores, issues, and safeguards inventory. Updates bin cards and
  maintains all warehouse records.

  Stock Clerk:
  Maintains stock records, updates inventory transactions, and prepares reports.

  Department Head:
  Approves requests from their department and ensures materials are used
  appropriately.

  Accountant:
  Records the financial value of inventory. Prepares financial reports and
  applies FIFO valuation.

  Security Officer:
  Controls movement of materials entering and leaving the organization.
  Verifies authorized gate passes for outgoing materials.

  Supplier:
  External party delivering goods to the organization's store.

2.4 Drawbacks of the Existing System

  • Heavy dependence on paper documents susceptible to loss and damage.
  • Time-consuming manual operations.
  • High probability of human error in recording and calculation.
  • Duplicate or missing records.
  • Delayed report generation.
  • Inaccurate FIFO valuation due to manual calculation.
  • No real-time visibility of inventory levels.
  • Lack of data security and audit trail.
  • Poor monitoring of damaged and obsolete items.
  • Difficulty monitoring reorder levels.
  • Poor inter-departmental communication.

2.5 Business Rules

  BR-01  Every inventory item must have a unique item code.
  BR-02  All received goods must be inspected before being stored.
  BR-03  Only authorized personnel can approve inventory transactions.
  BR-04  Inventory cannot be issued without an approved requisition form (reference number recorded on issue voucher).
  BR-05  Every inventory transaction must be recorded.
  BR-06  Every stock item must have a corresponding bin card and stock record card.
  BR-07  Stock records must be updated whenever goods are received or issued.
  BR-08  Inventory valuation must follow the FIFO principle.
  BR-09  Physical stock taking must be conducted at least once every fiscal year.
  BR-10  Damaged and obsolete items must be identified and reported separately.
  BR-11  Materials leaving the organization must have an authorized gate pass.
  BR-12  Stock discrepancies must be investigated and corrected.
  BR-13  Users are responsible for materials issued to their departments.
  BR-14  Reorder levels and safety stock must be maintained to avoid shortages.
  BR-15  Only authorized users can access inventory information.

================================================================================
CHAPTER 3 — OVERALL DESCRIPTION OF THE PROPOSED SYSTEM
================================================================================

3.1 Product Perspective

The proposed system is a three-tier web application:

  Presentation Layer:  React.js frontend accessed via web browser.
  Application Layer:   Node.js + Express.js REST API backend.
  Data Layer:          PostgreSQL relational database.

The frontend communicates with the backend exclusively through REST API calls.
The database is not directly accessible from the frontend.

3.2 Main Product Functions

  1.  User authentication and session management.
  2.  Role-based access control (7 roles).
  3.  Inventory management.
  4.  Category management.
  5.  Supplier management.
  6.  Warehouse management.
  7.  Stock receiving with GRN generation.
  8.  Stock issuing with Issue Voucher generation.
  9.  Stock transfer between warehouses.
  10. Stock taking and PAO approval workflow.
  11. Damaged and obsolete item management.
  12. FIFO inventory valuation engine.
  13. Digital bin card management.
  14. Stock control (reorder and safety stock monitoring).
  15. Report generation.
  16. Audit logging.

3.3 User Classes

  Administrator:     Full system access. Manages users, roles, and audit logs.
  PAO:               Approves transactions, disposals, and stock adjustments.
                     Views all reports and audit trail.
  Storekeeper:       Day-to-day stock operations. Receive, issue, transfer stock.
                     Manages inventory items and bin cards.
  Stock Clerk:       Updates stock records, conducts physical counts, prepares reports.
  Accountant:        Views FIFO valuation reports and financial summaries.
  Department Head:   Approves departmental requisitions. Views stock availability.
  Security Officer:  Views gate pass and outgoing transaction information.

3.4 Operating Environment

  Frontend:  React.js, modern web browser, HTML, CSS, JavaScript.
  Backend:   Node.js, Express.js.
  Database:  PostgreSQL.
  Auth:      JWT + bcrypt.
  Dev Tools: VS Code, Git, GitHub, Postman.
  Deploy:    Docker, Docker Compose, cloud hosting.

3.5 Constraints

  • Development period limited to internship duration.
  • Budget limited to 12,000 ETB.
  • Team experience is at student intern level.
  • Internet availability affects deployment testing.

3.6 Assumptions

  • All authorized users have access to a web browser and internet connection.
  • Users will receive basic training before using the system.
  • Inventory data will be entered accurately by trained staff.
  • Required server infrastructure will be available for deployment.

================================================================================
CHAPTER 4 — FUNCTIONAL REQUIREMENTS
================================================================================

4.1 Authentication Requirements

  FR-AUTH-001  The system shall allow registered users to log in using valid credentials.
  FR-AUTH-002  The system shall reject invalid login credentials with an error message.
  FR-AUTH-003  The system shall allow authenticated users to log out.
  FR-AUTH-004  The system shall prevent unauthenticated users from accessing protected pages.
  FR-AUTH-005  The system shall enforce role-based access to all protected functionality.
  FR-AUTH-006  The system shall store user passwords as bcrypt hashes. Plain text storage is prohibited.
  FR-AUTH-007  The system shall invalidate user sessions upon logout.

4.2 User Management

  FR-USER-001  The Administrator shall be able to create a user account.
  FR-USER-002  The Administrator shall be able to view all registered users.
  FR-USER-003  The Administrator shall be able to update user information.
  FR-USER-004  The Administrator shall be able to deactivate a user account.
  FR-USER-005  The Administrator shall be able to assign a role to a user.
  FR-USER-006  Deactivated users shall not be able to log into the system.
  FR-USER-007  The system shall prevent unauthorized users from managing other users.

4.3 Dashboard

  FR-DASH-001  The system shall display the total number of inventory items.
  FR-DASH-002  The system shall display current available stock summary.
  FR-DASH-003  The system shall display items at or below minimum stock level.
  FR-DASH-004  The system shall display a feed of recent stock transactions.
  FR-DASH-005  The PAO dashboard shall display a count of pending approval actions.
  FR-DASH-006  Dashboard content shall be filtered according to the user's role.

4.4 Inventory Management

  FR-INV-001   Authorized users shall be able to add a new inventory item.
  FR-INV-002   Authorized users shall be able to view inventory items.
  FR-INV-003   Authorized users shall be able to update inventory information.
  FR-INV-004   Authorized users shall be able to delete an inventory item when permitted.
  FR-INV-005   The system shall assign a unique item code to each inventory item.
  FR-INV-006   The system shall store item name, category, warehouse, unit, quantity,
               minimum level, maximum level, reorder level, and safety stock.
  FR-INV-007   The system shall allow users to search inventory by name or item code.
  FR-INV-008   The system shall allow filtering by category, warehouse, and status.
  FR-INV-009   Inventory quantity shall never be allowed to fall below zero.

4.5 Category Management

  FR-CAT-001   Authorized users shall be able to create inventory categories.
  FR-CAT-002   Authorized users shall be able to view all categories.
  FR-CAT-003   Authorized users shall be able to update category information.
  FR-CAT-004   Authorized users shall be able to delete categories when permitted.
  FR-CAT-005   Category codes shall follow the MoFED classification system (4401–4418).
  FR-CAT-006   The system shall prevent duplicate category codes.

4.6 Supplier Management

  FR-SUP-001   Authorized users shall be able to register suppliers.
  FR-SUP-002   Users shall be able to view supplier information.
  FR-SUP-003   Authorized users shall be able to update supplier information.
  FR-SUP-004   Authorized users shall be able to remove suppliers when permitted.
  FR-SUP-005   The system shall store supplier name, contact person, phone, email,
               and address.

4.7 Warehouse Management

  FR-WH-001    The system shall support registration of one or more warehouses.
  FR-WH-002    Each inventory item shall be associated with a warehouse location.
  FR-WH-003    Authorized users shall be able to view stock levels per warehouse.
  FR-WH-004    Stock transfers between warehouses shall update quantities in both locations.

4.8 Stock Receiving

  FR-REC-001   Authorized users shall be able to record received stock.
  FR-REC-002   The system shall record item, quantity, unit cost, supplier, receiving date,
               and reference number for each receipt.
  FR-REC-003   The system shall increase inventory quantity upon a successful receipt.
  FR-REC-004   The system shall automatically generate a Goods Receiving Note (GRN)
               for each receipt transaction.
  FR-REC-005   The system shall record unit cost per receiving batch for FIFO calculation.
  FR-REC-006   Every stock receipt shall be recorded in the transaction history.

4.9 Stock Issuing

  FR-ISS-001   Authorized users shall be able to issue stock.
  FR-ISS-002   The system shall record item, quantity, department, recipient name,
               issue date, and reference number for each issue.
  FR-ISS-003   The system shall decrease inventory quantity upon a successful issue.
  FR-ISS-004   The system shall prevent issuing a quantity greater than available stock.
  FR-ISS-005   The system shall automatically generate an Issue Voucher for each
               issue transaction.
  FR-ISS-006   The system shall apply FIFO logic when calculating the cost of issued stock.
  FR-ISS-007   Every stock issue shall be recorded in the transaction history.

4.10 Stock Transfer

  FR-TRANS-001  Authorized users shall be able to transfer stock between warehouses.
  FR-TRANS-002  The system shall record source warehouse, destination warehouse, item,
                quantity, date, and responsible user for each transfer.
  FR-TRANS-003  The system shall decrease the source warehouse quantity upon transfer.
  FR-TRANS-004  The system shall increase the destination warehouse quantity upon transfer.
  FR-TRANS-005  The system shall prevent a transfer if the source warehouse has
                insufficient stock.
  FR-TRANS-006  Every stock transfer shall be recorded in the transaction history.

4.11 Stock Control

  FR-CTRL-001  Each inventory item shall have configurable minimum, maximum, reorder,
               and safety stock levels.
  FR-CTRL-002  The system shall flag items that fall at or below the reorder level.
  FR-CTRL-003  The dashboard shall display a low-stock alert for items at or below
               the minimum stock level.
  FR-CTRL-004  The system shall generate a reorder report listing all items
               requiring replenishment.

4.12 Stock Taking and Reconciliation

  FR-STOCK-001  Authorized users shall be able to record a physical stock count
                for any inventory item.
  FR-STOCK-002  The system shall display the current system quantity alongside the
                physical count entry field.
  FR-STOCK-003  The system shall calculate the variance between the physical count
                and the system quantity.
  FR-STOCK-004  The storekeeper shall be able to submit a stock count for PAO approval.
  FR-STOCK-005  The PAO shall be able to approve or reject a submitted stock adjustment.
  FR-STOCK-006  Upon PAO approval, the system shall update the inventory quantity
                to the physical count value.
  FR-STOCK-007  Every stock adjustment shall be recorded with justification, old value,
                new value, and responsible users.
  FR-STOCK-008  The system shall generate a reconciliation report for any completed
                stock taking session.
  FR-STOCK-009  The system shall support annual stock taking as required by BR-09.

4.13 Damaged and Obsolete Item Management

  FR-DAM-001   Authorized users shall be able to flag an inventory item as
               Damaged or Obsolete.
  FR-DAM-002   The system shall support the following item lifecycle states:
               Available → Reserved → Issued → Damaged → Obsolete → Disposed.
  FR-DAM-003   Damaged and obsolete items shall be tracked separately from active
               inventory and excluded from available stock calculations.
  FR-DAM-004   The PAO shall be able to approve or reject disposal of flagged items.
  FR-DAM-005   Upon disposal approval, the system shall remove the item from active
               inventory and record the disposal in the audit log.
  FR-DAM-006   The system shall generate a damaged and obsolete items report.

4.14 Bin Card Management

  FR-BIN-001   The system shall maintain a digital bin card for each inventory item
               recording every receipt and issue transaction with a running balance.
  FR-BIN-002   Each bin card entry shall display: date, reference number, quantity in,
               quantity out, and running balance.
  FR-BIN-003   The bin card shall be automatically updated on every stock receiving,
               issuing, or adjustment transaction.
  FR-BIN-004   Authorized users shall be able to view and print the bin card for any item.
  FR-BIN-005   The bin card shall support filtering by date range.

4.15 FIFO Inventory Valuation

  FR-FIFO-001  The system shall implement FIFO as the mandatory inventory valuation
               method, as required by BR-08 and the MoFED manual.
  FR-FIFO-002  Each stock receipt shall record the unit cost of the received batch.
  FR-FIFO-003  When stock is issued, the system shall deduct from the oldest
               received batch first.
  FR-FIFO-004  The system shall calculate and display the current inventory value
               using FIFO batch costs.
  FR-FIFO-005  The system shall generate a FIFO valuation report showing remaining
               batch quantities, unit costs, and total inventory value per item.

4.16 Document Generation

  FR-DOC-001   The system shall automatically generate a Goods Receiving Note (GRN)
               for each stock receipt, including: date, supplier, item, quantity,
               unit cost, total value, and receiving officer.
  FR-DOC-002   The system shall automatically generate an Issue Voucher for each
               stock issue, including: date, item, quantity, department, recipient,
               and issuing officer.
  FR-DOC-003   All generated documents shall be printable and exportable.

4.17 Report Management

  FR-REPORT-001  The system shall generate an inventory summary report.
  FR-REPORT-002  The system shall generate a stock movement report.
  FR-REPORT-003  The system shall generate a low-stock report.
  FR-REPORT-004  The system shall generate a FIFO valuation report.
  FR-REPORT-005  The system shall generate a damaged and obsolete items report.
  FR-REPORT-006  The system shall generate a stock taking and reconciliation report.
  FR-REPORT-007  The system shall generate an audit activity report.
  FR-REPORT-008  All reports shall be filterable by date range.
  FR-REPORT-009  Report access shall be restricted according to user role.

4.18 Audit Logging

  FR-AUDIT-001  The system shall automatically record an audit log entry for every
               significant user action, including: login, logout, add item,
               update item, delete item, receive stock, issue stock, transfer stock,
               stock adjustment, user management, and disposal approval.
  FR-AUDIT-002  Each audit log entry shall record: timestamp, user ID, action type,
               affected entity, old value, and new value.
  FR-AUDIT-003  Audit logs shall be read-only. No user shall be able to modify or
               delete audit log entries.
  FR-AUDIT-004  Authorized users (Administrator, PAO) shall be able to view and filter
               audit logs by date, user, and action type.
  FR-AUDIT-005  The system shall generate an audit report for any specified date range.

================================================================================
CHAPTER 5 — NON-FUNCTIONAL REQUIREMENTS
================================================================================

5.1 Security

  NFR-SEC-001  All users shall authenticate before accessing any protected resource.
  NFR-SEC-002  The system shall enforce role-based access control on every operation.
  NFR-SEC-003  User passwords shall be hashed using bcrypt. Plain text storage is
               strictly prohibited.
  NFR-SEC-004  All user inputs shall be validated on both the frontend and backend.
  NFR-SEC-005  Unauthorized users shall receive a 403 response for restricted resources.
  NFR-SEC-006  Audit logs shall be immutable and append-only.
  NFR-SEC-007  Database credentials, JWT secrets, and all sensitive configuration values
               shall be stored in environment variables and never committed to version
               control.

5.2 Performance

  NFR-PERF-001  The system shall respond within 3 seconds for all standard inventory
                operations under normal load.
  NFR-PERF-002  Database queries shall use indexes on frequently queried columns
                to prevent unnecessary delays.
  NFR-PERF-003  The API shall return appropriate loading indicators to the frontend
                for all asynchronous operations.

5.3 Usability

  NFR-USE-001  The system shall provide clear, consistent navigation appropriate for
               non-technical store staff.
  NFR-USE-002  The interface shall use consistent design patterns across all modules.
  NFR-USE-003  Error messages shall be descriptive and actionable.
  NFR-USE-004  Common tasks shall require a minimal number of steps.
  NFR-USE-005  The system shall provide immediate feedback after every significant action.

5.4 Reliability

  NFR-REL-001  The system shall handle errors without crashing or exposing internal
               information to the user.
  NFR-REL-002  Stock quantity updates shall be ACID-compliant to maintain integrity.
  NFR-REL-003  FIFO valuation calculations shall produce consistent and reproducible
               results.
  NFR-REL-004  The system shall never allow inventory quantity to become negative.

5.5 Availability

  NFR-AVAIL-001  The deployed system shall be available 24 hours a day subject to
                 hosting uptime.
  NFR-AVAIL-002  Database backup mechanisms shall be provided to prevent data loss.

5.6 Scalability

  NFR-SCAL-001  The architecture shall support additional users, departments, and
                inventory volume without redesign.
  NFR-SCAL-002  The system shall support multiple warehouses and concurrent users
                without data integrity degradation.
  NFR-SCAL-003  Additional modules shall be integrable without requiring a complete
                system redesign.

5.7 Maintainability

  NFR-MAIN-001  The backend codebase shall use a modular MVC structure with clear
                separation of routes, controllers, services, and models.
  NFR-MAIN-002  The frontend codebase shall use a component-based architecture with
                reusable components, services, and hooks.
  NFR-MAIN-003  The project shall use Git for version control with meaningful commit
                messages.
  NFR-MAIN-004  The project shall use GitHub for source code collaboration.
  NFR-MAIN-005  All API endpoints shall follow RESTful conventions and be documented.

5.8 Portability

  NFR-PORT-001  The application shall be containerized with Docker for consistent
                deployment across different environments.
  NFR-PORT-002  A docker-compose.yml shall be provided enabling the full system
                (frontend, backend, database) to be started with a single command.

================================================================================
CHAPTER 6 — USER STORIES
================================================================================

  Authentication
  US-001  As a user, I want to log in so that I can securely access the system.
  US-002  As a user, I want to log out so that my account is protected when I finish.

  User Management
  US-003  As an Administrator, I want to create users so that authorized staff can
          access the system.
  US-004  As an Administrator, I want to assign roles so that users access only
          permitted functionality.

  Inventory
  US-005  As a Storekeeper, I want to add inventory items so that I can maintain
          accurate stock records.
  US-006  As a Storekeeper, I want to edit inventory information so that incorrect
          records can be corrected.
  US-007  As a Storekeeper, I want to search inventory so that I can quickly find
          a specific item.
  US-008  As a Storekeeper, I want to view the digital bin card for an item so
          that I can see its complete transaction history and running balance.

  Stock Transactions
  US-009  As a Storekeeper, I want to record received stock so that inventory
          quantities remain accurate and a GRN is generated.
  US-010  As a Storekeeper, I want to issue stock so that the transaction is
          recorded and an Issue Voucher is generated.
  US-011  As a Storekeeper, I want the system to prevent issuing more than
          available stock so that inventory accuracy is maintained.
  US-012  As a Storekeeper, I want to transfer stock between warehouses so that
          quantities are accurately reflected at both locations.

  Stock Taking
  US-013  As a Storekeeper, I want to record a physical count so that discrepancies
          can be identified and submitted for approval.
  US-014  As a PAO, I want to approve stock adjustments so that inventory is
          corrected based on verified physical counts.

  Damaged / Obsolete
  US-015  As a Storekeeper, I want to flag damaged items so that they are excluded
          from active inventory and reported.
  US-016  As a PAO, I want to approve disposals so that damaged items are formally
          removed from inventory records.

  Reports
  US-017  As a Manager, I want to view inventory reports so that I can monitor
          stock levels and make decisions.
  US-018  As an Accountant, I want to view the FIFO valuation report so that I
          can support financial reporting.
  US-019  As an Administrator, I want to view the audit log so that I can
          investigate any suspicious or erroneous activity.

================================================================================
CHAPTER 7 — USE CASES
================================================================================

7.1 Actor Identification

  Administrator, PAO, Storekeeper, Stock Clerk, Accountant,
  Department Head, Security Officer, Supplier.

7.2 Use Case List

  ┌─────────┬──────────────────────────────────────┬─────────────────────────────┐
  │ ID      │ Use Case                             │ Primary Actor               │
  ├─────────┼──────────────────────────────────────┼─────────────────────────────┤
  │ UC-001  │ Login                                │ All users                   │
  │ UC-002  │ Logout                               │ All users                   │
  │ UC-003  │ Manage Users                         │ Administrator               │
  │ UC-004  │ Manage Inventory                     │ Storekeeper                 │
  │ UC-005  │ Manage Categories                    │ Storekeeper                 │
  │ UC-006  │ Manage Suppliers                     │ Storekeeper                 │
  │ UC-007  │ Manage Warehouses                    │ Administrator / PAO         │
  │ UC-008  │ Receive Stock                        │ Storekeeper                 │
  │ UC-009  │ Issue Stock                          │ Storekeeper                 │
  │ UC-010  │ Transfer Stock                       │ Storekeeper                 │
  │ UC-011  │ Track Inventory / View Bin Card      │ Storekeeper / Stock Clerk   │
  │ UC-012  │ Monitor Stock Levels                 │ Storekeeper / PAO           │
  │ UC-013  │ Generate Reports                     │ Authorized users            │
  │ UC-014  │ Conduct Stock Taking                 │ Storekeeper / Stock Clerk   │
  │ UC-015  │ Approve Stock Adjustment             │ PAO                         │
  │ UC-016  │ Manage Damaged / Obsolete Items      │ Storekeeper / PAO           │
  │ UC-017  │ Approve Disposal                     │ PAO                         │
  │ UC-018  │ View FIFO Valuation Report           │ Accountant / PAO            │
  │ UC-019  │ View Audit Log                       │ Administrator / PAO         │
  │ UC-020  │ View Dashboard                       │ All authorized users        │
  └─────────┴──────────────────────────────────────┴─────────────────────────────┘

7.3 Use Case Descriptions

────────────────────────────────────────────────────────────────────────────────
UC-001: Login
────────────────────────────────────────────────────────────────────────────────
Actor:          All users
Precondition:   User account exists and is active.
Main Flow:
  1. User navigates to the login page.
  2. User enters email and password.
  3. System validates credentials against the database.
  4. System generates a JWT token and establishes a session.
  5. System redirects the user to the role-appropriate dashboard.
Alternative Flow (Invalid credentials):
  3a. System rejects the login and displays an error message.
  3b. User may retry.
Postcondition:  Authenticated user accesses the system with role-based permissions.

────────────────────────────────────────────────────────────────────────────────
UC-008: Receive Stock
────────────────────────────────────────────────────────────────────────────────
Actor:          Storekeeper
Precondition:   Supplier has delivered goods. User is authenticated and authorized.
Main Flow:
  1. Storekeeper opens the Receive Stock form.
  2. Storekeeper selects inventory item, supplier, enters quantity, unit cost,
     receiving date, and reference number.
  3. System validates all required fields.
  4. System creates a RECEIVE stock transaction record.
  5. System increases the inventory quantity.
  6. System records unit cost for FIFO batch tracking.
  7. System generates and saves a Goods Receiving Note (GRN).
  8. System records an audit log entry.
  9. System displays a success confirmation.
Alternative Flow (Validation failure):
  3a. System displays field-level validation errors.
  3b. User corrects the input and resubmits.
Postcondition:  Inventory quantity increased. GRN generated. Transaction recorded.

────────────────────────────────────────────────────────────────────────────────
UC-009: Issue Stock
────────────────────────────────────────────────────────────────────────────────
Actor:          Storekeeper
Precondition:   An approved requisition exists. User is authenticated and authorized.
Main Flow:
  1. Storekeeper opens the Issue Stock form.
  2. Storekeeper selects inventory item, enters quantity, department,
     recipient name, approved requisition reference number, and issue date.
  3. System verifies the requested quantity does not exceed available stock.
  4. System applies FIFO logic to calculate the cost of the issued stock.
  5. System creates an ISSUE stock transaction record (with reference_number).
  6. System decreases the inventory quantity.
  7. System generates and saves an Issue Voucher.
  8. System records an audit log entry.
  9. System displays a success confirmation.
Alternative Flow (Insufficient stock):
  3a. System displays an insufficient stock error.
  3b. User adjusts the quantity or cancels.
Postcondition:  Inventory quantity decreased. Issue Voucher generated. Transaction recorded.

────────────────────────────────────────────────────────────────────────────────
UC-010: Transfer Stock
────────────────────────────────────────────────────────────────────────────────
Actor:          Storekeeper
Precondition:   Sufficient stock exists at source warehouse.
Main Flow:
  1. Storekeeper selects source warehouse, destination warehouse, item,
     transfer quantity, and date.
  2. System validates that the source warehouse has sufficient stock.
  3. System creates a TRANSFER_OUT transaction for the source warehouse.
  4. System creates a TRANSFER_IN transaction for the destination warehouse.
  5. System updates quantities at both warehouses.
  6. System records an audit log entry.
  7. System displays a success confirmation.
Alternative Flow (Insufficient stock at source):
  2a. System displays an insufficient stock error.
  2b. User corrects the quantity or cancels.
Postcondition:  Stock quantities updated at both warehouses. Transfer recorded.

────────────────────────────────────────────────────────────────────────────────
UC-014: Conduct Stock Taking
────────────────────────────────────────────────────────────────────────────────
Actor:          Storekeeper / Stock Clerk (count), PAO (approval)
Precondition:   User is authenticated and authorized.
Main Flow:
  1. User opens the Stock Taking module.
  2. User selects an inventory item.
  3. System displays the current system quantity.
  4. User enters the physical count quantity.
  5. System calculates and displays the variance.
  6. User enters notes explaining any discrepancy.
  7. User submits the count for PAO approval.
  8. PAO reviews the count, system quantity, physical quantity, variance, and notes.
  9. PAO approves the adjustment.
  10. System updates the inventory quantity to the physical count value.
  11. System records a ADJUSTMENT stock transaction.
  12. System records an audit log entry.
  13. System generates a reconciliation report.
Alternative Flow (PAO rejects adjustment):
  9a. PAO rejects with comments.
  9b. Record is returned to storekeeper for review and resubmission.
Postcondition:  Inventory quantity corrected. Reconciliation report generated.

────────────────────────────────────────────────────────────────────────────────
UC-016: Manage Damaged / Obsolete Items
────────────────────────────────────────────────────────────────────────────────
Actor:          Storekeeper (report), PAO (approve disposal)
Precondition:   Item exists in active inventory.
Main Flow:
  1. Storekeeper selects an inventory item and flags it as Damaged or Obsolete.
  2. Storekeeper enters quantity affected and description.
  3. System changes item status to Damaged or Obsolete.
  4. Item is removed from available stock calculations.
  5. PAO reviews the flagged item.
  6. PAO approves the disposal.
  7. System marks the item as Disposed.
  8. System records an audit log entry.
  9. System generates a disposal report.
Alternative Flow (PAO rejects disposal):
  6a. PAO rejects the disposal.
  6b. Item status reverts to Available.
Postcondition:  Item removed from active inventory. Disposal recorded.

================================================================================
CHAPTER 8 — BUSINESS RULES
================================================================================

  BR-01  Every inventory item must have a unique item code.
  BR-02  All received goods must be inspected before being stored.
  BR-03  Only authorized personnel can approve inventory transactions.
  BR-04  Inventory cannot be issued without an approved requisition form (reference number recorded on issue voucher).
  BR-05  Every inventory transaction must be recorded.
  BR-06  Every stock item must have a corresponding bin card and stock record card.
  BR-07  Stock records must be updated whenever goods are received or issued.
  BR-08  Inventory valuation must follow the FIFO (First In, First Out) principle.
  BR-09  Physical stock taking must be conducted at least once every fiscal year.
  BR-10  Damaged and obsolete items must be identified and reported separately.
  BR-11  Materials leaving the organization must have an authorized gate pass.
  BR-12  Stock discrepancies must be investigated and corrected.
  BR-13  Users are responsible for materials issued to their departments.
  BR-14  Reorder levels and safety stock must be maintained to avoid stock shortages.
  BR-15  Only authorized users can access inventory information.

================================================================================
CHAPTER 9 — DATA REQUIREMENTS
================================================================================

9.1 User Data

  user_id, full_name, email, password_hash, role_id, department, phone,
  status (active/inactive), created_by, created_at, updated_at.

9.2 Role Data

  role_id, name, description.
  Values: admin, pao, storekeeper, stock_clerk, accountant, dept_head,
  security_officer.

9.3 Inventory Data

  inventory_id, item_code, name, description, category_id, warehouse_id,
  unit, quantity, minimum_level, maximum_level, reorder_level, safety_stock,
  unit_cost, status, created_by, created_at, updated_at.
  Status values: available, reserved, damaged, obsolete, disposed.

9.4 Category Data

  category_id, code (MoFED 4401–4418), name, description, created_at.

9.5 Supplier Data

  supplier_id, name, contact_person, phone, email, address, status, created_at.

9.6 Warehouse Data

  warehouse_id, name, location, description, status, created_at.

9.7 Stock Transaction Data

  transaction_id, transaction_type (RECEIVE/ISSUE/TRANSFER_OUT/TRANSFER_IN/
  ADJUSTMENT/DISPOSAL), inventory_id, quantity, unit_cost, total_value,
  source_warehouse_id, dest_warehouse_id, supplier_id, department,
  recipient_name, reference_number, approved_by, performed_by,
  transaction_date, notes, created_at.

9.8 Stock Taking Data

  stock_taking_id, inventory_id, system_quantity, physical_quantity,
  variance (computed), counted_by, approved_by, status (pending/approved/rejected),
  notes, count_date, approved_at.

9.9 Audit Log Data

  log_id, user_id, action, entity_type, entity_id, old_values (JSON),
  new_values (JSON), ip_address, created_at.
  Constraint: append-only. No update or delete permitted.

================================================================================
CHAPTER 10 — EXTERNAL INTERFACE REQUIREMENTS
================================================================================

10.1 User Interface

  Required pages:
  • Login page.
  • Dashboard (role-specific).
  • Inventory list, add item, edit item, item details, bin card view.
  • Receive stock, issue stock, transfer stock, stock history.
  • Stock taking, pending approvals.
  • Damaged / obsolete items list, report form.
  • Warehouse list and detail.
  • Supplier list and forms.
  • Categories list and forms.
  • Reports page (all report types).
  • User management page.
  • Audit log page.

10.2 Software Interfaces

  The React frontend communicates with the Express backend through REST API
  over HTTP/HTTPS. All request and response bodies use JSON format.

  API Base URL:  /api
  Auth:          Bearer token in Authorization header.

  Example communication flow:
  React Component → Service → HTTP Request → Express Route → Controller
  → Service → PostgreSQL → Response → UI Update.

10.3 Hardware Interface

  The system requires no specialized hardware. Users access it via:
  • Desktop computers or laptops.
  • Supported web browsers (Chrome, Firefox, Edge).

10.4 Network Interface

  • HTTP/HTTPS communication between client and server.
  • HTTPS with TLS is required in production.
  • All sensitive data transmitted over encrypted connections only.

================================================================================
CHAPTER 11 — ACCEPTANCE CRITERIA
================================================================================

Authentication:
  • Valid credentials grant access to the role-appropriate dashboard.
  • Invalid credentials are rejected with a clear error message.
  • Unauthenticated requests to protected pages are redirected to login.
  • A user with an inactive account cannot log in.

Inventory Management:
  • An authorized user can add an item with all required fields.
  • Duplicate item codes are rejected.
  • The system correctly searches and filters inventory items.
  • Inventory quantity never falls below zero.

Stock Receiving:
  • A storekeeper can record a receipt with all required fields.
  • Inventory quantity increases by the received amount.
  • A GRN is generated and the transaction appears in history.
  • Unit cost is saved with the batch for FIFO calculation.

Stock Issuing:
  • A storekeeper can record an issue with all required fields.
  • Inventory quantity decreases by the issued amount.
  • An Issue Voucher is generated and the transaction appears in history.
  • A request to issue more than available stock is rejected.
  • FIFO logic deducts from the oldest batch first.

Stock Transfer:
  • Source warehouse quantity decreases by the transferred amount.
  • Destination warehouse quantity increases by the transferred amount.
  • A transfer request where source quantity is insufficient is rejected.

Stock Taking:
  • Physical count can be entered alongside the current system quantity.
  • Variance is correctly calculated.
  • PAO can approve or reject the adjustment.
  • Approved adjustment updates the inventory quantity.
  • A reconciliation report is generated.

Damaged / Obsolete:
  • Flagged items are removed from active inventory calculations.
  • PAO approval is required before disposal.
  • Disposed items are removed from active inventory and recorded.

FIFO Valuation:
  • Inventory value is calculated correctly using batch costs.
  • FIFO valuation report shows correct per-batch breakdown.

Audit Log:
  • Every significant action creates an audit log entry.
  • Audit log entries cannot be modified or deleted.
  • Administrator and PAO can filter and view audit logs.

Role-Based Access:
  • Each user role can access only the functions permitted in the RBAC matrix.
  • Unauthorized access attempts receive a 403 response.

================================================================================
CHAPTER 12 — PRODUCT BACKLOG
================================================================================

  ┌──────────┬──────────────────────────────────────────────┬──────────┐
  │ ID       │ Backlog Item                                 │ Priority │
  ├──────────┼──────────────────────────────────────────────┼──────────┤
  │ PB-001   │ User authentication                          │ High     │
  │ PB-002   │ User management                              │ High     │
  │ PB-003   │ Role management                              │ High     │
  │ PB-004   │ Dashboard                                    │ High     │
  │ PB-005   │ Inventory CRUD                               │ High     │
  │ PB-006   │ Category management                          │ High     │
  │ PB-007   │ Supplier management                          │ Medium   │
  │ PB-008   │ Warehouse management                         │ Medium   │
  │ PB-009   │ Stock receiving with GRN generation          │ High     │
  │ PB-010   │ Stock issuing with Issue Voucher generation  │ High     │
  │ PB-011   │ Stock transfer module                        │ High     │
  │ PB-012   │ Stock taking and reconciliation              │ High     │
  │ PB-013   │ PAO approval workflow                        │ High     │
  │ PB-014   │ Damaged and obsolete item management         │ High     │
  │ PB-015   │ Bin card management                          │ High     │
  │ PB-016   │ FIFO valuation engine                        │ High     │
  │ PB-017   │ Stock control and reorder alerts             │ High     │
  │ PB-018   │ Core reports                                 │ High     │
  │ PB-019   │ FIFO valuation report                        │ Medium   │
  │ PB-020   │ Damaged/obsolete report                      │ Medium   │
  │ PB-021   │ Stock taking report                          │ Medium   │
  │ PB-022   │ Audit logging                                │ High     │
  │ PB-023   │ Audit log report                             │ Medium   │
  │ PB-024   │ Search and filtering                         │ High     │
  │ PB-025   │ Input validation (frontend and backend)      │ High     │
  │ PB-026   │ Error handling                               │ High     │
  │ PB-027   │ Unit and integration testing                 │ High     │
  │ PB-028   │ Dockerization                                │ High     │
  │ PB-029   │ Deployment                                   │ High     │
  └──────────┴──────────────────────────────────────────────┴──────────┘

================================================================================
CHAPTER 13 — REQUIREMENT PRIORITIZATION (MoSCoW)
================================================================================

Must Have (Required for MVP):
  Authentication, user and role management, inventory CRUD, categories,
  suppliers, stock receiving with GRN, stock issuing with Issue Voucher,
  stock transfer, stock taking and PAO approval, damaged/obsolete management,
  FIFO valuation engine, bin card management, stock control alerts,
  core reports, audit logging, Dockerization, deployment.

Should Have (Important but not blocking MVP):
  Advanced filtering, report export (PDF/Excel), email notifications,
  FIFO valuation report, improved dashboard visualizations.

Could Have (Useful additions):
  Barcode/QR code support, advanced analytics, additional dashboard charts.

Will Not Have in Version 1:
  Mobile application, AI forecasting, multi-campus management,
  external ERP integration, offline synchronization.

================================================================================
CHAPTER 14 — REQUIREMENT TRACEABILITY MATRIX
================================================================================

  ┌─────────────────┬──────────────────────────┬───────────┬─────────────────┐
  │ Requirement     │ Business Rule / Source   │ Use Case  │ Test Case       │
  ├─────────────────┼──────────────────────────┼───────────┼─────────────────┤
  │ FR-AUTH-001     │ BR-15                    │ UC-001    │ TC-AUTH-001     │
  │ FR-INV-005      │ BR-01                    │ UC-004    │ TC-INV-005      │
  │ FR-REC-001      │ BR-05, BR-07             │ UC-008    │ TC-REC-001      │
  │ FR-REC-004      │ BR-05                    │ UC-008    │ TC-REC-004      │
  │ FR-REC-005      │ BR-08                    │ UC-008    │ TC-FIFO-001     │
  │ FR-ISS-004      │ BR-04                    │ UC-009    │ TC-ISS-004      │
  │ FR-ISS-006      │ BR-08                    │ UC-009    │ TC-FIFO-002     │
  │ FR-TRANS-001    │ BR-05, workflow step 14  │ UC-010    │ TC-TRANS-001    │
  │ FR-STOCK-001    │ BR-09, workflow step 16  │ UC-014    │ TC-STOCK-001    │
  │ FR-STOCK-005    │ BR-03, BR-12             │ UC-015    │ TC-STOCK-005    │
  │ FR-DAM-001      │ BR-10, workflow step 15  │ UC-016    │ TC-DAM-001      │
  │ FR-DAM-004      │ BR-03                    │ UC-017    │ TC-DAM-004      │
  │ FR-BIN-001      │ BR-06, BR-07             │ UC-011    │ TC-BIN-001      │
  │ FR-FIFO-001     │ BR-08                    │ UC-018    │ TC-FIFO-001     │
  │ FR-WH-001       │ workflow step 7          │ UC-007    │ TC-WH-001       │
  │ FR-AUDIT-001    │ BR-05, BR-15             │ UC-019    │ TC-AUDIT-001    │
  │ FR-AUDIT-003    │ BR-03                    │ UC-019    │ TC-AUDIT-003    │
  │ FR-CTRL-002     │ BR-14, workflow step 13  │ UC-020    │ TC-CTRL-001     │
  │ NFR-SEC-003     │ BR-15                    │ UC-001    │ TC-SEC-003      │
  │ NFR-SEC-007     │ BR-15                    │ —         │ TC-SEC-007      │
  │ NFR-REL-004     │ BR-08                    │ UC-009    │ TC-REL-004      │
  └─────────────────┴──────────────────────────┴───────────┴─────────────────┘

================================================================================
END OF DOCUMENT
================================================================================
