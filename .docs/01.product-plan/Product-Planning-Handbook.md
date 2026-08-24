================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Product Planning Handbook

Author:   Megersa Tekalign Senbeta
Project:  ASTU Stock Management System
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  Chapter 1  — Introduction
  Chapter 2  — Product Vision
  Chapter 3  — Project Charter
  Chapter 4  — Stakeholder Analysis
  Chapter 5  — User Research
  Chapter 6  — Competitor Analysis
  Chapter 7  — SWOT Analysis
  Chapter 8  — Product Scope
  Chapter 9  — Product Goals
  Chapter 10 — Functional Feature List
  Chapter 11 — Non-Functional Requirements (Overview)
  Chapter 12 — Minimum Viable Product (MVP)
  Chapter 13 — Product Roadmap
  Chapter 14 — Risk Analysis
  Chapter 15 — Technology Decisions
  Chapter 16 — Agile Planning
  Chapter 17 — Success Metrics
  Chapter 18 — Development Standards
  Chapter 19 — Feasibility Study
  Chapter 20 — Team Composition
  Chapter 21 — Testing Procedure
  Chapter 22 — Existing System Description
  Chapter 23 — Complete Stock Management Workflow

================================================================================
CHAPTER 1 — INTRODUCTION
================================================================================

1.1 Purpose of the Document

This document presents the product planning for the ASTU Stock Management System.
It establishes the project foundation, defines the business problem, and provides
the overall direction for development. It serves as the primary reference for the
project team throughout the Software Development Life Cycle (SDLC).

1.2 Project Overview

The ASTU Stock Management System is a web-based application designed to help
Adama Science and Technology University manage its inventory efficiently. The system
enables authorized users to record, monitor, and manage stock items through a
centralized digital platform, replacing manual inventory management with a secure,
role-based solution.

The project is developed following the SDLC using Agile methodology.

1.3 Business Background

Universities purchase and distribute many types of items including laboratory
equipment, office supplies, furniture, computers, and institutional assets. Manual
inventory management using paper records introduces problems including inaccurate
records, reporting delays, and difficulty tracking stock movement. A digital stock
management system addresses these inefficiencies and provides accurate information
for decision-making.

1.4 Problem Statement

The current inventory management process at ASTU experiences the following challenges:

  • Manual recording of stock information.
  • Difficulty tracking available inventory in real time.
  • Human errors during data entry and calculations.
  • Delayed report generation.
  • Limited transparency in stock movement.
  • Difficulty monitoring issued and received items.
  • Poor accountability for inventory transactions.

These challenges reduce operational efficiency and increase the risk of inventory
inaccuracies and losses.

1.5 Proposed Solution

The proposed solution is a web-based Stock Management System providing the
following capabilities:

  • User authentication and role-based authorization.
  • Inventory management (add, update, search, categorize items).
  • Stock receiving with Goods Receiving Note generation.
  • Stock issuing with Issue Voucher generation.
  • Stock transfer between warehouses.
  • Stock taking and reconciliation.
  • Damaged and obsolete item management.
  • FIFO inventory valuation.
  • Supplier management.
  • Bin card management (digital).
  • Dashboard with real-time summary statistics.
  • Report generation.
  • Audit logging.

1.6 Expected Benefits

  For ASTU:
    • Improved inventory accuracy and transparency.
    • Reduced paperwork and manual processing time.
    • Faster report generation and decision support.
    • Audit trail for all inventory transactions.

  For Users:
    • Real-time access to accurate inventory information.
    • Simplified stock operations with automated calculations.
    • Role-appropriate interface reducing complexity.

1.7 Project Objectives

  • Develop a secure, web-based stock management system.
  • Digitize all core inventory management processes.
  • Implement FIFO valuation as required by the MoFED manual.
  • Enforce role-based access control for all system operations.
  • Deploy the application using Docker and cloud hosting.
  • Follow Agile development practices with Git/GitHub version control.

1.8 Development Methodology

The project follows the SDLC using Agile methodology. Development phases are:

  Phase 0  — Product Planning
  Phase 1  — Requirements Analysis (SRS)
  Phase 2  — UX/UI Design
  Phase 3  — System Analysis and Design (SAD)
  Phase 4  — Environment Setup
  Phase 5  — Backend Development
  Phase 6  — Frontend Development
  Phase 7  — Integration
  Phase 8  — Testing and QA
  Phase 9  — Dockerization
  Phase 10 — Deployment
  Phase 11 — Documentation
  Phase 12 — Maintenance

================================================================================
CHAPTER 2 — PRODUCT VISION
================================================================================

2.1 Vision Statement

To develop a modern, secure, and user-friendly web-based Stock Management System
that enables Adama Science and Technology University to efficiently manage inventory,
improve transparency, reduce manual work, and support effective decision-making
through accurate and real-time information.

2.2 Mission Statement

