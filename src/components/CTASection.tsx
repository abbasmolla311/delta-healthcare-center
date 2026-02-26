import { Phone, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 gradient-medical text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Need Assistance? <br />
              We're Here to Help!
            </h2>
            <p className="text-lg opacity-90">
              Have questions about our diagnostic services or need to book an appointment? Send us a WhatsApp message and we'll assist you promptly.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+917427915869">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Phone className="h-5 w-5" />
                  +91 74279 15869
                </Button>
              </a>
              <a
                href="https://wa.me/917427915869?text=Hello, I want to inquire about services"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Inquiry
                </Button>
              </a>
            </div>
          </div>

          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-semibold">Center Location</h3>
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 flex-shrink-0" />
              <div>
                <p className="font-medium">Delta HealthCare</p>
                <p className="opacity-90">
                  Polerhat (Anantpur Mor), <br />
                  South 24 Parganas, <br />
                  West Bengal
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-primary-foreground/20">
              <p className="text-sm opacity-90">
                <strong>Opening Hours:</strong> 8:00 AM - 10:00 PM (Daily)
              </p>
              <p className="text-sm opacity-90 mt-2">
                <strong>Doctor Visits:</strong> As per schedule (Call for appointment)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
