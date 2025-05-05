import { useLocation } from "wouter";
import { ChevronRight, BookOpen, Brain, Lightbulb, Sparkles, User, ArrowRight } from "lucide-react";
import DocsLayout from "@/components/docs/docs-layout";
import FeatureDoc from "@/components/docs/feature-doc";
import Walkthrough from "@/components/docs/walkthrough";
import CodeBlock from "@/components/docs/code-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Documentation() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  
  // Extract the path without the /docs prefix
  const docPath = location.startsWith('/docs') ? location.substring(5) : '';
  
  // Render different content based on the current path
  const renderContent = () => {
    // Root documentation page (introduction)
    if (docPath === '' || docPath === '/') {
      return <IntroductionContent />;
    }
    
    // Other documentation pages
    switch (docPath) {
      case '/installation':
        return <InstallationContent />;
      case '/features':
        return <FeaturesContent />;
      case '/auth/login':
        return <LoginContent />;
      case '/auth/register':
        return <RegisterContent />;
      case '/auth/password-reset':
        return <PasswordResetContent />;
      case '/quizzes/create':
        return <CreateQuizContent />;
      case '/quizzes/take':
        return <TakeQuizContent />;
      case '/quizzes/results':
        return <QuizResultsContent />;
      case '/profile/settings':
        return <ProfileSettingsContent />;
      case '/profile/analytics':
        return <AnalyticsContent />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Documentation Page Not Found</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              The documentation page you're looking for doesn't exist yet.
            </p>
            <Button onClick={() => navigate('/docs')}>
              Back to Documentation Home
            </Button>
          </div>
        );
    }
  };

  // Determine the page title based on the path
  const getPageTitle = () => {
    if (docPath === '' || docPath === '/') return 'Introduction';
    
    switch (docPath) {
      case '/installation': return 'Installation Guide';
      case '/features': return 'Features Overview';
      case '/auth/login': return 'Login Process';
      case '/auth/register': return 'Registration Process';
      case '/auth/password-reset': return 'Password Reset';
      case '/quizzes/create': return 'Creating Quizzes';
      case '/quizzes/take': return 'Taking Quizzes';
      case '/quizzes/results': return 'Quiz Results';
      case '/profile/settings': return 'Profile Settings';
      case '/profile/analytics': return 'User Analytics';
      default: return 'Documentation';
    }
  };

  return (
    <DocsLayout title={getPageTitle()}>
      {renderContent()}
    </DocsLayout>
  );
}

// Individual documentation page components
function IntroductionContent() {
  const [, navigate] = useLocation();
  
  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          QuizGenius Documentation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Welcome to the comprehensive documentation for QuizGenius, your AI-powered, adaptive quiz generation platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-0 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                AI-Powered Content
              </CardTitle>
              <CardDescription>
                Generate professional quizzes with advanced AI technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Learn how our AI creates engaging quiz content, customizes difficulty levels, and adapts to different topics.
              </p>
              <Button 
                variant="link" 
                className="mt-2 p-0 h-auto flex items-center text-blue-600 dark:text-blue-400"
                onClick={() => navigate("/docs/features")}
              >
                Explore AI Features
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-0 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                User Guide
              </CardTitle>
              <CardDescription>
                Complete walkthrough for all user features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Step-by-step instructions for creating accounts, managing quizzes, and tracking your performance.
              </p>
              <Button 
                variant="link" 
                className="mt-2 p-0 h-auto flex items-center text-green-600 dark:text-green-400"
                onClick={() => navigate("/docs/auth/login")}
              >
                Get Started
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Getting Started
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          This documentation will help you understand how to use QuizGenius effectively. Navigate through different sections using the sidebar, or start with these popular pages:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2" onClick={() => navigate("/docs/features")}>
            <BookOpen className="h-6 w-6 mb-1 text-indigo-500" />
            <span className="font-medium">Features Overview</span>
            <span className="text-xs text-gray-500">Discover all features</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2" onClick={() => navigate("/docs/quizzes/create")}>
            <Brain className="h-6 w-6 mb-1 text-purple-500" />
            <span className="font-medium">Creating Quizzes</span>
            <span className="text-xs text-gray-500">AI & manual creation</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2" onClick={() => navigate("/docs/profile/analytics")}>
            <Lightbulb className="h-6 w-6 mb-1 text-amber-500" />
            <span className="font-medium">User Analytics</span>
            <span className="text-xs text-gray-500">Track your progress</span>
          </Button>
        </div>
      </div>

      <Walkthrough 
        title="Quick Tour of QuizGenius"
        steps={[
          {
            title: "Welcome to QuizGenius",
            description: (
              <p>
                QuizGenius is an AI-powered quiz platform that helps you create, take, and manage quizzes. 
                This quick tour will show you the main features of the application.
              </p>
            )
          },
          {
            title: "Creating Your Account",
            description: (
              <p>
                Start by creating an account or signing in with Google. Your profile keeps track of all your 
                quizzes and progress in one place.
              </p>
            )
          },
          {
            title: "Dashboard Overview",
            description: (
              <p>
                The dashboard shows your recent quizzes, progress statistics, and recommendations for new quizzes 
                to take based on your interests and performance.
              </p>
            )
          },
          {
            title: "Creating a Quiz",
            description: (
              <p>
                You can create quizzes in two ways: using AI to generate questions based on your topic and preferences, 
                or manually creating each question yourself.
              </p>
            )
          },
          {
            title: "Taking Quizzes",
            description: (
              <p>
                QuizGenius offers interactive timed quizzes with various question types. Answer questions, see immediate 
                feedback, and get a detailed score report at the end.
              </p>
            )
          },
          {
            title: "Analytics and Progress",
            description: (
              <p>
                Track your progress over time with detailed analytics. See your strengths, areas for improvement, 
                and compare your performance with other users on the leaderboard.
              </p>
            )
          }
        ]}
      />
    </>
  );
}

