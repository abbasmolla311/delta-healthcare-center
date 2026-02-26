import { useState } from "react";
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create WhatsApp message
    const whatsappMessage = `Hello! I'm ${formData.name}.\n\nService/Query: ${formData.service}\n\nMessage: ${formData.message}\n\nContact: ${formData.phone}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Open WhatsApp
    window.open(`https://wa.me/917427915869?text=${encodedMessage}`, "_blank");

    toast({
      title: "Redirecting to WhatsApp",
      description: "Your inquiry will be sent via WhatsApp for quick response.",
    });

    setIsSubmitting(false);
    setFormData({ name: "", phone: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contact <span className="text-gradient">Us</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question about our diagnostic services or doctor availability?
                We're here to help!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 -mt-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <div className="space-y-1">
                    <a href="tel:+917427915869" className="text-sm text-muted-foreground hover:text-primary block">
                      +91 74279 15869
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">WhatsApp</h3>
                  <a
                    href="https://wa.me/917427915869"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-secondary"
                  >
                    Send Message
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Polerhat (Anantpur Mor),<br />
                    South 24 Parganas
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    8:00 AM - 10:00 PM<br />
                    Open Daily
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Service Inquiry Form */}
              <div>
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      Service Inquiry / Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service">Service / Query *</Label>
                        <Input
                          id="service"
                          name="service"
                          placeholder="Enter service name or your query"
                          value={formData.service}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Details</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Any additional information (date, urgency, etc.)"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                        />
                      </div>

                      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                        <Send className="h-4 w-4" />
                        {isSubmitting ? "Sending..." : "Send via WhatsApp"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        This will open WhatsApp to send your inquiry directly to our team.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Map & Address */}
              <div className="space-y-6">
                <Card className="shadow-card overflow-hidden">
                  <CardContent className="p-0">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.123456789!2d88.345678!3d22.345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDIwJzQ0LjQiTiA4OMKwMjAnNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Delta HealthCare Location"
                      className="grayscale hover:grayscale-0 transition-all"
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Center Address</h3>
                        <p className="text-muted-foreground">
                          <strong>Delta HealthCare</strong><br />
                          Polerhat (Anantpur Mor),<br />
                          South 24 Parganas,<br />
                          West Bengal, India
                        </p>
                        <a
                          href="https://maps.google.com/?q=Polerhat+Anantpur+Mor+South+24+Parganas"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
                        >
                          <MapPin className="h-4 w-4" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gradient-medical text-primary-foreground overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Quick Contact</h3>
                    <div className="space-y-4">
                      <a href="tel:+917427915869" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Phone className="h-5 w-5" />
                        <span>+91 74279 15869 (Appointment Inquiries)</span>
                      </a>
                      <a
                        href="https://wa.me/917427915869?text=Hello, I want to inquiry about services"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>WhatsApp for Service Inquiry</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
