🚀 Sprint 3 — Day 3
Software Architecture: Understanding How the System Works

You already completed:

✅ Product planning
✅ UX/UI design
✅ Wireframes
✅ Design system
✅ High-fidelity design
✅ SRS
✅ Git/GitHub basics
✅ Some GitHub collaboration practice

Now we're moving from:

"What should the system do?"

to:

"How will the system actually be built?"

That's the purpose of Software Architecture / SAD.

🎯 Today's Goal

By the end of Day 3, you should understand:

User
 ↓
Frontend
 ↓
Backend/API
 ↓
Database

and be able to explain:

What frontend does
What backend does
What database does
What API does
How they communicate
Why we separate them
How your ASTU Stock Management System will be organized

No coding today.

We're learning the architecture before we start development.

🧠 Part 1 — Think about your system as a restaurant

Imagine a restaurant.

Customer
   ↓
Waiter
   ↓
Kitchen
   ↓
Storage

The customer doesn't walk into the kitchen and directly modify the ingredients.

Instead:

Customer
   ↓
Waiter
   ↓
Kitchen
   ↓
Storage

A web application works similarly.

User
 ↓
Frontend
 ↓
Backend
 ↓
Database

Now let's understand each one.

🖥️ Part 2 — Frontend

Frontend is what the user sees and interacts with.

For ASTU Stock:

Login
Dashboard
Products
Suppliers
Sales
Purchases
Reports
Users
Settings

For example:

┌───────────────────────────────────────┐
│ ASTU STOCK                 👤 Admin   │
├───────────┬───────────────────────────┤
│ Dashboard │                           │
│ Products  │       Products            │
│ Suppliers │                           │
│ Sales     │  + Add Product            │
│ Reports   │                           │
│           │  Laptop       20          │
│           │  Keyboard     50          │
└───────────┴───────────────────────────┘

That's frontend.

You already practiced this part through Figma.

But there's an important difference:

Figma
Design
React
Real interactive application

For example, Figma shows:

[Add Product]

React makes that button actually work.

⚙️ Part 3 — Backend

Backend is the logic behind the application.

The user doesn't normally see it.

For example, the user clicks:

[Add Product]

Frontend sends information to backend.

Backend checks:

Is the user authenticated?
Is the product name valid?
Is quantity valid?
Does the product already exist?

Then backend communicates with the database.

🗄️ Part 4 — Database

Database stores your application's information.

For ASTU Stock, you may have things such as:

Users
Products
Categories
Suppliers
Purchases
Sales
Stock movements

For example:

Products

ID    Name        Quantity    Price
--------------------------------------
1     Laptop      20          45000
2     Keyboard    50          1500
3     Mouse       30          800

MongoDB will eventually store this data.

🌉 Part 5 — What is an API?

This is one of the most important concepts for your development sprint.

API is basically the communication channel between frontend and backend.

Think:

Frontend
   │
   │ "Give me all products."
   ▼
 API
   │
   ▼
Backend
   │
   │ "Let me check the database."
   ▼
Database

Then the response comes back:

Database
   ↓
Backend
   ↓
API
   ↓
Frontend
   ↓
User sees products
🔥 Example

User opens:

Products

React sends:

GET /api/products

Backend receives it.

Backend asks MongoDB:

Give me all products.

MongoDB returns:

[
  {
    "name": "Laptop",
    "quantity": 20
  },
  {
    "name": "Keyboard",
    "quantity": 50
  }
]

Backend sends that back to React.

React displays:

Products

Laptop       20
Keyboard     50

That is the basic architecture of your application.

🏗️ Part 6 — Your ASTU Stock architecture

For your project, we're going to use something approximately like:

                    USER
                      │
                      ▼
                ┌───────────┐
                │ FRONTEND  │
                │   React   │
                └─────┬─────┘
                      │
                  HTTP/API
                      │
                      ▼
                ┌───────────┐
                │  BACKEND  │
                │ Node/     │
                │ Express   │
                └─────┬─────┘
                      │
                  Mongoose
                      │
                      ▼
                ┌───────────┐
                │ DATABASE  │
                │  MongoDB  │
                └───────────┘

Remember this diagram.

It's going to become the foundation for your development.

🧩 Part 7 — Why separate frontend and backend?

Imagine putting everything together:

one giant folder
   ↓
UI
logic
database
authentication
everything

It becomes difficult to maintain.

Instead:

ASTU-stock-management-system/

├── frontend/
│
├── backend/
│
└── docs/

Now responsibilities are clear.

Frontend
frontend/
    ↓
User interface
Backend
backend/
    ↓
Business logic + API
Database
MongoDB
    ↓
Data storage
🔐 Part 8 — Authentication

Your system will also need authentication.

For example:

User
 ↓
Login
 ↓
Frontend
 ↓
Backend
 ↓
Check credentials
 ↓
Database
 ↓
Authentication result

If correct:

✅ Login successful
       ↓
Dashboard

If incorrect:

❌ Invalid email/password

Later, you'll learn:

Password hashing
JWT
Authentication
Authorization
Protected routes
Roles

For example:

Admin
Manager
Storekeeper

Different users can have different permissions.

👥 Part 9 — Architecture and your team

Now your three-person collaboration makes more sense.

Suppose:

Person 1 — SRS/SAD

Defines:

What should the system do?
How should it be structured?
Person 2 — Frontend

Builds:

React UI
Person 3 — Backend

Builds:

Node + Express API
MongoDB
Authentication
Business logic

But they must agree on the API contract.

For example:

POST /api/products

Request:
{
   name,
   quantity,
   price
}

Frontend knows what to send.

Backend knows what to receive.

That's how independent developers eventually create one system.

🧠 Part 10 — The most important distinction

Don't confuse these:

SRS

What should the system do?

Example:

The storekeeper shall be able to add products.

SAD

How will we build it?

Example:

React
 ↓
Express API
 ↓
MongoDB
Figma

What should the interface look like?

Example:

[ Product Name ]
[ Quantity     ]
[ Price        ]

[ Add Product ]
Code

Actually make it work.

React + Node + MongoDB

So your whole project flows like:

SRS
"What?"

   ↓

SAD
"How?"

   ↓

Figma
"What will it look like?"

   ↓

Development
"Let's build it."

   ↓

Testing
"Does it work?"

   ↓

Deployment
"Let's release it."
✍️ Your Day 3 Practice

Don't ask Kiro to do this for you yet.

Open a paper, notebook, Figma, or your Sprint 3 - SAD/Day 3 folder.

Task 1 — Draw your architecture

Draw:

User
 ↓
React
 ↓
API
 ↓
Node/Express
 ↓
MongoDB

Then add:

Authentication

and show where it belongs.

Task 2 — Explain this scenario

Write the data flow for:

A storekeeper logs in and views the products.

Try to write it yourself:

1. User opens ______
2. Frontend sends ______
3. Backend checks ______
4. Backend requests ______
5. Database returns ______
6. Backend sends ______
7. Frontend displays ______

Don't worry about being perfect.

Task 3 — Draw "Add Product"

Show:

Storekeeper
     ↓
Add Product Form
     ↓
Frontend
     ↓
API
     ↓
Backend
     ↓
MongoDB
     ↓
Response
     ↓
Frontend
     ↓
Success message
📁 What to save in Sprint 3 Day 3

Your folder can contain:

Sprint 3 - SAD/
│
├── Day 1/
├── Day 2/
└── Day 3/
    │
    ├── architecture-diagram
    ├── data-flow
    └── notes

