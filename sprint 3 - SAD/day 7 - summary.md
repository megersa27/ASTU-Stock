🚀 Sprint 3 — Day 7
Architecture Review & System Blueprint

Congratulations! 🎉 You have reached the last day of Sprint 3.

This day is different from the previous days.

We are not learning a completely new topic today.

Instead, we're going to connect everything you learned during Sprint 3 and make sure you can explain your ASTU Stock Management System without depending on me or Kiro.

🎯 Sprint 3 Review

Look at your journey:

Day 1
Technical Requirements
        ↓
"What does the system need?"

Day 2
System Analysis
        ↓
"What are the users and system functions?"

Day 3
System Architecture
        ↓
"How are the major parts connected?"

Day 4
API Design
        ↓
"How do the parts communicate?"

Day 5
Database Design
        ↓
"How is information stored?"

Day 6
Authentication & Authorization
        ↓
"Who can access the system and what can they do?"

Day 7
Architecture Review
        ↓
"Can I explain the whole system?"

Today you're going to prove that you understand this chain.

🧠 Part 1 — Your Complete Architecture

Start with the biggest picture.

                         ASTU STOCK MANAGEMENT SYSTEM

                                👤 USER
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    FRONTEND     │
                         │ React + Vite    │
                         └────────┬────────┘
                                  │
                              HTTP / API
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     BACKEND     │
                         │ Node + Express  │
                         └────────┬────────┘
                                  │
                             Mongoose
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    DATABASE     │
                         │    MongoDB      │
                         └─────────────────┘

Don't worry about writing code yet.

You should be able to look at this and explain what each box does.

🖥️ Part 2 — Frontend

Ask yourself:

What does the frontend do?

Your answer should be something like:

The frontend provides the user interface and allows users to interact with the system.

For ASTU Stock, this could include:

Login
Dashboard
Products
Suppliers
Purchases
Sales
Stock
Reports
Users
Settings

And you already practiced designing these screens in Figma.

⚙️ Part 3 — Backend

Ask:

What does the backend do?

Think:

Frontend
    ↓
Request
    ↓
Backend
    ↓
Business logic
    ↓
Database

The backend will eventually handle things like:

Authentication
Authorization
Product management
Supplier management
Sales
Purchases
Stock calculations
Reports
Validation

So:

Frontend presents and collects information. Backend processes and controls it.

🗄️ Part 4 — Database

Your database stores the system's persistent information.

You have already started identifying entities such as:

Users
Products
Categories
Suppliers
Purchases
Sales

Conceptually:

MongoDB
│
├── users
├── products
├── categories
├── suppliers
├── purchases
└── sales

Remember:

Frontend ≠ Database
Backend ≠ Database

The backend acts as the main intermediary between your application and the database.

🌉 Part 5 — API

Now connect Day 4.

For example:

React
  │
  │ GET /api/products
  ▼
Express
  │
  ▼
MongoDB

MongoDB returns the data:

MongoDB
  │
  ▼
Express
  │
  ▼
React
  │
  ▼
Products page

So API communication looks like:

REQUEST
Frontend ──────────────→ Backend

RESPONSE
Frontend ←────────────── Backend
🔐 Part 6 — Authentication

Now connect Day 6.

Imagine the user opens your login page.

User
 ↓
Login Form
 ↓
React
 ↓
POST /api/auth/login
 ↓
Backend
 ↓
Database
 ↓
Verify user

If the credentials are correct:

Authentication
      ↓
     ✅
      ↓
Authenticated user
      ↓
Dashboard
🛡️ Part 7 — Authorization

Now the system knows:

"This is a Storekeeper."

But that's not enough.

The backend asks:

"What is this Storekeeper allowed to do?"

For example:

Storekeeper
    │
    ├── View products       ✅
    ├── Add stock           ✅
    ├── Record sales        ✅
    └── Manage users        ❌

This gives you:

Authentication
       ↓
Who are you?

Authorization
       ↓
What can you do?
🔄 Part 8 — Complete Example

Now let's combine all six days.

Scenario:

A storekeeper logs in and adds a new product.

Start here:

Storekeeper
     ↓
Login screen
     ↓
React
     ↓
POST /api/auth/login
     ↓
