import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Delta HealthCare" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-bold">Delta HealthCare</h3>
                <p className="text-sm opacity-80">Diagnostic & Polyclinic</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Your trusted partner for all diagnostic and medical needs. Providing high-quality healthcare services and accurate diagnostic results.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Visiting Doctors
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Doctor Consultations</li>
              <li>Blood Tests & Diagnostics</li>
              <li>Imaging Services (Scan)</li>
              <li>Pharmacy Services</li>
              <li>Health Packages</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 opacity-80 flex-shrink-0 mt-0.5" />
                <span className="text-sm opacity-80">
                  Polerhat (Anantpur Mor), South 24 Parganas, West Bengal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 opacity-80" />
                <div className="text-sm opacity-80">
                  <a href="tel:+917427915869" className="hover:opacity-100">+91 74279 15869</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 opacity-80" />
                <a
                  href="https://wa.me/917427915869"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  WhatsApp Inquiry
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 opacity-80" />
                <span className="text-sm opacity-80">Open: 8AM - 10PM Daily</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-10 pt-6 text-center">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Delta HealthCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
