import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/InfoPages/About";
import Contact from "./pages/InfoPages/Contact";
import FAQs from "./pages/InfoPages/FAQs";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";
import CarOwnerDashboard from "./pages/Dashboard/CarOwnerDashboard";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/faqs" element={<FAQs />}></Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>

          {/* Role-Based */}
          <Route path="/dashboard/admin" element={<AdminDashboard />}></Route>
          <Route
            path="/dashboard/customer"
            element={<CustomerDashboard />}
          ></Route>
          <Route
            path="/dashboard/owner"
            element={<CarOwnerDashboard />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
