# ASTU Stock Management System
## Backend Architecture

### 1. Overview

The backend of the ASTU Stock Management System is responsible for
handling business logic, data processing, authentication, and
communication with the database.

### 2. Backend Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- Git and GitHub

### 3. Backend Responsibilities

The backend is responsible for:

- User authentication and authorization
- Inventory management
- Stock receiving
- Stock issuing
- Supplier management
- Stock history
- Reports
- Database operations
- API communication with the frontend

### 4. Proposed Folder Structure

```text
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── server.js
└── package.json

## Authentication and Authorization

The system will use authentication to verify the identity of users.

After authentication, authorization will determine what actions a user
is allowed to perform based on their assigned role.

The expected flow is:

```text
User
  ↓
Login API
  ↓
Authentication
  ↓
Token / Session
  ↓
Protected Route
  ↓
Authentication Middleware
  ↓
Authorization Middleware
  ↓
Controller
  ↓
Response
