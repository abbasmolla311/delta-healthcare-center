import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, Clock, MapPin, Phone, MessageCircle, 
  ShieldCheck, Truck, Users, Award
} from "lucide-react";
import storeFront from "@/assets/store-front.jpeg";

const stats = [
  { label: "Years of Service", value: "10+", icon: Award },
  { label: "Happy Customers", value: "10,000+", icon: Users },
  { label: "Medicine Brands", value: "100+", icon: ShieldCheck },
  { label: "Expert Doctors", value: "15+", icon: Users },
];

const AboutSection = () => {
  return (
    <section className="py-12 bg-muted/30 rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src={storeFront}
              alt="Taj Medical Store"
              className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-1">Taj Medical Store</h3>
              <p className="text-sm text-muted-foreground">Your trusted healthcare partner since 2014</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                About <span className="text-gradient">Taj Medical Store</span>
              </h2>
              <p className="text-muted-foreground">
                We are a leading healthcare destination offering comprehensive medical services including 
                medicines from all major pharmaceutical companies, expert doctor consultations, 
                diagnostic lab tests, and imaging services. Our commitment to quality healthcare 
                has made us a trusted name in the community.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Polerhat, South 24 Parganas, West Bengal</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Open: 8:00 AM - 10:00 PM (Daily)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+917427915869" className="hover:text-primary">+91 74279 15869</a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/contact">
                <Button className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
              <a
                href="https://wa.me/917427915869?text=Hello, I want to inquire about medicines"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-white">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
