
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, MessageCircle, Search, ShoppingCart, User, ChevronDown, Grid, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchModal from "@/components/SearchModal";
import NotificationDropdown from "@/components/NotificationDropdown";
import MegaMenu from "@/components/MegaMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { isAdmin, isWholesale } = useUserRole();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Doctors", path: "/doctors" },
    { name: "Lab Tests", path: "/lab-tests" },
    { name: "Scans", path: "/scan-booking" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isWholesale) return "/wholesale";
    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return "Admin Panel";
    if (isWholesale) return "Business Dashboard";
    return "Dashboard";
  };

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Taj Medical Store" className="h-14 w-14 rounded-full object-cover" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-primary">Taj Medical Store</h1>
                <p className="text-xs text-muted-foreground">Wholesale & Retail</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-lg font-medium text-sm hover:bg-primary/10 transition-colors"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
              >
                <Grid className="h-4 w-4" />
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {itemCount > 9 ? "9+" : itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              {user && <NotificationDropdown />}
              {user ? (
                <Link to={getDashboardLink()}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {getDashboardLabel()}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
              <a href="https://wa.me/917427915869?text=Hello" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-2 bg-green-500 hover:bg-green-600 text-white">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>

            <div className="flex lg:hidden items-center gap-1">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}><Search className="h-5 w-5" /></Button>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{itemCount}</Badge>}
                </Button>
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground" aria-label="Toggle menu">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-medium px-4 py-2 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="px-4 pt-4 mt-2 border-t border-border space-y-3">
                  {user ? (
                    <>
                      <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          {getDashboardLabel()}
                        </Button>
                      </Link>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <User className="h-4 w-4" />
                          My Profile
                        </Button>
                      </Link>
                      <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="h-4 w-4" />
                        Login / Register
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="px-4 pt-4 flex gap-2">
                  <a href="tel:+917427915869" className="flex-1">
                    <Button variant="outline" className="w-full gap-2"><Phone className="h-4 w-4" />Call</Button>
                  </a>
                  <a href="https://wa.me/917427915869?text=Hello" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white"><MessageCircle className="h-4 w-4" />WhatsApp</Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
