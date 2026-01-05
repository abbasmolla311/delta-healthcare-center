import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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

const mockOrders = [
  { id: "ORD001", date: "2026-01-03", items: 3, total: 760, status: "delivered" },
  { id: "ORD002", date: "2026-01-01", items: 2, total: 450, status: "shipped" },
  { id: "ORD003", date: "2025-12-28", items: 5, total: 1250, status: "processing" },
];

const mockAppointments = [
  { id: 1, doctor: "Dr. Amit Kumar", specialty: "General Physician", date: "2026-01-06", time: "4:00 PM", mode: "video", status: "upcoming" },
  { id: 2, doctor: "Dr. Priya Sharma", specialty: "Dermatologist", date: "2026-01-02", time: "5:30 PM", mode: "chat", status: "completed" },
];

const mockLabBookings = [
  { id: 1, test: "Complete Blood Count", date: "2026-01-05", collection: "home", status: "confirmed" },
  { id: 2, test: "Thyroid Profile", date: "2026-01-02", collection: "lab", status: "completed", reportUrl: "#" },
];

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
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
        return <Badge className="bg-orange-500"><Clock className="h-3 w-3 mr-1" />{status}</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
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
                    {mockOrders.slice(0, 2).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.items} items • ₹{order.total}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    ))}
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
                    {mockAppointments.slice(0, 2).map((apt) => (
                      <div key={apt.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{apt.doctor}</p>
                          {getStatusBadge(apt.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {apt.specialty} • {apt.date} at {apt.time}
                        </p>
                      </div>
                    ))}
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
                    {mockLabBookings.map((booking) => (
                      <div key={booking.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{booking.test}</p>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {booking.date} • {booking.collection} collection
                        </p>
                        {booking.reportUrl && (
                          <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                            <FileText className="h-3 w-3 mr-1" />
                            Download Report
                          </Button>
                        )}
                      </div>
                    ))}
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
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items} items • {order.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.total}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>My Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{apt.doctor}</p>
                            <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                            <p className="text-sm">{apt.date} at {apt.time} • {apt.mode}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(apt.status)}
                          {apt.status === "upcoming" && (
                            <Button size="sm" className="mt-2">Join</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lab-tests">
              <Card>
                <CardHeader>
                  <CardTitle>My Lab Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLabBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <TestTube className="h-6 w-6 text-secondary" />
                          </div>
                          <div>
                            <p className="font-semibold">{booking.test}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date} • {booking.collection} collection
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                          {booking.reportUrl && (
                            <Button variant="outline" size="sm" className="mt-2">
                              <FileText className="h-4 w-4 mr-1" />
                              Report
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <p className="text-muted-foreground">No prescriptions uploaded yet</p>
                    <Button className="mt-4">Upload Prescription</Button>
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
