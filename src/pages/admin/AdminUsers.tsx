import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Briefcase, Store } from "lucide-react";

const AddUserForm = ({ role, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🔐 Ensure admin is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in as admin.");
      }

      // ✅ Call Edge Function
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: { ...formData, role },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(
        `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully!`
      );

      setFormData({
        email: "",
        password: "",
        fullName: "",
        phone: "",
      });

      onSuccess();
    } catch (error) {
      console.error("Create user error:", error);
      toast.error(error.message || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Full Name</Label>
          <Input
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : `Create ${role} User`}
      </Button>
    </form>
  );
};

const AdminUsers = () => {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <Tabs defaultValue="add-doctor">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-doctor">
            <Briefcase className="mr-2 h-4 w-4" />
            Add New Doctor
          </TabsTrigger>

          <TabsTrigger value="add-wholesale">
            <Store className="mr-2 h-4 w-4" />
            Add New Wholesaler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-doctor">
          <Card>
            <CardHeader>
              <CardTitle>Create Doctor Account</CardTitle>
              <CardDescription>
                Create a new user with the 'Doctor' role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddUserForm
                key={key}
                role="doctor"
                onSuccess={() => setKey((k) => k + 1)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-wholesale">
          <Card>
            <CardHeader>
              <CardTitle>Create Wholesale Account</CardTitle>
              <CardDescription>
                Create a new user with the 'Wholesale' role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddUserForm
                key={key + 1}
                role="wholesale"
                onSuccess={() => setKey((k) => k + 1)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;