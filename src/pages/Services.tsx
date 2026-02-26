import { Pill, TestTube, Stethoscope, Truck, ShieldCheck, Clock, Package, Heart, Microscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const medicineCategories = [
  "Antibiotics",
  "Painkillers",
  "Cardiac Medicines",
  "Diabetes Medicines",
  "Vitamins & Supplements",
  "Dermatology",
  "Pediatric Medicines",
  "Gynecology Medicines",
  "Neurology Medicines",
  "Respiratory Medicines",
  "Gastro Medicines",
  "Ophthalmology",
  "Orthopedic Medicines",
  "Ayurvedic Products",
  "Surgical Items",
  "Baby Care Products",
];

const diagnosticTests = [
  { name: "Complete Blood Count (CBC)", price: "₹200" },
  { name: "Blood Sugar (Fasting/PP)", price: "₹50" },
  { name: "HbA1c Test", price: "₹400" },
  { name: "Lipid Profile", price: "₹500" },
  { name: "Liver Function Test (LFT)", price: "₹450" },
  { name: "Kidney Function Test (KFT)", price: "₹500" },
  { name: "Thyroid Profile (T3, T4, TSH)", price: "₹450" },
  { name: "Urine Routine Examination", price: "₹80" },
  { name: "Hemoglobin Test", price: "₹50" },
  { name: "Blood Group Test", price: "₹100" },
  { name: "Vitamin D Test", price: "₹900" },
  { name: "Vitamin B12 Test", price: "₹600" },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-gradient">Services</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Complete healthcare solutions under one roof - from diagnostics to consultations,
                we've got all your healthcare needs covered.
              </p>
            </div>
          </div>
        </section>

        {/* Diagnostic Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <TestTube className="h-4 w-4" />
                  Diagnostic Services
                </div>
                <h2 className="text-3xl font-bold">
                  Advanced Diagnostics at <span className="text-gradient">Best Prices</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a wide range of diagnostic services including blood tests, imaging, and more.
                  Delta HealthCare is your trusted source for accurate and timely diagnostic reports.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <ShieldCheck className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">Accurate Reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Microscope className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">Modern Equipment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Stethoscope className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">Expert Technicians</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Clock className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">Quick Results</span>
                  </div>
                </div>
              </div>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Medical Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {medicineCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm bg-muted rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Blood Tests & Diagnostics */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                <TestTube className="h-4 w-4" />
                Diagnostics
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Blood Tests & <span className="text-gradient">Diagnostics</span>
              </h2>
              <p className="text-muted-foreground">
                All types of blood tests and diagnostic services at affordable rates. 
                Quick and accurate reports from trusted laboratories.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {diagnosticTests.map((test, index) => (
                <Card key={index} className="hover:shadow-soft transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Microscope className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{test.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-secondary">{test.price}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-4">
                * Prices are approximate. Contact us for exact pricing and package offers.
              </p>
              <a href="tel:+917427915869">
                <Button className="gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Book a Test
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Doctor Consultations */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Card className="gradient-medical text-primary-foreground overflow-hidden">
                  <CardContent className="p-8 space-y-6">
                    <h3 className="text-2xl font-bold">Specialist Consultations</h3>
                    <p className="opacity-90">
                      Get consultations from renowned specialist doctors without traveling to the city.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Heart className="h-5 w-5" />
                        <span>Cardiology & Heart Care</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Stethoscope className="h-5 w-5" />
                        <span>General Medicine</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Pill className="h-5 w-5" />
                        <span>Gynecology & Obstetrics</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <TestTube className="h-5 w-5" />
                        <span>Neurology & Psychiatry</span>
                      </li>
                    </ul>
                    <a href="/doctors">
                      <Button variant="secondary" size="lg" className="w-full mt-4">
                        View All Doctors
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Stethoscope className="h-4 w-4" />
                  Doctor Visits
                </div>
                <h2 className="text-3xl font-bold">
                  Expert Doctors <span className="text-gradient">At Your Doorstep</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  15+ specialist doctors from top medical institutions visit Delta HealthCare regularly.
                  Get expert consultations for:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    ENT (Ear, Nose, Throat) disorders
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Heart diseases & Cardiology
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Women's health & Gynecology
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Skin & Hair problems (Dermatology)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Child health & Pediatrics
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Neurological disorders
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pharmacy Services */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                      <Pill className="h-4 w-4" />
                      Pharmacy
                    </div>
                    <h3 className="text-2xl font-bold">In-house Pharmacy</h3>
                    <p className="text-muted-foreground">
                      Get all your prescribed medicines at our in-house pharmacy.
                      We stock medicines from all major pharmaceutical companies.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ All major pharmaceutical brands</li>
                      <li>✓ Competitive pricing</li>
                      <li>✓ Genuine medicines</li>
                      <li>✓ Expert guidance</li>
                    </ul>
                    <a
                      href="https://wa.me/917427915869?text=Hello, I want to inquire about medicines"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2 mt-4">
                        Inquire for Medicine
                      </Button>
                    </a>
                  </div>
                  <div className="gradient-medical p-8 flex items-center justify-center">
                    <div className="text-center text-primary-foreground">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-80" />
                      <h4 className="text-xl font-bold">Complete Care</h4>
                      <p className="text-sm opacity-80 mt-2">All your health needs covered</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
