
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Loader2 } from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import Doctors from "./pages/Doctors";
import LabTests from "./pages/LabTests";
import ScanBooking from "./pages/ScanBooking";
import Contact from "./pages/Contact";
import Consult from "./pages/Consult";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import WholesaleLayout from "./layouts/WholesaleLayout";

// User Pages
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import UserOrders from "./pages/UserOrders";
import UserPrescriptions from "./pages/UserPrescriptions";
import UserSettings from "./pages/UserSettings";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UploadPrescription from "./pages/UploadPrescription";

// Doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorRegister from "./pages/doctor/DoctorRegister";

// Wholesale
import WholesaleDashboard from "./pages/wholesale/WholesaleDashboard";
import WholesaleRegister from "./pages/wholesale/WholesaleRegister";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminLabTests from "./pages/admin/AdminLabTests";
import AdminScans from "./pages/admin/AdminScans";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWholesale from "./pages/admin/AdminWholesale";
import AdminAdvertisements from "./pages/admin/AdminAdvertisements";
import AdminSettings from "./pages/admin/AdminSettings";

// Placeholder components for the fix
const Placeholder = ({ title }: { title: string }) => <div className="p-4"><h2>{title}</h2><p>This page is under construction.</p></div>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/lab-tests" element={<LabTests />} />
      <Route path="/scan-booking" element={<ScanBooking />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/consult" element={<Consult />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>

        {/* Standalone Register Pages */}
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/wholesale/register" element={<WholesaleRegister />} />

        {/* USER PANEL */}
        <Route path="/" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="prescriptions" element={<UserPrescriptions />} />
        </Route>

        {/* DOCTOR PANEL */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
        </Route>

        {/* WHOLESALE PANEL */}
        <Route path="/wholesale" element={<WholesaleLayout />}>
          <Route index element={<Navigate to="/wholesale/dashboard" replace />} />
          <Route path="dashboard" element={<WholesaleDashboard />} />
          {/* ✅ THE FIX: ADDED MISSING WHOLESALE ROUTES */}
          <Route path="products" element={<Placeholder title="Wholesale Products" />} />
          <Route path="quotes" element={<Placeholder title="Quote Requests" />} />
          <Route path="profile" element={<Placeholder title="Wholesale Profile" />} />
        </Route>

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/upload-prescription" element={<UploadPrescription />} />

        {/* ADMIN PANEL */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="lab-tests" element={<AdminLabTests />} />
          <Route path="scans" element={<AdminScans />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="wholesale" element={<AdminWholesale />} />
          <Route path="advertisements" element={<AdminAdvertisements />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
