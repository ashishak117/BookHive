# 📚 BookHive – Full-Stack Bookstore Management System

**BookHive** is a complete full-stack web application built using **Angular**, **Spring Boot**, and **MySQL**.  
It allows **users** to browse, borrow, and purchase books, while **admins** can manage the entire bookstore system.

---

## 🚀 Tech Stack

### 🌐 Frontend
- Angular 17+
- TypeScript
- Bootstrap 5
- RxJS + Signals
- JWT Authentication
- Angular Routing & Guards

### ⚙️ Backend
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- MySQL 8
- Lombok

---

## 🧠 Key Features

### 👤 User Features
- Register & Login (JWT Authentication)
- Browse available books
- Add to Cart & Checkout
- Choose payment method (COD / Card)
- Track orders and delivery status

### 🛠️ Admin Features
- Add, Edit, Publish/Unpublish, Delete Books
- Manage Orders & Status Updates
- Dashboard showing Sales & Borrow Stats
- Secure Admin Routes with Role-based Guard

---

## ⚙️ Setup Instructions

### 🧩 Prerequisites
- Node.js ≥ 18  
- Angular CLI ≥ 17  
- Java ≥ 17  
- MySQL ≥ 8  

---

### 🗄️ Database Setup

1. Create and populate database:
   ```sql
   SOURCE Backend/src/main/resources/schema.sql;
Default Admin credentials:

Email: admin@bookhive.com

Password: admin123

🧱 Backend Setup
bash
Copy code
cd Backend
mvn spring-boot:run
📍 Backend will run at: http://localhost:8080/api

💻 Frontend Setup
bash
Copy code
cd Frontend/bookhive
npm install
npm start
🌍 Frontend will run at: http://localhost:4200

🔑 Default Credentials
Role	Email	Password
Admin	admin@bookhive.com	admin123
User	Register manually	—

🔐 Authentication Flow
User registers/logs in → JWT token is issued.

Token stored in localStorage as bh_token.

Every HTTP request includes Authorization: Bearer <token>.

Spring Boot validates token via JwtAuthFilter.

🧾 API Endpoints Summary
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT
GET	/api/auth/me	Fetch authenticated user info

Books
Method	Endpoint	Description
GET	/api/books	List all published books
POST	/api/admin/books	Add new book (Admin only)
PUT	/api/admin/books/{id}	Update book
DELETE	/api/admin/books/{id}	Delete book

Orders
Method	Endpoint	Description
POST	/api/orders	Place a new order
GET	/api/orders/mine	Get logged-in user orders
GET	/api/admin/orders	Get all orders (Admin only)

🧪 Testing with Postman
Login via:

bash
Copy code
POST http://localhost:8080/api/auth/login
Example body:

json
Copy code
{
  "email": "admin@bookhive.com",
  "password": "admin123"
}
Copy the token from response.

Add header to all API requests:

makefile
Copy code
Authorization: Bearer <your_token>
📊 Admin Dashboard Metrics
Total Users

Total Books

Total Sales & Borrow Revenue

Live Order Statistics

💳 Checkout Flow
User adds items to cart.

Chooses Cash on Delivery or Card (demo).

System creates an order record.

Admin can manage order statuses:
Confirmed → Shipped → Out for Delivery → Delivered → Closed

🧱 Error Handling
400 – Bad Request (Invalid payload)

401 – Unauthorized (Invalid/missing token)

403 – Forbidden (Access denied)

404 – Not Found

500 – Internal Server Error

🧰 Developer Notes
Backend base URL → http://localhost:8080/api

Frontend base URL → http://localhost:4200

JWT expiry time: 24 hours

CORS enabled for http://localhost:4200

---

THANBK YOU

---






