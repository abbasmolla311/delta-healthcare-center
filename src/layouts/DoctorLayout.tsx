
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutGrid, Calendar, Users, User, Settings, LogOut, PanelLeft, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const doctorNavLinks = [
  { name: "Dashboard", path: "/doctor/dashboard", icon: LayoutGrid },
  { name: "Appointments", path: "/doctor/appointments", icon: Calendar },
  { name: "My Patients", path: "/doctor/patients", icon: Users },
  { name: "My Profile", path: "/doctor/profile", icon: User },
  { name: "Settings", path: "/doctor/settings", icon: Settings },
];

const DoctorLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const NavLinks = ({ isMobile = false }) => (
    <nav className={`flex flex-col p-2 space-y-1 ${isMobile ? 'text-lg' : 'text-sm'}`}>
      {doctorNavLinks.map(nav => (
        <Link key={nav.path} to={nav.path} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${location.pathname === nav.path ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'}`}>
          <nav.icon className="h-4 w-4" />
          {nav.name}
        </Link>
      ))}
    </nav>
  );

  const canGoBack = location.pathname !== "/doctor/dashboard";

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-card">
        <div className="p-4 border-b h-20 flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary"><AvatarImage src={user?.user_metadata?.avatar_url} /><AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) ?? 'D'}</AvatarFallback></Avatar>
          <div>
            <p className="font-semibold text-sm">Dr. {user?.user_metadata?.full_name || "Doctor"}</p>
            <p className="text-xs text-muted-foreground">Doctor Panel</p>
          </div>
        </div>
        <NavLinks />
        <div className="p-4 mt-auto border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={signOut}><LogOut className="h-4 w-4" />Logout</Button>
        </div>
      </aside>

      <div className="flex flex-col md:ml-64">
        <header className="md:hidden sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild><Button size="icon" variant="outline" className="sm:hidden"><PanelLeft className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs flex flex-col">
                <div className="flex-grow">
                  <NavLinks isMobile />
                </div>
                <div className="p-4 border-t">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={signOut}><LogOut className="h-4 w-4" />Logout</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <h2 className="font-bold text-lg">{doctorNavLinks.find(l => l.path === location.pathname)?.name || "Menu"}</h2>
        </header>

        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default DoctorLayout;