The mission of the ASTU Stock Management System is to replace manual inventory
management with a reliable digital solution that simplifies stock operations,
improves efficiency, and provides accurate information for university departments.

2.3 Product Values

  • Simplicity      — Interfaces optimized for non-technical users.
  • Reliability     — Consistent and accurate inventory data at all times.
  • Security        — Role-based access protecting sensitive operations.
  • Transparency    — Full audit trail for every transaction.
  • Scalability     — Architecture supporting future expansion.
  • Maintainability — Modular codebase allowing updates without full redesign.

2.4 Long-Term Vision

The long-term vision is a complete inventory management platform adaptable to
other Ethiopian educational institutions. Future versions may include:

  • Barcode and QR Code support.
  • Mobile application.
  • Email and SMS notifications.
  • AI-assisted inventory forecasting.
  • Multi-campus inventory management.

================================================================================
CHAPTER 3 — PROJECT CHARTER
================================================================================

3.1 Project Name

ASTU Stock Management System

3.2 Project Background

Adama Science and Technology University manages a large volume of inventory
including office supplies, laboratory equipment, furniture, and institutional assets.
The existing manual system introduces errors, delays, and limited visibility into
stock movement. A modern web-based solution is required.

3.3 Project Scope

  In Scope:
    • User authentication and role-based access control.
    • Dashboard with real-time inventory summary.
    • Inventory management (CRUD, categories, item codes).
    • Stock receiving, issuing, and transfer.
    • Stock taking and reconciliation.
    • Damaged and obsolete item management.
    • FIFO inventory valuation.
    • Bin card management.
    • Supplier management.
    • Warehouse management.
    • Report generation.
    • Audit logging.

  Out of Scope (Version 1):
    • Mobile application.
    • AI-based demand forecasting.
    • Barcode and RFID integration.
    • Offline synchronization.
    • Integration with banking or ERP systems.
    • Multi-organization support.

3.4 Assumptions

  • Users have access to a web browser and internet connection.
  • Users will receive basic system training before use.
  • The required server infrastructure will be available.
  • Stakeholders will provide timely feedback during development.

3.5 Constraints

  • Internship duration limits the development timeline.
  • Team experience is at the student intern level.
  • Budget is limited to 12,000 ETB.

3.6 Success Criteria

  • All core inventory operations are functional and tested.
  • Reports are generated correctly.
  • Users authenticate and are restricted to role-permitted functions.
  • FIFO valuation produces correct results.
  • The system is successfully deployed using Docker.
  • All functional requirements in the SRS are satisfied.

================================================================================
CHAPTER 4 — STAKEHOLDER ANALYSIS
================================================================================

4.1 Stakeholder Identification

  Internal Stakeholders:
    • Store Keeper
    • Property Administration Officer (PAO)
    • Stock Clerk
    • Accountant
    • Department Staff / Department Head
    • Security Officer
    • ICT Center
    • University Management
    • System Administrator

  External Stakeholders:
    • External Suppliers
    • Software Development Team
    • Software Maintenance Team

4.2 Stakeholder Roles

  ┌──────────────────────────┬──────────────────────────────────────────────────┐
  │ Stakeholder              │ Responsibility                                   │
  ├──────────────────────────┼──────────────────────────────────────────────────┤
  │ Store Keeper             │ Receive, issue, transfer stock; manage bin cards │
  │ PAO                      │ Approve transactions, monitor all inventory      │
  │ Stock Clerk              │ Maintain records, conduct stock taking           │
  │ Accountant               │ Monitor inventory value and FIFO reports         │
  │ Department Staff         │ Request inventory items                          │
  │ Department Head          │ Approve departmental requisitions                │
  │ Security Officer         │ Monitor outgoing materials and gate passes       │
  │ ICT Center               │ System maintenance and technical support         │
  │ University Management    │ Review reports and make strategic decisions      │
  │ System Administrator     │ Manage users, permissions, and security          │
  │ Development Team         │ Design, develop, test, and deploy the system     │
  └──────────────────────────┴──────────────────────────────────────────────────┘

4.3 Stakeholder Influence

  ┌──────────────────────────┬──────────────────┐
  │ Stakeholder              │ Influence Level  │
  ├──────────────────────────┼──────────────────┤
  │ University Management    │ High             │
  │ PAO                      │ High             │
  │ ICT Center               │ High             │
  │ System Administrator     │ High             │
  │ Store Keeper             │ High             │
  │ Development Team         │ High             │
  │ Accountant               │ Medium           │
  │ Procurement Office       │ Medium           │
  │ Department Staff         │ Medium           │
  └──────────────────────────┴──────────────────┘

