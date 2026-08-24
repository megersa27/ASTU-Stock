================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Frontend Architecture

Document: 02-Frontend-Architecture.md
Phase:    Phase 3 — System Analysis and Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1.  Overview
  2.  Technology Stack
  3.  Application Entry Points
  4.  Folder Structure
  5.  Layer Responsibilities
  6.  Component Architecture
  7.  Page Architecture
  8.  Layout Architecture
  9.  API Communication Layer (Services)
  10. State Management
  11. Custom Hooks
  12. Routing
  13. Design System Integration
  14. Authentication Flow (Frontend)
  15. Error Handling
  16. Responsive Design
  17. Folder Structure — Complete Reference
  18. Component-to-Page Mapping

================================================================================
1. OVERVIEW
================================================================================

This document defines the frontend architecture of the ASTU Stock Management
System. It specifies how the React application is organized, how responsibilities
are separated across layers, how components interact with each other, and how
the frontend communicates with the backend API.

The frontend is the Presentation Layer in the system's three-tier architecture:

  Presentation Layer  →  React.js (this document)
  Application Layer   →  Node.js + Express.js
  Data Layer          →  PostgreSQL

The frontend communicates with the backend exclusively through REST API calls.
It never accesses the database directly.

================================================================================
2. TECHNOLOGY STACK
================================================================================

  ┌──────────────────────────┬───────────────────────────────────────────────┐
  │ Technology               │ Purpose                                       │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ React.js                 │ UI component framework                        │
  │ Vite                     │ Build tool and development server             │
  │ React Router DOM         │ Client-side routing                           │
  │ Axios                    │ HTTP client for API communication             │
  │ Tailwind CSS             │ Utility-first CSS styling                     │
  │ React Context API        │ Global state (authentication, theme)          │
  │ JWT (localStorage)       │ Authentication token storage                  │
  └──────────────────────────┴───────────────────────────────────────────────┘

================================================================================
3. APPLICATION ENTRY POINTS
================================================================================

3.1 main.jsx

The application entry point. Mounts the React application into the HTML DOM.
Wraps the application in StrictMode and any top-level context providers.

  Responsibilities:
    • Mount React application to the DOM element with id="root".
    • Wrap the application in React StrictMode.
    • Wrap the application in global context providers (AuthProvider).

  Data flow:
    Browser loads index.html
         ↓
    main.jsx executes
         ↓
    React application mounted
         ↓
    App.jsx renders

3.2 App.jsx

The root component. Defines the top-level routing structure and applies
the application shell layout to authenticated routes.

  Responsibilities:
    • Define all application routes using React Router.
    • Apply authentication guards to protected routes.
    • Render the appropriate layout (AuthLayout or DashboardLayout) based
      on the current route.

================================================================================
4. FOLDER STRUCTURE
================================================================================

  frontend/
  └── src/
      │
      ├── assets/           Static resources (images, icons, fonts)
      ├── components/       Reusable UI building blocks
      ├── pages/            Full application screens
      ├── layouts/          Shared page wrapper structures
      ├── services/         Backend API communication functions
      ├── hooks/            Custom React hooks
      ├── context/          Global state via React Context
      ├── utils/            Reusable helper functions
      ├── routes/           Route definitions and guards
      │
      ├── App.jsx           Root component and routing
      └── main.jsx          Application entry point

