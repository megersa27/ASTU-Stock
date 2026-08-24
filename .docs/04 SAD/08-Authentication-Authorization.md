================================================================================
ASTU STOCK MANAGEMENT SYSTEM
Authentication and Authorization Design

Document: 08-Authentication-Authorization.md
Phase:    Phase 3 — System Analysis and Design
Version:  1.0
Status:   Approved
Date:     August 2026
================================================================================

TABLE OF CONTENTS

  1.  Overview
  2.  Definitions
  3.  Authentication Design
  4.  Password Security
  5.  JWT Token Design
  6.  Login Flow
  7.  Authenticated Request Flow
  8.  Logout Flow
  9.  Token Expiry Handling
  10. Authorization Design
  11. Role-Based Access Control (RBAC)
  12. Permission Matrix
  13. Protected Routes — Backend
  14. Protected Routes — Frontend
  15. Security Rules
  16. Implementation Reference

================================================================================
1. OVERVIEW
================================================================================

The ASTU Stock Management System requires that all users authenticate before
accessing any system functionality. Once authenticated, the system authorizes
each request based on the user's assigned role.

Authentication and authorization are two distinct, sequential checks:

  Authentication  →  confirms the identity of the user.
  Authorization   →  confirms the user is permitted to perform the action.

Both checks are enforced on the backend for every protected API request.
Frontend role-based navigation is a UX convenience only and does not
constitute a security control.

SRS references: FR-AUTH-001 to FR-AUTH-007, FR-ROLE-001 to FR-ROLE-002,
                NFR-SEC-001 to NFR-SEC-007, BR-03, BR-15.

================================================================================
2. DEFINITIONS
================================================================================

  Authentication
  Verification that the user is who they claim to be, by validating
  their email address and password against the database.

  Authorization
  Verification that the authenticated user has permission to perform
  a specific action on a specific resource.

  JWT (JSON Web Token)
  A compact, self-contained token that encodes the user's identity (id, role)
  and is signed with a secret key. The backend can verify the token's
  authenticity without querying the database on every request.

  bcrypt
  A password hashing algorithm designed for security. It applies a salt
  and multiple hash rounds to a plain-text password, producing a hash
  that cannot be reversed to recover the original password.

  RBAC (Role-Based Access Control)
  An authorization model where permissions are assigned to roles, and
  users are assigned to roles. A user inherits the permissions of their role.

  Protected route
  A backend API endpoint that requires a valid JWT token (and optionally
  a specific role) before processing the request.

================================================================================
3. AUTHENTICATION DESIGN
================================================================================

Authentication is implemented using JWT (JSON Web Tokens).

Design decisions:
  • Stateless authentication: the server does not maintain session state.
    The JWT token itself encodes all necessary user identity information.
  • Short token expiry (24 hours) to limit the window of exposure if a
    token is compromised.
  • Tokens are stored in the browser's localStorage and attached to every
    API request via Axios request interceptor.
  • Token expiry is handled automatically by the Axios response interceptor,
    which redirects the user to the login page when a 401 response is received.

================================================================================
4. PASSWORD SECURITY
================================================================================

Plain-text passwords are never stored in the database.

Process when a password is set (user creation):
  1. Receive plain-text password from the request.
  2. Generate a bcrypt salt with 10 rounds.
  3. Hash the password: passwordHash = await bcrypt.hash(password, 10).
  4. Store passwordHash in the users table.
  5. Discard the plain-text password — it is never saved.

Process when a password is verified (login):
  1. Retrieve the stored passwordHash from the users table by email.
  2. Compare: isMatch = await bcrypt.compare(enteredPassword, passwordHash).
  3. If isMatch is true: authentication proceeds.
  4. If isMatch is false: return 401 Unauthorized.

bcrypt properties relevant to this design:
  • Each hash includes a unique salt, so two identical passwords produce
    different hashes.
  • The hashing process is intentionally slow (CPU-intensive) to resist
    brute-force attacks.
  • The hash is not reversible — the original password cannot be recovered
    from the hash.

================================================================================
5. JWT TOKEN DESIGN
================================================================================

5.1 Token Generation

  Issued by the backend on successful login.
  Signed with JWT_SECRET from environment variables.
  Algorithm: HS256.
  Expiry: 24 hours (configurable via JWT_EXPIRES_IN env variable).