4.4 Communication Plan

  ┌──────────────────────────┬──────────────────────────┬────────────────┐
  │ Stakeholder              │ Communication Method     │ Frequency      │
  ├──────────────────────────┼──────────────────────────┼────────────────┤
  │ Store Keeper             │ Meetings                 │ Weekly         │
  │ ICT Center               │ Meetings and Reports     │ Weekly         │
  │ University Management    │ Progress Reports         │ Monthly        │
  │ Development Team         │ Daily Stand-up           │ Daily          │
  │ PAO                      │ Meetings                 │ Weekly         │
  │ Suppliers                │ As required              │ When needed    │
  └──────────────────────────┴──────────────────────────┴────────────────┘

================================================================================
CHAPTER 5 — USER RESEARCH
================================================================================

5.1 Target Users

  • Store Keeper
  • Department Staff / Department Head
  • Property Administration Officer (PAO)
  • Accountant
  • Security Officer
  • System Administrator
  • University Management

5.2 User Personas

  Persona 1 — Store Keeper
  ─────────────────────────
  Role: Manages university stock day-to-day.
  Responsibilities: Receive stock, issue stock, transfer stock, monitor levels,
  maintain bin cards, prepare inventory records.
  Pain Points: Manual record keeping, calculation errors, difficulty finding records,
  time-consuming report preparation.
  Goals: Quickly find stock information, record transactions accurately,
  know current stock levels, generate reports easily.

  Persona 2 — Department Staff
  ──────────────────────────────
  Role: Requests items from the store.
  Responsibilities: Submit stock requests, receive approved items,
  check request status.
  Pain Points: Delayed communication, lack of visibility of available items,
  uncertainty about request status.
  Goals: Easily request items, track requests, receive timely responses.

  Persona 3 — System Administrator
  ───────────────────────────────────
  Role: Manages the system.
  Responsibilities: Create and manage users, assign roles, manage permissions,
  monitor system activity and audit logs.
  Goals: Maintain system security, control user access, keep the system reliable.

  Persona 4 — PAO
  ─────────────────
  Role: Supervises all inventory operations.
  Responsibilities: Approve stock requests and transfers, oversee reconciliation,
  approve disposals, review all reports.
  Goals: Real-time visibility of inventory status, complete audit trail,
  efficient approval workflow.

5.3 User Needs

  • Secure, role-specific login.
  • Simple navigation to frequently used functions.
  • Accurate real-time stock information.
  • Fast item search and filtering.
  • Automated stock quantity updates on every transaction.
  • Report generation without manual calculation.
  • Clear error messages and transaction feedback.

================================================================================
CHAPTER 6 — COMPETITOR ANALYSIS
================================================================================

6.1 Existing Solutions Reviewed

  • Odoo Inventory
  • ERPNext
  • Zoho Inventory
  • inFlow Inventory

6.2 Feature Comparison

  ┌──────────────────────────┬────────┬─────────┬──────┬──────────────┐
  │ Feature                  │ Odoo   │ ERPNext │ Zoho │ ASTU System  │
  ├──────────────────────────┼────────┼─────────┼──────┼──────────────┤
  │ Inventory Management     │ ✓      │ ✓       │ ✓    │ ✓            │
  │ Stock Receiving          │ ✓      │ ✓       │ ✓    │ ✓            │
  │ Stock Issuing            │ ✓      │ ✓       │ ✓    │ ✓            │
  │ Supplier Management      │ ✓      │ ✓       │ ✓    │ ✓            │
  │ FIFO Valuation           │ ✓      │ ✓       │ ✓    │ ✓            │
  │ MoFED Compliance         │ —      │ —       │ —    │ ✓            │
  │ ASTU-specific Workflow   │ —      │ —       │ —    │ ✓            │
  │ University-focused UI    │ —      │ —       │ —    │ ✓            │
  │ Ethiopian gov. standards │ —      │ —       │ —    │ ✓            │
  └──────────────────────────┴────────┴─────────┴──────┴──────────────┘

6.3 Competitive Advantage

General-purpose ERP systems are complex, expensive, and not configured for
Ethiopian government inventory workflows. The ASTU system focuses on:

  • MoFED stock classification and business rules.
  • ASTU-specific organizational roles and approval workflows.
  • Simple interface designed for non-technical store staff.
  • Local language and operational context.

================================================================================
CHAPTER 7 — SWOT ANALYSIS
================================================================================

7.1 Strengths

  • Designed specifically for ASTU's inventory processes.
  • Compliant with MoFED Stock Management Manual.
  • Modern web-based architecture.
  • Role-based access matching organizational structure.
  • FIFO valuation built in from the start.

7.2 Weaknesses

  • New system with no long-term production usage history.
  • Development team is at intern level with limited experience.
  • Initial version has limited features (no mobile, no barcode).
  • Requires user training for adoption.

7.3 Opportunities

  • Expansion to other ASTU departments or campuses.
  • Barcode and QR-code integration in future versions.
  • Mobile application development.
  • Possible adoption by other Ethiopian universities.
  • Integration with ASTU financial systems.

