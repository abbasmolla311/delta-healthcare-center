
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Stethoscope, User as UserIcon, FileText, ChevronRight, Heart, Pill } from "lucide-react";
import { Link } from "react-router-dom";

const ActionCard = ({ to, icon, title, description }: { to: string, icon: React.ReactNode, title: string, description: string }) => (
  <Link to={to} className="block hover:bg-muted/50 rounded-lg p-1 transition-colors">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-3">{icon}{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
    </Card>
  </Link>
);

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome, {user?.user_metadata?.full_name || 'Valued Customer'}!</h1>
        <p className="text-lg text-muted-foreground">This is your personal health and wellness hub. Manage your account and access our services.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Account</h2>
          <ActionCard
            to="/profile"
            icon={<UserIcon className="h-6 w-6 text-primary" />}
            title="My Profile"
            description="Update your name, contact, and personal details."
          />
          <ActionCard
            to="/orders"
            icon={<ShoppingCart className="h-6 w-6 text-primary" />}
            title="My Orders"
            description="Track recent orders and view your purchase history."
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Health</h2>
          <ActionCard
            to="/prescriptions"
            icon={<FileText className="h-6 w-6 text-primary" />}
            title="My Prescriptions"
            description="View and manage your uploaded prescriptions."
          />
          <ActionCard
            to="/consultations"
            icon={<Stethoscope className="h-6 w-6 text-primary" />}
            title="My Consultations"
            description="Access records from your doctor appointments."
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
