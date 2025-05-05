import { useLocation } from "wouter";
import { 
  BookOpen, 
  ChevronRight, 
  FileText, 
  User, 
  Sparkles, 
  Brain, 
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Documentation() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <span className="font-bold text-xl">QuizGenius</span>
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">Documentation</span>
          </div>
          <div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to App
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sticky top-4">
              <nav className="space-y-1">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-sm uppercase text-gray-500 dark:text-gray-400">Getting Started</h3>
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Introduction</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Features</span>
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-sm uppercase text-gray-500 dark:text-gray-400">User Guide</h3>
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Account Management</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      <span>Creating Quizzes</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content area */}
          <main className="flex-1">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  QuizGenius Documentation
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Welcome to the comprehensive documentation for QuizGenius, your AI-powered, adaptive quiz generation platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      AI-Powered Content
                    </CardTitle>
                    <CardDescription>
                      Generate quizzes with advanced AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      QuizGenius leverages OpenAI's powerful language models to create engaging, 
                      relevant quiz content on any topic. The AI adapts to your requirements, 
                      generating questions at various difficulty levels.
                    </p>
                    <Button variant="link" className="p-0 h-auto">
                      Learn more <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Comprehensive Features
                    </CardTitle>
                    <CardDescription>
                      Everything you need in one platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      From quiz creation to performance analytics, QuizGenius provides a complete 
                      solution for educational assessment. Create, share, and analyze quizzes 
                      while tracking progress over time.
                    </p>
                    <Button variant="link" className="p-0 h-auto">
                      View features <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Quick Start Guide
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Create an account</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Sign up with your email or use Google authentication to create your QuizGenius account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Create your first quiz</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Use AI generation or manually create a quiz on your topic of choice.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Share and analyze</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Share your quiz with others and track performance through the analytics dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">AI Quiz Generation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Create professional quizzes on any topic with our powerful AI engine.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Track quiz performance and user progress with detailed analytics.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">PDF Export</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Export quiz results and documentation as professional PDF documents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} QuizGenius. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/terms")}>
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/privacy")}>
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/contact")}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}