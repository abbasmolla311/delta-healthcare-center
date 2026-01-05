import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Users, Stethoscope, TestTube, TrendingUp, 
  TrendingDown, DollarSign, Package, Calendar, Clock
} from "lucide-react";

const stats = [
  { title: "Total Orders", value: "1,234", change: "+12%", trend: "up", icon: ShoppingCart, color: "bg-blue-500" },
  { title: "Revenue", value: "₹4,52,890", change: "+8%", trend: "up", icon: DollarSign, color: "bg-green-500" },
  { title: "Registered Users", value: "3,456", change: "+23%", trend: "up", icon: Users, color: "bg-purple-500" },
  { title: "Appointments", value: "189", change: "-5%", trend: "down", icon: Calendar, color: "bg-orange-500" },
];

const recentOrders = [
  { id: "ORD001", customer: "John Doe", amount: 760, status: "delivered", date: "2 hours ago" },
  { id: "ORD002", customer: "Jane Smith", amount: 450, status: "shipped", date: "4 hours ago" },
  { id: "ORD003", customer: "Amit Kumar", amount: 1250, status: "processing", date: "6 hours ago" },
  { id: "ORD004", customer: "Priya Sharma", amount: 890, status: "pending", date: "8 hours ago" },
];

const upcomingAppointments = [
  { doctor: "Dr. Amit Kumar", patient: "Rahul Singh", time: "4:00 PM", type: "Video" },
  { doctor: "Dr. Priya Sharma", patient: "Neha Gupta", time: "5:30 PM", type: "Chat" },
  { doctor: "Dr. D.P. Mandal", patient: "Suresh Kumar", time: "6:00 PM", type: "Audio" },
];

const AdminDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500";
      case "shipped": return "bg-blue-500";
      case "processing": return "bg-orange-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.amount}</p>
                    <Badge className={`${getStatusColor(order.status)} text-xs`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((apt, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{apt.doctor}</p>
                      <p className="text-sm text-muted-foreground">with {apt.patient}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{apt.time}</span>
                    </div>
                    <Badge variant="outline">{apt.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Add Product</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <Stethoscope className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <p className="text-sm font-medium">Add Doctor</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <TestTube className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Add Lab Test</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-sm font-medium">View Users</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