Backend
     ↓
Database
     ↓
Credentials verified
     ↓
Authentication successful
     ↓
Dashboard

Then:

Storekeeper
     ↓
Products
     ↓
Add Product
     ↓
React
     ↓
POST /api/products
     ↓
Backend
     ↓
Validate data
     ↓
Check authorization
     ↓
MongoDB
     ↓
Product saved
     ↓
Response
     ↓
React
     ↓
"Product added successfully"

This is the kind of flow you should be able to explain before you start development.

🧩 Part 9 — Your System Blueprint

Now create your own final architecture diagram.

I recommend something like:

                         ASTU STOCK MANAGEMENT SYSTEM

                                  USERS
                                    │
                                    ▼
                        ┌────────────────────┐
                        │      FRONTEND      │
                        │   React + Vite     │
                        │                    │
                        │ Login              │
                        │ Dashboard          │
                        │ Products           │
                        │ Suppliers          │
                        │ Purchases          │
                        │ Sales              │
                        │ Reports            │
                        └─────────┬──────────┘
                                  │
                              REST API
                                  │
                                  ▼
                        ┌────────────────────┐
                        │       BACKEND      │
                        │  Node + Express    │
                        │                    │
                        │ Authentication     │
                        │ Authorization      │
                        │ Business Logic     │
                        │ Validation         │
                        │ API Routes         │
                        └─────────┬──────────┘
                                  │
                              Mongoose
                                  │
                                  ▼
                        ┌────────────────────┐
                        │      MongoDB       │
                        │                    │
                        │ Users              │
                        │ Products           │
                        │ Categories         │
                        │ Suppliers          │
                        │ Purchases          │
                        │ Sales              │
                        └────────────────────┘
Don't copy this immediately.

Try to draw your own version first.

You can do it in:

Figma
LibreOffice Draw
Paper
Your notebook

Since you already know Figma, I recommend Figma.

🧪 Part 10 — Your Sprint 3 Final Challenge

Now close this conversation for a moment. 😄

Without looking back, answer these questions in your own words.

Question 1

What is the job of the frontend?

Question 2

What is the job of the backend?

Question 3

Why don't we let React directly connect to MongoDB?

Question 4

What is an API?

Question 5

What's the difference between:

GET
POST
PATCH
DELETE
Question 6

What is CRUD?

Question 7

What is a database collection?

Question 8

What is a document?

Question 9

What's the difference between authentication and authorization?

Question 10

What happens when a Storekeeper logs in?

🏆 Final Challenge — Explain Your System

This is the most important activity of Sprint 3 Day 7.

Imagine that tomorrow you meet your real development team.

Your backend developer asks:

"Megersa, how is our system going to work?"

You should be able to stand in front of the team and explain:

User
 ↓
Frontend
 ↓
API
 ↓
Backend
 ↓
Database

Then explain:

Authentication
Authorization
API
Database
Business logic

And finally explain one complete use case:

"A storekeeper adds a product."

If you can explain the complete flow without copying my answer, Sprint 3 has done its job. 🎯

📁 What to put inside Day 7

Your structure can be:

Sprint 3 - SAD/
│
├── Day 1/
├── Day 2/
├── Day 3/
├── Day 4/
├── Day 5/
├── Day 6/
└── Day 7/
    ├── Final Architecture Diagram
    ├── Complete Data Flow
    ├── Authentication Flow
    ├── Authorization / Role Matrix
    └── Sprint 3 Review
🔗 And then GitHub

Since you've now practiced collaboration separately, you can use your normal workflow to save today's work:

git status
git add .
git commit -m "docs: complete sprint 3 architecture review"
git push
🧠 The Big Picture

You started this project by thinking about what the system should look like.

Now you're beginning to think about how the system actually works.

Your progression is:

                    YOUR PROJECT

                 PRODUCT IDEA
                      ↓
                   SRS
                      ↓
                  UX / UI
                      ↓
                   FIGMA
                      ↓
              SYSTEM ARCHITECTURE
                      ↓
                  API DESIGN
                      ↓
                DATABASE DESIGN
                      ↓
           AUTHENTICATION & AUTHORIZATION
                      ↓
                 DEVELOPMENT 🚀