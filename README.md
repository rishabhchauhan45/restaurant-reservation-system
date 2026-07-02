# 🍽️ ReserveIt — Restaurant Reservation Management System

A production-quality, full-stack restaurant reservation management system built with the MERN stack. Features smart table assignment, role-based access control, and a premium dark-themed UI.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Tech Stack](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Routes](#api-routes)
- [Reservation Logic](#reservation-logic)
- [Authentication Flow](#authentication-flow)
- [Role-Based Access](#role-based-access)
- [Deployment Steps](#deployment-steps)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## 🏗️ Project Overview

ReserveIt is a complete restaurant reservation system enabling:

- **Customers** to browse availability, book tables, view their reservations, and cancel bookings.
- **Admins** to manage all reservations, filter by date, update/cancel any reservation, and perform full CRUD operations on restaurant tables.

The system uses **smart table assignment** — automatically finding the smallest suitable table available for the requested date, time, and party size.

---

## 🏛️ Architecture

```
Restaurant Reservation Management System/
├── backend/                    # Express.js REST API
│   ├── config/                 # Database configuration
│   ├── controllers/            # Request handlers (MVC)
│   ├── middleware/              # Auth, role, error handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── seeds/                  # Database seeder
│   ├── utils/                  # Validation utilities
│   └── server.js               # App entry point
├── frontend/                   # React (Vite) SPA
│   ├── src/
│   │   ├── api/                # Axios instance
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/          # Admin-specific components
│   │   │   ├── common/         # Shared components
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── reservation/    # Booking components
│   │   ├── context/            # React Context (Auth)
│   │   ├── hooks/              # Custom hooks
│   │   └── pages/              # Page components
│   └── index.html              # HTML entry
├── .gitignore
└── README.md
```

### Design Pattern: MVC (Model-View-Controller)

- **Models**: Mongoose schemas defining data structure and validation
- **Controllers**: Business logic for handling API requests
- **Routes**: Express route definitions mapping URLs to controllers
- **Middleware**: Cross-cutting concerns (auth, error handling, role checks)

---

## ⚙️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite 5, Tailwind CSS 3   |
| Backend    | Node.js, Express.js 4              |
| Database   | MongoDB Atlas, Mongoose 8          |
| Auth       | JWT (jsonwebtoken), bcryptjs       |
| HTTP       | Axios                              |
| Routing    | React Router DOM 6                 |
| Validation | express-validator                   |
| UI         | react-icons, react-hot-toast       |

---

## 🚀 Installation

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Restaurant Reservation Management System"
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
```

### 3. Configure Environment Variables

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/restaurant-reservations?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- 6 restaurant tables (Table 1-6 with capacities 2, 2, 4, 4, 6, 8)
- 1 admin user: `admin@restaurant.com` / `Admin@123`

### 5. Start Backend

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 6. Frontend Setup

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 📡 API Routes

### Authentication

| Method | Endpoint            | Access         | Description           |
|--------|---------------------|----------------|-----------------------|
| POST   | `/api/auth/register`| Public         | Register new user     |
| POST   | `/api/auth/login`   | Public         | Login & get JWT       |
| GET    | `/api/auth/me`      | Authenticated  | Get current user      |

### Reservations

| Method | Endpoint                        | Access         | Description              |
|--------|---------------------------------|----------------|--------------------------|
| POST   | `/api/reservations`             | Customer       | Create reservation       |
| GET    | `/api/reservations/my`          | Customer       | Get own reservations     |
| GET    | `/api/reservations`             | Admin          | Get all (filter: ?date=) |
| PUT    | `/api/reservations/:id`         | Admin          | Update reservation       |
| PATCH  | `/api/reservations/:id/cancel`  | Authenticated  | Cancel reservation       |

### Tables

| Method | Endpoint          | Access         | Description     |
|--------|-------------------|----------------|-----------------|
| GET    | `/api/tables`     | Authenticated  | Get all tables  |
| POST   | `/api/tables`     | Admin          | Create table    |
| PUT    | `/api/tables/:id` | Admin          | Update table    |
| DELETE | `/api/tables/:id` | Admin          | Delete table    |

---

## 🧠 Reservation Logic

The smart table assignment algorithm:

```
1. Customer submits: date, timeSlot, guests
2. Query all tables where capacity >= guests
3. Sort results by capacity ASC (smallest suitable first)
4. For each table (smallest to largest):
   a. Check if table has a confirmed reservation for same date + timeSlot
   b. If available → assign this table → save reservation → return details
   c. If booked → try next table
5. If no table is available → return HTTP 409:
   { "message": "No tables available for selected time." }
```

**Why smallest-first?** Optimizes restaurant capacity utilization — a party of 2 gets a 2-seat table before a 4-seat table.

**Duplicate prevention:** A compound partial index on `(table, reservationDate, timeSlot)` with filter `status: 'confirmed'` prevents double-booking at the database level.

---

## 🔐 Authentication Flow

```
1. User registers/logs in → server validates credentials
2. Server generates JWT with user ID → returns token + user data
3. Client stores token in localStorage
4. Every API request includes: Authorization: Bearer <token>
5. Auth middleware verifies token → attaches user to request
6. On 401 response → client clears storage → redirects to login
```

**Password Security:**
- Passwords hashed with bcrypt (12 salt rounds) before storage
- Raw passwords never stored or logged
- Password field excluded from queries by default (`select: false`)

---

## 👥 Role-Based Access

| Feature                   | Customer | Admin |
|---------------------------|----------|-------|
| Register                  | ✅       | ❌    |
| Login                     | ✅       | ✅    |
| Book reservation          | ✅       | ❌    |
| View own reservations     | ✅       | ❌    |
| Cancel own reservation    | ✅       | ✅    |
| View all reservations     | ❌       | ✅    |
| Update any reservation    | ❌       | ✅    |
| Cancel any reservation    | ❌       | ✅    |
| Manage tables (CRUD)      | ❌       | ✅    |

**Route Protection:**
- Frontend: `ProtectedRoute` component checks auth + role before rendering
- Backend: `protect` middleware verifies JWT, `authorize(role)` middleware checks role

---

## 🚢 Deployment Steps

### Frontend → Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Push code to GitHub
2. Create a **Web Service** on [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Set environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — your secret key
   - `JWT_EXPIRE` — `7d`
   - `NODE_ENV` — `production`

### MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (or allow access from anywhere: `0.0.0.0/0`)
4. Get connection string → paste in `MONGO_URI`
5. Run seed script to populate initial data

---

## 📌 Assumptions

1. **Time slots are fixed** — 12 predefined hourly slots from 10 AM to 9 PM
2. **One reservation per slot** — each table can only have one confirmed reservation per date/time slot
3. **Customers register themselves** — admin accounts are created via seed script only
4. **No payment processing** — reservations are free to make
5. **Date format** — stored as `YYYY-MM-DD` string for simplicity
6. **Single restaurant** — the system manages one restaurant location

---

## ⚠️ Known Limitations

1. **No email notifications** — users are not notified via email about reservation status
2. **No password reset** — forgot password flow is not implemented
3. **No reservation editing by customer** — customers can only cancel, not modify
4. **No walk-in management** — only handles pre-booked reservations
5. **No waitlist** — when all tables are booked, there's no waitlist option
6. **Time zone handling** — dates are stored as strings without timezone context
7. **No rate limiting** — API endpoints don't have request rate limiting

---

## 🔮 Future Improvements

- [ ] Email notifications (booking confirmation, reminders, cancellation)
- [ ] Password reset flow with email verification
- [ ] Customer reservation modification (not just cancellation)
- [ ] Recurring reservations
- [ ] Waitlist system when fully booked
- [ ] Real-time updates with WebSockets
- [ ] Table layout visualization
- [ ] Analytics dashboard for admins
- [ ] Multi-restaurant support
- [ ] Rate limiting and request throttling
- [ ] Comprehensive test suite (unit + integration)
- [ ] API documentation with Swagger/OpenAPI

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
