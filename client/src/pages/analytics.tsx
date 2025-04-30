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

// Types for analytics data
interface AnalyticsData {
  overallMetrics: {
    totalParticipants: number;
    avgScore: number;
    avgTimeTaken: number;
  };
  participationData: {
    name: string;
    participants: number;
  }[];
  scoreDistribution: {
    name: string;
    value: number;
  }[];
  categoryData: {
    name: string;
    count: number;
  }[];
}

interface QuizAnalytics {
  quiz: {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    participantCount: number;
    averageScore: number;
    completionRate: number;
  };
  participationOverTime: {
    date: string;
    count: number;
  }[];
  scoreDistribution: {
    range: string;
    count: number;
  }[];
  questionAnalytics: {
    questionId: number;
    text: string;
    correctPercentage: number;
    difficulty: string;
    totalAnswers: number;
    correctCount: number;
    optionAnalytics: {
      optionId: number;
      text: string;
      count: number;
      percentage: number;
      isCorrect: boolean;
    }[];
  }[];
  performanceTrends: {
    trend: string;
    percentage: number;
  };
}

interface UserAnalytics {
  summary: {
    quizzesTaken: number;
    avgScore: number;
    globalAvgScore: number;
    percentile: number;
  };
  progressData: {
    quiz: string;
    score: number;
    date: string;
    number: number;
  }[];
  categoryPerformance: {
    category: string;
    count: number;
    avgScore: number;
  }[];
  strengths: {
    category: string;
    avgScore: number;
    count: number;
  }[];
  weaknesses: {
    category: string;
    avgScore: number;
    count: number;
  }[];
  recentActivity: {
    quizId: number;
    quizTitle: string;
    score: number;
    date: string;
    timeTaken: string;
  }[];
}

