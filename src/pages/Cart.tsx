import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Minus, Plus, Trash2, ShoppingBag, Tag, 
  Truck, Shield, ArrowRight, Package, LogIn
} from "lucide-react";
import { useState } from "react";

const Cart = () => {
  const { user } = useAuth();
  const { items, loading, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const mrpTotal = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const discount = mrpTotal - subtotal;
  const couponDiscount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal - couponDiscount + deliveryFee;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon("SAVE10");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <LogIn className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Please login to view your cart</h1>
            <p className="text-muted-foreground mb-6">Sign in to add items and checkout</p>
            <Link to="/auth">
              <Button>Login / Sign Up</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add medicines and health products to your cart</p>
            <Link to="/shop">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-4xl">
                        {item.image || "💊"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.prescription && (
                              <Badge className="mt-1 bg-orange-500">Rx Required</Badge>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.medicine_id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.medicine_id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.medicine_id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{item.price * item.quantity}</p>
                            <p className="text-sm text-muted-foreground line-through">₹{item.mrp * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Coupon */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter coupon code (Try SAVE10)"
                        className="pl-10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon}
                      />
                    </div>
                    <Button variant="outline" onClick={applyCoupon} disabled={!!appliedCoupon}>
                      {appliedCoupon ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-secondary mt-2">Coupon SAVE10 applied! You save ₹{couponDiscount}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">MRP Total</span>
                    <span className="line-through">₹{mrpTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount on MRP</span>
                    <span className="text-secondary">-₹{discount}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coupon Discount</span>
                      <span className="text-secondary">-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="text-secondary">FREE</span>
                    ) : (
                      <span>₹{deliveryFee}</span>
                    )}
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{500 - subtotal} more for free delivery
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-3 text-sm text-secondary">
                    You save ₹{discount + couponDiscount} on this order
                  </div>
                  <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>100% genuine products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Easy returns within 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
