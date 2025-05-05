import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuizForm from "@/components/quiz-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/auth-store";
import ManualQuizCreator from "@/components/manual-quiz-creator";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Building, Code, Wand2, BookOpen, ArrowRight } from "lucide-react";

export default function CreateQuiz() {
  const { user } = useStore();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("ai-generated");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Create a New Quiz
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Design your quiz by either generating one with AI or creating one manually.
          </p>
        </div>
      </div>

      <Tabs defaultValue="ai-generated" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <TabsTrigger value="manual">Create Manually</TabsTrigger>
          <TabsTrigger value="ai-generated">AI Generated Quiz</TabsTrigger>
          <TabsTrigger value="templates">Quiz Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <div className="mb-6">
            <ManualQuizCreator />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Pro Tip
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              You can create and save questions to your question bank for reuse in multiple quizzes. 
              Access your question bank anytime from the dashboard.
            </p>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                onClick={() => navigate("/question-bank")}
              >
                Go to Question Bank
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ai-generated">
          <QuizForm />
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Templates</CardTitle>
              <CardDescription>
                Choose from our pre-made quiz templates to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-blue-200 dark:border-blue-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6">
                      <Code className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Programming Basics</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">10 questions covering fundamental programming concepts</p>
                    </div>
                    <div className="p-4">
                      <Button className="w-full">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 p-6">
                      <Building className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
                      <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300">Business Fundamentals</h3>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">15 questions about business strategy and operations</p>
                    </div>
                    <div className="p-4">
                      <Button className="w-full" disabled>Coming Soon</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-amber-200 dark:border-amber-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-6">
                      <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
                      <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300">General Knowledge</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">20 questions covering a variety of trivia topics</p>
                    </div>
                    <div className="p-4">
                      <Button className="w-full" disabled>Coming Soon</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
              More templates will be added regularly. Check back soon!
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {activeTab === "manual" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Need inspiration? Our AI can help you generate questions for your quiz.
          </p>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('ai-generated-tab')?.click()}
            className="group"
          >
            <Wand2 className="h-4 w-4 mr-2 group-hover:animate-pulse text-indigo-500" />
            Try AI Generation
          </Button>
        </motion.div>
      )}
    </div>
  );
}
