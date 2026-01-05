import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, MapPin, Clock, FileText, CheckCircle2, 
  Scan, Radio, Zap, Eye, Calendar
} from "lucide-react";

const scanTypes = [
  { id: 1, name: "X-Ray", icon: Zap, description: "Quick imaging for bones & chest", price: 300, color: "bg-blue-100 text-blue-600" },
  { id: 2, name: "Ultrasound", icon: Radio, description: "Soft tissue imaging", price: 800, color: "bg-purple-100 text-purple-600" },
  { id: 3, name: "CT Scan", icon: Scan, description: "Detailed cross-section images", price: 2500, color: "bg-orange-100 text-orange-600" },
  { id: 4, name: "MRI", icon: Eye, description: "High-resolution soft tissue imaging", price: 5000, color: "bg-green-100 text-green-600" },
];

const popularScans = [
  { id: 1, name: "Chest X-Ray", type: "X-Ray", price: 300, mrp: 500, discount: 40, reportTime: "2 hours", prescription: false },
  { id: 2, name: "Abdomen Ultrasound", type: "Ultrasound", price: 800, mrp: 1200, discount: 33, reportTime: "Same day", prescription: false },
  { id: 3, name: "Brain MRI", type: "MRI", price: 5000, mrp: 8000, discount: 38, reportTime: "24 hours", prescription: true },
  { id: 4, name: "CT Scan Chest", type: "CT Scan", price: 2500, mrp: 4000, discount: 38, reportTime: "24 hours", prescription: true },
  { id: 5, name: "Spine X-Ray", type: "X-Ray", price: 400, mrp: 650, discount: 38, reportTime: "2 hours", prescription: false },
  { id: 6, name: "Pelvic Ultrasound", type: "Ultrasound", price: 900, mrp: 1400, discount: 36, reportTime: "Same day", prescription: false },
  { id: 7, name: "Knee MRI", type: "MRI", price: 4500, mrp: 7500, discount: 40, reportTime: "24 hours", prescription: true },
  { id: 8, name: "CT Scan Abdomen", type: "CT Scan", price: 3000, mrp: 5000, discount: 40, reportTime: "24 hours", prescription: true },
];

const scanCenters = [
  { id: 1, name: "Diagnostic Hub - Main Branch", address: "Bhawanipur, Kolkata", rating: 4.8, reviews: 234, scans: ["X-Ray", "Ultrasound", "CT", "MRI"] },
  { id: 2, name: "City Scan Center", address: "Salt Lake, Kolkata", rating: 4.6, reviews: 156, scans: ["X-Ray", "Ultrasound", "CT"] },
  { id: 3, name: "Advanced Imaging Lab", address: "Park Street, Kolkata", rating: 4.7, reviews: 189, scans: ["X-Ray", "Ultrasound", "MRI"] },
];

const ScanBooking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredScans = popularScans.filter(scan => {
    const matchesSearch = scan.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? scan.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-100 via-orange-50 to-primary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Badge className="mb-4 bg-orange-500">Premium Diagnostic Centers</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Book Scans & Imaging Tests
              </h1>
              <p className="text-muted-foreground mb-6">
                X-Ray, Ultrasound, CT Scan, MRI at discounted prices. Easy slot booking with quick reports.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for scans..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Scan Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Select Scan Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scanTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(selectedType === type.name ? null : type.name)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedType === type.name 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-12 h-12 mb-3 rounded-lg flex items-center justify-center ${type.color}`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{type.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                  <p className="font-bold text-primary">From ₹{type.price}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Popular Scans */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Popular Scans</h2>
              {selectedType && (
                <Button variant="outline" size="sm" onClick={() => setSelectedType(null)}>
                  Clear Filter
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredScans.map((scan) => (
                <Card key={scan.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">{scan.type}</Badge>
                      {scan.prescription && (
                        <Badge className="bg-orange-500">Rx Required</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{scan.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock className="h-3 w-3" />
                      <span>Report: {scan.reportTime}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-primary">₹{scan.price}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{scan.mrp}</span>
                      <Badge className="bg-secondary text-xs">{scan.discount}% OFF</Badge>
                    </div>
                    <Button size="sm" className="w-full gap-2">
                      <Calendar className="h-4 w-4" />
                      Book Slot
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Scan Centers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Our Diagnostic Centers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {scanCenters.map((center) => (
                <Card key={center.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{center.address}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{center.rating}</span>
                      <span className="text-sm text-muted-foreground">({center.reviews} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {center.scans.map((scan, idx) => (
                        <Badge key={idx} variant="outline">{scan}</Badge>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">View Center</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-muted/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Select Scan", desc: "Choose from X-Ray, MRI, CT, Ultrasound" },
                { step: 2, title: "Pick Center", desc: "Select a diagnostic center near you" },
                { step: 3, title: "Book Slot", desc: "Choose convenient date and time" },
                { step: 4, title: "Get Report", desc: "Receive digital report within hours" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScanBooking;
