import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Home, Building2, Clock, FileText, 
  CheckCircle2, Star, ArrowRight, Beaker, Heart, 
  Activity, Droplets, ShieldCheck
} from "lucide-react";

const popularTests = [
  { id: 1, name: "Complete Blood Count (CBC)", price: 299, mrp: 450, discount: 33, reportTime: "6 hours", homeCollection: true, category: "Blood" },
  { id: 2, name: "Lipid Profile", price: 399, mrp: 600, discount: 33, reportTime: "12 hours", homeCollection: true, category: "Heart" },
  { id: 3, name: "Thyroid Profile (T3, T4, TSH)", price: 449, mrp: 700, discount: 36, reportTime: "24 hours", homeCollection: true, category: "Thyroid" },
  { id: 4, name: "Liver Function Test (LFT)", price: 549, mrp: 800, discount: 31, reportTime: "12 hours", homeCollection: true, category: "Liver" },
  { id: 5, name: "Kidney Function Test (KFT)", price: 499, mrp: 750, discount: 33, reportTime: "12 hours", homeCollection: true, category: "Kidney" },
  { id: 6, name: "HbA1c (Glycated Hemoglobin)", price: 399, mrp: 550, discount: 27, reportTime: "24 hours", homeCollection: true, category: "Diabetes" },
  { id: 7, name: "Vitamin D Total", price: 699, mrp: 1200, discount: 42, reportTime: "24 hours", homeCollection: true, category: "Vitamins" },
  { id: 8, name: "Vitamin B12", price: 599, mrp: 900, discount: 33, reportTime: "24 hours", homeCollection: true, category: "Vitamins" },
];

const healthPackages = [
  {
    id: 1,
    name: "Basic Health Checkup",
    tests: 35,
    price: 999,
    mrp: 2500,
    discount: 60,
    popular: true,
    includes: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Blood Sugar"],
  },
  {
    id: 2,
    name: "Comprehensive Health Package",
    tests: 72,
    price: 1999,
    mrp: 5000,
    discount: 60,
    popular: true,
    includes: ["All Basic Tests", "Thyroid Profile", "Vitamin D & B12", "Iron Studies", "Urine Analysis"],
  },
  {
    id: 3,
    name: "Diabetes Care Package",
    tests: 28,
    price: 1299,
    mrp: 3000,
    discount: 57,
    popular: false,
    includes: ["HbA1c", "Fasting Glucose", "Post Prandial", "Kidney Function", "Lipid Profile"],
  },
  {
    id: 4,
    name: "Heart Care Package",
    tests: 42,
    price: 2499,
    mrp: 6000,
    discount: 58,
    popular: false,
    includes: ["Lipid Profile", "ECG", "Cardiac Markers", "Homocysteine", "hs-CRP"],
  },
];

const LabTests = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = popularTests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-primary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Badge className="mb-4 bg-secondary">Trusted by 50,000+ customers</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Book Lab Tests at Home
              </h1>
              <p className="text-muted-foreground mb-6">
                Get up to 60% off on all lab tests. Free home sample collection. Reports in 6-24 hours.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for tests, health packages..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Home className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Home Collection</p>
                  <p className="text-xs text-muted-foreground">Free pickup at home</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Quick Reports</p>
                  <p className="text-xs text-muted-foreground">Within 6-24 hours</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">NABL Certified</p>
                  <p className="text-xs text-muted-foreground">Quality assured</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Digital Reports</p>
                  <p className="text-xs text-muted-foreground">PDF download</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="packages" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="packages">Health Packages</TabsTrigger>
              <TabsTrigger value="tests">Individual Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="packages">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {healthPackages.map((pkg) => (
                  <Card key={pkg.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    {pkg.popular && (
                      <Badge className="absolute top-3 right-3 bg-orange-500">Popular</Badge>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Includes {pkg.tests} tests</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        {pkg.includes.map((test, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-secondary" />
                            <span>{test}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary">₹{pkg.price}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{pkg.mrp}</span>
                        <Badge variant="secondary">{pkg.discount}% OFF</Badge>
                      </div>
                      <Button className="w-full">Book Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tests">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTests.map((test) => (
                  <Card key={test.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-secondary/10 rounded-lg">
                          <Beaker className="h-5 w-5 text-secondary" />
                        </div>
                        <Badge variant="outline">{test.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{test.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3" />
                        <span>Report in {test.reportTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Home className="h-3 w-3" />
                        <span>Home collection available</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold">₹{test.price}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{test.mrp}</span>
                        <Badge className="bg-secondary text-xs">{test.discount}% OFF</Badge>
                      </div>
                      <Button size="sm" className="w-full">Book Test</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Why Choose Us */}
          <section className="bg-muted/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Lab Services?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expert Pathologists</h3>
                <p className="text-sm text-muted-foreground">
                  Our team of experienced pathologists ensures accurate and reliable test results.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Activity className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Advanced Equipment</h3>
                <p className="text-sm text-muted-foreground">
                  State-of-the-art diagnostic equipment for precise test results.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Patient Care</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated support team to assist you throughout your testing journey.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LabTests;
