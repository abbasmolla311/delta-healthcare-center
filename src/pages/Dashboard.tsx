import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders, useUserAppointments, useUserLabBookings } from "@/hooks/useProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, Package, Calendar, TestTube, Scan, FileText, 
  Bell, Settings, LogOut, Clock, CheckCircle2, XCircle,
  ShoppingBag, Stethoscope, ArrowRight
} from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: orders = [], isLoading: ordersLoading } = useUserOrders(user?.id);
  const { data: appointments = [], isLoading: appointmentsLoading } = useUserAppointments(user?.id);
  const { data: labBookings = [], isLoading: labLoading } = useUserLabBookings(user?.id);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />{status}</Badge>;
      case "shipped":
      case "confirmed":
      case "upcoming":
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
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back!</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
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
            <Link to="/scan-booking">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Scan className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="font-semibold text-sm">Book Scan</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ordersLoading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-16 bg-muted rounded-lg"></div>
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
                    ) : (
                      orders.slice(0, 2).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{order.id.slice(0, 8)}...</p>
                            <p className="text-xs text-muted-foreground">
                              {getOrderItems(order.items)} items • ₹{order.total}
                            </p>
                          </div>
                          {getStatusBadge(order.status || "pending")}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Appointments</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("appointments")}>
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {appointmentsLoading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-16 bg-muted rounded-lg"></div>
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-2">No appointments</p>
                        <Link to="/consult">
                          <Button size="sm" variant="outline">Book Now</Button>
                        </Link>
                      </div>
                    ) : (
                      appointments.slice(0, 2).map((apt: any) => (
                        <div key={apt.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">{apt.doctors?.name || "Doctor"}</p>
                            {getStatusBadge(apt.status || "pending")}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {apt.doctors?.specialty} • {apt.appointment_date} at {apt.appointment_time}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Lab Bookings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Lab Tests</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("lab-tests")}>
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {labLoading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ) : labBookings.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-2">No lab bookings</p>
                        <Link to="/lab-tests">
                          <Button size="sm" variant="outline">Book Now</Button>
                        </Link>
                      </div>
                    ) : (
                      labBookings.slice(0, 2).map((booking: any) => (
                        <div key={booking.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">
                              {booking.lab_tests?.name || booking.health_packages?.name || "Test"}
                            </p>
                            {getStatusBadge(booking.status || "pending")}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {booking.booking_date} • {booking.is_home_collection ? "Home" : "Lab"} collection
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
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
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                          <div className="text-right">
                            <p className="font-bold">₹{order.total}</p>
                            {getStatusBadge(order.status || "pending")}
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
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
                              <p className="text-sm">{apt.appointment_date} at {apt.appointment_time} • {apt.consultation_mode}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(apt.status || "pending")}
                            {apt.status === "confirmed" && (
                              <Button size="sm" className="mt-2">Join</Button>
                            )}
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
                            {getStatusBadge(booking.status || "pending")}
                            {booking.report_url && (
                              <Button variant="outline" size="sm" className="mt-2">
                                <FileText className="h-4 w-4 mr-1" />
                                Report
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>My Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Manage your prescriptions here</p>
                    <Link to="/upload-prescription">
                      <Button>Upload Prescription</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
