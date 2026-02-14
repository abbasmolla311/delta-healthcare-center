
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
// ... (other imports remain the same)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Phone, Store, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.jpeg";

// ... (schemas remain the same) ...
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const signupSchema = z.object({ fullName: z.string().min(2), email: z.string().email(), phone: z.string().min(10), password: z.string().min(6), accountType: z.enum(["customer", "wholesale", "doctor"]) });
const resetSchema = z.object({ email: z.string().email() });
const newPasswordSchema = z.object({ password: z.string().min(6), confirmPassword: z.string().min(6) }).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // ... (state declarations remain the same) ...
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ fullName: "", email: "", phone: "", password: "", accountType: "customer" as "customer" | "wholesale" | "doctor" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        redirectBasedOnRole(session.user.id);
      }
    });
  }, [navigate]);

  // Updated redirect logic
  const redirectBasedOnRole = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      const role = roleData?.role;

      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "wholesale":
          navigate("/wholesale");
          break;
        default:
          navigate("/dashboard"); // Default dashboard for customers
      }
    } catch (error) {
      console.error("Role check failed, redirecting to default dashboard:", error);
      navigate("/dashboard"); // Fallback for any error
    } finally {
      setIsLoading(false);
    }
  };

  // ... (handleLogin, handleSignup, etc. remain the same, just ensure they call the updated redirect function) ...
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... validation ...
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(loginData);
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else if (data.user) {
      toast.success("Welcome back!");
      redirectBasedOnRole(data.user.id);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... validation ...
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: { data: { full_name: signupData.fullName, phone: signupData.phone, account_type: signupData.accountType } },
    });
    // ... rest of signup logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      {/* The JSX for the forms remains largely the same, ensure you add a 'doctor' option in the account type selector */}
    </div>
  );
};

export default Auth;
