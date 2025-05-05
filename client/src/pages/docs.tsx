import { useState } from "react";
import { useLocation } from "wouter";
import { 
  BookOpen, 
  ChevronRight, 
  FileText, 
  User, 
  Sparkles, 
  Brain, 
  Lightbulb,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Documentation() {
  const [activeTab, setActiveTab] = useState("getting-started");
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
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-primary hover:dark:text-primary"
                      onClick={() => setActiveTab("getting-started")}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Introduction</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-primary hover:dark:text-primary"
                      onClick={() => setActiveTab("features")}
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
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-primary hover:dark:text-primary"
                      onClick={() => setActiveTab("account")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Account Management</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-primary hover:dark:text-primary"
                      onClick={() => setActiveTab("quizzes")}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      <span>Creating Quizzes</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-primary hover:dark:text-primary"
                      onClick={() => setActiveTab("analytics")}
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
            {activeTab === "getting-started" && (
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
                      <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("features")}>
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
                      <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("features")}>
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
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Features Overview
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    QuizGenius offers a comprehensive set of features designed to make quiz creation, participation, and analysis intuitive and powerful.
                  </p>
                </div>

                <div className="grid gap-8">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">AI-Powered Quiz Generation</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our advanced AI engine creates high-quality, relevant quizzes based on your specifications.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Topic Analysis</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          AI analyzes topics to generate relevant, accurate questions
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Difficulty Levels</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Customize question difficulty from beginner to expert
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Code Snippets</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Support for programming questions with syntax highlighting
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Comprehensive Analytics</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Track performance metrics and quiz effectiveness with detailed reports.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Performance Tracking</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Monitor progress over time with detailed statistics and charts
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Question Effectiveness</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Analyze which questions are most challenging or discriminating
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Account Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Learn how to manage your QuizGenius account and user profile.
                  </p>
                </div>

                <Tabs defaultValue="signup">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="signup">Creating Account</TabsTrigger>
                    <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signup" className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-4">
                    <h3 className="font-medium mb-3">Creating Your Account</h3>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Sign up using your email address or Google account</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Create a strong password with at least 8 characters</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Verify your email address to complete registration</span>
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="profile" className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-4">
                    <h3 className="font-medium mb-3">Profile Management</h3>
                    <p className="mb-3">Update your profile information in the settings page:</p>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Change your display name and profile picture</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Update contact information</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Set notification preferences</span>
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="security" className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-4">
                    <h3 className="font-medium mb-3">Account Security</h3>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Change your password regularly for optimal security</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Reset your password if you forget it</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Manage connected accounts and active sessions</span>
                      </li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Placeholder content for Quizzes tab */}
            {activeTab === "quizzes" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Creating Quizzes
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Learn how to create, edit, and manage quizzes using QuizGenius.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quiz Creation Methods</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" />
                        AI-Powered Generation
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Let our AI create quizzes based on your topic and specifications:
                      </p>
                      <ol className="space-y-2 ml-6 list-decimal">
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Select "Create Quiz" from the dashboard
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Choose "AI Generation" mode
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Enter your topic, difficulty level, and number of questions
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Review and edit the generated quiz
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Save and publish your quiz
                        </li>
                      </ol>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Manual Creation
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Create quizzes manually with full control over content:
                      </p>
                      <ol className="space-y-2 ml-6 list-decimal">
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Select "Create Quiz" from the dashboard
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Choose "Manual Creation" mode
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Add quiz title, description, and category
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Create individual questions and answer options
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-300">
                          Save and publish your quiz
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder content for Analytics tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Quiz Analytics
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Track performance and gain insights from your quiz results.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>
                        View detailed statistics about your quiz performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">Score trends over time</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">Category strengths and weaknesses</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">Comparison with peer groups</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">Progress tracking toward goals</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Export Options</CardTitle>
                      <CardDescription>
                        Share and save your analytics data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">PDF reports with visualizations</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">CSV export for data analysis</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">Share results via email</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-sm">Integration with learning management systems</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
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