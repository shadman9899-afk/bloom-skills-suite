import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, Home } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim()) { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    if (signUpError) {
      setError("Something went wrong. Please try again.");
    } else {
      toast({ title: "Account created! 🎉", description: "Check your email to confirm your account." });
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-secondary items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <GraduationCap className="h-6 w-6 text-secondary-foreground" />
              </div>
              <span className="text-2xl font-bold text-secondary-foreground tracking-tight" onClick={() => navigate('/')}>
                Slate Academy
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-secondary-foreground leading-tight mb-4">
              Start learning<br />something new today
            </h2>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed">
              Join thousands of students mastering design, development, and marketing skills.
            </p>
            {/* Steps preview */}
            <div className="mt-10 space-y-4">
              {[
                { step: "1", text: "Create your account" },
                { step: "2", text: "Pick your interests" },
                { step: "3", text: "Start learning" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-secondary-foreground">
                    {item.step}
                  </div>
                  <p className="text-secondary-foreground/80 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute top-16 right-16 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute bottom-16 left-8 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Right - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[400px]"
        >
          <div className="flex items-center justify-between gap-2 mb-10 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight" onClick={() => navigate('#')}>
                Slate Academy
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>

          {/* Back to Home button for desktop */}
          <div className="hidden lg:flex justify-end mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create account ✨</h1>
            <p className="text-muted-foreground">Join Slate Academy for free</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="name"
                  placeholder="Alex Johnson"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-12 rounded-xl text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;