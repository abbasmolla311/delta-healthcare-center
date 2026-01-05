import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Pill } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";

const DiscountedProducts = () => {
  const { data: products = [], isLoading } = useProducts();
  const { addToCart } = useCart();

  // Filter products with discounts
  const discountedProducts = products
    .filter((p: any) => p.discount_percent && p.discount_percent > 0)
    .sort((a: any, b: any) => (b.discount_percent || 0) - (a.discount_percent || 0))
    .slice(0, 8);

  const getDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  if (isLoading || discountedProducts.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Deals of the Day</h2>
          <p className="text-muted-foreground text-sm">Best discounts on medicines</p>
        </div>
        <Link to="/shop">
          <Button variant="outline" className="gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {discountedProducts.map((product: any) => {
          const discountedPrice = getDiscountedPrice(product.price, product.discount_percent || 0);
          
          return (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <CardContent className="p-4">
                <div className="relative mb-3">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-32 bg-muted rounded-lg flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                    <Pill className="h-12 w-12 text-muted-foreground" />
                  </div>
                  {product.discount_percent && (
                    <Badge className="absolute top-2 left-2 bg-red-500">{product.discount_percent}% OFF</Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
                {product.manufacturer && (
                  <p className="text-xs text-muted-foreground mb-2">{product.manufacturer}</p>
                )}
                
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">₹{discountedPrice}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default DiscountedProducts;
