# 🚗 easyGo — MERN Car Rental
*Book a ride. Manage your fleet. Drive with confidence.*
---
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)
---
[Report Bug](https://github.com/samarth8804/MERN-Car-Rental/issues) • [Request Feature](https://github.com/samarth8804/MERN-Car-Rental/issues)
---
## 📖 About
**easyGo** is a full-stack car rental platform built on the MERN stack. It supports multiple user roles — customers, car owners, drivers, and admins — each with their own dedicated dashboard and workflow. Users can browse available cars, make bookings with pickup/drop locations, and track rides in real time.
---
## ✨ Key Features
- 🔐 **Role-Based Auth** — JWT-secured login/signup for Customers, Car Owners, Drivers, and Admins
- 📧 **OTP Email Verification** — Account verification via Brevo email service
- 🚘 **Car Listings** — Car owners can add, update, and manage their fleet with image uploads via Cloudinary
- 📅 **Booking System** — Customers can book cars with pickup & drop locations and date ranges
- 🗺️ **Map Integration** — OpenStreetMap API-powered interactive location selection
- 🧾 **Booking Management** — View active, pending, and completed bookings across all roles
- 🚦 **Ride Lifecycle** — Drivers can start and complete rides; bookings auto-update status
- 🛠️ **Admin Panel** — Approve/reject car owners & drivers, oversee the entire platform
- ☁️ **Image Uploads** — Cloudinary integration for car and profile images
- ⏰ **Cron Jobs** — Automated background tasks (e.g. booking status updates)
---
## 🛠️ Tech Stack
### Frontend (`client/`)
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router DOM | Client-side routing |
| Tailwind CSS 4 | Utility-first styling |
| Axios | HTTP requests |
| OpenStreetMap API | Interactive maps |
| React Hot Toast | Notifications |
| Vite | Build tool & dev server |
### Backend (`server/`)
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication & authorization |
| Bcrypt | Password hashing |
| Cloudinary + Multer | Image upload & storage |
| Brevo API | Transactional email (OTP, notifications) |
| Node-Cron | Scheduled background jobs |
---
## 🚀 Getting Started
### Prerequisites
- **Node.js** 18+
- **MongoDB** (local instance or [MongoDB Atlas](https://cloud.mongodb.com))
- **Cloudinary** account (for image uploads)
- **Brevo** account (for email/OTP — free tier works)
### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/samarth8804/MERN-Car-Rental.git
   cd MERN-Car-Rental
   ```
2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```
3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```
---
## 🔐 Environment Variables
Create a `.env` file inside the `server/` directory:
```env
# Server
PORT=3000
# Database
MONGO_URI=your_mongodb_connection_string
# Auth
JWT_SECRET=your_jwt_secret_key
# CORS
CORS_ORIGIN=http://localhost:5173
# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Brevo (email / OTP)
BREVO_API_KEY=your_brevo_api_key
BREVO_FROM_EMAIL=no-reply@yourdomain.com
BREVO_FROM_NAME=easyGo
# Cron keep-alive (optional, for hosted deployments)
SERVICE_URL=https://your-deployed-api-url.com
```
---
## ▶️ Running the App
### Start the backend
```bash
cd server
npm start          # uses nodemon for auto-reload
```
The API will be available at `http://localhost:3000`.
### Start the frontend
```bash
cd client
npm run dev        # Vite dev server with HMR
```
The client will be available at `http://localhost:5173`.
> The Vite dev server proxies all `/api` requests to `http://localhost:3000`, so no extra CORS setup is needed locally.
---
## 📦 Project Structure
```
MERN-Car-Rental/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # Auth context (UserContext)
│       ├── pages/          # Route-level page components
│       └── utils/          # Axios instance, API paths, helpers
│
└── server/                 # Node.js / Express backend
    ├── config/             # DB & Cloudinary configuration
    ├── controllers/        # Route handler logic
    ├── middlewares/        # Auth & role protection
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    └── utils/              # Cron jobs, email helpers, JWT utils
```
---
## 🤝 Contributing
Contributions are welcome!
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add: amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
---
## 📄 License
This project is open source. Add a `LICENSE` file (e.g. MIT) if you'd like to specify terms.
---
## 👤 Author
**Samarth**
GitHub: [@samarth8804](https://github.com/samarth8804)
---
*Made with ❤️ for seamless car rentals*