5.2 Token Payload

  {
    "userId": 5,
    "email": "megersa@astu.edu.et",
    "role": "storekeeper",
    "iat": 1722480000,
    "exp": 1722566400
  }

  Fields:
    userId  — user's database ID, used to identify the user in audit logs.
    email   — included for display purposes.
    role    — used by roleMiddleware for authorization decisions.
    iat     — issued at timestamp (set automatically by jsonwebtoken).
    exp     — expiry timestamp (set automatically from expiresIn config).

5.3 Token Storage (Frontend)

  The token is stored in localStorage under the key: astu_stock_token.
  It is read by the Axios request interceptor on every outgoing request.

5.4 Token Transmission

  All protected API requests include the header:
    Authorization: Bearer <token>

5.5 Token Verification (Backend)

  authMiddleware calls jwt.verify(token, process.env.JWT_SECRET).
  If verification succeeds: decoded payload is attached to req.user.
  If verification fails (invalid signature, expired, malformed):
    Returns 401 Unauthorized.

================================================================================
6. LOGIN FLOW
================================================================================

  Client                Backend                  Database
    │                      │                         │
    │─POST /auth/login─────>│                         │
    │ {email, password}     │                         │
    │                       │─validate fields─────────│
    │                       │─SELECT user by email────>│
    │                       │<────────────user record──│
    │                       │                         │
    │                 [user not found]                │
    │<──401 Unauthorized────│                         │
    │                       │                         │
    │                 [user found]                    │
    │                       │─bcrypt.compare()        │
    │                       │                         │
    │              [password wrong]                   │
    │<──401 Unauthorized────│                         │
    │                       │                         │
    │              [password correct]                 │
    │                       │─check user.status       │
    │                       │                         │
    │              [status = inactive]                │
    │<──401 Account inactive│                         │
    │                       │                         │
    │              [status = active]                  │
    │                       │─jwt.sign({userId,role}) │
    │                       │─INSERT audit_logs───────>│
    │                       │  (action: LOGIN)         │
    │<──200 {token, user}───│                         │
    │                       │                         │
    │ Store token in        │                         │
    │ localStorage          │                         │
    │                       │                         │
    │ Redirect to /dashboard│                         │

================================================================================
7. AUTHENTICATED REQUEST FLOW
================================================================================

Every request to a protected endpoint follows this flow:

  Client                   authMiddleware           roleMiddleware
    │                            │                        │
    │─GET /api/inventory─────────>│                        │
    │  Authorization:             │                        │
    │  Bearer <token>             │                        │
    │                             │─jwt.verify(token)      │
    │                             │                        │
    │                    [invalid/expired token]           │
    │<──401 Unauthorized──────────│                        │
    │                             │                        │
    │                    [valid token]                     │
    │                             │─attach req.user        │
    │                             │  {userId, role}        │
    │                             │────────────────────────>│
    │                             │                        │─check role
    │                             │                        │
    │                        [role not permitted]          │
    │<──403 Forbidden─────────────────────────────────────│
    │                             │                        │
    │                        [role permitted]              │
    │                             │                        │─call next()
    │                             │                        │
    │  [Controller → Service → Database → Response]        │

================================================================================
8. LOGOUT FLOW
================================================================================

Logout is handled on the client side. The backend provides an endpoint
for audit logging purposes.

  Client side:
    1. User clicks Logout.
    2. AuthContext.logout() removes the token from localStorage.
    3. AuthContext user state is set to null.
    4. React Router redirects to /login.
    5. All subsequent API requests have no Authorization header,
       so they return 401 and are redirected to /login.

  Backend side:
    POST /auth/logout
    Records an audit log entry (action: LOGOUT) with the user's identity.
    Returns 200 OK.

  Note: JWT tokens cannot be actively invalidated server-side without
  maintaining a token blacklist. The 24-hour expiry window is the
  primary expiry mechanism. Token blacklisting may be added in Version 2.

================================================================================
9. TOKEN EXPIRY HANDLING
================================================================================

  When a JWT token expires, the backend returns 401 Unauthorized.

  The Axios response interceptor in services/api.js handles this:
    1. Intercepts any 401 response.
    2. Calls AuthContext.logout() to clear the token and user state.
    3. Redirects the browser to /login.
    4. Optionally displays a "Session expired. Please log in again." message.

  This ensures that expired sessions are handled transparently without
  requiring manual logout.

================================================================================
10. AUTHORIZATION DESIGN
================================================================================

Authorization is enforced using Role-Based Access Control (RBAC).

Design principles:
  • Permissions are assigned to roles, not to individual users.
  • A user is assigned exactly one role at account creation.
  • The role determines which API endpoints the user can access.
  • Authorization is enforced at the backend route level.
  • The frontend role-based navigation is supplementary to backend
    authorization, not a replacement for it.

