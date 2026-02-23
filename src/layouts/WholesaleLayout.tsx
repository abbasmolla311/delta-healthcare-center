
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building, Package, FileText, User, LogOut, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ✅ THE FIX: Links now point to the dashboard with a `tab` query parameter
const wholesaleNavLinks = [
  { name: "Dashboard", path: "/wholesale/dashboard?tab=dashboard", icon: Building, tab: "dashboard" },
  { name: "Products", path: "/wholesale/dashboard?tab=products", icon: Package, tab: "products" },
  { name: "Quote Requests", path: "/wholesale/dashboard?tab=quotes", icon: FileText, tab: "quotes" },
  { name: "My Profile", path: "/wholesale/dashboard?tab=profile", icon: User, tab: "profile" },
];

const WholesaleLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'dashboard';

  const NavLinks = ({ isMobile = false }) => (
    <nav className={`flex flex-col p-2 space-y-1 ${isMobile ? 'text-lg' : 'text-sm'}`}>
      {wholesaleNavLinks.map(nav => (
        <Link
          key={nav.path}
          to={nav.path}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${activeTab === nav.tab ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'}`}>
          <nav.icon className="h-4 w-4" />
          {nav.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-card">
        {/* ... Header is correct ... */}
        <NavLinks />
        <div className="p-4 mt-auto border-t"><Button variant="ghost" className="w-full justify-start" onClick={signOut}><LogOut className="mr-2 h-4 w-4"/>Logout</Button></div>
      </aside>

      <div className="flex flex-col md:ml-64">
        <header className="md:hidden sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4">
          <Sheet>
            <SheetTrigger asChild><Button size="icon" variant="outline" className="sm:hidden"><PanelLeft /></Button></SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs"><NavLinks isMobile /></SheetContent>
          </Sheet>
          <h2 className="font-bold text-lg">{wholesaleNavLinks.find(l => l.tab === activeTab)?.name || "Menu"}</h2>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WholesaleLayout;