================================================================================
5. LAYER RESPONSIBILITIES
================================================================================

  ┌─────────────────┬─────────────────────────────────────────────────────────┐
  │ Layer           │ Responsibility                                          │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ pages/          │ Assembles components into a complete screen.            │
  │                 │ Calls services to fetch/submit data.                    │
  │                 │ Passes data to child components via props.              │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ components/     │ Renders UI elements. Receives data via props.           │
  │                 │ Emits user events (onClick, onChange) upward.           │
  │                 │ Contains no API calls and no global state access.       │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ layouts/        │ Provides the structural shell (header, sidebar, main    │
  │                 │ content area) shared across multiple pages.             │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ services/       │ Contains all Axios API calls.                           │
  │                 │ Abstracts the backend URL and HTTP methods from pages.  │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ hooks/          │ Encapsulates reusable stateful logic                    │
  │                 │ (e.g., data fetching, form state, debounce).            │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ context/        │ Provides global state (current user, role, auth token)  │
  │                 │ accessible to any component without prop drilling.      │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ utils/          │ Pure helper functions (date formatting, currency        │
  │                 │ formatting, input validation helpers).                  │
  ├─────────────────┼─────────────────────────────────────────────────────────┤
  │ routes/         │ Defines route paths and applies PrivateRoute guards     │
  │                 │ that redirect unauthenticated users to /login.          │
  └─────────────────┴─────────────────────────────────────────────────────────┘

  Separation of concerns principle:
    A component never calls the API directly.
    A service never manages React state.
    A page assembles components and orchestrates data flow.
    A context never contains business logic.

================================================================================
6. COMPONENT ARCHITECTURE
================================================================================

6.1 Definition

A component is a reusable UI building block used across multiple pages.
Components receive data as props and emit events upward to their parent.
They contain no API calls and no direct global state mutations.

6.2 Component Categories

  Primitive components (atomic UI elements):
    Button, Input, Select, Checkbox, Badge, Spinner, Toast

  Composite components (assembled from primitives):
    Table, Modal, Card, Pagination, SearchInput, DateRangePicker,
    FormField, ConfirmDialog

  Domain components (specific to a feature area):
    InventoryTable, BinCardTable, StockTakingTable, AuditLogTable,
    SummaryCard, LowStockAlert, TransactionRow

6.3 Component File Convention

  components/
  ├── ui/                   Primitive and composite components
  │   ├── Button.jsx
  │   ├── Input.jsx
  │   ├── Modal.jsx
  │   ├── Table.jsx
  │   ├── Badge.jsx
  │   ├── Card.jsx
  │   ├── Pagination.jsx
  │   ├── ConfirmDialog.jsx
  │   ├── Toast.jsx
  │   └── Spinner.jsx
  │
  └── shared/               Domain-specific reusable components
      ├── InventoryTable.jsx
      ├── BinCardTable.jsx
      ├── StockTakingTable.jsx
      ├── AuditLogTable.jsx
      ├── SummaryCard.jsx
      └── LowStockAlert.jsx

6.4 Design System Integration

All components implement the visual specifications defined in the Figma
Design System (Phase 2, page: 02-Design-System).

  ┌──────────────────────────────┬───────────────────────────────────────────┐
  │ Figma Design System Element  │ React Component                           │
  ├──────────────────────────────┼───────────────────────────────────────────┤
  │ Button variants              │ <Button variant="primary|secondary|danger">│
  │ Input field states           │ <Input error={} disabled={}>              │
  │ Status badge variants        │ <Badge status="ok|low|critical|pending">  │
  │ Card component               │ <Card>                                    │
  │ Data table                   │ <Table columns={} data={}>                │
  │ Modal                        │ <Modal isOpen={} onClose={}>              │
  │ Toast notification           │ <Toast type="success|error|warning">      │
  └──────────────────────────────┴───────────────────────────────────────────┘

================================================================================
7. PAGE ARCHITECTURE
================================================================================

7.1 Definition

A page represents a complete application screen corresponding to a single URL
route. Pages are responsible for:

  • Fetching required data on mount using service functions.
  • Managing the page-level state (loading, error, data).
  • Passing data to child components via props.
  • Handling form submissions by calling service functions.

