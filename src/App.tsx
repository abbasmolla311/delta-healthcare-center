
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Loader2 } from "lucide-react";

// Import All Pages & Layouts
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout"; // Import the new layout
import Shop from "./pages/Shop";
import Doctors from "./pages/Doctors";
import LabTests from "./pages/LabTests";
import ScanBooking from "./pages/ScanBooking";
import Contact from "./pages/Contact";
import Consult from "./pages/Consult";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import UserOrders from "./pages/UserOrders";
import UserPrescriptions from "./pages/UserPrescriptions";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UploadPrescription from "./pages/UploadPrescription";
import UserSettings from "./pages/UserSettings";
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
import WholesaleDashboard from "./pages/wholesale/WholesaleDashboard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loading } = useAuth();
  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  return (
    <Routes>
      {/* === Public Routes === */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/lab-tests" element={<LabTests />} />
      <Route path="/scan-booking" element={<ScanBooking />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/consult" element={<Consult />} />

      {/* === Protected Routes === */}
      <Route element={<ProtectedRoute />}>

        {/* User & Wholesale Dashboard Layout */}
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/wholesale" element={<WholesaleDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/prescriptions" element={<UserPrescriptions />} />
        </Route>

        {/* Other protected routes that don't use the sidebar layout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/upload-prescription" element={<UploadPrescription />} />

        {/* === Admin Routes (UNCHANGED) === */}
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

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
