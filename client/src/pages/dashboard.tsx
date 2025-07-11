import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/stats-card";
import QuizCard from "@/components/quiz-card";
import QuizForm from "@/components/quiz-form";
import QuizAnalytics from "@/components/quiz-analytics";
import { useStore } from "@/store/auth-store";
import { useQuizStore } from "@/store/quiz-store";
import { Plus, Share2 } from "lucide-react";
import { Quiz } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareButton } from "@/components/share";
import { FirestoreQuiz } from "@/lib/firestore-service";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { user } = useStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("ai-generated");
  const [isLoading, setIsLoading] = useState(true);
  const [firestoreQuizzes, setFirestoreQuizzes] = useState<FirestoreQuiz[]>([]);
  const getUserQuizzes = useQuizStore(state => state.getUserQuizzes);
  
  // Fetch quizzes from Firestore
  useEffect(() => {
    async function fetchQuizzes() {
      if (user) {
        try {
          const quizzes = await getUserQuizzes();
          setFirestoreQuizzes(quizzes);
        } catch (error) {
          console.error("Failed to fetch quizzes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    fetchQuizzes();
  }, [user, getUserQuizzes]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 feature-tour-dashboard">
      {/* Dashboard Overview */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t("dashboard")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("welcome_back")}, {user?.displayName}! {t("you_have")} <span className="font-medium text-primary-600 dark:text-primary-400">{firestoreQuizzes.length} {t("quizzes")}</span> {t("in_your_collection")}{firestoreQuizzes.filter(q => q.isPublic).length > 0 ? `, ${t("with")} ${firestoreQuizzes.filter(q => q.isPublic).length} ${t("shared_publicly")}` : ''}.
          </p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
          <ShareButton 
            title="QuizGenius - Create and share interactive quizzes"
            description="Join me on QuizGenius, the intelligent quiz platform. Create, share, and take quizzes on any topic with AI assistance."
            hashtags={["QuizGenius", "Learning", "Education"]}
            variant="outline"
            buttonText={t("invite_friends")}
          />
          <Button asChild className="feature-tour-create-quiz">
            <Link href="/create-quiz">
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              {t("create_new_quiz")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 feature-tour-stats">
        <StatsCard
          title={t("total_quizzes")}
          value={firestoreQuizzes.length.toString()}
          change={{ value: 0, isIncrease: true }}
          changeText={t("total_quizzes")}
        />
        <StatsCard
          title={t("public_quizzes")}
          value={firestoreQuizzes.filter(q => q.isPublic).length.toString()}
          change={{ value: 0, isIncrease: true }}
          changeText={t("publicly_available")}
        />
        <StatsCard
          title={t("total_questions")}
          value={(firestoreQuizzes.reduce((sum, quiz) => sum + (quiz.questionCount || 0), 0)).toString()}
          change={{ value: 0, isIncrease: true }}
          changeText={t("across_all_quizzes")}
        />
        <StatsCard
          title={t("average_questions")}
          value={firestoreQuizzes.length ? Math.round(firestoreQuizzes.reduce((sum, quiz) => sum + (quiz.questionCount || 0), 0) / firestoreQuizzes.length).toString() : "0"}
          change={{ value: 0, isIncrease: true }}
          changeText={t("per_quiz")}
        />
      </div>

      {/* Active Quizzes */}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t("your_recent_quizzes")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {firestoreQuizzes && firestoreQuizzes.length > 0 ? (
          firestoreQuizzes.slice(0, 3).map((quiz) => (
            <div key={quiz.id} className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {quiz.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      {quiz.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {quiz.questionCount} {t("questions")}
                    </span>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/quiz/${quiz.id}`}>{t("take_quiz")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-white dark:bg-[#1e1e1e] rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
{t('no_quizzes_created_yet')}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/create-quiz">{t('create_quiz')}</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ai-generated" className="mb-8">
        <TabsList className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <TabsTrigger value="create-new">{t('create_new_quiz')}</TabsTrigger>
          <TabsTrigger value="ai-generated">{t('ai_generated_quiz')}</TabsTrigger>
          <TabsTrigger value="templates">{t('quiz_templates')}</TabsTrigger>
        </TabsList>
        <TabsContent value="create-new">
          <div className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('create_manually_title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('create_manually_description')}
            </p>
            <Button asChild>
              <Link href="/create-quiz">{t('get_started')}</Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="ai-generated">
          <QuizForm />
        </TabsContent>
        <TabsContent value="templates">
          <div className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('quiz_templates')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('quiz_templates_description')}
              {t('coming_soon')}
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Analytics Preview */}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('recent_quiz_analytics')}</h2>
      <QuizAnalytics
        quizTitle={t('es6_features')}
        participantCount={42}
        questionAnalytics={questionAnalytics}
        scoreDistribution={scoreDistribution}
      />
    </div>
  );
}