7.2 Page File Convention

  pages/
  ├── auth/
  │   └── LoginPage.jsx
  │
  ├── dashboard/
  │   └── DashboardPage.jsx
  │
  ├── inventory/
  │   ├── InventoryListPage.jsx
  │   ├── AddItemPage.jsx
  │   ├── EditItemPage.jsx
  │   ├── ItemDetailsPage.jsx
  │   └── BinCardPage.jsx
  │
  ├── stock/
  │   ├── ReceiveStockPage.jsx
  │   ├── IssueStockPage.jsx
  │   ├── TransferStockPage.jsx
  │   └── StockHistoryPage.jsx
  │
  ├── stock-taking/
  │   ├── StockTakingPage.jsx
  │   └── StockTakingApprovalsPage.jsx
  │
  ├── damaged/
  │   ├── DamagedItemsPage.jsx
  │   ├── ReportDamagedPage.jsx
  │   └── DisposalApprovalsPage.jsx
  │
  ├── suppliers/
  │   ├── SupplierListPage.jsx
  │   └── SupplierFormPage.jsx
  │
  ├── warehouses/
  │   ├── WarehouseListPage.jsx
  │   └── WarehouseDetailPage.jsx
  │
  ├── reports/
  │   └── ReportsPage.jsx
  │
  └── admin/
      ├── UserManagementPage.jsx
      └── AuditLogPage.jsx

7.3 Page Internal Structure

  Each page follows this internal pattern:

    1. Import required service functions.
    2. Declare state variables (data, loading, error).
    3. Fetch data on mount (useEffect).
    4. Render loading state, error state, or content.
    5. Pass data to child components.
    6. Handle form submissions through service calls.

================================================================================
8. LAYOUT ARCHITECTURE
================================================================================

8.1 Purpose

A layout defines the structural shell that surrounds a group of pages.
Rather than duplicating the header, sidebar, and main content structure
on every page, a single layout component wraps all authenticated pages.

8.2 Layout Files

  layouts/
  ├── DashboardLayout.jsx    Shell for all authenticated pages
  │                          (Header + Sidebar + Main content area)
  └── AuthLayout.jsx         Minimal layout for login page
                             (Centered card, no sidebar)

8.3 DashboardLayout Structure

  ┌──────────────────────────────────────────────────────────────────────┐
  │ Header                                                               │
  │ (Logo, page title, notifications, user menu)                         │
  ├──────────────────────┬───────────────────────────────────────────────┤
  │                      │                                               │
  │  Sidebar             │   <Outlet />                                  │
  │  (role-filtered      │   (current page renders here)                 │
  │   navigation)        │                                               │
  │                      │                                               │
  └──────────────────────┴───────────────────────────────────────────────┘

  The <Outlet /> is a React Router component that renders the current
  matched child route inside the layout.

8.4 Role-Based Sidebar

  The sidebar navigation items are rendered conditionally based on
  the authenticated user's role retrieved from AuthContext.

  Sidebar items visible per role:
    Administrator   → All modules including Administration and Audit Log
    PAO             → All modules except User Management write access
    Storekeeper     → Inventory, Stock, Stock Taking, Damaged, Suppliers,
                      Warehouses, Reports (operational)
    Stock Clerk     → Inventory (view), Stock History, Stock Taking, Reports
    Accountant      → Inventory (view), Reports (FIFO + movement)
    Department Head → Inventory (view), Stock History, Reports
    Security Officer→ Stock History (outgoing only)

================================================================================
9. API COMMUNICATION LAYER (SERVICES)
================================================================================

9.1 Purpose

All backend API calls are centralized in the services/ folder.
Pages and components never call Axios or fetch directly.
This pattern means that if the API base URL or an endpoint path changes,
only the relevant service file needs updating.

9.2 Axios Instance Configuration

  A shared Axios instance is configured in services/api.js:

    • Base URL set from environment variable VITE_API_URL.
    • Request interceptor attaches the JWT token from localStorage
      to the Authorization header of every outgoing request.
    • Response interceptor handles 401 responses by clearing the
      token and redirecting to /login.

