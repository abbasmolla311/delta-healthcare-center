import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Phone, CreditCard, Wallet, Building, 
  Truck, Shield, ArrowLeft, Check
} from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processing, setProcessing] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const mrpTotal = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const discount = mrpTotal - subtotal;
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setProcessing(true);
    try {
      // Create order
      const orderItems = items.map(item => ({
        medicine_id: item.medicine_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items: orderItems,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          discount: discount,
          total: total,
          delivery_address: formData.address,
          delivery_phone: formData.phone,
          delivery_notes: formData.notes || null,
          payment_method: paymentMethod,
          payment_status: "pending",
          status: paymentMethod === "cod" ? "confirmed" : "pending",
        })
        .select()
        .single();

      if (error) throw error;

      if (paymentMethod === "online") {
        // Process Stripe payment
        const paymentItems = items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));

        const { data, error: fnError } = await supabase.functions.invoke("create-payment", {
          body: {
            items: paymentItems,
            orderId: order.id,
            deliveryAddress: formData.address,
            deliveryPhone: formData.phone,
          },
        });

        if (fnError) throw fnError;

        if (data?.url) {
          await clearCart();
          window.location.href = data.url;
          return;
        }
      }

      // COD - clear cart and redirect
      await clearCart();
      
      // Send notifications
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone, email")
          .eq("id", user.id)
          .single();
        
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "order_placed",
            userId: user.id,
            email: profile?.email || user.email,
            phone: profile?.phone || formData.phone,
            data: {
              orderId: order.id,
              orderTotal: total,
              customerName: profile?.full_name || "Customer",
            },
            channels: ["email", "sms"],
          },
        });
      } catch (notifError) {
        console.error("Notification error:", notifError);
        // Don't block order completion
      }
      
      toast.success("Order placed successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>

          <h1 className="text-2xl font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Delivery Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Full Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete delivery address including house/flat number, street, landmark..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="Enter your phone number"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions for delivery..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Wallet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Online Payment</p>
                            <p className="text-sm text-muted-foreground">Card, UPI, Net Banking</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items ({items.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-2xl">
                              {item.image}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.brand} × {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
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
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-secondary">-₹{discount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      {deliveryFee === 0 ? (
                        <span className="text-secondary">FREE</span>
                      ) : (
                        <span>₹{deliveryFee}</span>
                      )}
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>

                    <div className="bg-secondary/10 rounded-lg p-3 text-sm text-secondary">
                      You save ₹{discount} on this order
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="h-5 w-5 text-primary" />
                    <span>Delivery within 2-3 days</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
