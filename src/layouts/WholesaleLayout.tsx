
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building, Package, FileText, User, LogOut, PanelLeft, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const wholesaleNavLinks = [
  { name: "Dashboard", path: "/wholesale/dashboard?tab=dashboard", icon: Building, tab: "dashboard" },
  { name: "Products", path: "/wholesale/dashboard?tab=products", icon: Package, tab: "products" },
  { name: "Quote Requests", path: "/wholesale/dashboard?tab=quotes", icon: FileText, tab: "quotes" },
  { name: "My Profile", path: "/wholesale/dashboard?tab=profile", icon: User, tab: "profile" },
];

const WholesaleLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'dashboard';

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["wholesale-profile-layout", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("wholesale_profiles").select("business_name").eq("user_id", user.id).maybeSingle();
      if (error) { console.error("Error fetching wholesale profile for layout:", error); return null; }
      return data;
    },
    enabled: !!user,
  });

  const NavLinks = ({ isMobile = false }) => (
    <nav className={`flex flex-col p-2 space-y-1 ${isMobile ? 'text-lg' : 'text-sm'}`}>
      {wholesaleNavLinks.map(nav => (
        <Link key={nav.path} to={nav.path} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${activeTab === nav.tab ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'}`}>
          <nav.icon className="h-4 w-4" />
          {nav.name}
        </Link>
      ))}
    </nav>
  );

  const canGoBack = location.pathname !== "/wholesale/dashboard" || activeTab !== "dashboard";

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-card">
        <div className="p-4 border-b h-20 flex items-center gap-4">
          <Avatar className="h-12 w-12"><AvatarImage src={user?.user_metadata?.avatar_url} /><AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) ?? 'W'}</AvatarFallback></Avatar>
          <div>
            {isProfileLoading ? (
              <div className="space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
            ) : (
              <><p className="font-semibold text-sm">{profile?.business_name || "Wholesale"}</p><p className="text-xs text-muted-foreground">{user?.user_metadata?.full_name || user?.email}</p></>
            )}
          </div>
        </div>
        <NavLinks />
        <div className="p-4 mt-auto border-t"><Button variant="ghost" className="w-full justify-start gap-3" onClick={signOut}><LogOut className="h-4 w-4"/>Logout</Button></div>
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
              <SheetTrigger asChild><Button size="icon" variant="outline"><PanelLeft className="h-5 w-5" /></Button></SheetTrigger>
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
          <h2 className="font-bold text-lg">{wholesaleNavLinks.find(l => l.tab === activeTab)?.name || "Menu"}</h2>
        </header>
        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default WholesaleLayout;