7.4 Threats

  • Changing requirements during development.
  • Resistance from staff accustomed to manual processes.
  • Security threats if deployment is not properly secured.
  • Internet or infrastructure instability at ASTU.
  • Changes in university policies affecting scope.

================================================================================
CHAPTER 8 — PRODUCT SCOPE
================================================================================

8.1 In Scope

  Authentication and Authorization:
    Login, logout, role-based access control, session management.

  Inventory Management:
    Add, edit, view, delete, search, filter, and categorize items.
    MoFED-compliant item code generation.

  Stock Transactions:
    Receive stock (with GRN), issue stock (with Issue Voucher),
    transfer stock between warehouses, stock history.

  Stock Control:
    Minimum, maximum, reorder, and safety stock levels.
    Low-stock alerts and reorder reports.

  Stock Taking and Reconciliation:
    Physical count recording, variance calculation,
    PAO approval workflow, reconciliation reports.

  Damaged and Obsolete Item Management:
    Report, track, approve disposal, generate disposal reports.

  FIFO Valuation:
    Batch-level cost tracking, FIFO issue calculation,
    inventory valuation reports for the Accountant.

  Bin Card Management:
    Digital bin card per item showing every IN/OUT and running balance.

  Supplier Management:
    Register, update, search suppliers.

  Warehouse Management:
    Register warehouses, view per-warehouse stock levels.

  Reports:
    Inventory, stock movement, low stock, FIFO valuation,
    damaged/obsolete, stock taking, and audit reports.

  Audit Logging:
    Immutable record of all significant user actions.

  Dashboard:
    Total items, low-stock alerts, recent transactions, pending approvals.

8.2 Out of Scope (Version 1)

  • Mobile application.
  • AI-based demand forecasting.
  • Barcode and RFID integration.
  • Offline synchronization.
  • Integration with banking or external ERP systems.
  • Multi-organization support.

================================================================================
CHAPTER 9 — PRODUCT GOALS
================================================================================

9.1 Business Goals

  • Reduce manual inventory work and associated errors.
  • Improve inventory accuracy and transparency.
  • Reduce reporting time from days to minutes.
  • Maintain full accountability for all inventory transactions.

9.2 User Goals

  • Complete common inventory tasks without specialized training.
  • Access accurate, real-time stock information instantly.
  • Record transactions with automated quantity updates.
  • Generate reports without manual data compilation.

9.3 Technical Goals

  • Build a maintainable, modular system.
  • Implement secure authentication with JWT and bcrypt.
  • Use Git and GitHub for full version control history.
  • Containerize the application with Docker.
  • Deploy to a production environment.
  • Follow RESTful API design conventions.

9.4 SMART Project Goal

Develop and deploy a fully functional Version 1 ASTU Stock Management System
within the internship period, satisfying all Must Have requirements defined in the
SRS, passing all test cases, and deployed in a Docker-based environment.

================================================================================
CHAPTER 10 — FUNCTIONAL FEATURE LIST
================================================================================

10.1 Authentication
  • Login with email and password.
  • Logout.
  • Password management.
  • Role-based access control.
  • Session management via JWT.

10.2 Dashboard
  • Total inventory items count.
  • Available stock summary.
  • Low-stock item alerts.
  • Recent transaction feed.
  • Pending approvals counter (PAO view).

10.3 Inventory Management
  • Add, edit, view, delete inventory items.
  • Search by name or item code.
  • Filter by category, warehouse, and status.
  • Categorize items using MoFED classification codes.
  • View digital bin card per item.

10.4 Stock Receiving
  • Record received items with quantity, supplier, unit cost, and date.
  • Auto-generate Goods Receiving Note (GRN).
  • Automatic inventory quantity increase.

10.5 Stock Issuing
  • Record issued items with quantity, department, and recipient.
  • Validate against available stock (prevent over-issuing).
  • Auto-generate Issue Voucher.
  • Automatic inventory quantity decrease.

10.6 Stock Transfer
  • Transfer items between warehouses.
  • Record source and destination warehouse.
  • Automatic quantity update at both locations.

10.7 Stock Taking
  • Record physical count per item.
  • Calculate variance against system quantity.
  • Submit for PAO approval.
  • Apply approved adjustment and generate reconciliation report.

10.8 Damaged / Obsolete Management
  • Flag items as damaged or obsolete.
  • PAO approval for disposal.
  • Generate disposal report.

10.9 FIFO Valuation
  • Track unit cost per receiving batch.
  • Apply FIFO on issue transactions.
  • Generate valuation report for Accountant.

10.10 Supplier Management
  • Add, edit, view, search suppliers.
  • Link suppliers to receiving transactions.

10.11 Warehouse Management
  • Register and manage warehouses.
  • View stock levels per warehouse.

