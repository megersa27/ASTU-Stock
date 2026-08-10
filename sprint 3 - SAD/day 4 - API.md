🚀 Sprint 3 — Day 4
API Design & Data Flow

Yesterday we learned how the parts of ASTU Stock communicate:

User
 ↓
React Frontend
 ↓
API
 ↓
Node + Express Backend
 ↓
MongoDB

Today we go one level deeper:

What exactly does the frontend ask the backend to do, and how does the backend respond?

This is the foundation you'll need before we start actual frontend/backend development.

🎯 Day 4 Goals

By the end of today, you should understand:

What an API endpoint is
HTTP methods: GET, POST, PUT/PATCH, DELETE
Request vs response
URL/endpoint
JSON
CRUD
How to design APIs for ASTU Stock
How frontend and backend connect through APIs

No serious coding today. We're designing first.

1. What is an API?

Think of the API as a waiter.

Customer
   ↓
"Give me the menu."
   ↓
Waiter
   ↓
Kitchen

In your application:

React
   ↓
API request
   ↓
Express Backend
   ↓
MongoDB

The frontend doesn't directly manipulate MongoDB.

Instead:

Frontend → API → Backend → Database
2. What is an endpoint?

An endpoint is a specific address where the frontend can request an operation.

For example:

GET /api/products

means:

"Give me the products."

Another:

POST /api/products

means:

"Create a new product."

So:

/api/products

is the resource, while:

GET
POST

determines what we want to do with it.

3. The four HTTP methods you need

You should know these very well.

Method	Meaning	ASTU Stock example
GET	Read	Get products
POST	Create	Add product
PUT/PATCH	Update	Change product
DELETE	Delete	Remove product

This is called CRUD:

C → Create
R → Read
U → Update
D → Delete
4. ASTU Stock Product API

Let's design our first API.

Get all products
GET /api/products

Frontend says:

"Give me all products."

Backend responds:

[
  {
    "id": "1",
    "name": "Laptop",
    "quantity": 20,
    "price": 45000
  },
  {
    "id": "2",
    "name": "Keyboard",
    "quantity": 50,
    "price": 1500
  }
]

React then displays them.

5. Add a product

Suppose the storekeeper fills out:

Product Name: Keyboard
Quantity: 50
Price: 1500

Then clicks:

[ Add Product ]

React sends:

POST /api/products

with JSON:

{
  "name": "Keyboard",
  "quantity": 50,
  "price": 1500
}

The backend receives it.

Then:

Backend
   ↓
Validate information
   ↓
Save product
   ↓
MongoDB

Then backend responds:

{
  "message": "Product created successfully"
}

Frontend can show:

✅ Product added successfully!
6. Update a product

Suppose quantity changes:

Keyboard
50 → 70

Frontend could send:

PATCH /api/products/2

with:

{
  "quantity": 70
}

Backend updates MongoDB.

7. Delete a product

If the administrator wants to remove product 2:

DELETE /api/products/2

Backend deletes it.

Then:

{
  "message": "Product deleted successfully"
}
🧠 8. Notice the pattern

You should start seeing this:

GET       /api/products
POST      /api/products

GET       /api/products/:id
PATCH     /api/products/:id
DELETE    /api/products/:id

The important idea is:

/api/products

represents the product resource.

The HTTP method tells us what we're doing.

9. Request vs Response

This is another important concept.

Request

Frontend → Backend

"Here is what I want."

For example:

{
  "name": "Laptop",
  "quantity": 20,
  "price": 45000
}
Response

Backend → Frontend

"Here is the result."

For example:

{
  "message": "Product created successfully"
}

Or:

{
  "id": "1",
  "name": "Laptop",
  "quantity": 20,
  "price": 45000
}
🔄 10. Complete data flow

Let's follow Add Product from beginning to end.

Storekeeper
     │
     │ fills form
     ▼
React Frontend
     │
     │ POST /api/products
     │
     │ { name, quantity, price }
     ▼
Express API
     │
     ▼
Validation
     │
     ▼
Business Logic
     │
     ▼
MongoDB
     │
     │ save product
     ▼
Express Backend
     │
     │ response
     ▼
React Frontend
     │
     ▼
"Product added successfully!"

This is what you were learning yesterday, but today we're making the communication much more concrete.

🏪 11. Let's expand beyond Products

Your system won't only have products.

Eventually we'll have resources such as:

Users
Products
Categories
Suppliers
Purchases
Sales
Stock
Reports

So your API might eventually look something like:

/api/users
/api/products
/api/categories
/api/suppliers
/api/purchases
/api/sales
/api/stock
/api/reports

Don't build all of these today.

We're just learning to think like an API designer.

🔐 12. Authentication API

Remember the login page you designed in Figma?

The frontend could send:

POST /api/auth/login

with:

{
  "email": "user@example.com",
  "password": "mypassword"
}

Backend:

Receive credentials
       ↓
Validate
       ↓
Find user
       ↓
Check password
       ↓
Generate authentication information
       ↓
Send response

Then frontend can take the user to:

Dashboard

We'll go much deeper into authentication later.

👥 13. Why API design matters for your team

This connects directly to the GitHub collaboration practice you did.

Imagine your team has:

Developer A → Frontend
Developer B → Backend

If both agree on:

GET /api/products
POST /api/products
PATCH /api/products/:id
DELETE /api/products/:id

the frontend developer can build the UI knowing:

"These are the endpoints the backend will provide."

And the backend developer knows:

"These are the endpoints the frontend expects."

That's how two developers can work independently while producing one connected application.

📝 Your Day 4 Practice

Now it's your turn.

Task 1 — Design Product API

Create a small table in your Sprint 3 - SAD/Day 4 folder:

Action	Method	Endpoint
Get all products	?	?
Get one product	?	?
Add product	?	?
Update product	?	?
Delete product	?	?

Try to fill it yourself before looking back at the examples above.

Task 2 — Design Supplier API

Now do the same thing without my answer.

Think:

GET
POST
PATCH
DELETE

and:

/api/suppliers

Create the endpoints yourself.

Task 3 — Draw one complete flow

Draw this:

Storekeeper
     ↓
Add Product Form
     ↓
React
     ↓
POST /api/products
     ↓
Express
     ↓
MongoDB
     ↓
Response
     ↓
React
     ↓
Success message

Then explain each arrow in your own words.

🧪 Day 4 Challenge

Here's the most important exercise.

Imagine the storekeeper wants to see all products.

Write the complete process:

1. User ______________________

2. React _____________________

3. API _______________________

4. Backend ___________________

5. MongoDB ___________________

6. Database returns ___________

7. Backend ___________________

8. React _____________________

9. User sees _________________

Try doing this without looking at my explanation.

📁 Your Sprint 3 structure

Your work should now look something like:

Sprint 3 - SAD/
│
├── Day 1/
│
├── Day 2/
│
├── Day 3/
│   ├── Architecture Diagram
│   └── Data Flow
│
└── Day 4/
    ├── Product API Design
    ├── Supplier API Design
    └── API Data Flow

