
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building, User, Phone, Mail, MapPin, FileText } from "lucide-react";

const DetailRow = ({ icon, label, value }) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b">
    <div className="col-span-1 flex items-center gap-3 text-muted-foreground">
      {icon}
      <Label className="text-sm">{label}</Label>
    </div>
    <div className="col-span-2 font-medium">
      {value || "-"}
    </div>
  </div>
);

const WholesaleProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("wholesale_profiles").select("*").eq("user_id", user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>No wholesale profile found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Business Profile</h1>
        <Badge variant={profile.is_verified ? "success" : "warning"}>
          {profile.is_verified ? "Verified" : "Pending Verification"}
        </Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building/> {profile.business_name}</CardTitle>
          <CardDescription>{profile.business_type}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow icon={<User/>} label="Contact Person" value={profile.contact_person} />
          <DetailRow icon={<Phone/>} label="Phone" value={profile.phone} />
          <DetailRow icon={<Mail/>} label="Email" value={profile.email} />
          <DetailRow icon={<MapPin/>} label="Address" value={`${profile.business_address}, ${profile.business_city}, ${profile.business_state} - ${profile.business_pincode}`} />
          <DetailRow icon={<FileText/>} label="GST Number" value={profile.gst_number} />
          <DetailRow icon={<FileText/>} label="Drug License" value={profile.drug_license_number} />
          <DetailRow icon={<FileText/>} label="PAN Number" value={profile.pan_number} />
        </CardContent>
      </Card>
    </div>
  );
};

export default WholesaleProfile;
