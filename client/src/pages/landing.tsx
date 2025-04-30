import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/theme-toggle";
import { Check, Code, Brain, Zap, ChevronRight, Trophy, Users } from "lucide-react";

export default function LandingPage() {
  const [_, navigate] = useLocation();

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "AI-Powered Quiz Generation",
      description: "Create custom quizzes in seconds using advanced AI technology."
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Technical Subjects",
      description: "Specialized in programming, web development, and technical concepts."
    },
    {
      icon: <Trophy className="h-6 w-6 text-primary" />,
      title: "Competitive Leaderboards",
      description: "Track your progress and compete with others on our global leaderboard."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Instant Feedback",
      description: "Get immediate results and detailed explanations for each answer."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Community Sharing",
      description: "Share your quizzes and results with friends and colleagues."
    },
    {
      icon: <Check className="h-6 w-6 text-primary" />,
      title: "Progress Tracking",
      description: "Monitor your knowledge growth with detailed analytics."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212]">
      {/* Navigation */}
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white dark:bg-[#1e1e1e] shadow-sm">
        <div className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
            <path fill="white" d="M15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            <path fill="white" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            <path fill="white" d="M15.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            <path fill="white" d="M8.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QuizGenius</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="text-gray-700 dark:text-gray-300"
          >
            Log in
          </Button>
          <Button onClick={() => navigate("/register")}>
            Sign up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 px-6 md:px-12 flex flex-col items-center bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/5">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Create Intelligent Quizzes with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Generate custom quizzes on any technical topic in seconds, test your knowledge, 
            and track your progress with our advanced quiz platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/register")} className="text-lg">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="text-lg">
              Try a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Powerful Features for Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-[#1e1e1e] border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary/10 dark:bg-primary/5 p-3 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-6 md:px-12 bg-primary/10 dark:bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of learners expanding their technical expertise through our interactive quizzes.
          </p>
          <Button size="lg" onClick={() => navigate("/register")} className="text-lg">
            Start Learning Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-12 bg-white dark:bg-[#1e1e1e] mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path fill="white" d="M15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M15.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">QuizGenius</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Button variant="link" onClick={() => navigate("/contact")}>Contact</Button>
              <Button variant="link">Terms</Button>
              <Button variant="link">Privacy</Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} QuizGenius. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}