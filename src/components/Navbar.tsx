import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle, Search, Calendar, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchModal from "@/components/SearchModal";
import AppointmentModal from "@/components/AppointmentModal";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCart();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Doctors", path: "/doctors" },
    { name: "Lab Tests", path: "/lab-tests" },
    { name: "Scans", path: "/scan-booking" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Taj Medical Store" className="h-14 w-14 rounded-full object-cover shadow-soft" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">Taj Medical Store</h1>
                <p className="text-xs text-muted-foreground">Wholesale & Retail</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
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

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {user && <NotificationDropdown />}
              
              {user ? (
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    My Account
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
              
              <a
                href="https://wa.me/917427915869?text=Hello, I want to inquire about medicine availability"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="gap-2 bg-secondary hover:bg-secondary/90">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-4">
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
                <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      setIsOpen(false);
                      setIsAppointmentOpen(true);
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                    Book Appointment
                  </Button>
                  <div className="flex gap-2">
                    <a href="tel:+917427915869" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    </a>
                    <a
                      href="https://wa.me/917427915869?text=Hello, I want to inquire about medicine availability"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full gap-2 bg-secondary hover:bg-secondary/90">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AppointmentModal isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} />
    </>
  );
};

export default Navbar;
