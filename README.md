# 🚗 MERN Car Rental

A full-stack Car Rental web application built with the **MERN stack** (MongoDB, Express, React, Node.js). The platform supports multiple user roles — **Admin**, **Car Owner**, **Customer**, and **Driver** — each with their own dashboard and feature set.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [User Roles](#user-roles)

---

## ✨ Features

- User authentication with JWT (login / signup / OTP email verification)
- Role-based dashboards: Admin, Car Owner, Customer, Driver
- Car listing, management, and image uploads via Cloudinary
- Booking system with status tracking
- Interactive location/map support using Leaflet & React-Leaflet
- Scheduled background tasks with node-cron
- Responsive UI built with Tailwind CSS
- Toast notifications with react-hot-toast

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client |
| Leaflet / React-Leaflet | Interactive maps |
| Moment.js | Date formatting |
| React Icons | Icon library |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| bcrypt / bcryptjs | Password hashing |
| Cloudinary + Multer | Image upload & storage |
| node-cron | Scheduled jobs |
| dotenv | Environment configuration |
| nodemon | Development auto-restart |

---

## 📁 Project Structure

```
MERN-Car-Rental/
├── client/                  # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── config/
│       ├── context/         # UserContext (global auth state)
│       ├── pages/
│       │   ├── Auth/        # Login, Signup
│       │   ├── Booking/
│       │   ├── Dashboard/   # Admin, CarOwner, Customer, Driver dashboards
│       │   ├── InfoPages/   # About, Contact, FAQs
│       │   └── Home.jsx
│       └── utils/
│
└── server/                  # Express backend
    ├── config/              # DB & Cloudinary config
    ├── controllers/         # Route handlers
    ├── middlewares/         # Auth & upload middleware
    ├── models/              # Mongoose models
    ├── routes/              # API route definitions
    ├── templates/           # Email templates
    ├── uploads/             # Local file uploads
    ├── utils/               # cron jobs & helpers
    └── app.js               # Express entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A running **MongoDB** instance (local or Atlas)
- A **Cloudinary** account for image uploads

---

### Environment Variables

#### Server (`server/.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (OTP)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

#### Client (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Running the App

**Development mode:**

```bash
# Terminal 1 – start the backend (runs on port 3000)
cd server
npm start

# Terminal 2 – start the frontend (runs on port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Build the frontend for production:**

```bash
cd client
npm run build
```

---

## 📡 API Overview

All API routes are prefixed with `/api/v1/` (or `/api/` for location and health endpoints).

| Prefix | Description |
|---|---|
| `/api/v1/auth` | Register, login, OTP verification |
| `/api/v1/admin` | Admin management endpoints |
| `/api/v1/carOwner` | Car owner profile & fleet management |
| `/api/v1/car` | Car listings (CRUD) |
| `/api/v1/booking` | Booking creation & management |
| `/api/v1/customer` | Customer profile & booking history |
| `/api/v1/driver` | Driver profile & assignments |
| `/api/v1/upload` | File/image uploads |
| `/api/location` | Location & map data |
| `/api/health` | Health-check endpoint |

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Admin** | Manage all users, cars, bookings; platform oversight |
| **Car Owner** | List and manage their cars; view bookings for their vehicles |
| **Customer** | Browse cars, make bookings, view booking history |
| **Driver** | View assigned trips and update trip status |
