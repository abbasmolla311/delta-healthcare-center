
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const WholesaleRegisterForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ business_name: "", owner_name: "", phone: "", address: "", gst_number: "" });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ THE FIX: Add a guard clause to ensure the user object is loaded.
    if (!user) {
      toast.error("User not loaded yet. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('wholesale_profiles').upsert(
        { user_id: user.id, ...formData, status: 'pending' },
        { onConflict: 'user_id' }
      );
      if (error) throw error;

      await supabase.from('user_roles').upsert({ user_id: user.id, role: 'wholesale' }, { onConflict: 'user_id' });

      toast.success("Registration submitted for review!");
      queryClient.invalidateQueries(['wholesale-profile', user.id]);
      queryClient.invalidateQueries(['user-role', user.id]);

    } catch (error) {
      toast.error(error.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (rest of the component is correct)
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader><CardTitle>Wholesale Registration</CardTitle><CardDescription>Register your business to access wholesale pricing.</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="business_name">Business Name</Label><Input id="business_name" value={formData.business_name} onChange={handleChange} required/></div>
            <div className="space-y-1"><Label htmlFor="owner_name">Owner Name</Label><Input id="owner_name" value={formData.owner_name} onChange={handleChange} required/></div>
            <div className="space-y-1"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={formData.phone} onChange={handleChange} required/></div>
            <div className="space-y-1"><Label htmlFor="gst_number">GST Number</Label><Input id="gst_number" value={formData.gst_number} onChange={handleChange} /></div>
          </div>
          <div className="space-y-1"><Label htmlFor="address">Full Address</Label><Textarea id="address" value={formData.address} onChange={handleChange} required/></div>
          <Button type="submit" className="w-full" disabled={isSubmitting || !user}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : "Submit for Verification"}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WholesaleRegisterForm;
