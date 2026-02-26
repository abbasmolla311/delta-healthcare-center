import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, Pill, TestTube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import storeFront from "@/assets/store-front.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-secondary" />
        <div className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-medical-teal" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Stethoscope className="h-4 w-4" />
              Diagnostic & Polyclinic
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Trusted
              <span className="text-gradient block">Healthcare Partner</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Delta HealthCare - Your one-stop destination for complete diagnostic services and expert medical care. We offer expert doctor consultations, blood tests, imaging services, and more.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg" className="gap-2 shadow-soft">
                  Book Appointment
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://wa.me/917427915869?text=Hello, I want to inquire about services"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Inquiry
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <h3 className="text-3xl font-bold text-primary">15+</h3>
                <p className="text-sm text-muted-foreground">Expert Doctors</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary">24/7</h3>
                <p className="text-sm text-muted-foreground">Emergency Care</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary">10K+</h3>
                <p className="text-sm text-muted-foreground">Happy Patients</p>
              </div>
            </div>
          </div>

          {/* Image & Cards */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={storeFront}
                alt="Delta HealthCare Front"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-background mb-2">Delta HealthCare</h3>
                <p className="text-background/90">Polerhat, South 24 Parganas</p>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-card animate-float">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Doctor Visits</p>
                  <p className="text-xs text-muted-foreground">Daily Schedule</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-card animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <TestTube className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Lab Tests</p>
                  <p className="text-xs text-muted-foreground">Blood & Diagnostics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