export default function Analytics() {
  const { user } = useStore();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("month");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch quizzes for dropdown
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['/api/quizzes'],
    enabled: !!user,
  });

  // Fetch general analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics', selectedQuiz, timeRange],
    enabled: !!user,
  });

  // Fetch user-specific analytics when on the personal tab
  const { data: userAnalytics, isLoading: isLoadingUserAnalytics } = useQuery<UserAnalytics>({
    queryKey: ['/api/analytics/user', user?.id, timeRange],
    enabled: !!user && activeTab === "personal",
  });

  // Fetch quiz-specific analytics when a quiz is selected
  const { data: quizAnalytics, isLoading: isLoadingQuizAnalytics } = useQuery<QuizAnalytics>({
    queryKey: ['/api/analytics/quiz', selectedQuiz],
    enabled: !!user && selectedQuiz !== "all",
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const isLoading = isLoadingQuizzes || isLoadingAnalytics || 
                    (activeTab === "personal" && isLoadingUserAnalytics) ||
                    (selectedQuiz !== "all" && isLoadingQuizAnalytics);

  // Format time in minutes to MM:SS format
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          Advanced Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get detailed insights into quiz performance, user engagement, and learning patterns
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overall Analytics</TabsTrigger>
          <TabsTrigger value="personal">Personal Performance</TabsTrigger>
          <TabsTrigger value="quiz-specific">Quiz-Specific Analysis</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {activeTab !== "personal" && (
            <div className="w-full sm:w-64">
              <Label htmlFor="quiz-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Quiz
              </Label>
              <Select 
                value={selectedQuiz}
                onValueChange={setSelectedQuiz}
              >
                <SelectTrigger id="quiz-select" className="mt-1 w-full dark:bg-[#111]">
                  <SelectValue placeholder="All Quizzes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quizzes</SelectItem>
                  {Array.isArray(quizzes) && quizzes.map((quiz: any) => (
                    <SelectItem key={quiz.id} value={quiz.id.toString()}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="w-full sm:w-64">
            <Label htmlFor="time-range" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Range
            </Label>
            <Select 
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger id="time-range" className="mt-1 w-full dark:bg-[#111]">
                <SelectValue placeholder="Last Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-indigo-500" />
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Participants</div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {analyticsData?.overallMetrics.totalParticipants || 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {analyticsData?.overallMetrics.avgScore || 0}%
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Time</div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
              <CardHeader>
                <CardTitle>Participation By Day</CardTitle>
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
                        <Bar dataKey="participants" name="Participants" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
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
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Array.isArray(analyticsData?.scoreDistribution) && analyticsData.scoreDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} participants`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Analysis */}
          <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg mb-8">
            <CardHeader>
              <CardTitle>Quiz Categories</CardTitle>
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
                      <Bar dataKey="count" name="Participants" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Performance Tab */}
        <TabsContent value="personal">
          {user ? (
            <>
              {/* Personal Summary */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
                <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <Target className="w-5 h-5 mr-2 text-indigo-500" />
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Quizzes Taken</div>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {userAnalytics?.summary.quizzesTaken || 0}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</div>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {userAnalytics?.summary.avgScore || 0}%
                      </div>
                    )}
                    <div className="mt-2 flex items-center text-sm">
                      {!isLoading && userAnalytics && (
                        <>
                          {userAnalytics.summary.avgScore > userAnalytics.summary.globalAvgScore ? (
                            <span className="text-green-500 inline-flex items-center">
                              <ArrowUp className="w-3 h-3 mr-1" />
                              {userAnalytics.summary.avgScore - userAnalytics.summary.globalAvgScore}%
                            </span>
                          ) : (
                            <span className="text-red-500 inline-flex items-center">
                              <ArrowDown className="w-3 h-3 mr-1" />
                              {Math.abs(userAnalytics.summary.avgScore - userAnalytics.summary.globalAvgScore)}%
                            </span>
                          )}
                          <span className="ml-2 text-gray-500 dark:text-gray-400">vs global avg</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <Medal className="w-5 h-5 mr-2 text-blue-500" />
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Percentile Rank</div>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {userAnalytics?.summary.percentile || 0}%
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {!isLoading && userAnalytics && (
                        userAnalytics.summary.percentile > 75 
                          ? "Top performer" 
                          : userAnalytics.summary.percentile > 50 
                            ? "Above average" 
                            : "Keep improving"
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Chart */}
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg mb-8">
                <CardHeader>
                  <CardTitle>Score Progression</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <Skeleton className="h-80 w-full" />
                  ) : userAnalytics && userAnalytics.progressData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={userAnalytics.progressData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="number" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Score']}
                            labelFormatter={(value) => `Quiz ${value}: ${userAnalytics.progressData[value-1]?.quiz || ''}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            name="Score" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No quiz history available. Complete some quizzes to see your progress.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
                <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Strengths</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoading ? (
                      <Skeleton className="h-40 w-full" />
                    ) : userAnalytics && userAnalytics.strengths.length > 0 ? (
                      <div className="space-y-4">
                        {userAnalytics.strengths.map((strength, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">{strength.category}</div>
                              <div className="text-sm text-gray-500">{strength.count} quiz(zes) taken</div>
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {strength.avgScore}%
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        Not enough data to determine strengths yet.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Areas to Improve</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoading ? (
                      <Skeleton className="h-40 w-full" />
                    ) : userAnalytics && userAnalytics.weaknesses.length > 0 ? (
                      <div className="space-y-4">
                        {userAnalytics.weaknesses.map((weakness, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">{weakness.category}</div>
                              <div className="text-sm text-gray-500">{weakness.count} quiz(zes) taken</div>
                            </div>
                            <div className="text-lg font-bold text-red-600 dark:text-red-400">
                              {weakness.avgScore}%
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        Not enough data to determine areas for improvement yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Category Performance */}
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg mb-8">
                <CardHeader>
                  <CardTitle>Performance by Category</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <Skeleton className="h-60 w-full" />
                  ) : userAnalytics && userAnalytics.categoryPerformance.length > 0 ? (
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={userAnalytics.categoryPerformance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            dataKey="avgScore" 
                            name="Average Score" 
                            fill="#8884d8" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      Complete quizzes in different categories to see your performance comparison.
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">Please log in to view your personal analytics.</p>
            </div>
          )}
        </TabsContent>

        {/* Quiz-Specific Analysis Tab */}
        <TabsContent value="quiz-specific">
          {selectedQuiz === "all" ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              Please select a specific quiz from the dropdown above to view detailed analysis.
            </div>
          ) : isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
          ) : quizAnalytics ? (
            <>
              {/* Quiz Information */}
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {quizAnalytics.quiz.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {quizAnalytics.quiz.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="font-medium text-gray-900 dark:text-white">{quizAnalytics.quiz.category}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Difficulty</span>
                      <span className="font-medium text-gray-900 dark:text-white">{quizAnalytics.quiz.difficulty}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Participants</span>
                      <span className="font-medium text-gray-900 dark:text-white">{quizAnalytics.quiz.participantCount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Average Score</span>
                      <span className="font-medium text-gray-900 dark:text-white">{quizAnalytics.quiz.averageScore}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance Trend</h3>
                    <div className="flex items-center">
                      {quizAnalytics.performanceTrends.trend === 'improving' ? (
                        <ArrowUp className="w-4 h-4 text-green-500 mr-2" />
                      ) : quizAnalytics.performanceTrends.trend === 'declining' ? (
                        <ArrowDown className="w-4 h-4 text-red-500 mr-2" />
                      ) : (
                        <span className="w-4 h-4 mr-2">–</span>
                      )}
                      <span className="text-gray-700 dark:text-gray-300">
                        {quizAnalytics.performanceTrends.trend === 'improving' ? (
                          `Improving trend: Average scores increased by ${quizAnalytics.performanceTrends.percentage}% over time`
                        ) : quizAnalytics.performanceTrends.trend === 'declining' ? (
                          `Declining trend: Average scores decreased by ${quizAnalytics.performanceTrends.percentage}% over time`
                        ) : (
                          'Stable performance over time'
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Participation Over Time */}
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg mb-8">
                <CardHeader>
                  <CardTitle>Participation Over Time</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {quizAnalytics.participationOverTime.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={quizAnalytics.participationOverTime}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            name="Participants" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.3} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No historical participation data available yet.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Question Analysis */}
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg mb-8">
                <CardHeader>
                  <CardTitle>Question Difficulty Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {quizAnalytics.questionAnalytics.map((question, idx) => {
                      // Determine color based on difficulty
                      let barColor = "bg-red-500";
                      if (question.correctPercentage >= 80) {
                        barColor = "bg-green-500";
                      } else if (question.correctPercentage >= 50) {
                        barColor = "bg-yellow-500";
                      }
                      
                      return (
                        <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-800 dark:text-gray-200 font-medium">
                              Question {idx+1}
                            </span>
                            <div className="flex items-center">
                              <span className="text-gray-600 dark:text-gray-400 mr-3">
                                Difficulty: 
                                <span className={
                                  question.difficulty === 'Easy' 
                                    ? 'text-green-500 ml-1' 
                                    : question.difficulty === 'Medium'
                                      ? 'text-yellow-500 ml-1'
                                      : 'text-red-500 ml-1'
                                }>
                                  {question.difficulty}
                                </span>
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {question.correctPercentage}% correct
                              </span>
                            </div>
                          </div>
                          
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                            <div className={`${barColor} h-2 rounded-full`} style={{ width: `${question.correctPercentage}%` }}></div>
                          </div>
                          
                          <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                            {question.text}
                          </div>
                          
                          {/* Option Analysis (collapsible) */}
                          <div className="ml-4 mt-2 space-y-2">
                            {question.optionAnalytics.map((option, optIdx) => (
                              <div key={optIdx} className="flex items-center">
                                <div className={`w-1 h-4 mr-2 ${option.isCorrect ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                <div className="flex-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                  {option.text}
                                </div>
                                <div className="text-xs font-medium">
                                  {option.percentage}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Score Distribution */}
              <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={quizAnalytics.scoreDistribution}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Participants" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              No analytics data available for this quiz.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