Authorization enforcement layers:

  Layer 1 — Backend route middleware (authoritative):
    roleMiddleware(['admin', 'storekeeper']) applied per Express route.
    Returns 403 if req.user.role is not in the allowed roles array.

  Layer 2 — Frontend route guard (UX only):
    PrivateRoute component checks the user's role before rendering a page.
    Prevents accidental navigation to restricted pages.
    Does not provide security — a determined user could bypass this.

  Layer 3 — Frontend navigation filtering (UX only):
    Sidebar renders only the navigation items permitted for the user's role.
    Reduces cognitive load by hiding irrelevant functionality.

================================================================================
11. ROLE-BASED ACCESS CONTROL (RBAC)
================================================================================

The system defines 7 roles:

  Administrator
  ──────────────
  Full system access. Creates and manages users. Manages roles and
  system configuration. Accesses audit logs and all reports.

  PAO (Property Administration Officer)
  ───────────────────────────────────────
  Approves stock transactions, stock adjustments, and item disposals.
  Views all inventory data and reports. Views audit logs.
  Cannot create or deactivate user accounts.

  Storekeeper
  ────────────
  Primary operational role. Receives stock, issues stock, transfers stock.
  Creates and updates inventory items. Manages suppliers. Conducts physical
  stock counts. Reports damaged and obsolete items. Views operational reports.

  Stock Clerk
  ────────────
  Supports the Storekeeper. Updates stock records. Conducts physical
  stock counts. Prepares operational reports. Read-only access to inventory.

  Accountant
  ───────────
  Read-only access to inventory data and reports. Accesses FIFO valuation
  reports and stock movement reports for financial reporting purposes.

  Department Head
  ────────────────
  Approves requisitions from their department. Views stock availability
  and inventory data in read-only mode.

  Security Officer
  ─────────────────
  Views outgoing transaction information and stock history. Read-only
  access to confirm gate pass information for outgoing materials.

================================================================================
12. PERMISSION MATRIX
================================================================================

Legend: ✓ = Full access | R = Read only | A = Approve only | — = No access

  ┌──────────────────────────────┬───────┬─────┬───────┬───────┬──────┬───────┬──────────┐
  │ Action                       │ Admin │ PAO │ Store │ Clerk │ Acct │ Dept  │ Security │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ Login / Logout               │  ✓    │  ✓  │   ✓   │   ✓   │  ✓   │   ✓   │    ✓     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ Create / manage users        │  ✓    │  —  │   —   │   —   │  —   │   —   │    —     │
  │ View users                   │  ✓    │  R  │   —   │   —   │  —   │   —   │    —     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ Add / edit inventory         │  ✓    │  ✓  │   ✓   │   —   │  —   │   —   │    —     │
  │ View inventory               │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    —     │
  │ Delete inventory             │  ✓    │  ✓  │   —   │   —   │  —   │   —   │    —     │
  │ View bin card                │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   —   │    —     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ Receive stock                │  ✓    │  —  │   ✓   │   —   │  —   │   —   │    —     │
  │ Issue stock                  │  ✓    │  —  │   ✓   │   —   │  —   │   —   │    —     │
  │ Transfer stock               │  ✓    │  —  │   ✓   │   —   │  —   │   —   │    —     │
  │ View stock history           │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    R     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ Conduct stock taking         │  ✓    │  —  │   ✓   │   ✓   │  —   │   —   │    —     │
  │ Approve stock adjustment     │  ✓    │  ✓  │   —   │   —   │  —   │   —   │    —     │
  │ View reconciliation report   │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   —   │    —     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ Report damaged / obsolete    │  ✓    │  —  │   ✓   │   ✓   │  —   │   —   │    —     │
  │ Approve disposal             │  ✓    │  ✓  │   —   │   —   │  —   │   —   │    —     │
  │ View damaged list            │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   —   │    —     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ Manage suppliers             │  ✓    │  ✓  │   ✓   │   —   │  R   │   —   │    —     │
  │ Manage warehouses            │  ✓    │  ✓  │   R   │   R   │  R   │   —   │    —     │
  │ Manage categories            │  ✓    │  ✓  │   ✓   │   —   │  R   │   —   │    —     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ View inventory report        │  ✓    │  ✓  │   ✓   │   ✓   │  R   │   R   │    —     │
  │ View FIFO valuation report   │  ✓    │  ✓  │   —   │   —   │  ✓   │   —   │    —     │
  │ View audit report            │  ✓    │  ✓  │   —   │   —   │  —   │   —   │    —     │
  ├──────────────────────────────┼───────┼─────┼───────┼───────┼──────┼───────┼──────────┤
  │ View audit log               │  ✓    │  ✓  │   —   │   —   │  —   │   —   │    —     │
  └──────────────────────────────┴───────┴─────┴───────┴───────┴──────┴───────┴──────────┘

