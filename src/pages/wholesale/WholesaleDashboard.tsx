
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

// ✅ THE FIX: Importing the REAL page components we already built
import WholesaleRegisterForm from "./WholesaleRegister";
import WholesaleProducts from "./WholesaleProducts";
import WholesaleQuotes from "./WholesaleQuotes";
import WholesaleProfile from "./WholesaleProfile";

// DashboardStats can be a simple component for the main dashboard view
const DashboardStats = () => (
    <Card>
        <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Welcome to your Wholesale Dashboard</h2>
            <p className="text-muted-foreground">From here you can browse products, manage quote requests, and view your business profile.</p>
        </CardContent>
    </Card>
);

const WholesaleDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "dashboard";

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("wholesale_profiles").select("*").eq("user_id", user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading || profileLoading) {
    return <div>Loading Wholesale Dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If no profile, render the full registration form component.
  if (!profile) {
    return <WholesaleRegisterForm />;
  }

  // This is the main view for a registered wholesale user.
  return (
    <div className="space-y-6">
      {!profile.is_verified && (
        <Card className="border-yellow-500 bg-yellow-50"><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="h-5 w-5 text-yellow-600" /><div><p className="font-medium text-yellow-800">Verification Pending</p><p className="text-sm text-yellow-700">Your business profile is under review.</p></div></CardContent></Card>
      )}

      <Tabs value={activeTab} onValueChange={(tab) => navigate(`${location.pathname}?tab=${tab}`)} className="w-full">
        {/* The TabsList is hidden because navigation is handled by the main Layout sidebar */}
        <TabsContent value="dashboard"><DashboardStats /></TabsContent>
        <TabsContent value="products"><WholesaleProducts /></TabsContent>
        <TabsContent value="quotes"><WholesaleQuotes /></TabsContent>
        <TabsContent value="profile"><WholesaleProfile /></TabsContent>
      </Tabs>
    </div>
  );
};

export default WholesaleDashboard;
