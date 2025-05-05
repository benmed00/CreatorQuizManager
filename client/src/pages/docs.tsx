import { useLocation, useRoute } from "wouter";
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

// Introduction section
function IntroSection() {
  const [, navigate] = useLocation();
  
  return (
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
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => navigate("/docs/features")}
            >
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
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => navigate("/docs/features")}
            >
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
  );
}

// Features section
function FeaturesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Features Overview
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Explore the powerful features that make QuizGenius the ultimate quiz platform
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">AI-Powered Quiz Generation</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Create professional quizzes in seconds using our advanced AI technology. Simply input your topic, 
          and let QuizGenius handle the rest.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Natural Language Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our AI understands context and nuance to generate questions that truly test knowledge and understanding.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customizable Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Fine-tune question difficulty, style, and format to match your exact requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Comprehensive Analytics</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Gain deep insights into quiz performance and user knowledge with our detailed analytics dashboard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Monitor individual and group progress over time with intuitive visualizations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Identify areas where users struggle, allowing for targeted learning interventions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Export & Sharing Options</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Share your quizzes and results easily with flexible export options.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">PDF Export</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate professional PDFs of quizzes and results for offline use.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Direct Sharing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Share quizzes via URL, email, or social media with just a click.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Embedding</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Embed quizzes directly into your website or learning management system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Account Management section
function AccountSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Account Management
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Learn how to manage your QuizGenius account and user profile
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Creating Your Account</CardTitle>
          <CardDescription>Multiple options to start using QuizGenius</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Email Registration</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>Click the "Register" button in the top navigation</li>
                <li>Enter your email address and create a password</li>
                <li>Verify your email address through the link sent to your inbox</li>
                <li>Complete your profile by adding your name and optional details</li>
              </ol>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Google Authentication</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>Click the "Login with Google" button</li>
                <li>Select your Google account or sign in</li>
                <li>Review and accept the permissions</li>
                <li>You'll be automatically logged in and can complete your profile</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Managing Your Profile</CardTitle>
          <CardDescription>Customize your QuizGenius experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Profile Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Access your profile settings by clicking on your avatar in the top right corner and selecting "Profile"
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>Update your display name and profile picture</li>
                <li>Change your email address</li>
                <li>Set your notification preferences</li>
                <li>Manage connected accounts</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Security Settings</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>Change your password (for email accounts)</li>
                <li>Enable two-factor authentication for enhanced security</li>
                <li>View and manage active sessions</li>
                <li>Delete your account if needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quizzes section
function QuizzesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Creating Quizzes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Learn how to create, edit, and manage quizzes using QuizGenius
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI-Powered Quiz Creation</CardTitle>
          <CardDescription>Let our AI do the work for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
              <li className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                <span className="font-medium text-gray-900 dark:text-white">Start a new quiz</span>
                <p className="mt-1 ml-5 text-sm">
                  Click the "Create Quiz" button on your dashboard and select "AI Generation"
                </p>
              </li>
              
              <li className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                <span className="font-medium text-gray-900 dark:text-white">Enter your topic</span>
                <p className="mt-1 ml-5 text-sm">
                  Type in the subject or topic you want to create a quiz about (e.g., "JavaScript Basics", "World War II", etc.)
                </p>
              </li>
              
              <li className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                <span className="font-medium text-gray-900 dark:text-white">Configure parameters</span>
                <p className="mt-1 ml-5 text-sm">
                  Select the number of questions, difficulty level, and question types
                </p>
              </li>
              
              <li className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                <span className="font-medium text-gray-900 dark:text-white">Generate and review</span>
                <p className="mt-1 ml-5 text-sm">
                  Click "Generate Quiz" and review the AI-created questions and answers
                </p>
              </li>
              
              <li className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                <span className="font-medium text-gray-900 dark:text-white">Edit if needed</span>
                <p className="mt-1 ml-5 text-sm">
                  Modify any questions, answers, or settings to fine-tune your quiz
                </p>
              </li>
              
              <li className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                <span className="font-medium text-gray-900 dark:text-white">Save and publish</span>
                <p className="mt-1 ml-5 text-sm">
                  Give your quiz a title, add tags, and publish it for others to take
                </p>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Quiz Creation</CardTitle>
          <CardDescription>Create custom quizzes with complete control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Creating Questions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                With manual creation, you can craft each question precisely:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>Multiple choice questions with single or multiple correct answers</li>
                <li>True/False questions for quick assessments</li>
                <li>Fill-in-the-blank for testing specific knowledge</li>
                <li>Code snippets for programming quizzes</li>
                <li>Image-based questions for visual content</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Quiz Settings</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>Set time limits for the entire quiz or per question</li>
                <li>Configure scoring options (partial credit, negative marking, etc.)</li>
                <li>Add media like images or videos to questions</li>
                <li>Create explanations for answers to enhance learning</li>
                <li>Set privacy options (public, private, or shared with specific users)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics section
function AnalyticsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics & Reporting
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Gain valuable insights from quiz results and user performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Analyze how your quizzes are performing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Completion Rate</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  See what percentage of users complete your quizzes and identify potential drop-off points
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Question Difficulty</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Analyze which questions are proving most challenging or too easy
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Time Analysis</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Review how long users spend on each question and the entire quiz
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Progress</CardTitle>
            <CardDescription>Track individual and group learning journeys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Score Trends</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Monitor how scores change over time to measure improvement
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Knowledge Gaps</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Identify specific areas where users need additional learning resources
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Comparative Analysis</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Compare performance against peers or established benchmarks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exporting Reports</CardTitle>
          <CardDescription>Share or save analytics data in multiple formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">PDF Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate comprehensive PDF reports with visualizations, summary statistics, and detailed breakdowns.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">CSV Export</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Export raw data in CSV format for further analysis in spreadsheet software or statistical tools.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Scheduled Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Set up automatic report generation and delivery on daily, weekly, or monthly schedules.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Documentation() {
  const [, navigate] = useLocation();
  // Check if we're on a section route 
  const [matchesSection, params] = useRoute('/docs/:section');
  
  // Render different content based on the section
  const renderContent = () => {
    if (matchesSection) {
      const section = params.section;
      
      switch (section) {
        case 'features':
          return <FeaturesSection />;
        case 'account':
          return <AccountSection />;
        case 'quizzes':
          return <QuizzesSection />;
        case 'analytics':
          return <AnalyticsSection />;
        default:
          return <IntroSection />;
      }
    }
    
    // Default to intro section
    return <IntroSection />;
  };

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
                      onClick={() => navigate("/docs")}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Introduction</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                      onClick={() => navigate("/docs/features")}
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
                      onClick={() => navigate("/docs/account")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Account Management</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                      onClick={() => navigate("/docs/quizzes")}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      <span>Creating Quizzes</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                      onClick={() => navigate("/docs/analytics")}
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
            {renderContent()}
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