9.3 Service Files

  services/
  ├── api.js                Shared Axios instance
  ├── authService.js        login(), logout(), getCurrentUser()
  ├── inventoryService.js   getAll(), getById(), create(), update(), delete(),
  │                         getBinCard()
  ├── categoryService.js    getAll(), create(), update(), delete()
  ├── supplierService.js    getAll(), getById(), create(), update(), delete()
  ├── warehouseService.js   getAll(), getById(), create()
  ├── stockService.js       receive(), issue(), transfer(), getHistory()
  ├── stockTakingService.js create(), getPending(), approve(), reject()
  ├── damagedService.js     report(), getPending(), approveDisposal()
  ├── reportService.js      getInventory(), getMovement(), getLowStock(),
  │                         getFIFO(), getDamaged(), getStockTaking(),
  │                         getAudit()
  └── userService.js        getAll(), create(), update(), deactivate()

9.4 Service Function Pattern

  Every service function follows this pattern:

    export async function getInventory(filters = {}) {
      const response = await api.get('/inventory', { params: filters });
      return response.data;
    }

    export async function receiveStock(data) {
      const response = await api.post('/stock/receive', data);
      return response.data;
    }

  Pages call service functions and handle the returned data or errors:

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    useEffect(() => {
      getInventory()
        .then(data  => setItems(data))
        .catch(err  => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

================================================================================
10. STATE MANAGEMENT
================================================================================

10.1 Local State (useState)

Used for component-level and page-level state:
form inputs, loading flags, error messages, modal open/close state.

10.2 Global State (React Context)

Used for application-wide state that multiple components need:

  AuthContext
  ─────────────
  Stores the currently authenticated user and role.
  Provides: user, role, token, login(), logout(), isAuthenticated.
  Consumed by: Sidebar (role-based nav), PrivateRoute (route guard),
               any component that needs to know who is logged in.

  ThemeContext (optional)
  ─────────────────────────
  Stores UI theme preference (light/dark mode) if implemented.

10.3 Server State

Data fetched from the backend (inventory items, transactions, reports)
is managed as local state in each page component.
Caching and background refetching may be added with React Query
in a future version.

================================================================================
11. CUSTOM HOOKS
================================================================================

Custom hooks extract reusable stateful logic from page components.

  hooks/
  ├── useAuth.js          Returns current user, role, and auth helpers
  │                       from AuthContext
  ├── useInventory.js     Fetches inventory list with loading/error state
  ├── useDebounce.js      Delays a value update for search input optimization
  └── usePagination.js    Manages current page, page size, and total pages

  Example useAuth.js usage in a component:
    const { user, role, logout } = useAuth();

================================================================================
12. ROUTING
================================================================================

12.1 React Router DOM

Client-side routing is implemented using React Router DOM v6.

12.2 Route Structure

  routes/
  └── AppRoutes.jsx       All route definitions in one place

  Route categories:
    Public routes         Accessible without authentication (/login)
    Protected routes      Require valid JWT token
    Role-restricted       Require specific role in addition to authentication

12.3 PrivateRoute Guard

  A PrivateRoute wrapper component checks:
    1. Is the user authenticated (valid token in AuthContext)?
       No → redirect to /login
    2. Does the user's role permit this route?
       No → render 403 Forbidden page

12.4 Complete Route Definitions

  /login                           LoginPage (public)
  /dashboard                       DashboardPage
  /inventory                       InventoryListPage
  /inventory/add                   AddItemPage
  /inventory/:id                   ItemDetailsPage
  /inventory/:id/edit              EditItemPage
  /inventory/:id/bin-card          BinCardPage
  /categories                      CategoryListPage
  /stock/receive                   ReceiveStockPage
  /stock/issue                     IssueStockPage
  /stock/transfer                  TransferStockPage
  /stock/history                   StockHistoryPage
  /stock-taking                    StockTakingPage
  /stock-taking/approvals          StockTakingApprovalsPage
  /damaged                         DamagedItemsPage
  /damaged/report                  ReportDamagedPage
  /damaged/approvals               DisposalApprovalsPage
  /suppliers                       SupplierListPage
  /suppliers/add                   SupplierFormPage
  /suppliers/:id/edit              SupplierFormPage
  /warehouses                      WarehouseListPage
  /warehouses/:id                  WarehouseDetailPage
  /reports/:type                   ReportsPage
  /admin/users                     UserManagementPage
  /admin/audit-log                 AuditLogPage
  *                                NotFoundPage (404)

================================================================================
13. DESIGN SYSTEM INTEGRATION
================================================================================

The Figma Design System (Phase 2) defines:
  • Color palette and semantic color tokens.
  • Typography scale (font sizes, weights, line heights).
  • Spacing scale.
  • Component specifications (Button, Input, Card, Table, Modal, Badge, Toast).

The React implementation maps these directly:

  Figma token → Tailwind CSS class or CSS custom property.
  Figma component → React component in components/ui/.
  Figma page design → React page in pages/.
  Figma user flow → React Router route and page transitions.

The Figma design file is the authoritative reference for all visual
decisions during frontend implementation.

================================================================================
14. AUTHENTICATION FLOW (FRONTEND)
================================================================================

14.1 Login

  1. User submits LoginPage form (email + password).
  2. LoginPage calls authService.login(email, password).
  3. authService sends POST /api/auth/login to the backend.
  4. On success: JWT token and user data returned.
  5. AuthContext.login() stores the token in localStorage
     and sets the user/role in context state.
  6. React Router redirects the user to /dashboard.

14.2 Authenticated Requests

  1. Axios request interceptor reads JWT from localStorage.
  2. Attaches header: Authorization: Bearer <token> to every request.
  3. Backend validates the token on every protected endpoint.

14.3 Logout

  1. User clicks Logout in the header or sidebar.
  2. AuthContext.logout() removes the token from localStorage
     and clears the user state.
  3. React Router redirects to /login.

14.4 Token Expiry

  1. Backend returns 401 Unauthorized when the token is expired.
  2. Axios response interceptor catches 401 responses.
  3. Interceptor calls AuthContext.logout() automatically.
  4. User is redirected to /login with a session-expired message.

14.5 Protected Route Guard

  Every route except /login is wrapped in <PrivateRoute>.
  PrivateRoute checks isAuthenticated from AuthContext.
  Unauthenticated users are redirected to /login.

================================================================================
15. ERROR HANDLING
================================================================================

15.1 API Errors

  All service functions propagate errors to the calling page.
  Pages display user-friendly error messages in a Toast notification
  or an inline error alert component.

  HTTP error codes and their frontend handling:
    400 Bad Request    → Display field-level validation errors.
    401 Unauthorized   → Redirect to /login (handled by Axios interceptor).
    403 Forbidden      → Display "Access Denied" message.
    404 Not Found      → Display "Resource not found" message.
    422 Unprocessable  → Display business rule violation message.
    500 Server Error   → Display generic "Something went wrong" message.

15.2 Form Validation

  Client-side validation is applied before any API call is made.
  Validation errors are displayed as field-level messages
  beneath the relevant input field.
  The submit button is disabled while an API call is in progress.

15.3 Loading States

  Every page that fetches data displays a loading spinner
  while the API call is pending. Tables show a skeleton loader
  or spinner in place of data rows.

================================================================================
16. RESPONSIVE DESIGN
================================================================================

  Desktop (≥ 1280px):   Full sidebar visible. All table columns visible.
  Tablet (768–1279px):  Sidebar collapses to icons or hamburger menu.
  Mobile (< 768px):     Sidebar hidden behind overlay menu.
                        Complex data tables scroll horizontally.
                        Forms stack vertically.

Full mobile equivalence for complex pages (bin cards, stock history,
reports) is out of scope for Version 1.

================================================================================
17. FOLDER STRUCTURE — COMPLETE REFERENCE
================================================================================

  frontend/
  └── src/
      │
      ├── assets/
      │   ├── images/
      │   └── icons/
      │
      ├── components/
      │   ├── ui/
      │   │   ├── Button.jsx
      │   │   ├── Input.jsx
      │   │   ├── Select.jsx
      │   │   ├── Modal.jsx
      │   │   ├── Card.jsx
      │   │   ├── Table.jsx
      │   │   ├── Badge.jsx
      │   │   ├── Pagination.jsx
      │   │   ├── Toast.jsx
      │   │   ├── Spinner.jsx
      │   │   └── ConfirmDialog.jsx
      │   │
      │   └── shared/
      │       ├── InventoryTable.jsx
      │       ├── BinCardTable.jsx
      │       ├── StockTakingTable.jsx
      │       ├── AuditLogTable.jsx
      │       ├── SummaryCard.jsx
      │       └── LowStockAlert.jsx
      │
      ├── pages/
      │   ├── auth/LoginPage.jsx
      │   ├── dashboard/DashboardPage.jsx
      │   ├── inventory/(5 files)
      │   ├── stock/(4 files)
      │   ├── stock-taking/(2 files)
      │   ├── damaged/(3 files)
      │   ├── suppliers/(2 files)
      │   ├── warehouses/(2 files)
      │   ├── reports/ReportsPage.jsx
      │   └── admin/(2 files)
      │
      ├── layouts/
      │   ├── DashboardLayout.jsx
      │   └── AuthLayout.jsx
      │
      ├── services/
      │   ├── api.js
      │   ├── authService.js
      │   ├── inventoryService.js
      │   ├── categoryService.js
      │   ├── supplierService.js
      │   ├── warehouseService.js
      │   ├── stockService.js
      │   ├── stockTakingService.js
      │   ├── damagedService.js
      │   ├── reportService.js
      │   └── userService.js
      │
      ├── hooks/
      │   ├── useAuth.js
      │   ├── useInventory.js
      │   ├── useDebounce.js
      │   └── usePagination.js
      │
      ├── context/
      │   └── AuthContext.jsx
      │
      ├── utils/
      │   ├── formatDate.js
      │   ├── formatCurrency.js
      │   └── validation.js
      │
      ├── routes/
      │   └── AppRoutes.jsx
      │
      ├── App.jsx
      └── main.jsx

================================================================================
18. COMPONENT-TO-PAGE MAPPING
================================================================================

  ┌──────────────────────────────┬────────────────────────────────────────────┐
  │ Page                         │ Key Components Used                        │
  ├──────────────────────────────┼────────────────────────────────────────────┤
  │ DashboardPage                │ SummaryCard, LowStockAlert, Table,         │
  │                              │ Badge, Spinner                             │
  │ InventoryListPage            │ Table, SearchInput, Badge, Pagination,     │
  │                              │ Button                                     │
  │ AddItemPage / EditItemPage   │ Input, Select, Button, Toast               │
  │ BinCardPage                  │ BinCardTable, DateRangePicker, Button      │
  │ ReceiveStockPage             │ Input, Select, Button, Toast               │
  │ IssueStockPage               │ Input, Select, Button, Toast,              │
  │                              │ inline stock availability display          │
  │ TransferStockPage            │ Select (×2 warehouses), Input, Button      │
  │ StockTakingPage              │ StockTakingTable, Input, Button            │
  │ StockTakingApprovalsPage     │ Card, Button (approve/reject), Badge       │
  │ DamagedItemsPage             │ Table, Badge, Button                       │
  │ AuditLogPage                 │ AuditLogTable, DateRangePicker, Select,    │
  │                              │ Modal (detail view)                        │
  │ ReportsPage                  │ Select, DateRangePicker, Table, Button     │
  │ UserManagementPage           │ Table, Modal, Input, Select, Button        │
  └──────────────────────────────┴────────────────────────────────────────────┘

================================================================================
END OF DOCUMENT
================================================================================