10.12 Reports
  • Inventory report, stock movement report, low stock report.
  • FIFO valuation report, damaged/obsolete report.
  • Stock taking report, audit report.
  • Export and print functionality.

10.13 User Management
  • Add, edit, deactivate users.
  • Assign and manage roles.

10.14 Audit Log
  • View and filter all system activity logs.
  • Export audit report.

================================================================================
CHAPTER 11 — NON-FUNCTIONAL REQUIREMENTS (OVERVIEW)
================================================================================

  Security:       Authentication required for all protected operations.
                  Passwords encrypted with bcrypt.
                  Role-based access enforced at API and UI level.
                  Immutable audit logs.

  Performance:    System response within 3 seconds for standard operations.
                  Optimized database queries with indexes on frequently
                  queried columns.

  Usability:      Simple navigation appropriate for non-technical store staff.
                  Consistent interface patterns across all modules.
                  Clear error messages and operation feedback.

  Reliability:    ACID-compliant transactions for stock quantity integrity.
                  Error handling preventing application crashes.
                  FIFO calculations producing consistent, reproducible results.

  Availability:   System available 24 hours a day subject to hosting uptime.
                  Database backup mechanisms provided.

  Scalability:    Architecture supports additional users, departments,
                  and inventory volume without redesign.

  Maintainability: Modular codebase with clear separation of concerns.
                   Full Git history and documented APIs.

  Portability:    Docker containerization for consistent deployment across
                  different environments.

================================================================================
CHAPTER 12 — MINIMUM VIABLE PRODUCT (MVP)
================================================================================

12.1 MVP Features (Must Have for Version 1)

  1. User authentication and role management.
  2. Dashboard.
  3. Inventory management (CRUD, categories, item codes).
  4. Stock receiving with GRN generation.
  5. Stock issuing with Issue Voucher generation.
  6. Stock transfer between warehouses.
  7. Stock taking and PAO approval workflow.
  8. Damaged and obsolete item management.
  9. FIFO valuation engine.
  10. Bin card management.
  11. Supplier management.
  12. Warehouse management.
  13. Core reports (inventory, movement, low stock, FIFO, audit).
  14. Audit logging.

12.2 Version 2 Features

  • Barcode/QR scanning.
  • SMS/email notifications.
  • Advanced analytics and dashboard visualizations.
  • Export to Excel/PDF for all reports.
  • Improved mobile-responsive layouts.

12.3 Future Features

  • Mobile application.
  • AI inventory forecasting.
  • Multi-campus support.
  • Integration with ASTU financial systems.

================================================================================
CHAPTER 13 — PRODUCT ROADMAP
================================================================================

  Version 1.0 — Core System (Current Internship)
  ────────────────────────────────────────────────
  Authentication, inventory management, stock receiving/issuing/transfer,
  stock taking, damaged/obsolete, FIFO valuation, bin cards, suppliers,
  warehouses, core reports, audit logging, Docker deployment.

  Version 1.1 — Improvements
  ────────────────────────────
  Export functionality, notifications, improved reporting,
  UI refinements based on user feedback.

  Version 2.0 — Advanced Inventory
  ──────────────────────────────────
  Barcode/QR support, advanced analytics, automated reorder alerts.

  Version 3.0 — Intelligent System
  ──────────────────────────────────
  AI-assisted forecasting, multi-campus management,
  integration with university financial systems.

================================================================================
CHAPTER 14 — RISK ANALYSIS
================================================================================

14.1 Risk Register

  ┌────────────────────────────┬─────────────┬────────┬────────────────────────────────────────┐
  │ Risk                       │ Probability │ Impact │ Mitigation                             │
  ├────────────────────────────┼─────────────┼────────┼────────────────────────────────────────┤
  │ Requirement changes        │ Medium      │ High   │ Regular stakeholder reviews.            │
  │ Development delay          │ Medium      │ High   │ Agile sprint planning with MVP focus.   │
  │ Technical problems         │ Medium      │ Medium │ Early prototyping and research.         │
  │ Team communication issues  │ Medium      │ High   │ Daily stand-up meetings.                │
  │ Data loss                  │ Low         │ High   │ Regular database backups.               │
  │ Security vulnerabilities   │ Medium      │ High   │ Secure coding practices and testing.    │
  │ Internet/infra problems    │ Medium      │ Medium │ Local development environment.          │
  │ Limited team experience    │ High        │ Medium │ Training, documentation, mentorship.    │
  │ Technology inconsistency   │ Low         │ High   │ Agreed stack documented and enforced.   │
  └────────────────────────────┴─────────────┴────────┴────────────────────────────────────────┘

================================================================================
CHAPTER 15 — TECHNOLOGY DECISIONS
================================================================================