function InstallationContent() {
  return (
    <FeatureDoc
      title="Installation Guide"
      description="Learn how to set up the QuizGenius platform in your environment"
      path="/docs/installation"
      tags={["Setup", "Configuration", "Environment"]}
      notes={[
        "QuizGenius is a web application that doesn't require installation for end users.",
        "This installation guide is for developers who want to set up the platform locally or deploy it to their own servers."
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h3>System Requirements</h3>
        <ul>
          <li>Node.js 14.x or higher</li>
          <li>PostgreSQL database</li>
          <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
        </ul>

        <h3>Local Development Setup</h3>
        <p>
          To set up QuizGenius for local development, follow these steps:
        </p>

        <h4>1. Clone the repository</h4>
        <CodeBlock 
          code="git clone https://github.com/quizgenius/quizgenius.git
cd quizgenius" 
          language="bash"
        />

        <h4>2. Install dependencies</h4>
        <CodeBlock 
          code="npm install" 
          language="bash"
        />

        <h4>3. Set up environment variables</h4>
        <p>
          Create a <code>.env</code> file in the root directory with the following variables:
        </p>
        <CodeBlock 
          code="# Database
DATABASE_URL=postgresql://username:password@localhost:5432/quizgenius

# Firebase Auth
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Optional: OpenAI for quiz generation
OPENAI_API_KEY=your_openai_api_key" 
          language="bash"
          filename=".env"
        />

        <h4>4. Start the development server</h4>
        <CodeBlock 
          code="npm run dev" 
          language="bash"
        />

        <p>
          The application should now be running at <code>http://localhost:5000</code>.
        </p>

        <h3>Deployment Options</h3>
        <p>
          QuizGenius can be deployed to various platforms:
        </p>
        <ul>
          <li><strong>Vercel/Netlify</strong>: For the frontend application</li>
          <li><strong>Heroku/Railway</strong>: For the full-stack application</li>
          <li><strong>Docker</strong>: For containerized deployment</li>
        </ul>
        
        <h4>Docker Deployment Example</h4>
        <CodeBlock 
          code="# Build the Docker image
docker build -t quizgenius .

# Run the container
docker run -p 5000:5000 --env-file .env quizgenius" 
          language="bash"
        />
      </div>
    </FeatureDoc>
  );
}

function FeaturesContent() {
  return (
    <FeatureDoc
      title="Features Overview"
      description="Comprehensive guide to all QuizGenius features and capabilities"
      path="/docs/features"
      tags={["Features", "Overview", "Capabilities"]}
      links={[
        { 
          label: "Create Quiz",
          path: "/create-quiz",
          description: "Access the quiz creation page" 
        },
        { 
          label: "My Quizzes",
          path: "/my-quizzes",
          description: "View all your created quizzes" 
        },
        { 
          label: "Analytics Dashboard",
          path: "/analytics",
          description: "View your performance statistics" 
        }
      ]}
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-3">AI-Powered Quiz Generation</h3>
          <p className="mb-4">
            QuizGenius uses advanced AI to create high-quality, relevant quizzes on any topic. The AI engine analyzes your requirements and generates questions with varying difficulty levels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <span className="mr-2">🧠</span> Smart Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  AI analyzes topics to generate relevant, accurate questions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <span className="mr-2">⚖️</span> Difficulty Adjustment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Automatically adapts question difficulty based on settings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <span className="mr-2">🎯</span> Topic Relevance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Creates questions that stay focused on your chosen topic
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">User Experience Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Quiz Taking</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                <li>Interactive multiple-choice format</li>
                <li>Timed quiz sessions</li>
                <li>Immediate feedback on answers</li>
                <li>Progress tracking during quiz</li>
                <li>Support for code snippets in questions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">Results & Analytics</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                <li>Detailed score reports</li>
                <li>Performance trends over time</li>
                <li>Comparison with other users</li>
                <li>Exportable results (PDF, CSV)</li>
                <li>Personalized improvement suggestions</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Quiz Management</h3>
          <p className="mb-4">
            Create, edit, and organize your quizzes with our comprehensive management tools:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Quiz Creator</CardTitle>
                <CardDescription>Build quizzes from scratch or with AI</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• AI-assisted question generation</p>
                <p>• Manual question creation</p>
                <p>• Rich text editor with code support</p>
                <p>• Question templates and banks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Quiz Organizer</CardTitle>
                <CardDescription>Manage your quiz collection</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• Categorize and tag quizzes</p>
                <p>• Search and filter functionality</p>
                <p>• Duplicate and modify existing quizzes</p>
                <p>• Privacy controls</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Social & Sharing Features</h3>
          <p className="mb-2">
            QuizGenius includes various social features to enhance the collaborative learning experience:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3">
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Public/private quiz settings
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Shareable quiz links
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Social media integration
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Embeddable quizzes
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Leaderboards and badges
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Performance comparison
            </li>
          </ul>
        </div>
      </div>
    </FeatureDoc>
  );
}

function LoginContent() {
  return (
    <FeatureDoc
      title="Login Process"
      description="Detailed documentation about the login process and authentication flow"
      path="/docs/auth/login"
      tags={["Authentication", "User Access", "Security"]}
      userActions={[
        {
          type: 'input',
          element: 'Email field',
          description: 'Enter your registered email address',
          result: 'Email validation occurs as you type'
        },
        {
          type: 'input',
          element: 'Password field',
          description: 'Enter your password',
          result: 'Password is masked for security'
        },
        {
          type: 'click',
          element: 'Show/Hide Password button',
          description: 'Toggle password visibility',
          result: 'Password text toggles between visible and masked'
        },
        {
          type: 'click',
          element: 'Sign In button',
          description: 'Submit login credentials',
          result: 'Authentication process begins, redirects to dashboard upon success'
        },
        {
          type: 'click',
          element: 'Forgot Password link',
          description: 'Request password reset',
          result: 'Navigates to password reset page'
        },
        {
          type: 'click',
          element: 'Continue with Google button',
          description: 'Sign in using Google account',
          result: 'Opens Google authentication popup'
        }
      ]}
      links={[
        {
          label: 'Dashboard',
          path: '/dashboard',
          description: 'Redirected here after successful login'
        },
        {
          label: 'Register',
          path: '/register',
          description: 'Create a new account'
        },
        {
          label: 'Forgot Password',
          path: '/forgot-password',
          description: 'Reset your password'
        }
      ]}
      notes={[
        "Login sessions are valid for 14 days by default.",
        "After 5 failed attempts, the account will be temporarily locked for 15 minutes."
      ]}
    >
      <div className="space-y-6">
        <p>
          The login page provides secure authentication for registered users. You can log in using your email and password or via Google authentication for a faster sign-in experience.
        </p>
        
        <h3 className="text-xl font-semibold">Authentication Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Email & Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Standard authentication using your registered email and password.</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Enter your registered email</li>
                <li>Enter your password</li>
                <li>Click "Sign In" to authenticate</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Google Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Quick sign-in using your Google account.</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Click "Continue with Google"</li>
                <li>Select your Google account</li>
                <li>Confirm access permissions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold">Security Features</h3>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Secure password hashing using bcrypt</li>
          <li>HTTPS encrypted communication</li>
          <li>JWT (JSON Web Token) for session management</li>
          <li>Rate limiting to prevent brute force attacks</li>
          <li>Account lockout after multiple failed attempts</li>
        </ul>
        
        <h3 className="text-xl font-semibold">Common Issues & Solutions</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mt-3">
          <h4 className="font-medium mb-2">Forgot Password</h4>
          <p className="text-sm">
            If you've forgotten your password, click on the "Forgot Password?" link. You'll be sent an email with instructions to reset your password.
          </p>
          
          <h4 className="font-medium mt-4 mb-2">Account Locked</h4>
          <p className="text-sm">
            After 5 failed login attempts, your account will be temporarily locked for security. Wait 15 minutes before trying again or use the password reset option.
          </p>
          
          <h4 className="font-medium mt-4 mb-2">Email Not Recognized</h4>
          <p className="text-sm">
            If your email isn't recognized, double-check for typos or consider registering for a new account if you haven't already signed up.
          </p>
        </div>
      </div>
    </FeatureDoc>
  );
}

// Placeholder components for other documentation pages
function RegisterContent() {
  return (
    <FeatureDoc
      title="Registration Process"
      description="Learn how to create a new account on QuizGenius"
      path="/docs/auth/register"
      tags={["Authentication", "Account Creation", "Signup"]}
    >
      <p>
        This page documents the registration process for creating a new account on QuizGenius.
        Currently in development.
      </p>
    </FeatureDoc>
  );
}

function PasswordResetContent() {
  return (
    <FeatureDoc
      title="Password Reset Process"
      description="Documentation for the password reset functionality"
      path="/docs/auth/password-reset"
      tags={["Authentication", "Security", "Password Management"]}
    >
      <p>
        This page documents the password reset process.
        Currently in development.
      </p>
    </FeatureDoc>
  );
}

function CreateQuizContent() {
  return (
    <FeatureDoc
      title="Creating Quizzes"
      description="Learn how to create quizzes using AI or manual methods"
      path="/docs/quizzes/create"
      tags={["Quizzes", "Content Creation", "AI Generation"]}
    >
      <p>
        This page documents the quiz creation process.
        Currently in development.
      </p>
    </FeatureDoc>
  );
}

function TakeQuizContent() {
  return (
    <FeatureDoc
      title="Taking Quizzes"
      description="Learn how to take quizzes and navigate the quiz interface"
      path="/docs/quizzes/take"
      tags={["Quizzes", "User Experience", "Interaction"]}
    >
      <p>
        This page documents the quiz-taking experience.
        Currently in development.
      </p>
    </FeatureDoc>
  );
}

function QuizResultsContent() {
  return (
    <FeatureDoc
      title="Quiz Results"
      description="Understanding your quiz results and performance metrics"
      path="/docs/quizzes/results"
      tags={["Quizzes", "Analytics", "Performance"]}
    >
      <p>
        This page documents the quiz results and performance reports.
        Currently in development.
      </p>
    </FeatureDoc>
  );
}

function ProfileSettingsContent() {
  return (
    <FeatureDoc
      title="Profile Settings"
      description="Managing your user profile and account settings"
      path="/docs/profile/settings"
      tags={["User Account", "Settings", "Profile Management"]}
    >
      <p>
        This page documents the profile settings features.
        Currently in development.
      </p>
    </FeatureDoc>
  );
}

function AnalyticsContent() {
  return (
    <FeatureDoc
      title="User Analytics"
      description="Understanding your performance analytics and statistics"
      path="/docs/profile/analytics"
      tags={["Analytics", "Statistics", "Performance Tracking"]}
    >
      <p>
        This page documents the user analytics and performance tracking features.
        Currently in development.
      </p>
    </FeatureDoc>
  );
}