
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// ✅ THE FIX: Using a valid UUID string that matches the database
const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

const AdminSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_settings").select("*").eq("id", SETTINGS_ID).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const { mutate: updateSettings, isPending: isSaving } = useMutation({
    mutationFn: async (newSettings: any) => {
      const { error } = await supabase.from("admin_settings").upsert({ ...newSettings, id: SETTINGS_ID });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (error) => {
      toast.error("Error saving settings", { description: error.message });
    },
  });

  const handleSave = () => {
    if (localSettings) {
      updateSettings(localSettings);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setLocalSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading || !localSettings) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your application-wide settings.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Store Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Store Name</Label>
            <Input id="store_name" value={localSettings.store_name || ""} onChange={(e) => handleInputChange("store_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support_email">Support Email</Label>
            <Input id="support_email" type="email" value={localSettings.support_email || ""} onChange={(e) => handleInputChange("support_email", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payment Gateway (Stripe)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe_pk">Stripe Publishable Key</Label>
            <Input id="stripe_pk" placeholder="pk_test_..." value={localSettings.stripe_pk || ""} onChange={(e) => handleInputChange("stripe_pk", e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe_sk">Stripe Secret Key</Label>
            <Input id="stripe_sk" type="password" placeholder="••••••••••••••••" value={localSettings.stripe_sk || ""} onChange={(e) => handleInputChange("stripe_sk", e.target.value)}/>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
