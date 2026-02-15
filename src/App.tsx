
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Page Imports
import Index from "./pages/Index";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import LabTests from "./pages/LabTests";
import ScanBooking from "./pages/ScanBooking";
import Consult from "./pages/Consult";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import UploadPrescription from "./pages/UploadPrescription";
import UpdatePassword from "./pages/UpdatePassword";

// Dashboard Imports
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
// Make sure all admin pages are imported
import AdminProducts from "./pages/admin/AdminProducts";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminLabTests from "./pages/admin/AdminLabTests";
import AdminScans from "./pages/admin/AdminScans";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAdvertisements from "./pages/admin/AdminAdvertisements";
import AdminWholesale from "./pages/admin/AdminWholesale";
import AdminSettings from "./pages/admin/AdminSettings";


const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* === Public Routes === */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/lab-tests" element={<LabTests />} />
              <Route path="/scan-booking" element={<ScanBooking />} />
              <Route path="/consult" element={<Consult />} />

              {/* === Protected User Routes === */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/upload-prescription" element={<ProtectedRoute><UploadPrescription /></ProtectedRoute>} />

              {/* === Protected Doctor Routes === */}
              <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />

              {/* === Admin Routes === */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="lab-tests" element={<AdminLabTests />} />
                <Route path="scans" element={<AdminScans />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="advertisements" element={<AdminAdvertisements />} />
                <Route path="wholesale" element={<AdminWholesale />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
