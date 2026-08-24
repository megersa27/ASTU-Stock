================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Prototype and UX Testing

Document: 05-Prototype-and-Testing.md
Phase:    Phase 2 — UX/UI Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1. Overview
  2. Prototype Scope
  3. Figma Prototype Structure
  4. Interaction Flows Linked in Prototype
  5. UX Testing Plan
  6. Test Scenarios
  7. Testing Checklist
  8. Issue Tracking and Improvements
  9. Phase 2 Design Deliverables Summary

Figma file: ASTU Stock Management System — UX/UI
Page:       04-Prototype

================================================================================
1. OVERVIEW
================================================================================

This document defines the prototype specification and UX testing plan for the
ASTU Stock Management System. The Figma prototype simulates the application's
interactions before any code is written, enabling early validation of user
flows and design decisions.

The prototype is not a functional application. It simulates screen transitions
and interactions to evaluate whether users can complete key tasks intuitively.
Issues identified during prototype testing are resolved at the design level
before development begins, reducing the cost of changes.

================================================================================
2. PROTOTYPE SCOPE
================================================================================

The following flows are prototyped and testable in Figma:

  Priority 1 (Must prototype):
    • Login → Dashboard
    • Inventory List → Add Item → Save → Inventory List
    • Inventory List → Item Details → View Bin Card
    • Stock Management → Receive Stock → Confirm → Success
    • Stock Management → Issue Stock → Confirm → Success
    • Stock Management → Transfer Stock → Confirm → Success
    • Stock Taking → Enter Count → Submit for Approval
    • Damaged/Obsolete → Report Item → Submit

  Priority 2 (Prototype if time allows):
    • Dashboard → Low Stock Alert → Inventory Item Details
    • Reports → Select Report Type → Generate → View Results
    • Administration → Users → Add User → Save

================================================================================
3. FIGMA PROTOTYPE STRUCTURE
================================================================================

The Figma project contains four pages:

  01-Wireframes      Low-fidelity wireframes (as defined in 04-Wireframe-Design.md)
  02-Design-System   Colors, typography, component library
  03-High-Fidelity   Final visual designs (production-ready screens)
  04-Prototype       Interactive prototype with navigation connections

All prototype interactions are defined on the 04-Prototype page.
Connections use Figma's prototype panel with the following settings:

  Trigger:     On click
  Action:      Navigate to
  Animation:   Instant (or Smart Animate for transitions)

================================================================================
4. INTERACTION FLOWS LINKED IN PROTOTYPE
================================================================================

4.1 Login Flow

  Login Screen
    [Login button] → Dashboard

4.2 Add Inventory Item Flow

  Inventory List
    [+ Add Item] → Add Item Form
  Add Item Form
    [Save Item]  → Inventory List (with success toast)
    [Cancel]     → Inventory List

4.3 Receive Stock Flow

  Dashboard / Sidebar
    [Receive Stock] → Receive Stock Form
  Receive Stock Form
    [Receive Stock] → Success Confirmation
    [Cancel]        → Dashboard
  Success Confirmation
    [View GRN]   → GRN preview
    [Done]       → Dashboard

4.4 Issue Stock Flow

  Issue Stock Form
    [Issue Stock]   → Success Confirmation (if qty valid)
    Qty > Available → Inline error state shown (no navigation)
    [Cancel]        → Dashboard

4.5 Stock Taking Flow

  Stock Taking Page
    [Submit for Approval] → Pending confirmation state
  PAO Approval Page
    [Approve]   → Success state
    [Reject]    → Return to storekeeper view

4.6 Delete / Dispose Confirmation Flow

  Any delete or dispose action
    [Delete / Dispose] → Confirmation Dialog
  Confirmation Dialog
    [Confirm] → Updated list
    [Cancel]  → Previous page (no change)

4.7 Sidebar Navigation

  All sidebar items link to their respective pages.
  Active state is highlighted for the current page.

================================================================================
5. UX TESTING PLAN
================================================================================

5.1 Test Objectives

  • Verify that users can complete key inventory tasks without guidance.
  • Identify navigation confusion, unclear labels, or missing feedback.
  • Validate that role-based navigation shows appropriate items.
  • Confirm that error states (insufficient stock, validation errors) are
    understood by users.

5.2 Test Method

  Moderated usability test using the Figma prototype.
  Each participant is given a task scenario and asked to complete it
  by interacting with the prototype while the observer notes:
    • Points of hesitation or confusion.
    • Incorrect paths taken.
    • Verbal feedback about unclear elements.

5.3 Test Participants

  Minimum 3 participants from the following groups:
    • 1 Storekeeper (primary user)
    • 1 PAO or supervisor
    • 1 general staff member unfamiliar with the system

5.4 Test Environment

  Figma prototype shared via link.
  Conducted on desktop browser (Chrome or Firefox).
  Participants use mouse and keyboard only (no touch interface).

