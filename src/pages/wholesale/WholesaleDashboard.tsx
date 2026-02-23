
import { useEffect } from "react"; // ✅ Import useEffect
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // ✅ Import useQueryClient
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

import WholesaleRegisterForm from "./WholesaleRegister";
import WholesaleProducts from "./WholesaleProducts";
import WholesaleQuotes from "./WholesaleQuotes";
import WholesaleProfile from "./WholesaleProfile";

const DashboardStats = () => (
    <Card><CardContent className="p-6"><h2>Welcome to your Wholesale Dashboard</h2><p className="text-muted-foreground">Your account is active. You can now browse products and create quote requests.</p></CardContent></Card>
);

const WholesaleDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient(); // ✅ Get query client
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "dashboard";

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("wholesale_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (error) { console.error("Error fetching wholesale dashboard profile:", error); return null; }
      return data;
    },
    enabled: !!user,
  });

  // ✅ THE FIX: Add a real-time listener for profile updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`wholesale_profile_${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'wholesale_profiles', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log("Profile update received!", payload);
          // When an update is received, invalidate the query to force a refetch
          queryClient.invalidateQueries({ queryKey: ["wholesale-profile", user.id] });
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  if (authLoading || profileLoading) {
    return <div>Loading Wholesale Dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return <WholesaleRegisterForm />;
  }

  return (
    <div className="space-y-6">
      {!profile.is_verified && (
        <Card className="border-yellow-500 bg-yellow-50"><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="h-5 w-5 text-yellow-600" /><div><p className="font-medium text-yellow-800">Verification Pending</p><p className="text-sm text-yellow-700">Your account is under review. You will be notified once it is approved.</p></div></CardContent></Card>
      )}

      {/* Only show the main dashboard content if the user is verified */}
      {profile.is_verified ? (
        <Tabs value={activeTab} onValueChange={(tab) => navigate(`${location.pathname}?tab=${tab}`)} className="w-full">
          <TabsContent value="dashboard"><DashboardStats /></TabsContent>
          <TabsContent value="products"><WholesaleProducts /></TabsContent>
          <TabsContent value="quotes"><WholesaleQuotes /></TabsContent>
          <TabsContent value="profile"><WholesaleProfile /></TabsContent>
        </Tabs>
      ) : (
        <p className="text-center text-muted-foreground">Please wait for admin approval to access dashboard features.</p>
      )}
    </div>
  );
};

export default WholesaleDashboard;
