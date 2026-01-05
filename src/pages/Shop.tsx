import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Filter, ShoppingCart, Heart, Star, 
  Pill, Droplets, Stethoscope, Baby, Leaf, 
  Dumbbell, ThermometerSun, Sparkles, HeartPulse
} from "lucide-react";

const categories = [
  { name: "Medicines", icon: Pill, count: 500, slug: "medicines", color: "bg-blue-100 text-blue-600" },
  { name: "Skin Care", icon: Sparkles, count: 120, slug: "skin-care", color: "bg-pink-100 text-pink-600" },
  { name: "Hair Care", icon: Droplets, count: 85, slug: "hair-care", color: "bg-purple-100 text-purple-600" },
  { name: "Personal Care", icon: HeartPulse, count: 200, slug: "personal-care", color: "bg-green-100 text-green-600" },
  { name: "Baby Care", icon: Baby, count: 95, slug: "baby-care", color: "bg-yellow-100 text-yellow-600" },
  { name: "Ayurveda", icon: Leaf, count: 150, slug: "ayurveda", color: "bg-emerald-100 text-emerald-600" },
  { name: "Fitness", icon: Dumbbell, count: 75, slug: "fitness", color: "bg-orange-100 text-orange-600" },
  { name: "Medical Devices", icon: ThermometerSun, count: 60, slug: "medical-devices", color: "bg-red-100 text-red-600" },
];

const featuredProducts = [
  { id: 1, name: "Dolo 650mg", brand: "Micro Labs", price: 30, mrp: 35, discount: 14, rating: 4.5, reviews: 234, image: "💊", prescription: false },
  { id: 2, name: "Crocin Advance", brand: "GSK", price: 25, mrp: 28, discount: 11, rating: 4.3, reviews: 156, image: "💊", prescription: false },
  { id: 3, name: "Vitamin D3 60K", brand: "Mankind", price: 180, mrp: 220, discount: 18, rating: 4.7, reviews: 89, image: "💊", prescription: false },
  { id: 4, name: "Cetaphil Moisturizer", brand: "Galderma", price: 550, mrp: 650, discount: 15, rating: 4.6, reviews: 312, image: "🧴", prescription: false },
  { id: 5, name: "Himalaya Neem Face Wash", brand: "Himalaya", price: 150, mrp: 175, discount: 14, rating: 4.4, reviews: 567, image: "🧴", prescription: false },
  { id: 6, name: "Ensure Powder 400g", brand: "Abbott", price: 750, mrp: 850, discount: 12, rating: 4.8, reviews: 203, image: "🥛", prescription: false },
  { id: 7, name: "Omez 20mg", brand: "Dr. Reddy's", price: 95, mrp: 110, discount: 14, rating: 4.5, reviews: 178, image: "💊", prescription: true },
  { id: 8, name: "BP Monitor Digital", brand: "Omron", price: 1850, mrp: 2200, discount: 16, rating: 4.7, reviews: 445, image: "🩺", prescription: false },
];

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = featuredProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Order Medicines & Health Products
              </h1>
              <p className="text-muted-foreground mb-6">
                Get up to 25% off on all medicines. Free delivery on orders above ₹500
              </p>
              <div className="flex gap-2 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search medicines, health products..."
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Link to="/upload-prescription">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Upload Prescription</h3>
                  <p className="text-xs text-muted-foreground">Get medicines delivered</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/lab-tests">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20 hover:border-secondary">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                    <ThermometerSun className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-sm">Book Lab Test</h3>
                  <p className="text-xs text-muted-foreground">Home sample collection</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/consult">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-accent/20 hover:border-accent">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
                    <HeartPulse className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-sm">Consult Doctor</h3>
                  <p className="text-xs text-muted-foreground">Online consultation</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/scan-booking">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-500/20 hover:border-orange-500">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-sm">Book Scan</h3>
                  <p className="text-xs text-muted-foreground">X-Ray, MRI, CT, USG</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCategory === category.slug 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-sm text-center">{category.name}</p>
                  <p className="text-xs text-muted-foreground text-center">{category.count}+ items</p>
                </button>
              ))}
            </div>
          </section>

          {/* Products Grid */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="relative p-4 bg-muted/30">
                      <div className="text-5xl text-center py-4">{product.image}</div>
                      {product.prescription && (
                        <Badge className="absolute top-2 left-2 bg-orange-500">Rx</Badge>
                      )}
                      <Badge className="absolute top-2 right-2 bg-secondary">
                        {product.discount}% OFF
                      </Badge>
                      <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg">₹{product.price}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                      </div>
                      <Button size="sm" className="w-full gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
