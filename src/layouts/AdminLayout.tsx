
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Package, Users, Stethoscope, TestTube,
  Scan, ShoppingCart, Settings, LogOut, Menu,
  Bell, Search, Megaphone, Store, ChevronLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo.jpeg";

const allSidebarItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, adminOnly: false },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart, adminOnly: false },
  { name: "Products", path: "/admin/products", icon: Package, adminOnly: false },
  { name: "Doctors", path: "/admin/doctors", icon: Stethoscope, adminOnly: false },
  { name: "Lab Tests", path: "/admin/lab-tests", icon: TestTube, adminOnly: false },
  { name: "Scans", path: "/admin/scans", icon: Scan, adminOnly: false },
  { name: "Users", path: "/admin/users", icon: Users, adminOnly: true },
  { name: "Wholesale", path: "/admin/wholesale", icon: Store, adminOnly: true },
  { name: "Advertisements", path: "/admin/advertisements", icon: Megaphone, adminOnly: true },
  { name: "Settings", path: "/admin/settings", icon: Settings, adminOnly: true },
];

const SidebarContent = ({ isAdmin, onLinkClick }: { isAdmin: boolean, onLinkClick?: () => void }) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const sidebarItems = allSidebarItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b h-16 flex items-center">
        <Link to="/admin" className="flex items-center gap-3" onClick={onLinkClick}>
          <img src={logo} alt="Taj Medical" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <h1 className="font-bold text-primary text-sm">Taj Medical</h1>
            <p className="text-[10px] text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mb-2">
          <Package className="h-5 w-5" />
          <span className="text-sm font-medium">View Store</span>
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/auth" replace />;

  const canGoBack = location.pathname !== "/admin";

  return (
    <div className="min-h-screen bg-muted/40">
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)}></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r">
            <SidebarContent isAdmin={isAdmin} onLinkClick={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 border-r">
        <SidebarContent isAdmin={isAdmin} />
      </aside>

      <div className="md:ml-64">
        <header className="sticky top-0 z-30 bg-card border-b px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
