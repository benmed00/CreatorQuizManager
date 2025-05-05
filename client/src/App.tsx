import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CreateQuiz from "@/pages/create-quiz";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import Quizzes from "@/pages/quizzes";
import Analytics from "@/pages/analytics";
import LeaderboardPage from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import Contact from "@/pages/contact";
import LandingPage from "@/pages/landing";
import TemplatesPage from "@/pages/templates";
import QuestionBank from "@/pages/question-bank";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import UseCasesPage from "@/pages/use-cases";
import Header from "@/components/nav/header";
import Footer from "@/components/nav/footer";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from "@/store/auth-store";
import { transformFirebaseUser, getCurrentUser } from "@/lib/firebase";
import Documentation from "@/pages/docs";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useStore();
  const [location, navigate] = useLocation();
  
  // Check if user is authenticated on app load
  useEffect(() => {
    const auth = getAuth();
    
    // First, try to get user from localStorage for immediate UI response
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Then listen for auth state changes from Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Use our transformer to ensure consistent formatting
        const transformedUser = transformFirebaseUser(firebaseUser);
        setUser(transformedUser);
      } else {
        // No Firebase user, but check if we have a stored user in localStorage
        const storedUser = getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [setUser]);

  // Handle routing based on auth status
  useEffect(() => {
    if (isLoading) return; // Don't redirect until auth state is resolved
    
    // Public routes that don't require authentication
    const publicRoutes = ['/home', '/login', '/register', '/forgot-password', '/contact', '/terms', '/privacy', '/use-cases'];
    // Check if current route is a documentation page (starts with /docs)
    const isDocsRoute = location.startsWith('/docs');
    // Consider a route public if it's in publicRoutes OR it's a docs route
    const isPublicRoute = publicRoutes.includes(location) || isDocsRoute;
    
    // Redirect root to home or dashboard depending on auth status
    if (location === '/') {
      navigate(user ? '/dashboard' : '/home');
      return;
    }
    
    // If user is not authenticated and trying to access a protected route, redirect to home
    if (!user && !isPublicRoute) {
      navigate('/home');
      return;
    }

    // If user is authenticated and trying to access login/register/home, redirect to dashboard
    if (user && (location === '/login' || location === '/register' || location === '/home')) {
      navigate('/dashboard');
      return;
    }
  }, [user, location, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if the current route is a documentation page
  const isDocsRoute = location.startsWith('/docs');

  return (
    <TooltipProvider>
      {/* Only show header on authenticated routes and contact page but not login/register or docs */}
      {user && location !== '/login' && location !== '/register' && !isDocsRoute && <Header />}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/home" component={LandingPage} />
            <Route path="/create-quiz" component={CreateQuiz} />
            <Route path="/quiz/:id" component={Quiz} />
            <Route path="/results/:id" component={Results} />
            <Route path="/my-quizzes" component={Quizzes} />
            <Route path="/templates" component={TemplatesPage} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/leaderboard" component={LeaderboardPage} />
            <Route path="/profile" component={Profile} />
            <Route path="/question-bank" component={QuestionBank} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/use-cases" component={UseCasesPage} />
            
            {/* Documentation routes - more specific routing */}
            <Route path="/docs" component={Documentation} />
            <Route path="/docs/:section" component={Documentation} />
            
            <Route component={NotFound} />
          </Switch>
        </main>
        {/* Only show footer on authenticated routes and contact page but not login/register or docs */}
        {user && location !== '/login' && location !== '/register' && !isDocsRoute && <Footer />}
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
