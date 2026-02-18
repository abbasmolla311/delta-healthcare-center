
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Phone, Store, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(6) });
const signupSchema = z.object({ fullName: z.string().trim().min(2), email: z.string().trim().email(), phone: z.string().trim().min(10), password: z.string().min(6), accountType: z.enum(["customer", "wholesale", "doctor"]) });

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ fullName: "", email: "", phone: "", password: "", accountType: "customer" as "customer" | "wholesale" | "doctor" });
  const [newPasswordData, setNewPasswordData] = useState({ password: "", confirmPassword: "" });
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("type") === "recovery") {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setShowNewPasswordForm(true);
        }
      });
    }
  }, [location]);

  const redirectBasedOnRole = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase.from('user_roles').select('role').eq('user_id', userId);
      if (error) throw error;
      const isAdmin = roles && roles.some(r => r.role === 'admin');
      if (isAdmin) {
        navigate("/admin");
      } else {
        const isDoctor = roles && roles.some(r => r.role === 'doctor');
        const isWholesale = roles && roles.some(r => r.role === 'wholesale');
        if (isDoctor) navigate("/doctor/dashboard");
        else if (isWholesale) navigate("/wholesale");
        else navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during role-based redirection:", error);
      navigate("/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(loginData);
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    if (data.user) {
      await redirectBasedOnRole(data.user.id);
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          full_name: signupData.fullName,
          phone: signupData.phone,
          account_type: signupData.accountType,
        },
      },
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    if (data.user) {
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: signupData.accountType === "doctor"
          ? "doctor"
          : signupData.accountType === "wholesale"
          ? "wholesale"
          : "user",
      });
      if(roleError) {
        toast.error("Could not assign role on signup. Contact support.")
      }
    }
    toast.success("Account created! Please check your email to verify.");
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: `${window.location.origin}/auth` });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent!");
    setIsLoading(false);
    setShowForgotPassword(false);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPasswordData.password });
    if (error) toast.error(error.message);
    else toast.success("Password updated successfully!");
    setShowNewPasswordForm(false);
    navigate("/auth", { replace: true });
    setIsLoading(false);
  };

  if (showNewPasswordForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md"><CardHeader><CardTitle>Set New Password</CardTitle></CardHeader><CardContent>
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <Input type="password" placeholder="New Password" value={newPasswordData.password} onChange={e => setNewPasswordData({...newPasswordData, password: e.target.value})} required/>
            <Input type="password" placeholder="Confirm New Password" value={newPasswordData.confirmPassword} onChange={e => setNewPasswordData({...newPasswordData, confirmPassword: e.target.value})} required/>
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Saving..." : "Save New Password"}</Button>
          </form>
        </CardContent></Card>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md"><CardHeader><CardTitle>Reset Password</CardTitle></CardHeader><CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input type="email" placeholder="your@email.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required/>
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Sending..." : "Send Reset Link"}</Button>
            <Button variant="ghost" onClick={() => setShowForgotPassword(false)}>Back to Login</Button>
          </form>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center"><img src={logo} alt="Logo" className="mx-auto h-20 w-20 mb-4" /><CardTitle>Welcome</CardTitle><CardDescription>Login or create an account</CardDescription></CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Login</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <Input type="email" placeholder="Email" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required/>
                <Input type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required/>
                <Button type="button" variant="link" onClick={() => setShowForgotPassword(true)} className="px-0">Forgot Password?</Button>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <Input placeholder="Full Name" value={signupData.fullName} onChange={e => setSignupData({...signupData, fullName: e.target.value})} required/>
                <Input type="email" placeholder="Email" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} required/>
                <Input placeholder="Phone" value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})} required/>
                <Input type="password" placeholder="Password" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} required/>
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
