import { Link } from "wouter";
import { ArrowLeft, BookOpen, School, Building2, Code, Rocket, User, Users, BookmarkIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UseCasesPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <div className="flex items-center mb-8">
        <Link href="/home">
          <Button variant="ghost" className="mr-2 p-0 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Use Cases & Documentation</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            How to use QuizGenius in various learning and assessment scenarios
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview" className="text-base">
            <BookOpen className="mr-2 h-5 w-5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="education" className="text-base">
            <School className="mr-2 h-5 w-5" />
            Education
          </TabsTrigger>
          <TabsTrigger value="business" className="text-base">
            <Building2 className="mr-2 h-5 w-5" />
            Business
          </TabsTrigger>
          <TabsTrigger value="technical" className="text-base">
            <Code className="mr-2 h-5 w-5" />
            Technical
          </TabsTrigger>
          <TabsTrigger value="personal" className="text-base">
            <User className="mr-2 h-5 w-5" />
            Personal
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <School className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Educational Applications</CardTitle>
                <CardDescription>For teachers, professors, and students</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Create assessments for classrooms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Test knowledge across subjects</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Track student progress</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Business Solutions</CardTitle>
                <CardDescription>For HR, trainers, and teams</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Training assessments and knowledge checks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Skill verification for hiring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Team certification programs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <User className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Personal Growth</CardTitle>
                <CardDescription>For individual learners</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Self-assessment of knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Exam preparation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Skill development tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>What makes QuizGenius unique</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                QuizGenius is an AI-powered quiz generation platform designed to transform how people create, take, and analyze quizzes. Our platform leverages advanced machine learning to generate high-quality questions, provide detailed analytics, and create a personalized learning experience.
              </p>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>AI-Generated Questions:</strong> Create quizzes instantly with our AI system that generates relevant, accurate questions on any topic.</li>
                <li><strong>Custom Quiz Builder:</strong> Design your own questions with our intuitive editor, add code snippets, and customize difficulty levels.</li>
                <li><strong>Template Library:</strong> Start with pre-built templates for common topics and customize them to your needs.</li>
                <li><strong>Detailed Analytics:</strong> Track performance over time with comprehensive reporting on quiz results.</li>
                <li><strong>Leaderboards:</strong> Create friendly competition with global and team-specific leaderboards.</li>
                <li><strong>PDF Export:</strong> Download and share quiz results with detailed breakdowns of performance.</li>
                <li><strong>Email Sharing:</strong> Send quiz results directly via email to participants or managers.</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Getting Started</h3>
              <p>
                New to QuizGenius? Here's how to begin:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Create an account or sign in with your existing credentials</li>
                <li>Navigate to the Dashboard to see available quizzes and results</li>
                <li>To create a new quiz, click "Create Quiz" and choose between AI generation or manual creation</li>
                <li>Take quizzes by selecting them from the Dashboard or Quizzes page</li>
                <li>View your results after completion and track your progress over time</li>
              </ol>
              
              <p className="mt-4">
                Explore the tabs above for detailed use cases in specific contexts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <School className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Educational Use Cases</CardTitle>
                  <CardDescription>For instructors and students at all levels</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-medium mb-3">For Teachers & Professors</h3>
              <p>
                QuizGenius offers educators powerful tools to create assessments, track student progress, and identify areas where students need additional support.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">Creating Course Assessments</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generate quizzes based on course material by entering topics and key concepts</li>
                <li>Create quizzes with varying difficulty levels to challenge different student abilities</li>
                <li>Include code snippets for programming and technical courses</li>
                <li>Save time with AI-generated questions that align with your curriculum</li>
                <li>Create a standardized template that can be reused across multiple sections or semesters</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Computer Science Assessment
                </h5>
                <p className="text-sm">
                  A professor teaching Introduction to Python can generate a comprehensive quiz covering variables, loops, functions, and basic data structures. The system automatically creates questions with appropriate code snippets and varying difficulty levels to test students' understanding from basic syntax recognition to advanced problem-solving.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Tracking Student Progress</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review detailed analytics on class performance across different topics</li>
                <li>Identify common misconceptions based on frequently missed questions</li>
                <li>Track improvement over time with historical performance data</li>
                <li>Compare performance across different student groups or class sections</li>
                <li>Export results for integration with learning management systems</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-8 mb-3">For Students</h3>
              <p>
                Students can use QuizGenius to test their knowledge, prepare for exams, and identify areas for improvement.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">Exam Preparation</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create practice quizzes on specific topics to test understanding</li>
                <li>Use AI to generate questions similar to those that might appear on exams</li>
                <li>Track progress to identify weak areas that need additional study</li>
                <li>Share quizzes with study groups for collaborative learning</li>
                <li>Practice with timed quizzes to simulate exam conditions</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Group Study Session
                </h5>
                <p className="text-sm">
                  A study group preparing for a biology final exam can collaborate to create a comprehensive quiz covering all major topics from the semester. Each student can take the quiz independently, then the group can review results together to identify collective knowledge gaps and focus their remaining study time effectively.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Self-Assessment</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Take quizzes to gauge understanding before formal assessments</li>
                <li>Review detailed explanations for incorrect answers</li>
                <li>Generate follow-up quizzes focused on weaker areas</li>
                <li>Track knowledge growth over academic terms</li>
                <li>Build confidence through demonstrated mastery</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Business Use Cases</CardTitle>
                  <CardDescription>For corporate training, hiring, and professional development</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-medium mb-3">For HR & Training Teams</h3>
              <p>
                QuizGenius provides valuable tools for creating standardized assessments, verifying skills, and measuring training effectiveness.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">Onboarding & Training</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create standardized knowledge assessments for new employees</li>
                <li>Develop quizzes to verify comprehension of company policies and procedures</li>
                <li>Track completion and performance across departments</li>
                <li>Identify training gaps and opportunities for additional instruction</li>
                <li>Create certification programs with verification of completion</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Sales Team Training
                </h5>
                <p className="text-sm">
                  A company can develop a comprehensive product knowledge quiz for their sales team covering features, benefits, pricing, and competitive positioning. The team takes the quiz before and after training to measure knowledge improvement, while managers receive detailed analytics showing which areas need reinforcement.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Hiring & Recruitment</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create technical assessments for job candidates</li>
                <li>Standardize initial screening with knowledge-based quizzes</li>
                <li>Compare candidate performance objectively</li>
                <li>Customize difficulty levels based on position requirements</li>
                <li>Include code assessments for technical roles</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-8 mb-3">For Team Leaders & Managers</h3>
              <p>
                Team leaders can use QuizGenius to foster continuous learning, track team knowledge, and identify skill gaps.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">Team Development</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create topic-specific quizzes to reinforce training</li>
                <li>Track team knowledge growth over time</li>
                <li>Identify individual and collective skill gaps</li>
                <li>Foster friendly competition with team leaderboards</li>
                <li>Celebrate knowledge mastery with achievement recognition</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Weekly Knowledge Challenges
                </h5>
                <p className="text-sm">
                  An engineering manager creates weekly quizzes on new technologies, company processes, or industry trends. Teams compete to top the leaderboard, creating a culture of continuous learning. The manager uses analytics to identify topics where the team excels and areas where additional training resources would be beneficial.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Compliance & Certification</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verify compliance knowledge with standardized assessments</li>
                <li>Create industry-specific certification programs</li>
                <li>Track completion rates and performance metrics</li>
                <li>Generate documentation of compliance training</li>
                <li>Schedule recurring assessments to ensure knowledge retention</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Technical Use Cases</CardTitle>
                  <CardDescription>For developers, IT professionals, and technical teams</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-medium mb-3">For Developers & Engineers</h3>
              <p>
                QuizGenius offers technical professionals tools to test programming knowledge, prepare for interviews, and stay current with evolving technologies.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">Technical Skill Assessment</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Test knowledge of programming languages, frameworks, and libraries</li>
                <li>Create quizzes with code snippets to test code comprehension</li>
                <li>Focus on specific domains like frontend, backend, or database concepts</li>
                <li>Test understanding of design patterns and best practices</li>
                <li>Verify knowledge of APIs, protocols, and system architecture</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Modern JavaScript Assessment
                </h5>
                <p className="text-sm">
                  A tech lead creates a comprehensive JavaScript quiz covering ES6+ features, async patterns, performance optimization, and common pitfalls. The quiz includes code snippets with potential bugs or optimization opportunities. Team members can test their knowledge, identify areas for improvement, and track their progress as they master new concepts.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Interview Preparation</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generate interview-style technical questions</li>
                <li>Practice with timed quizzes to simulate interview pressure</li>
                <li>Cover algorithm challenges and complexity analysis</li>
                <li>Test knowledge of system design principles</li>
                <li>Practice language-specific questions for specialized roles</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-8 mb-3">For IT & Operations Teams</h3>
              <p>
                IT professionals can use QuizGenius to verify system knowledge, test security awareness, and prepare for certifications.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">System & Security Knowledge</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create assessments of infrastructure and architecture knowledge</li>
                <li>Test understanding of security protocols and best practices</li>
                <li>Verify knowledge of deployment processes and tools</li>
                <li>Assess cloud platform and service knowledge</li>
                <li>Test incident response procedures and protocols</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Cloud Infrastructure Quiz
                </h5>
                <p className="text-sm">
                  A DevOps manager creates a comprehensive quiz covering AWS services, architecture patterns, security best practices, and cost optimization strategies. The team takes monthly assessments to verify knowledge growth as the company's cloud infrastructure evolves, with analytics highlighting which areas need additional training focus.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Certification Preparation</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create practice exams for popular IT certifications (AWS, Azure, CompTIA)</li>
                <li>Generate domain-specific questions aligned with certification objectives</li>
                <li>Track progress across different certification domains</li>
                <li>Simulate exam conditions with timed quizzes</li>
                <li>Focus study efforts on weak areas identified through analytics</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Personal Use Cases</CardTitle>
                  <CardDescription>For self-learners, hobbyists, and knowledge enthusiasts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-medium mb-3">For Individual Learners</h3>
              <p>
                QuizGenius helps individual learners test their knowledge, prepare for exams, and track their personal growth.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">Self-Directed Learning</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create quizzes on any topic you're learning</li>
                <li>Test retention after completing online courses or tutorials</li>
                <li>Generate quizzes with increasing difficulty as your knowledge grows</li>
                <li>Track progress over time with detailed analytics</li>
                <li>Identify knowledge gaps to focus future learning efforts</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Language Learning
                </h5>
                <p className="text-sm">
                  Someone learning Spanish can create vocabulary and grammar quizzes to test their knowledge after each learning session. They can set up recurring quizzes to test retention over time, tracking their progress and focusing additional practice on challenging concepts identified through their quiz results.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Exam & Certification Prep</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generate practice questions for standardized tests</li>
                <li>Create quizzes covering specific exam domains</li>
                <li>Practice with timed quizzes to build test-taking stamina</li>
                <li>Focus study efforts based on performance analytics</li>
                <li>Track improvement over time to build confidence</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-8 mb-3">For Knowledge Sharing</h3>
              <p>
                QuizGenius enables knowledge enthusiasts to create and share quizzes on topics they're passionate about.
              </p>
              
              <h4 className="text-base font-medium mt-5 mb-2">Creating Engaging Content</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Build quizzes on niche topics to share with communities</li>
                <li>Create interactive learning materials for blog readers or followers</li>
                <li>Design challenges for friends to test their knowledge</li>
                <li>Create family-friendly educational activities</li>
                <li>Share results and insights on social media</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-3 mb-5">
                <h5 className="text-base font-medium mb-2 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-primary" />
                  Example: Hobby Community
                </h5>
                <p className="text-sm">
                  A hobbyist photographer creates a series of quizzes on photography concepts, camera settings, and post-processing techniques. They share these quizzes with their online photography community, allowing members to test their knowledge and identify areas for further learning. The quizzes spark discussion and create an engaging learning environment for the community.
                </p>
              </div>
              
              <h4 className="text-base font-medium mt-5 mb-2">Personal Projects</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create trivia quizzes for social gatherings</li>
                <li>Design scavenger hunts with knowledge-based clues</li>
                <li>Build educational activities for children</li>
                <li>Develop subject-specific challenges for friends</li>
                <li>Track learning progress for personal goals</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8 gap-4">
        <Link href="/contact">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Contact Support
          </Button>
        </Link>
        <Link href="/">
          <Button className="gap-2">
            <Rocket className="h-4 w-4" />
            Start Creating Quizzes
          </Button>
        </Link>
      </div>
    </div>
  );
}