================================================================================
13. PROTECTED ROUTES — BACKEND
================================================================================

Every Express route that requires authentication is protected by
authMiddleware and roleMiddleware in combination.

Implementation pattern:

  import { authMiddleware } from '../middleware/authMiddleware.js';
  import { roleMiddleware  } from '../middleware/roleMiddleware.js';

  // Public route
  router.post('/auth/login', authController.login);

  // Protected — any authenticated user
  router.get('/inventory', authMiddleware, inventoryController.getAll);

  // Protected — specific roles
  router.post('/stock/receive',
    authMiddleware,
    roleMiddleware(['admin', 'storekeeper']),
    stockController.receiveStock
  );

  router.patch('/stock-takings/:id/approve',
    authMiddleware,
    roleMiddleware(['admin', 'pao']),
    stockTakingController.approve
  );

  router.post('/users',
    authMiddleware,
    roleMiddleware(['admin']),
    userController.create
  );

roleMiddleware implementation:

  export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
      }
      next();
    };
  };

================================================================================
14. PROTECTED ROUTES — FRONTEND
================================================================================

Frontend route protection is implemented using a PrivateRoute component
that wraps all authenticated routes in AppRoutes.jsx.

PrivateRoute checks:
  1. Is the user authenticated? (isAuthenticated from AuthContext)
     No → redirect to /login
  2. If a required role is specified, does the user have that role?
     No → render <ForbiddenPage /> (403 view)

Usage in AppRoutes.jsx:

  <Route element={<PrivateRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/inventory" element={<InventoryListPage />} />
    ...
  </Route>

  <Route element={<PrivateRoute allowedRoles={['admin']} />}>
    <Route path="/admin/users" element={<UserManagementPage />} />
    <Route path="/admin/audit-log" element={<AuditLogPage />} />
  </Route>

================================================================================
15. SECURITY RULES
================================================================================

  SR-01  Passwords are stored as bcrypt hashes with minimum 10 salt rounds.
         Plain-text passwords are never stored or logged.

  SR-02  JWT_SECRET is stored in the .env file. It is never committed to Git.
         A minimum length of 32 characters is required for the secret.

  SR-03  The database password (DB_PASSWORD) is stored in the .env file only.
         The database port (5432) is not publicly exposed in production.

  SR-04  All API inputs are validated by express-validator before processing.
         Unvalidated user input is never inserted into database queries.

  SR-05  HTTPS is required in production. HTTP traffic is redirected to HTTPS.

  SR-06  The helmet() middleware is applied globally to set secure HTTP headers
         (Content-Security-Policy, X-Frame-Options, etc.).

  SR-07  CORS is configured to allow requests only from the known frontend
         origin (CLIENT_URL environment variable). Wildcard origin (*) is
         not permitted in production.

  SR-08  Backend authorization (roleMiddleware) is the authoritative access
         control. Frontend navigation filtering does not constitute security.

  SR-09  Audit logs are append-only. No code path exists to UPDATE or DELETE
         audit_logs records.

  SR-10  Inactive users (status = 'inactive') cannot authenticate, even if
         they possess a valid JWT token issued before deactivation.
         The authMiddleware checks user status on every request.

================================================================================
16. IMPLEMENTATION REFERENCE
================================================================================

  File locations in the backend project:

  middleware/authMiddleware.js     JWT verification, req.user attachment
  middleware/roleMiddleware.js     Role-based route protection
  services/authService.js          login(), password comparison, JWT signing
  routes/authRoutes.js             POST /auth/login, POST /auth/logout,
                                   GET /auth/me
  backend/.env                     JWT_SECRET, JWT_EXPIRES_IN, DB_PASSWORD
  backend/.env.example             Template with placeholder values (committed)

  File locations in the frontend project:

  context/AuthContext.jsx          user state, token, login(), logout()
  services/api.js                  Axios instance with request/response interceptors
  routes/AppRoutes.jsx             PrivateRoute usage and route definitions
  components/auth/PrivateRoute.jsx Role and authentication guard component

================================================================================
END OF DOCUMENT
================================================================================
