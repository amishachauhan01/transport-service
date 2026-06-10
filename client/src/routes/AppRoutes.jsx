import { Routes, Route, Navigate } from "react-router-dom";

// AUTH
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// USER
import Dashboard from "../pages/user/Dashboard";
import CreateOrder from "../pages/user/CreateOrder";
import MyOrders from "../pages/user/MyOrders";
import OrderDetails from "../pages/user/OrderDetails";
import TrackOrder from "../pages/user/TrackOrder";
import SignatureUpload from "../pages/user/SignatureUpload";

// DRIVER
import DriverDashboard from "../pages/driver/DriverDashboard";
import AssignedOrders from "../pages/driver/AssignedOrders";
import DeliveryForm from "../pages/driver/DeliveryForm";

// ADMIN
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Drivers from "../pages/admin/Drivers";
import Vehicles from "../pages/admin/Vehicles";
import Orders from "../pages/admin/Orders";
import Reports from "../pages/admin/Reports";

// COMMON
import ProtectedRoute from "../components/ProtectedRoute";

// ⭐ NAVBAR ADD KIYA
import Navbar from "../components/Navbar";

// 🔐 helper
const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

function AppRoutes() {
  const user = getUser();

  return (
    <>
      {/* ⭐ NAVBAR (HAR PAGE PE SHOW HOGA) */}
      {user && <Navbar />}

      <Routes>

        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ================= */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/create-order"
          element={
            <ProtectedRoute role="user">
              <CreateOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/orders"
          element={
            <ProtectedRoute role="user">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute role="user">
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/track/:id"
          element={
            <ProtectedRoute role="user">
              <TrackOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/signature"
          element={
            <ProtectedRoute role="user">
              <SignatureUpload />
            </ProtectedRoute>
          }
        />

        {/* ================= DRIVER ================= */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute role="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/orders"
          element={
            <ProtectedRoute role="driver">
              <AssignedOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/delivery/:id"
          element={
            <ProtectedRoute role="driver">
              <DeliveryForm />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/drivers"
          element={
            <ProtectedRoute role="admin">
              <Drivers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute role="admin">
              <Vehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="admin">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  );
}

export default AppRoutes;