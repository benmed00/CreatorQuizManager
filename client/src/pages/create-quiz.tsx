import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuizForm from "@/components/quiz-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/auth-store";

export default function CreateQuiz() {
  const { user } = useStore();
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

      <Tabs defaultValue="ai-generated" className="mb-8">
        <TabsList className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <TabsTrigger value="manual">Create Manually</TabsTrigger>
          <TabsTrigger value="ai-generated">AI Generated Quiz</TabsTrigger>
          <TabsTrigger value="templates">Quiz Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Create a Quiz Manually</CardTitle>
              <CardDescription>
                Design your quiz by adding questions and answers step by step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Coming soon... This feature is under development. For now, try our AI-powered quiz generation.
              </p>
              <Button variant="outline" onClick={() => document.getElementById('ai-generated-tab')?.click()}>
                Try AI Generation Instead
              </Button>
            </CardContent>
          </Card>
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
              <p className="text-gray-500 dark:text-gray-400">
                Coming soon... This feature is under development. For now, try our AI-powered quiz generation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
