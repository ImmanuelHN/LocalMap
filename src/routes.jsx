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
import { getBusinessProfile, getCurrentUser, getRiderProfile } from "./utils/storage.js";

const homeByRole = {
  customer: "/customer",
  business: "/business",
  rider: "/rider",
};

function ProtectedLayout({ allowedRole }) {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user?.role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={homeByRole[user.role] || "/role-selection"} replace />;
  }

  if (
    user.role === "business" &&
    !getBusinessProfile() &&
    location.pathname !== "/business/register"
  ) {
    return <Navigate to="/business/register" replace />;
  }

  if (
    user.role === "rider" &&
    !getRiderProfile() &&
    location.pathname !== "/rider/register"
  ) {
    return <Navigate to="/rider/register" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar role={user.role} />
      <div className="main-panel">
        <Navbar />
        <NotificationCenter />
        <Outlet />
      </div>
    </div>
  );
}

export default function AppRoutes() {
  const user = getCurrentUser();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />

      <Route element={<ProtectedLayout allowedRole="customer" />}>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/business/:businessId" element={<BusinessDetails />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/customer/reviews" element={<CustomerReviews />} />
        <Route path="/customer/chat/:businessId" element={<ChatPage />} />
        <Route path="/customer/order/:businessId" element={<OrderPage />} />
        <Route path="/customer/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<ProtectedLayout allowedRole="business" />}>
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/business/register" element={<RegisterBusiness />} />
        <Route path="/business/orders" element={<ManageOrders />} />
        <Route path="/business/reviews" element={<BusinessReviews />} />
        <Route path="/business/chat" element={<ChatPage />} />
        <Route path="/business/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<ProtectedLayout allowedRole="rider" />}>
        <Route path="/rider" element={<RiderDashboard />} />
        <Route path="/rider/register" element={<RiderRegistration />} />
        <Route path="/rider/jobs" element={<RiderJobs />} />
        <Route path="/rider/history" element={<RiderJobs showHistory />} />
        <Route path="/rider/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={user?.role ? homeByRole[user.role] : "/"} replace />} />
    </Routes>
  );
}
