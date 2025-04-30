import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ArrowDown, ArrowUp, Award, Brain, Clock, Medal, Target, Trophy } from "lucide-react";
import { Link } from "wouter";

// Types for user analytics data
interface UserStatistics {
  quizzesTaken: number;
  averageScore: number;
  bestScore: number;
  totalTimeTaken: string;
  rank: number;
  percentile: number;
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

interface UserPerformanceDashboardProps {
  className?: string;
  userId?: string;
  compact?: boolean;
}

export default function UserPerformanceDashboard({
  className = "",
  userId,
  compact = false,
}: UserPerformanceDashboardProps) {
  const { user } = useStore();
  const activeUserId = userId || user?.id;

  // Fetch user statistics (basic summary)
  const { 
    data: userStats, 
    isLoading: isLoadingStats,
  } = useQuery<UserStatistics>({
    queryKey: ['/api/analytics/user/stats', activeUserId],
    enabled: !!activeUserId,
  });

  // Fetch detailed user analytics
  const { 
    data: userAnalytics, 
    isLoading: isLoadingAnalytics,
  } = useQuery<UserAnalytics>({
    queryKey: ['/api/analytics/user', activeUserId],
    enabled: !!activeUserId,
  });

  const isLoading = isLoadingStats || isLoadingAnalytics;

  if (!activeUserId) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Please log in to view performance analytics
        </p>
      </div>
    );
  }

  const renderPerformanceSummary = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center items-center h-full">
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">{userStats?.averageScore || 0}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Average Score</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center items-center h-full">
            <Target className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{userStats?.quizzesTaken || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quizzes Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center items-center h-full">
            <Medal className="h-8 w-8 text-purple-500 mb-2" />
            <div className="text-2xl font-bold">{userStats?.rank || "-"}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Leaderboard Rank</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center items-center h-full">
            <Award className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold">{userStats?.bestScore || 0}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Best Score</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProgressChart = () => {
    if (isLoading) {
      return <Skeleton className="h-80 w-full" />;
    }

    if (!userAnalytics?.progressData?.length) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500 dark:text-gray-400">
          <Brain className="h-12 w-12 mb-2 opacity-20" />
          <p>Not enough data to display progress</p>
          <button 
            className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            onClick={() => window.location.href = "/quizzes"}
          >
            Take some quizzes
          </button>
        </div>
      );
    }

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userAnalytics.progressData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="number" 
              label={{ 
                value: 'Quiz Number', 
                position: 'bottom',
                offset: 0
              }} 
            />
            <YAxis 
              domain={[0, 100]} 
              label={{ 
                value: 'Score (%)', 
                angle: -90, 
                position: 'insideLeft',
              }} 
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Score']}
              labelFormatter={(value) => `Quiz ${value}: ${userAnalytics.progressData[Number(value)-1]?.quiz || ''}`}
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
    );
  };

  const renderCategoryPerformance = () => {
    if (isLoading) {
      return <Skeleton className="h-60 w-full" />;
    }

    if (!userAnalytics?.categoryPerformance?.length) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          <p>Not enough data to display category performance</p>
        </div>
      );
    }

    // For radar chart, we need data in a specific format
    const radarData = userAnalytics.categoryPerformance.map(cat => ({
      subject: cat.category,
      score: cat.avgScore,
      fullMark: 100
    }));

    return (
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={80} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderStrengthsAndWeaknesses = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Strengths</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {userAnalytics?.strengths?.length ? (
              <ul className="space-y-2">
                {userAnalytics.strengths.map((strength, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{strength.category}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{strength.avgScore}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">
                Keep taking quizzes to discover your strengths
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {userAnalytics?.weaknesses?.length ? (
              <ul className="space-y-2">
                {userAnalytics.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{weakness.category}</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{weakness.avgScore}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">
                Keep taking quizzes to identify areas for improvement
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRecentActivity = () => {
    if (isLoading) {
      return <Skeleton className="h-40 w-full" />;
    }

    return (
      <Card className="bg-white dark:bg-[#1e1e1e]">
        <CardHeader className="p-4 pb-0">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {userAnalytics?.recentActivity?.length ? (
            <ul className="space-y-3">
              {userAnalytics.recentActivity.map((activity, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                  <div className="flex-1">
                    <Link href={`/results/${activity.quizId}`}>
                      <a className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        {activity.quizTitle}
                      </a>
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.date} • {activity.timeTaken}
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    activity.score >= 80 
                      ? 'text-green-600 dark:text-green-400' 
                      : activity.score >= 60 
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {activity.score}%
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">
              No recent quiz activity
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  if (compact) {
    // Compact view for dashboard widgets
    return (
      <div className={className}>
        {renderPerformanceSummary()}
      </div>
    );
  }

  // Full view for dedicated performance page
  return (
    <div className={className}>
      {renderPerformanceSummary()}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardHeader className="p-4 pb-0">
            <CardTitle>Score Progression</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {renderProgressChart()}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1e1e1e]">
            <CardHeader className="p-4 pb-0">
              <CardTitle>Performance by Category</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {renderCategoryPerformance()}
            </CardContent>
          </Card>

          {renderStrengthsAndWeaknesses()}
        </div>
      </div>

      <div className="mt-6">
        {renderRecentActivity()}
      </div>

      <div className="mt-6 text-center">
        <Link href="/analytics">
          <a className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            View detailed analytics →
          </a>
        </Link>
      </div>
    </div>
  );
}