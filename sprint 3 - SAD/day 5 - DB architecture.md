🚀 Sprint 3 — Day 5
Database Design & Data Modeling

Yesterday we learned:

How does the frontend communicate with the backend?

Today we ask:

How will the backend store and organize the information?

For ASTU Stock Management System, this is very important because the system will contain products, suppliers, sales, purchases, users, and stock information.

🎯 Today's Goals

By the end of today, you should understand:

What a database is
What a collection/table is
What a document/record is
What a field is
What a database schema means
How to identify the main data in your system
How different data are related
How to design your first ASTU Stock data model

Still no serious coding today.

We're designing before implementation.

1. Start with a real example

Imagine your stock shop has:

Laptop       20
Keyboard     50
Mouse        30

You need somewhere to store that information.

That's the job of the database.

Our architecture becomes:

User
 ↓
React
 ↓
API
 ↓
Node + Express
 ↓
MongoDB

Today we're concentrating on:

                 MongoDB
                    │
             ┌──────┴──────┐
             │             │
         Products       Suppliers
             │             │
          Sales        Purchases
2. What is a database?

Simply:

A database stores and organizes the information used by your application.

For ASTU Stock, we need information such as:

Users
Products
Categories
Suppliers
Purchases
Sales
Stock movements

Without a database, if you restart your application, your data could disappear.

3. Database → Collection → Document → Field

Since we're planning to use MongoDB, understand these four concepts.

Think of:

Database
   ↓
Collection
   ↓
Document
   ↓
Field

For example:

ASTUStockDB
    │
    ├── users
    ├── products
    ├── suppliers
    ├── sales
    └── purchases

products is a collection.

Inside it, you might have documents:

{
  "name": "Laptop",
  "quantity": 20,
  "price": 45000
}

The individual pieces are fields:

name
quantity
price
4. Let's design the Product model

Start with one of the most important parts of your system:

Product

Ask yourself:

What information do we need to know about a product?

You might come up with:

Product
├── name
├── description
├── price
├── quantity
├── category
├── supplier
└── createdAt

For example:

{
  "name": "Laptop",
  "description": "Dell business laptop",
  "price": 45000,
  "quantity": 20,
  "category": "Computer",
  "supplier": "ABC Supplier"
}

Notice that this is data design, not UI design.

5. Don't design the database from the screen alone

This is an important software engineering habit.

Your Figma design might show:

Product Name
Price
Quantity
Category

But the database might need additional information:

Product ID
Created Date
Updated Date
Supplier ID
Category ID

So:

Figma
   ↓
What the user needs to see

Database
   ↓
What the system needs to store

They're related, but they're not the same thing.

6. Let's identify ASTU Stock's main data

Look at your system from a business perspective.

👤 Users

Who uses the system?

Admin
Manager
Storekeeper

Possible information:

User
├── name
├── email
├── password
├── role
└── createdAt
📦 Products
Product
├── name
├── price
├── quantity
├── category
├── supplier
└── createdAt
🏷️ Categories

For example:

Computer
Stationery
Electronics
Furniture

Possible data:

Category
├── name
└── description
🚚 Suppliers
Supplier
├── name
├── phone
├── email
├── address
└── createdAt
🛒 Purchases

A purchase records stock coming into the business.

For example:

Supplier
     ↓
100 keyboards purchased
     ↓
Stock increases
💰 Sales

A sale records stock going out.

Customer
     ↓
5 keyboards sold
     ↓
Stock decreases
7. Now notice the relationships

This is where database design becomes interesting.

For example:

Supplier
   │
   │ supplies
   ▼
Product

A supplier might supply many products.

And:

Category
   │
   │ contains
   ▼
Products

One category can contain many products.

And:

User
   │
   │ creates
   ▼
Sale

A user might record many sales.

So our conceptual model starts looking like:

                    USER
                     │
                     │ records
                     ▼
                    SALES
                     │
                     │ contains
                     ▼
                   PRODUCT
                  ↙       ↘
             CATEGORY   SUPPLIER

This is the beginning of data modeling.

8. Why IDs matter

Suppose we have:

Product:
Laptop

and another:

Product:
Laptop

How does the system know which one we're talking about?

We use an ID.

For example:

{
  "_id": "P001",
  "name": "Laptop",
  "price": 45000
}

