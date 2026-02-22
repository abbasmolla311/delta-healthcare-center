
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import logo from "@/assets/logo.jpeg";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ SMART LOGIN: This function now correctly handles all user roles.
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !user) {
      toast.error(error?.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
      return;
    }

    // Fetch the user's role from the database
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError && roleError.code !== 'PGRST116') {
        toast.error("Could not verify user role.");
        navigate("/");
    } else {
        const role = roleData?.role || 'customer';
        if (role === 'admin') navigate("/admin");
        else if (role === 'doctor') navigate("/doctor/dashboard");
        else if (role === 'wholesale') navigate("/wholesale/dashboard");
        else navigate("/dashboard");
    }
    setIsLoading(false);
  };

  // ✅ SIMPLIFIED SIGNUP: New users can ONLY sign up as a regular customer.
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { fullName, email, phone, password } = e.currentTarget;

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: { data: { full_name: fullName.value, phone: phone.value } },
    });

    if (error) { toast.error(error.message); setIsLoading(false); return; }

    if (data.user) {
      const { error: roleError } = await supabase.from("user_roles").insert({ user_id: data.user.id, role: "customer" });
      if (roleError) { toast.error("Failed to set user role."); setIsLoading(false); return; }
      toast.success("Account created! Please check your email to verify.");
      navigate("/"); // Send all new users to the home page
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center"><img src={logo} alt="Logo" className="mx-auto h-20 w-20 mb-4" /><CardTitle>Welcome</CardTitle><CardDescription>Login or create an account</CardDescription></CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Login</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="password" type="password" placeholder="Password" required />
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <Input name="fullName" placeholder="Full Name" required />
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="phone" placeholder="Phone" required />
                <Input name="password" type="password" placeholder="Password" required />
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Creating Account..." : "Sign Up"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
