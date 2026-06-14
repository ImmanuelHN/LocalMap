import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import NotificationCenter from "./components/NotificationCenter.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RoleSelectionPage from "./pages/RoleSelectionPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import CustomerDashboard from "./pages/Customer/CustomerDashboard.jsx";
import BusinessDetails from "./pages/Customer/BusinessDetails.jsx";
import CustomerOrders from "./pages/Customer/CustomerOrders.jsx";
import CustomerReviews from "./pages/Customer/CustomerReviews.jsx";
import BusinessDashboard from "./pages/Business/BusinessDashboard.jsx";
import RegisterBusiness from "./pages/Business/RegisterBusiness.jsx";
import ManageOrders from "./pages/Business/ManageOrders.jsx";
import BusinessReviews from "./pages/Business/BusinessReviews.jsx";
import RiderDashboard from "./pages/Rider/RiderDashboard.jsx";
import RiderRegistration from "./pages/Rider/RiderRegistration.jsx";
import RiderJobs from "./pages/Rider/RiderJobs.jsx";
import { getBusinessProfile, getCurrentUser, getRiderProfile, getCustomerProfile } from "./utils/storage.js";

const homeByRole = {
  customer: "/customer",
  business: "/business",
  rider: "/rider",
};

// Shell layout that wraps all authenticated pages
function AppShell({ role }) {
  return (
    <div className="app-shell">
      <Sidebar role={role} />
      <div className="main-panel">
        <Navbar />
        <NotificationCenter />
        <Outlet />
      </div>
    </div>
  );
}

// Guard: must be logged in + correct role + have a complete profile
function ProtectedLayout({ allowedRole, requireProfile = true }) {
  const user = getCurrentUser();
  const location = useLocation();

  // Not logged in → login
  if (!user?.role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Wrong role → own dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={homeByRole[user.role] || "/role-selection"} replace />;
  }

  // Profile required but missing → back to onboarding
  if (requireProfile) {
    if (user.role === "business" && !getBusinessProfile()) {
      return <Navigate to="/role-selection" replace />;
    }
    if (user.role === "rider" && !getRiderProfile()) {
      return <Navigate to="/role-selection" replace />;
    }
    if (user.role === "customer" && !getCustomerProfile()) {
      return <Navigate to="/role-selection" replace />;
    }
  }

  return <AppShell role={user.role} />;
}

export default function AppRoutes() {
  const user = getCurrentUser();

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />

      {/* Customer routes — profile required */}
      <Route element={<ProtectedLayout allowedRole="customer" requireProfile />}>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/business/:businessId" element={<BusinessDetails />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/customer/reviews" element={<CustomerReviews />} />
        <Route path="/customer/chat/:businessId" element={<ChatPage />} />
        <Route path="/customer/order/:businessId" element={<OrderPage />} />
        <Route path="/customer/profile" element={<ProfilePage />} />
      </Route>

      {/* Business edit profile — no profile guard (so owner can fill/edit) */}
      <Route element={<ProtectedLayout allowedRole="business" requireProfile={false} />}>
        <Route path="/business/register" element={<RegisterBusiness />} />
      </Route>

      {/* Business routes — profile required */}
      <Route element={<ProtectedLayout allowedRole="business" requireProfile />}>
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/business/orders" element={<ManageOrders />} />
        <Route path="/business/reviews" element={<BusinessReviews />} />
        <Route path="/business/chat" element={<ChatPage />} />
        <Route path="/business/profile" element={<ProfilePage />} />
      </Route>

      {/* Rider registration — no profile guard */}
      <Route element={<ProtectedLayout allowedRole="rider" requireProfile={false} />}>
        <Route path="/rider/register" element={<RiderRegistration />} />
      </Route>

      {/* Rider routes — profile required */}
      <Route element={<ProtectedLayout allowedRole="rider" requireProfile />}>
        <Route path="/rider" element={<RiderDashboard />} />
        <Route path="/rider/jobs" element={<RiderJobs />} />
        <Route path="/rider/history" element={<RiderJobs showHistory />} />
        <Route path="/rider/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={user?.role ? homeByRole[user.role] : "/"} replace />} />
    </Routes>
  );
}
