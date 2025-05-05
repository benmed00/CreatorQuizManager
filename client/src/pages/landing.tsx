import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/theme-toggle";
import { 
  Check, 
  Code, 
  Brain, 
  Zap, 
  ChevronRight, 
  Trophy, 
  Users, 
  Sparkles, 
  Rocket, 
  BookOpen, 
  GraduationCap,
  Building2,
  Microscope,
  Database,
  School,
  ScrollText,
  ExternalLink
} from "lucide-react";

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

      {/* Use Cases Section */}
      <section className="w-full py-20 px-6 md:px-12 bg-white dark:bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            How People Use QuizGenius
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            Our platform serves various learning and assessment needs across different domains
          </p>
          
          <Tabs defaultValue="education" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="education" className="text-base">
                <GraduationCap className="mr-2 h-5 w-5" />
                Education
              </TabsTrigger>
              <TabsTrigger value="corporate" className="text-base">
                <Building2 className="mr-2 h-5 w-5" />
                Corporate
              </TabsTrigger>
              <TabsTrigger value="technical" className="text-base">
                <Database className="mr-2 h-5 w-5" />
                Technical
              </TabsTrigger>
              <TabsTrigger value="self" className="text-base">
                <Rocket className="mr-2 h-5 w-5" />
                Self Learning
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="education" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    For Educators & Students
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Create customized assessments for any subject or topic</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Generate quiz questions with varying difficulty levels</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Track student progress and identify knowledge gaps</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Automate assessment creation and grading</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Export results in PDF format for record keeping</p>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <School className="h-16 w-16 text-primary mb-4" />
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Trusted by Educators
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Teachers and professors use QuizGenius to create engaging assessments that save time and provide valuable insights into student understanding.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="corporate" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    For Companies & Teams
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Assess employee knowledge and identify training needs</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Create standardized assessments for hiring and onboarding</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Measure training effectiveness with pre and post assessments</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Build technical skills verification and certification tools</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Track team progress and foster friendly competition</p>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Building2 className="h-16 w-16 text-primary mb-4" />
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Enterprise Solutions
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    HR teams and department leaders rely on QuizGenius to streamline technical assessments and keep teams sharp with ongoing skill verification.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    For Developers & IT Professionals
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Test knowledge of programming languages and frameworks</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Practice for technical interviews with real coding examples</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Create code review and debugging challenges</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Design system architecture and database quizzes</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Stay up-to-date with changing technologies and best practices</p>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Code className="h-16 w-16 text-primary mb-4" />
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Technical Excellence
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Software engineers and IT teams use QuizGenius to sharpen their skills, prepare for certifications, and validate technical knowledge.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="self" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    For Self-Learners & Enthusiasts
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Reinforce learning with customized quizzes on any topic</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Track progress and identify areas for improvement</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Prepare for exams and certifications efficiently</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Challenge yourself with increasing difficulty levels</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300">Share your knowledge by creating quizzes for others</p>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <BookOpen className="h-16 w-16 text-primary mb-4" />
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Lifelong Learning
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Passionate learners use QuizGenius to make their study time more effective, test their knowledge, and challenge themselves on topics they care about.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
      <footer className="w-full py-16 px-6 md:px-12 bg-white dark:bg-[#1e1e1e] mt-auto border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path fill="white" d="M15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  <path fill="white" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  <path fill="white" d="M15.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  <path fill="white" d="M8.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                </svg>
                <span className="text-xl font-bold text-gray-900 dark:text-white">QuizGenius</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                The intelligent quiz platform that helps you learn, test, and grow your knowledge with AI-powered quiz generation.
              </p>
              <ThemeToggle />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/create-quiz")}>
                    Create Quiz
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/templates")}>
                    Quiz Templates
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/question-bank")}>
                    Question Bank
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/leaderboard")}>
                    Leaderboard
                  </Button>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/support")}>
                    Help Center
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/api-docs")}>
                    API Documentation
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/blog")}>
                    Blog
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto flex items-center text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => window.open("https://github.com", "_blank")}>
                    <span>Open Source</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/about")}>
                    About Us
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/contact")}>
                    Contact
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/privacy")}>
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-primary dark:text-gray-400" onClick={() => navigate("/terms")}>
                    Terms of Service
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} QuizGenius. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => window.open("https://twitter.com", "_blank")}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => window.open("https://linkedin.com", "_blank")}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}