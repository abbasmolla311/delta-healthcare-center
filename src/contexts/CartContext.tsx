import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartItem {
  id: string;
  medicine_id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
  prescription: boolean;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (medicine: any) => Promise<void>;
  removeFromCart: (medicineId: string) => Promise<void>;
  updateQuantity: (medicineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart items when user logs in
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          medicine_id,
          medicines (
            id,
            name,
            brand,
            price,
            discount_percent,
            image_url,
            requires_prescription
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        medicine_id: item.medicine_id,
        name: item.medicines?.name || "Unknown",
        brand: item.medicines?.brand || "",
        price: item.medicines?.price || 0,
        mrp: item.medicines?.price ? Math.round(item.medicines.price / (1 - (item.medicines.discount_percent || 0) / 100)) : 0,
        quantity: item.quantity || 1,
        image: item.medicines?.image_url || "💊",
        prescription: item.medicines?.requires_prescription || false,
      }));

      setItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (medicine: any) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      // Check if item already exists
      const existingItem = items.find(item => item.medicine_id === medicine.id);
      
      if (existingItem) {
        await updateQuantity(medicine.id, existingItem.quantity + 1);
        return;
      }

      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          medicine_id: medicine.id,
          quantity: 1,
        });

      if (error) throw error;

      toast.success("Added to cart");
      await fetchCartItems();
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (medicineId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("medicine_id", medicineId);

      if (error) throw error;

      setItems(items.filter(item => item.medicine_id !== medicineId));
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (medicineId: string, quantity: number) => {
    if (!user) return;

    if (quantity < 1) {
      await removeFromCart(medicineId);
      return;
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("medicine_id", medicineId);

      if (error) throw error;

      setItems(items.map(item => 
        item.medicine_id === medicineId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