15.1 Approved Technology Stack

  ┌────────────────────────┬──────────────────────────────────────────────────┐
  │ Category               │ Technology                                       │
  ├────────────────────────┼──────────────────────────────────────────────────┤
  │ Frontend               │ React.js                                         │
  │ Styling                │ Tailwind CSS                                     │
  │ Backend                │ Node.js + Express.js                             │
  │ Database               │ PostgreSQL                                       │
  │ Authentication         │ JWT (JSON Web Tokens) + bcrypt                   │
  │ API Style              │ REST API                                         │
  │ API Testing            │ Postman                                          │
  │ UI/UX Design           │ Figma                                            │
  │ Architecture Diagrams  │ Draw.io                                          │
  │ IDE                    │ Visual Studio Code                               │
  │ Version Control        │ Git                                              │
  │ Repository             │ GitHub                                           │
  │ Containerization       │ Docker + Docker Compose                          │
  │ Deployment             │ Cloud hosting (Docker-based)                     │
  │ Documentation          │ Markdown + Microsoft Word                        │
  └────────────────────────┴──────────────────────────────────────────────────┘

15.2 Database Selection Rationale

PostgreSQL is selected over MongoDB because:

  • The FIFO valuation logic requires complex joins across batch records.
  • Stock transactions require ACID compliance to maintain quantity integrity.
  • Relational foreign key constraints enforce business rules at the database level.
  • The MoFED stock classification system maps naturally to a relational schema.
  • PostgreSQL is the industry standard for financial and inventory data.

15.3 Technology Selection Principles

Technology decisions are evaluated against the following criteria:

  • Alignment with project requirements and business rules.
  • Team skill level and learning curve.
  • Long-term maintainability and community support.
  • Security capabilities.
  • Docker and cloud deployment compatibility.

================================================================================
CHAPTER 16 — AGILE PLANNING
================================================================================

16.1 Development Approach

The project uses an Agile iterative approach. Development is organized into
phases aligned with SDLC activities. Each phase produces specific deliverables
before proceeding to the next.

16.2 Sprint Structure

  Sprint Planning  → Development  → Testing  → Review  → Retrospective

16.3 Product Backlog (High-Level)

  • User authentication and role management.
  • Inventory CRUD and category management.
  • Stock receiving and issuing.
  • Stock transfer.
  • Stock taking and reconciliation.
  • Damaged and obsolete management.
  • FIFO valuation engine.
  • Bin card management.
  • Supplier management.
  • Warehouse management.
  • Report generation.
  • Audit logging.
  • Dockerization.
  • Deployment.

16.4 Team Roles (Agile)

  ┌──────────────────────┬──────────────────────────────────────────────────────┐
  │ Role                 │ Responsibility                                       │
  ├──────────────────────┼──────────────────────────────────────────────────────┤
  │ Product Owner        │ Prioritizes backlog, represents stakeholders         │
  │ Scrum Master         │ Facilitates sprints, removes blockers                │
  │ Backend Developers   │ Implement API, business logic, database              │
  │ Frontend Developers  │ Implement React UI against approved Figma designs    │
  │ UI/UX Designer       │ Produces Figma designs and design system             │
  │ QA / Testers         │ Write and execute test cases                         │
  └──────────────────────┴──────────────────────────────────────────────────────┘

================================================================================
CHAPTER 17 — SUCCESS METRICS
================================================================================

  Functional Success:
    All MVP features implemented and passing test cases.
    All 15 MoFED business rules enforced by the system.
    FIFO valuation producing correct results.

  User Success:
    Store Keepers can complete core tasks without assistance after basic training.
    PAO can view all reports and approve transactions within the system.
    Administrators can manage users and view audit logs.

  Technical Success:
    System deployed successfully in Docker.
    API endpoints return correct responses for all tested scenarios.
    No critical security vulnerabilities in authentication or authorization.
    All data integrity constraints enforced.

  Project Success:
    All agreed requirements satisfied.
    System delivered within the internship timeline.
    Documentation complete and professional.

================================================================================
CHAPTER 18 — DEVELOPMENT STANDARDS
================================================================================

18.1 File and Component Naming

  React components:   PascalCase    — Navbar.jsx, Dashboard.jsx, InventoryList.jsx
  Functions:          camelCase     — getInventory(), createItem(), deleteItem()
  Variables:          camelCase     — inventoryItems, currentUser, stockQuantity
  Database tables:    snake_case    — stock_transactions, audit_logs
  API endpoints:      kebab-case    — /api/stock-takings, /api/audit-logs

18.2 Git Commit Convention

  feat:     add inventory API
  fix:      correct stock calculation
  docs:     update project requirements
  test:     add inventory API tests
  refactor: improve authentication service
  chore:    update dependencies

18.3 Branch Naming

  main
  develop
  feature/authentication
  feature/inventory
  feature/stock-receiving
  fix/login-error

18.4 Code Quality Standards

  • No code duplication — extract reusable functions and components.
  • Meaningful variable and function names.
  • Single responsibility per function and component.
  • All user inputs validated on both frontend and backend.
  • Errors handled with appropriate HTTP status codes.
  • Sensitive values stored in environment variables only.

