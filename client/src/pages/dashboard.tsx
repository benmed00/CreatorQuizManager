import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/stats-card";
import QuizCard from "@/components/quiz-card";
import QuizForm from "@/components/quiz-form";
import QuizAnalytics from "@/components/quiz-analytics";
import { useStore } from "@/store/auth-store";
import { Plus, Share2 } from "lucide-react";
import { Quiz } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareButton } from "@/components/share";

export default function Dashboard() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState("ai-generated");

  // Fetch active quizzes
  const { data: quizzes, isLoading } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
    enabled: !!user,
  });

  // Sample analytics data
  const questionAnalytics = [
    { questionNumber: 1, correctPercentage: 85 },
    { questionNumber: 2, correctPercentage: 62 },
    { questionNumber: 3, correctPercentage: 38 },
    { questionNumber: 4, correctPercentage: 72 },
    { questionNumber: 5, correctPercentage: 56 },
  ];

  const scoreDistribution = [
    { range: "0-20%", percentage: 15, color: "bg-primary-200 dark:bg-primary-900" },
    { range: "21-40%", percentage: 25, color: "bg-primary-300 dark:bg-primary-800" },
    { range: "41-60%", percentage: 40, color: "bg-primary-400 dark:bg-primary-700" },
    { range: "61-80%", percentage: 65, color: "bg-primary-500 dark:bg-primary-600" },
    { range: "81-100%", percentage: 45, color: "bg-primary-600 dark:bg-primary-500" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Overview */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.displayName}! You have <span className="font-medium text-primary-600 dark:text-primary-400">3 active quizzes</span> and <span className="font-medium text-primary-600 dark:text-primary-400">12 completed</span> this month.
          </p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
          <ShareButton 
            title="QuizGenius - Create and share interactive quizzes"
            description="Join me on QuizGenius, the intelligent quiz platform. Create, share, and take quizzes on any topic with AI assistance."
            hashtags={["QuizGenius", "Learning", "Education"]}
            variant="outline"
            buttonText="Invite Friends"
          />
          <Button asChild>
            <Link href="/create-quiz">
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Create New Quiz
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Quizzes"
          value="15"
          change={{ value: 12, isIncrease: true }}
          changeText="from last month"
        />
        <StatsCard
          title="Total Participants"
          value="528"
          change={{ value: 23, isIncrease: true }}
          changeText="from last month"
        />
        <StatsCard
          title="Avg. Completion Rate"
          value="84%"
          change={{ value: 3, isIncrease: false }}
          changeText="from last month"
        />
        <StatsCard
          title="Avg. Score"
          value="76%"
          change={{ value: 5, isIncrease: true }}
          changeText="from last month"
        />
      </div>

      {/* Active Quizzes */}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Active Quizzes</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {quizzes && quizzes.length > 0 ? (
          quizzes.filter((quiz: Quiz) => quiz.active).slice(0, 3).map((quiz: Quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-white dark:bg-[#1e1e1e] rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              No active quizzes found. Create your first quiz to get started!
            </p>
            <Button className="mt-4" asChild>
              <Link href="/create-quiz">Create Quiz</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ai-generated" className="mb-8">
        <TabsList className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <TabsTrigger value="create-new">Create New Quiz</TabsTrigger>
          <TabsTrigger value="ai-generated">AI Generated Quiz</TabsTrigger>
          <TabsTrigger value="templates">Quiz Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="create-new">
          <div className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Create a New Quiz Manually
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Create a quiz from scratch by adding questions, answers, and options manually.
            </p>
            <Button asChild>
              <Link href="/create-quiz">Get Started</Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="ai-generated">
          <QuizForm />
        </TabsContent>
        <TabsContent value="templates">
          <div className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quiz Templates
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose from our pre-made quiz templates to get started quickly.
              Coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Analytics Preview */}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Quiz Analytics</h2>
      <QuizAnalytics
        quizTitle="JavaScript ES6 Features"
        participantCount={42}
        questionAnalytics={questionAnalytics}
        scoreDistribution={scoreDistribution}
      />
    </div>
  );
}
