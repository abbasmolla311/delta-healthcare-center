import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Search, Home, Clock, FileText, 
  CheckCircle2, Star, Beaker, Heart, 
  Activity, ShieldCheck, Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLabTests, useHealthPackages } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const fallbackTests = [
  { id: "1", name: "Complete Blood Count (CBC)", price: 299, discount_percent: 33, report_time: "6 hours", home_collection_available: true, category: "Blood" },
  { id: "2", name: "Lipid Profile", price: 399, discount_percent: 33, report_time: "12 hours", home_collection_available: true, category: "Heart" },
  { id: "3", name: "Thyroid Profile (T3, T4, TSH)", price: 449, discount_percent: 36, report_time: "24 hours", home_collection_available: true, category: "Thyroid" },
  { id: "4", name: "Liver Function Test (LFT)", price: 549, discount_percent: 31, report_time: "12 hours", home_collection_available: true, category: "Liver" },
  { id: "5", name: "Kidney Function Test (KFT)", price: 499, discount_percent: 33, report_time: "12 hours", home_collection_available: true, category: "Kidney" },
  { id: "6", name: "HbA1c (Glycated Hemoglobin)", price: 399, discount_percent: 27, report_time: "24 hours", home_collection_available: true, category: "Diabetes" },
  { id: "7", name: "Vitamin D Total", price: 699, discount_percent: 42, report_time: "24 hours", home_collection_available: true, category: "Vitamins" },
  { id: "8", name: "Vitamin B12", price: 599, discount_percent: 33, report_time: "24 hours", home_collection_available: true, category: "Vitamins" },
];

const fallbackPackages = [
  {
    id: "1",
    name: "Basic Health Checkup",
    total_tests: 35,
    discounted_price: 999,
    original_price: 2500,
    is_popular: true,
    tests_included: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Blood Sugar"],
  },
  {
    id: "2",
    name: "Comprehensive Health Package",
    total_tests: 72,
    discounted_price: 1999,
    original_price: 5000,
    is_popular: true,
    tests_included: ["All Basic Tests", "Thyroid Profile", "Vitamin D & B12", "Iron Studies", "Urine Analysis"],
  },
  {
    id: "3",
    name: "Diabetes Care Package",
    total_tests: 28,
    discounted_price: 1299,
    original_price: 3000,
    is_popular: false,
    tests_included: ["HbA1c", "Fasting Glucose", "Post Prandial", "Kidney Function", "Lipid Profile"],
  },
  {
    id: "4",
    name: "Heart Care Package",
    total_tests: 42,
    discounted_price: 2499,
    original_price: 6000,
    is_popular: false,
    tests_included: ["Lipid Profile", "ECG", "Cardiac Markers", "Homocysteine", "hs-CRP"],
  },
];

interface BookingItem {
  id: string;
  name: string;
  price: number;
  type: 'test' | 'package';
}

const LabTests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");
  const [collectionType, setCollectionType] = useState("home");
  const [address, setAddress] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: dbTests = [] } = useLabTests();
  const { data: dbPackages = [] } = useHealthPackages();
  
  const tests = dbTests.length > 0 ? dbTests : fallbackTests;
  const packages = dbPackages.length > 0 ? dbPackages : fallbackPackages;

  const filteredTests = tests.filter((test: any) => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (test.category && test.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  const getMrp = (price: number, discount: number) => {
    if (!discount || discount === 0) return null;
    return Math.round(price / (1 - discount / 100));
  };

  const handleBookTest = (item: BookingItem) => {
    if (!user) {
      toast.error("Please login to book a test");
      navigate("/auth");
      return;
    }
    setBookingItem(item);
    setBookingDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleConfirmBooking = async () => {
    if (!user || !bookingItem) return;
    
    if (!bookingDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (collectionType === "home" && !address) {
      toast.error("Please enter your address for home collection");
      return;
    }

    setIsBooking(true);
    try {
      const bookingData: any = {
        user_id: user.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        amount: bookingItem.price,
        is_home_collection: collectionType === "home",
        collection_address: collectionType === "home" ? address : null,
        status: "pending",
        payment_status: "pending",
      };

      if (bookingItem.type === "test") {
        bookingData.test_id = bookingItem.id;
      } else {
        bookingData.package_id = bookingItem.id;
      }

      const { error } = await supabase
        .from("lab_bookings")
        .insert(bookingData);

      if (error) throw error;

      toast.success("Test booked successfully! We will contact you shortly.");
      setBookingItem(null);
      setAddress("");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Failed to book test. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

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
                {packages.map((pkg: any) => {
                  const discount = pkg.original_price 
                    ? Math.round(((pkg.original_price - pkg.discounted_price) / pkg.original_price) * 100)
                    : 0;
                  return (
                    <Card key={pkg.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                      {pkg.is_popular && (
                        <Badge className="absolute top-3 right-3 bg-orange-500">Popular</Badge>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Includes {pkg.total_tests} tests</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                          {(pkg.tests_included || []).slice(0, 5).map((test: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                              <span className="line-clamp-1">{test}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-primary">₹{pkg.discounted_price}</span>
                          {pkg.original_price && (
                            <span className="text-sm text-muted-foreground line-through">₹{pkg.original_price}</span>
                          )}
                          {discount > 0 && (
                            <Badge variant="secondary">{discount}% OFF</Badge>
                          )}
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleBookTest({
                            id: pkg.id,
                            name: pkg.name,
                            price: pkg.discounted_price,
                            type: 'package'
                          })}
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="tests">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTests.map((test: any) => {
                  const mrp = getMrp(test.price, test.discount_percent || 0);
                  return (
                    <Card key={test.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-secondary/10 rounded-lg">
                            <Beaker className="h-5 w-5 text-secondary" />
                          </div>
                          {test.category && (
                            <Badge variant="outline">{test.category}</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{test.name}</h3>
                        {test.report_time && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Clock className="h-3 w-3" />
                            <span>Report in {test.report_time}</span>
                          </div>
                        )}
                        {test.home_collection_available && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Home className="h-3 w-3" />
                            <span>Home collection available</span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-bold">₹{test.price}</span>
                          {mrp && (
                            <span className="text-sm text-muted-foreground line-through">₹{mrp}</span>
                          )}
                          {test.discount_percent && test.discount_percent > 0 && (
                            <Badge className="bg-secondary text-xs">{test.discount_percent}% OFF</Badge>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleBookTest({
                            id: test.id,
                            name: test.name,
                            price: test.price,
                            type: 'test'
                          })}
                        >
                          Book Test
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
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

      {/* Booking Dialog */}
      <Dialog open={!!bookingItem} onOpenChange={() => setBookingItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book {bookingItem?.type === 'package' ? 'Health Package' : 'Lab Test'}</DialogTitle>
            <DialogDescription>
              {bookingItem?.name} - ₹{bookingItem?.price}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={bookingDate}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Collection Type</Label>
              <RadioGroup value={collectionType} onValueChange={setCollectionType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex items-center gap-2">
                    <Home className="h-4 w-4" /> Home Collection (Free)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lab" id="lab" />
                  <Label htmlFor="lab" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Visit Lab
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {collectionType === "home" && (
              <div className="space-y-2">
                <Label htmlFor="address">Collection Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setBookingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} disabled={isBooking}>
              {isBooking ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabTests;
