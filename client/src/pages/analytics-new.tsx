import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/auth-store";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, Clock, Medal, Target, Trophy, Users } from "lucide-react";

// Chart colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default function Analytics() {
  const { user } = useStore();
  const { t, i18n } = useTranslation();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const isRTL = i18n.language === 'ar';

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
    enabled: !!user,
  });

  // Fetch quiz data for dropdown
  const { data: quizzes } = useQuery({
    queryKey: ['/api/quizzes'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('analytics')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('please_login_to_view_analytics')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
            {t('analytics')}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('track_your_quiz_performance')}
          </p>
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-1 w-full sm:w-auto">
              <TabsTrigger 
                value="overview" 
                className="rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white flex-1 sm:flex-none"
              >
                {t('overall_analytics')}
              </TabsTrigger>
              <TabsTrigger 
                value="personal" 
                className="rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white flex-1 sm:flex-none"
              >
                {t('personal_performance')}
              </TabsTrigger>
              <TabsTrigger 
                value="quiz-specific" 
                className="rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white flex-1 sm:flex-none"
              >
                {t('quiz_specific_analysis')}
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiz-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('select_quiz')}
                </Label>
                <Select 
                  value={selectedQuiz?.toString() || "all"}
                  onValueChange={(value) => setSelectedQuiz(value === "all" ? null : parseInt(value))}
                >
                  <SelectTrigger id="quiz-select" className="mt-1 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder={t('all_quizzes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_quizzes')}</SelectItem>
                    {Array.isArray(quizzes) && quizzes.map((quiz: any) => (
                      <SelectItem key={quiz.id} value={quiz.id.toString()}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time-range" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('time_range')}
                </Label>
                <Select 
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger id="time-range" className="mt-1 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder={t('last_month')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">{t('last_week')}</SelectItem>
                    <SelectItem value="month">{t('last_month')}</SelectItem>
                    <SelectItem value="quarter">{t('last_quarter')}</SelectItem>
                    <SelectItem value="year">{t('last_year')}</SelectItem>
                    <SelectItem value="all">{t('all_time')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="w-3 h-3 bg-indigo-500 rounded-sm flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('total_participants')}
                    </span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {analyticsData?.overallMetrics.totalParticipants || 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('average_score')}
                    </span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {analyticsData?.overallMetrics.avgScore || 0}%
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="w-3 h-3 bg-blue-500 rounded-sm flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('average_time')}
                    </span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {analyticsData?.overallMetrics.avgTimeTaken 
                        ? Math.floor(analyticsData.overallMetrics.avgTimeTaken / 60) + ":" + 
                          String(analyticsData.overallMetrics.avgTimeTaken % 60).padStart(2, '0')
                        : "00:00"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {t('participation_by_day')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <Skeleton className="h-80 w-full" />
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData?.participationData || []}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="participants" name={t('participants')} fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {t('score_distribution')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <Skeleton className="h-80 w-full" />
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.scoreDistribution || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Array.isArray(analyticsData?.scoreDistribution) && analyticsData.scoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} ${t('participants')}`, t('count')]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {/* Legend with proper spacing */}
                  <div className="mt-4 space-y-2">
                    {analyticsData?.scoreDistribution?.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
                        <div 
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {entry.name}: {entry.value}%
                        </span>
                      </div>
                    )) || (
                      // Mock data for demonstration
                      ['81-100%', '61-80%', '41-60%', '21-40%', '0-20%'].map((range, index) => (
                        <div key={range} className="flex items-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {range}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                </Card>
              </div>

              {/* Category Analysis */}
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t('quiz_categories')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-60 w-full" />
                ) : (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData?.categoryData || []}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name={t('participants')} fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Performance Tab */}
            <TabsContent value="personal">
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('personal_performance_coming_soon')}
                </p>
              </div>
            </TabsContent>

            {/* Quiz Specific Analysis Tab */}
            <TabsContent value="quiz-specific">
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('quiz_specific_analysis_coming_soon')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}