18.5 GitHub Practices

  • All features developed on feature branches.
  • Pull requests required before merging to develop.
  • Code review required for all pull requests.
  • Issues used to track bugs and feature requests.
  • .env files listed in .gitignore and never committed.

================================================================================
CHAPTER 19 — FEASIBILITY STUDY
================================================================================

19.1 Technical Feasibility

The proposed system is developed using widely available modern technologies
(React.js, Node.js, Express.js, PostgreSQL, Docker). All tools are freely
available, well-documented, and appropriate for a web-based inventory system.
The development team has access to all required tools.

Conclusion: Technically Feasible.

19.2 Economic Feasibility

Total estimated development cost: 12,000 ETB.

  ┌─────────────────────────────┬───────────────────────┐
  │ Item                        │ Estimated Cost (ETB)  │
  ├─────────────────────────────┼───────────────────────┤
  │ Internet and communication  │ 2,000                 │
  │ Transportation              │ 1,500                 │
  │ Documentation and printing  │ 2,500                 │
  │ Software tools              │ 1,000                 │
  │ Hosting and deployment      │ 3,000                 │
  │ Miscellaneous expenses      │ 2,000                 │
  ├─────────────────────────────┼───────────────────────┤
  │ TOTAL                       │ 12,000                │
  └─────────────────────────────┴───────────────────────┘

The cost of continuing with the manual system (inventory losses, stock shortages,
delayed decisions) significantly exceeds this investment.

Conclusion: Economically Feasible.

19.3 Operational Feasibility

The system is designed to be user-friendly for storekeepers, stock clerks, the PAO,
accountants, and department heads with minimal training. The system mirrors existing
manual workflows in digital form, reducing the learning curve. Resistance to change
will be managed through training and phased transition.

Conclusion: Operationally Feasible.

19.4 Schedule Feasibility

  ┌────────────────────────────┬───────────────┐
  │ Phase                      │ Duration      │
  ├────────────────────────────┼───────────────┤
  │ Requirement gathering      │ 1 week        │
  │ System analysis            │ 1 week        │
  │ System design              │ 2 weeks       │
  │ Database design            │ 1 week        │
  │ Implementation             │ 4 weeks       │
  │ Testing                    │ 2 weeks       │
  │ Deployment                 │ 1 week        │
  │ Documentation              │ 1 week        │
  ├────────────────────────────┼───────────────┤
  │ TOTAL                      │ 13 weeks      │
  └────────────────────────────┴───────────────┘

Conclusion: Schedule Feasible.

================================================================================
CHAPTER 20 — TEAM COMPOSITION
================================================================================

  ┌──────────────────────────┬──────────────────────────────────────────────────┐
  │ Role                     │ Responsibility                                   │
  ├──────────────────────────┼──────────────────────────────────────────────────┤
  │ Project Manager          │ Plans, monitors, and controls project progress   │
  │ System Analyst           │ Gathers and analyzes requirements                │
  │ UI/UX Designer           │ Designs user interfaces and user experience      │
  │ Frontend Developer       │ Implements the React user interface              │
  │ Backend Developer        │ Implements APIs, business logic, integrations    │
  │ Database Administrator   │ Designs and manages the PostgreSQL schema        │
  │ QA / Tester              │ Writes and executes all test cases               │
  │ Documentation Specialist │ Prepares and maintains all project documents     │
  └──────────────────────────┴──────────────────────────────────────────────────┘

================================================================================
CHAPTER 21 — TESTING PROCEDURE
================================================================================

21.1 Testing Levels

  1. Unit Testing
     Tests individual functions and components in isolation.
     Tools: Jest or Vitest.

  2. Integration Testing
     Tests interaction between modules (e.g., Frontend → API → Database).
     Tools: Postman, Jest with supertest.

  3. System Testing
     End-to-end testing of complete user workflows against all requirements.

  4. User Acceptance Testing (UAT)
     Stakeholders (Store Keeper, PAO) validate the system against their
     operational needs before deployment.

  5. Performance Testing
     Verifies system response times under normal and peak load.

  6. Security Testing
     Verifies authentication, authorization, input validation,
     and protection against common vulnerabilities.

21.2 Test Coverage Requirements

  • All functional requirements (FR-*) must have at least one test case.
  • Critical paths (login, receive stock, issue stock, FIFO) must be fully covered.
  • All 7 user roles must be tested for correct access permissions.
  • Negative test cases (invalid input, unauthorized access) must be included.

================================================================================
CHAPTER 22 — EXISTING SYSTEM DESCRIPTION
================================================================================

22.1 Overview

The existing inventory management system at ASTU is based on manual procedures
and paper-based documentation following the Ministry of Finance and Economic
Development (MoFED) Stock Management Manual.

