import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders, useUserAppointments, useUserLabBookings } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderTracking from "@/components/OrderTracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, Mail, Phone, MapPin, Calendar, Save, Package, 
  Stethoscope, TestTube, LogOut, ShoppingBag, Clock, 
  CheckCircle2, XCircle, Eye
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { data: orders = [], isLoading: ordersLoading } = useUserOrders(user?.id);
  const { data: appointments = [], isLoading: appointmentsLoading } = useUserAppointments(user?.id);
  const { data: labBookings = [], isLoading: labLoading } = useUserLabBookings(user?.id);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      } else {
        setProfile(prev => ({ ...prev, email: user.email || "" }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name || null,
          email: profile.email || null,
          phone: profile.phone || null,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender || null,
          address: profile.address || null,
          city: profile.city || null,
          state: profile.state || null,
          pincode: profile.pincode || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />{status}</Badge>;
      case "shipped":
      case "confirmed":
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />{status}</Badge>;
      case "processing":
      case "pending":
        return <Badge className="bg-orange-500"><Clock className="h-3 w-3 mr-1" />{status}</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getOrderItems = (items: any) => {
    if (Array.isArray(items)) {
      return items.length;
    }
    return 0;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-white text-xl">
                  {profile.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name || "My Account"}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/shop">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">Order Medicines</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/consult">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Stethoscope className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <p className="font-semibold text-sm">Consult Doctor</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/lab-tests">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <TestTube className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <p className="font-semibold text-sm">Book Lab Test</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/upload-prescription">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="font-semibold text-sm">Upload Prescription</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="max-w-2xl">
                {/* Personal Information */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            className="pl-10"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dob"
                            type="date"
                            className="pl-10"
                            value={profile.date_of_birth}
                            onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={profile.gender} 
                          onValueChange={(value) => setProfile({ ...profile, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Textarea
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        placeholder="Enter your street address"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile.state}
                          onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={profile.pincode}
                          onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-muted rounded-lg"></div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No orders yet</p>
                      <Link to="/shop">
                        <Button>Shop Now</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {getOrderItems(order.items)} items • {format(new Date(order.created_at), "PP")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold">₹{order.total}</p>
                              {getStatusBadge(order.status || "pending")}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>My Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-muted rounded-lg"></div>
                      ))}
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No appointments scheduled</p>
                      <Link to="/consult">
                        <Button>Book Consultation</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Stethoscope className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{apt.doctors?.name || "Doctor"}</p>
                              <p className="text-sm text-muted-foreground">{apt.doctors?.specialty}</p>
                              <p className="text-sm">{apt.appointment_date} at {apt.appointment_time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(apt.status || "pending")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lab-tests">
              <Card>
                <CardHeader>
                  <CardTitle>My Lab Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  {labLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-muted rounded-lg"></div>
                      ))}
                    </div>
                  ) : labBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No lab tests booked</p>
                      <Link to="/lab-tests">
                        <Button>Book Lab Test</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {labBookings.map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                              <TestTube className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {booking.lab_tests?.name || booking.health_packages?.name || "Test"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.booking_date} • {booking.is_home_collection ? "Home" : "Lab"} collection
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold mb-1">₹{booking.amount}</p>
                            {getStatusBadge(booking.status || "pending")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Order Tracking Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id?.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderTracking 
              status={selectedOrder.status || "pending"} 
              createdAt={selectedOrder.created_at}
              expectedDelivery={selectedOrder.expected_delivery}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