================================================================================
6. TEST SCENARIOS
================================================================================

  Scenario 1 — Add a new inventory item
  ────────────────────────────────────────
  Task: "Add a new item called 'Stapler' to the Office Supplies category
         in the Main Store warehouse."
  Success: Item appears in inventory list after saving.
  Observation focus: Can the user find Add Item? Are required fields clear?

  Scenario 2 — Record received stock
  ────────────────────────────────────
  Task: "You received 50 reams of Printer Paper from ABC Suppliers at 25 ETB
         each. Record this receipt."
  Success: Stock quantity increases. GRN reference displayed.
  Observation focus: Is unit cost field noticed? Is the form intuitive?

  Scenario 3 — Issue stock to a department
  ──────────────────────────────────────────
  Task: "Issue 20 reams of Printer Paper to the CSE Department for Dr. Abebe."
  Success: Quantity decreases. Issue Voucher reference displayed.
  Observation focus: Is available quantity visible? Does the insufficient-stock
  error make sense?

  Scenario 4 — View the bin card for an item
  ────────────────────────────────────────────
  Task: "Find the complete transaction history for Printer Paper."
  Success: User reaches /inventory/:id/bin-card with running balance visible.
  Observation focus: Is "View Bin Card" button found within 2 clicks?

  Scenario 5 — PAO approves a stock adjustment
  ──────────────────────────────────────────────
  Task: "A stock count was submitted showing 5 missing Printer Paper units.
         Review and approve the adjustment."
  Success: PAO navigates to pending approvals and approves successfully.
  Observation focus: Is the pending approvals alert visible on the dashboard?

  Scenario 6 — Find low-stock items
  ───────────────────────────────────
  Task: "Identify which items need to be reordered."
  Success: User finds the low-stock section on the dashboard or navigates
           to /reports/low-stock.
  Observation focus: Is the dashboard low-stock section noticed immediately?

================================================================================
7. TESTING CHECKLIST
================================================================================

  ┌──────────────────────────────────────────────────┬────────┬──────────────┐
  │ Test Item                                        │ Result │ Issue Found  │
  ├──────────────────────────────────────────────────┼────────┼──────────────┤
  │ Login → Dashboard navigation                     │        │              │
  │ Dashboard shows correct summary cards            │        │              │
  │ Low-stock alert visible on dashboard             │        │              │
  │ Inventory List → Add Item accessible             │        │              │
  │ Add Item form validation works correctly         │        │              │
  │ Save Item → returns to Inventory List            │        │              │
  │ Cancel → returns without saving                  │        │              │
  │ Receive Stock form — all fields clear            │        │              │
  │ Unit cost field is noticed and filled            │        │              │
  │ GRN reference displayed after receiving          │        │              │
  │ Issue Stock — available quantity visible         │        │              │
  │ Insufficient stock error message is clear        │        │              │
  │ Issue button disabled when qty > available       │        │              │
  │ Transfer Stock — source/dest selection clear     │        │              │
  │ Bin Card reachable from Item Details in 2 clicks │        │              │
  │ Bin Card shows running balance                   │        │              │
  │ PAO sees pending approvals on dashboard          │        │              │
  │ PAO can approve stock adjustment                 │        │              │
  │ Dispose action requires confirmation dialog      │        │              │
  │ Audit log page is read-only (no edit actions)    │        │              │
  │ Sidebar shows role-appropriate items only        │        │              │
  │ Error messages are descriptive and visible       │        │              │
  └──────────────────────────────────────────────────┴────────┴──────────────┘

  Result values: ✓ Pass | ✗ Fail | △ Partial

================================================================================
8. ISSUE TRACKING AND IMPROVEMENTS
================================================================================

Issues identified during testing are recorded below and resolved in the
High-Fidelity UI design before development begins.

  ┌──────┬───────────────────────────────┬────────────────────────────┬────────┐
  │ ID   │ Issue Description             │ Proposed Fix               │ Status │
  ├──────┼───────────────────────────────┼────────────────────────────┼────────┤
  │ UI-01│ [To be filled during testing] │ [To be filled]             │ Open   │
  └──────┴───────────────────────────────┴────────────────────────────┴────────┘

================================================================================
9. PHASE 2 DESIGN DELIVERABLES SUMMARY
================================================================================

  ┌────────┬──────────────────────────────────────┬──────────────────┬────────┐
  │ Day    │ Activity                             │ Deliverable      │ Status │
  ├────────┼──────────────────────────────────────┼──────────────────┼────────┤
  │ Day 1  │ UX Design Brief                      │ 01-UX-Design-    │ Done   │
  │        │                                      │ Brief.md         │        │
  │ Day 2  │ User Flow Design (13 flows)           │ 02-User-Flow-    │ Done   │
  │        │                                      │ Design.md        │        │
  │        │                                      │ + .drawio files  │        │
  │ Day 3  │ Information Architecture + Sitemap   │ 03-Information-  │ Done   │
  │        │                                      │ Architecture-    │        │
  │        │                                      │ Sitemap.md       │        │
  │        │                                      │ + sitemap.drawio │        │
  │ Day 4  │ Wireframes (15 screens)               │ 04-Wireframe-    │ Done   │
  │        │                                      │ Design.md        │        │
  │        │                                      │ + Figma:         │        │
  │        │                                      │ 01-Wireframes    │        │
  │ Day 5  │ Design System                        │ Figma:           │ Todo   │
  │        │ (colors, typography, components)     │ 02-Design-System │        │
  │ Day 6  │ High-Fidelity UI                     │ Figma:           │ Todo   │
  │        │ (final visual designs)               │ 03-High-Fidelity │        │
  │ Day 7  │ Prototype + UX Testing               │ 05-Prototype-    │ Done   │
  │        │                                      │ and-Testing.md   │        │
  │        │                                      │ + Figma:         │        │
  │        │                                      │ 04-Prototype     │        │
  └────────┴──────────────────────────────────────┴──────────────────┴────────┘

Remaining Phase 2 tasks:
  • Create Figma Design System (colors, typography, spacing, component library).
  • Produce High-Fidelity screens in Figma based on wireframes.
  • Link all prototype connections in Figma 04-Prototype page.
  • Conduct UX testing sessions with at least 3 participants.
  • Document findings in Section 8 of this document.
  • Resolve all identified issues before handoff to Phase 3 development.

================================================================================
END OF DOCUMENT
================================================================================
