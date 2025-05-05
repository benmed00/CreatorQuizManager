import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/firebase";
import ThemeToggle from "@/components/theme-toggle";
import { ArrowLeft, Mail, ArrowRight, BrainCircuit, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPassword() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a] flex flex-col items-center justify-center p-4">
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
      
      <div className="w-full max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center"
          onClick={() => setLocation("/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left column - Form */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                  <KeyRound className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-bold">Reset Your Password</CardTitle>
              <CardDescription className="text-center pt-2">
                Enter your email and we'll send you instructions to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4 py-8"
                >
                  <div className="mx-auto bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium">Email Sent Successfully!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We've sent password reset instructions to <strong>{email}</strong>. 
                    Please check your inbox and follow the link to reset your password.
                  </p>
                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => setLocation("/login")}
                    >
                      Return to Login
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10 dark:bg-[#111] focus:ring-2 focus:ring-primary/50"
                        disabled={isSubmitting}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full py-6 shadow-md hover:shadow-lg transition-all group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Reset Link <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          
          {/* Right column - Decorative */}
          <div className="hidden md:block relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-8 shadow-xl h-full"
            >
              <div className="h-full flex flex-col items-center justify-center">
                <div className="mb-8">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full">
                    <BrainCircuit className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-4">Account Security</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                  We take your account security seriously. After resetting your password, consider these security best practices:
                </p>
                
                <div className="space-y-6 w-full">
                  <div className="flex">
                    <div className="mr-4 bg-primary/10 dark:bg-primary/20 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Create a Strong Password</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use a combination of letters, numbers, and special characters.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 bg-primary/10 dark:bg-primary/20 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Never Share Your Password</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Keep your credentials private and secure at all times.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 bg-primary/10 dark:bg-primary/20 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Regularly Update Your Password</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Change your password periodically for better security.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}