
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

  // ✅ THE FIX: Added { replace: true } to the navigation.
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully!");
      navigate("/", { replace: true }); // This removes the login page from history.
    }
    setIsLoading(false);
  };

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
      navigate("/", { replace: true }); // Also apply the fix here for consistency.
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
