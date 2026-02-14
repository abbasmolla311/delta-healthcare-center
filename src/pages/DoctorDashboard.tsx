
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User as UserIcon, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, Dr. {user?.user_metadata?.full_name || 'Doctor'}!</h1>
        <p className="text-muted-foreground">Manage your appointments and patient interactions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>View your upcoming and past appointments.</CardDescription>
            <Button asChild className="mt-4">
              <Link to="/doctor/appointments">View Appointments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Profile</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Update your professional profile and availability.</CardDescription>
            <Button asChild className="mt-4">
              <Link to="/doctor/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Respond to inquiries from your patients.</CardDescription>
            <Button asChild className="mt-4">
              <Link to="/doctor/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