22.2 Stock Classification and Coding (MoFED Standard)

The MoFED manual defines 18 stock classification codes (4401–4418) organized
under a 10-digit item coding system:

  Digit 1–2: Main group code (e.g., 44 = general stores)
  Digit 3–4: Sub-group code
  Digit 5–6: Item number
  Digit 7–8: Unit of measure
  Digit 9–10: Sequential number

  Sample classification codes:
  ┌────────┬──────────────────────────────────────────┐
  │ Code   │ Category                                 │
  ├────────┼──────────────────────────────────────────┤
  │ 4401   │ Office Supplies and Stationery           │
  │ 4402   │ Cleaning and Hygiene Materials           │
  │ 4403   │ Electrical and Lighting Materials        │
  │ 4404   │ Plumbing and Sanitation Materials        │
  │ 4405   │ Construction and Maintenance Materials   │
  │ 4406   │ Laboratory Supplies                      │
  │ 4407   │ Medical Supplies                         │
  │ 4408   │ Agricultural Materials                   │
  │ 4409   │ Fuel and Lubricants                      │
  │ 4410   │ Spare Parts and Accessories              │
  └────────┴──────────────────────────────────────────┘

22.3 Users of the Existing System

  Property Administration Officer (PAO): Supervises all inventory activities.
  Approves stock requests, transfers, and reports.

  Storekeeper: Receives, stores, issues, and safeguards inventory.
  Updates bin cards and warehouse records.

  Stock Clerk: Maintains stock records, updates transactions, prepares reports.

  Department Head: Approves departmental requests.

  Accountant: Records financial value of inventory, prepares financial reports,
  applies FIFO valuation.

  Security Officer: Controls movement of materials entering or leaving the
  organization. Verifies gate passes for outgoing materials.

22.4 Problems of the Existing System

  • Heavy dependence on paper documents.
  • Difficulty tracking stock movements across departments.
  • High probability of human error.
  • Duplicate or missing records.
  • Delayed report generation.
  • Inaccurate FIFO valuation due to manual calculation.
  • No real-time information access.
  • Lack of data security and audit trail.
  • Poor monitoring of damaged and obsolete items.

22.5 Business Rules (MoFED Standard — 15 Rules)

  BR-01  Every inventory item must have a unique item code.
  BR-02  All received goods must be inspected before storage.
  BR-03  Only authorized personnel can approve inventory transactions.
  BR-04  Inventory cannot be issued without an approved requisition form.
  BR-05  Every inventory transaction must be recorded.
  BR-06  Every stock item must have a corresponding bin card and stock record card.
  BR-07  Stock records must be updated whenever goods are received or issued.
  BR-08  Inventory valuation must follow the FIFO principle.
  BR-09  Physical stock taking must be conducted at least once every fiscal year.
  BR-10  Damaged and obsolete items must be identified and reported separately.
  BR-11  Materials leaving the organization must have an authorized gate pass.
  BR-12  Stock discrepancies must be investigated and corrected.
  BR-13  Users are responsible for materials issued to their departments.
  BR-14  Reorder levels and safety stock must be maintained.
  BR-15  Only authorized users can access inventory information.

================================================================================
CHAPTER 23 — COMPLETE STOCK MANAGEMENT WORKFLOW
================================================================================

23.1 End-to-End Workflow (17 Steps)

  Step 1  — Department identifies a material need.
  Step 2  — Department prepares a requisition form.
  Step 3  — Request is reviewed and approved by responsible authority.
  Step 4  — Store checks inventory availability and stock levels.
  Step 5  — Goods are received from supplier.
  Step 6  — Received goods are inspected and verified.
  Step 7  — Accepted goods are stored with bin card and stock record updated.
  Step 8  — Stock records maintained (item code, bin card, stock record card).
  Step 9  — Department submits stock request for use.
  Step 10 — Issue request is validated against approved requisition.
  Step 11 — Stock is issued to requesting department.
  Step 12 — Inventory quantity and transaction history are updated.
  Step 13 — Stock levels monitored against min/max/reorder/safety levels.
  Step 14 — Stock transferred between warehouses when required.
  Step 15 — Damaged and obsolete items identified and reported.
  Step 16 — Physical stock taking conducted (at least annually).
  Step 17 — Discrepancies reconciled; FIFO valuation and reports produced.
             Audit trail maintained throughout all steps.

23.2 Complete Flow Summary

  Department Need → Requisition → Approval → Stock Availability Check
  → Receiving → Inspection → Storage → Stock Records Update
  → Stock Request → Validation → Issue → Quantity Update
  → Transaction Tracking → Reorder Monitoring → Transfer
  → Damaged/Obsolete Management → Stock Taking → Reconciliation
  → FIFO Valuation → Reports → Audit Trail

================================================================================
END OF DOCUMENT
================================================================================
