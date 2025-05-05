import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signIn, signInWithGoogle, transformFirebaseUser } from "@/lib/firebase";
import { useStore } from "@/store/auth-store";
import ThemeToggle from "@/components/theme-toggle";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight, BrainCircuit } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", data.email);
      const userCredential = await signIn(data.email, data.password);
      const user = userCredential.user;
      
      console.log("Login successful, user:", user);
      
      // Use the transformer function to convert Firebase user to our app's User format
      const transformedUser = transformFirebaseUser(user);
      setUser(transformedUser);
      
      console.log("User set in store:", transformedUser);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      setLocation("/");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Invalid password";
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Authentication service unavailable. Using mock mode instead.";
        // Try to perform mock login despite Firebase error
        try {
          if (data.email === "test@example.com" && data.password === "password123") {
            const mockUser = {
              id: "mock-user-1",
              uid: "mock-user-1",
              email: "test@example.com",
              displayName: "Test User",
              photoURL: null
            };
            
            // Store in localStorage
            localStorage.setItem('quiz-app-user', JSON.stringify(mockUser));
            
            // Set in store
            setUser(mockUser);
            
            toast({
              title: "Login Successful (Mock Mode)",
              description: "Welcome back!",
            });
            
            setLocation("/");
            return; // Exit early after successful mock login
          }
        } catch (mockError) {
          console.error("Error during mock login fallback:", mockError);
          errorMessage = "Failed to sign in, even in mock mode";
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Attempting Google sign-in");
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      
      console.log("Google sign-in successful, user:", user);
      
      // Use the transformer function for Google sign-in too
      const transformedUser = transformFirebaseUser(user);
      setUser(transformedUser);
      
      console.log("Google user set in store:", transformedUser);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      setLocation("/");
    } catch (error: any) {
      console.error("Google login error:", error);
      
      // Special handling for Firebase configuration errors
      if (error.code === "auth/configuration-not-found") {
        // Use mock Google login instead
        try {
          const mockUser = {
            id: "google-user-1",
            uid: "google-user-1",
            email: "google-user@example.com",
            displayName: "Google User",
            photoURL: "https://via.placeholder.com/150"
          };
          
          // Store in localStorage
          localStorage.setItem('quiz-app-user', JSON.stringify(mockUser));
          
          // Set in store
          setUser(mockUser);
          
          toast({
            title: "Google Login Successful (Mock Mode)",
            description: "Welcome back!",
          });
          
          setLocation("/");
          return;
        } catch (mockError) {
          console.error("Error during mock Google login fallback:", mockError);
        }
      }
      
      toast({
        title: "Google Login Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a] p-4">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocation("/")}
          className="text-gray-600 dark:text-gray-300 hover:text-primary"
        >
          Home
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full bg-white dark:bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl">
        {/* Left panel - Decorative/Brand */}
        <div className="hidden md:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-primary/90 to-primary-foreground/80 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 p-3 rounded-full">
                <BrainCircuit className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">QuizGenius</h1>
            <p className="text-xl font-light max-w-xs">Create, share, and master knowledge with interactive quizzes</p>
            
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                  </svg>
                </div>
                <p className="text-sm">Create AI-powered quizzes instantly</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                  </svg>
                </div>
                <p className="text-sm">Track progress with detailed analytics</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                  </svg>
                </div>
                <p className="text-sm">Compete on leaderboards with other users</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Right panel - Login Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 flex flex-col justify-center"
        >
          <div className="md:hidden flex justify-center mb-6">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <BrainCircuit className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email Address</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          {...field}
                          className="pl-10 dark:bg-[#111] focus:ring-2 focus:ring-primary/50"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs font-medium"
                        type="button"
                        onClick={() => setLocation("/forgot-password")}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 dark:bg-[#111] focus:ring-2 focus:ring-primary/50"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full mt-6 py-6 shadow-md hover:shadow-lg transition-all group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full py-6 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </div>
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary hover:underline"
                onClick={() => setLocation("/register")}
              >
                Sign up now
              </Button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
