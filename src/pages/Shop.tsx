
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Search, Filter, ShoppingCart, Star, Pill } from "lucide-react";

// Import the components from the Home Page
import HeroCarousel from "@/components/home/HeroCarousel";
import QuickActions from "@/components/home/QuickActions";
import { categoryGroups } from "@/data/categories";

const fallbackProducts = [
  { id: "1", name: "Dolo 650mg", brand: "Micro Labs", price: 30, discount_percent: 14, image_url: "", requires_prescription: false },
];

const Shop = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { data: products, isLoading } = useProducts(searchQuery, selectedCategory || undefined);

  const displayProducts = products && products.length > 0 ? products : fallbackProducts;

  const filteredProducts = displayProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMrp = (price: number, discountPercent: number) => {
    return Math.round(price / (1 - discountPercent / 100));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4 space-y-8 sm:space-y-12">
          {/* 1. Replaced static hero with HeroCarousel */}
          <HeroCarousel />

          {/* 2. Replaced 4 actions with the 6-item QuickActions component */}
          <QuickActions />

          {/* Search bar - now positioned below quick actions */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('search_placeholder')}
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('shop_by_category_title')}</h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
              {categoryGroups.slice(0, 8).flatMap(group =>
                group.categories.slice(0, 1).map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      selectedCategory === cat.slug
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${cat.color}`}>
                      <cat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <p className="font-medium text-xs sm:text-sm line-clamp-2 leading-tight">{cat.name}</p>
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Products Grid Section */}
          <section>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">{t('featured_products_title')}</h2>
              {selectedCategory && (
                <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
                  {t('clear_filter_button')}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const mrp = getMrp(product.price, product.discount_percent || 0);
                return (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
                    <CardContent className="p-0">
                      <div className="relative p-2 sm:p-3 bg-muted/30 aspect-square flex items-center justify-center">
                        {product.image_url && product.image_url.startsWith("http") ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mx-auto" />
                        ) : (
                          <Pill className="h-10 w-10 text-muted-foreground" />
                        )}
                        {product.discount_percent && product.discount_percent > 0 && (
                          <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-secondary text-xs px-1.5 py-0.5">{product.discount_percent}% OFF</Badge>
                        )}
                      </div>
                      <div className="p-2 sm:p-3">
                        <p className="text-xs text-muted-foreground mb-0.5 truncate">{product.brand || "Generic"}</p>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">4.5</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-base sm:text-lg">₹{product.price}</span>
                          {mrp > product.price && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{mrp}</span>
                          )}
                        </div>
                        <Button size="sm" className="w-full gap-2 text-xs sm:text-sm h-9" onClick={() => addToCart(product)}>
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {t('add_to_cart_button')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