Then another document can refer to:

P001

This becomes especially important when we connect:

Product
Supplier
Category
Sale
Purchase
9. Example relationship

Suppose:

Category:

_id: C001
name: Electronics

And:

Product:

_id: P001
name: Laptop
categoryId: C001

Now the product says:

My category is C001.

Which means:

Product P001
       │
       │ categoryId = C001
       ▼
Category C001
       │
       ▼
Electronics

This is how related data can be connected.

🔥 10. Think about stock carefully

This is particularly important for your stock management system.

Suppose:

Current stock = 20 laptops

Then:

Purchase 10

Stock becomes:

20 + 10 = 30

Then:

Sale 5

Stock becomes:

30 - 5 = 25

So your system needs to understand:

Purchase → Stock increases

Sale → Stock decreases

This is why database design shouldn't just be:

Product
quantity

You need to think about the business events that change that quantity.

11. Connect Day 4 to Day 5

Yesterday:

POST /api/products

Today:

Where does that product actually go?

The complete flow becomes:

React
  │
  │ POST /api/products
  ▼
Express
  │
  │ Validate
  ▼
Product Model
  │
  ▼
MongoDB
  │
  ▼
products collection

And when retrieving:

MongoDB
   │
   ▼
Backend
   │
   ▼
API
   │
   ▼
React
   │
   ▼
Products page

Now Day 4 + Day 5 are connected.

🧠 12. Schema

You will hear this word constantly during backend development.

A schema describes what information a document should contain and often the rules for that information.

For example:

Product Schema

name       → required, text
price      → required, number
quantity   → required, number
category   → reference
supplier   → reference
createdAt  → date

Conceptually:

Product
────────────────────
name       String
price      Number
quantity   Number
category   ID
supplier   ID
createdAt  Date

Later, when you work with Mongoose, you'll turn this design into actual code.

Not today.

✍️ Your Day 5 Practice

This is where you should spend most of today's time.

Task 1 — Identify entities

Create a document:

Sprint 3 - SAD/
└── Day 5/
    └── Database Design

Write down the main entities you think ASTU Stock needs.

Start with:

1. User
2. Product
3. ...

Don't immediately copy my list. Look at your SRS and Figma screens and identify them yourself.

Task 2 — Design Product

Create:

PRODUCT
────────────────────
Field       Type       Required?
───────────────────────────────
id          ?
name        ?
price       ?
quantity    ?
category    ?
supplier    ?
createdAt   ?

Fill in the answers yourself.

Task 3 — Design User

Think about your login page.

Create:

USER
────────────────────
Field       Type       Required?
───────────────────────────────
id          ?
name        ?
email       ?
password    ?
role        ?
createdAt   ?

Again, try yourself first.

Task 4 — Design Supplier

Create your own:

SUPPLIER

Field       Type       Required?
───────────────────────────────
?
?
?
?
Task 5 — Draw relationships

Try drawing:

USER
 │
 ├──── records ────> SALE
 │
 └──── records ────> PURCHASE


CATEGORY
 │
 └──── contains ───> PRODUCT


SUPPLIER
 │
 └──── supplies ───> PRODUCT

Then think:

Is this always correct for my actual ASTU Stock requirements?

That's important.

Don't blindly accept my model. Your SRS is the authority for your project.

🧪 Day 5 Challenge

Here's your main challenge.

Imagine this scenario:

A storekeeper purchases 10 keyboards from a supplier.

Explain the data flow:

Storekeeper
     ↓
Purchase Form
     ↓
Frontend
     ↓
API
     ↓
Backend
     ↓
Database

Then answer:

Which data is saved?
Which collection is affected?
Which product is affected?
Which supplier is affected?
What happens to the stock quantity?

Then do the opposite:

The storekeeper sells 3 keyboards.

Explain what changes.

🔗 Your Sprint 3 progression

Now look at what you've accomplished:

DAY 3
Architecture
    ↓
"How are the parts connected?"

DAY 4
API Design
    ↓
"How do they communicate?"

DAY 5
Database Design
    ↓
"How is the information stored?"

And soon:

DAY 6
Authentication & Authorization
    ↓
"Who can access what?"

DAY 7
Architecture Review
    ↓
"Can I explain my entire system?"

Then Sprint 3 will be much more complete.