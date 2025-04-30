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
import Quizzes from "@/pages/quizzes";
import Analytics from "@/pages/analytics";
import LeaderboardPage from "@/pages/leaderboard";
import Header from "@/components/nav/header";
import Footer from "@/components/nav/footer";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from "@/store/auth-store";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useStore();
  const [location] = useLocation();
  
  // Check if user is authenticated on app load
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location);
  
  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!user && !isPublicRoute) {
    window.location.href = '/login';
    return null;
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (user && isPublicRoute) {
    window.location.href = '/';
    return null;
  }

  return (
    <TooltipProvider>
      {!isPublicRoute && <Header />}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/create-quiz" component={CreateQuiz} />
            <Route path="/quiz/:id" component={Quiz} />
            <Route path="/results/:id" component={Results} />
            <Route path="/my-quizzes" component={Quizzes} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/leaderboard" component={LeaderboardPage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route component={NotFound} />
          </Switch>
        </main>
        {!isPublicRoute && <Footer />}
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
