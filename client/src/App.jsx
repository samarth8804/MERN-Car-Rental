import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import About from "./pages/InfoPages/About";
import Contact from "./pages/InfoPages/Contact";
import FAQs from "./pages/InfoPages/FAQs";

// Auth pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// User Dashboard pages
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";
import CarOwnerDashboard from "./pages/Dashboard/CarOwnerDashboard";
import DriverDashboard from "./pages/Dashboard/DriverDashboard";

// Booking pages
import CarBookingPage from "./pages/Booking/CarBookingPage";
import BookingDetails from "./pages/Booking/BookingDetails";

// Error pages
import NotFound from "./pages/Error/NotFound";
import Unauthorized from "./pages/Error/Unauthorized";

// Context for authentication
import { AuthProvider } from "./context/UserContext";

// Protected Route component
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "./config/ToastConfig";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />

            {/* Auth Routes with role parameters */}
            <Route path="/login/:role" element={<Login />} />
            <Route path="/signup/:role" element={<Signup />} />

            {/* Protected Role-Based Dashboard Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute allowedRoles="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/carOwner"
              element={
                <ProtectedRoute allowedRoles="carOwner">
                  <CarOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/driver"
              element={
                <ProtectedRoute allowedRoles="driver">
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-car/:carId"
              element={
                <ProtectedRoute allowedRoles="customer">
                  <CarBookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-details/:bookingId"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 🎯 SINGLE CATCH-ALL ROUTE - HANDLES EVERYTHING */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>

        {/* React Hot Toast container */}
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
