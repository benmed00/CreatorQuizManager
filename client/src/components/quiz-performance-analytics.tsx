import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
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
  AreaChart,
  Area,
} from "recharts";
import { ArrowDown, ArrowUp, Calendar, Clock, Flag, Users } from "lucide-react";

interface QuizPerformanceAnalyticsProps {
  quizId: number;
  className?: string;
  compact?: boolean;
}

// Types for quiz analytics data
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

export default function QuizPerformanceAnalytics({
  quizId,
  className = "",
  compact = false,
}: QuizPerformanceAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch quiz-specific analytics
  const { 
    data: quizAnalytics, 
    isLoading, 
    error 
  } = useQuery<QuizAnalytics>({
    queryKey: ['/api/analytics/quiz', quizId.toString()],
    enabled: !!quizId,
  });

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
        Error loading quiz analytics. Please try again later.
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const renderOverviewStats = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      );
    }
    
    if (!quizAnalytics) {
      return (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          No analytics data available for this quiz yet.
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex items-center mb-1">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Participants</div>
            </div>
            <div className="text-2xl font-bold">{quizAnalytics.quiz.participantCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex items-center mb-1">
              <Flag className="w-4 h-4 mr-2 text-green-500" />
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Score</div>
            </div>
            <div className="text-2xl font-bold">{quizAnalytics.quiz.averageScore}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex items-center mb-1">
              <Clock className="w-4 h-4 mr-2 text-yellow-500" />
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</div>
            </div>
            <div className="text-2xl font-bold">{quizAnalytics.quiz.completionRate}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1e1e1e]">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex items-center mb-1">
              <Calendar className="w-4 h-4 mr-2 text-purple-500" />
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance</div>
            </div>
            <div className="flex items-center">
              {quizAnalytics.performanceTrends.trend === 'improving' ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : quizAnalytics.performanceTrends.trend === 'declining' ? (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              ) : (
                <span className="w-4 h-4 mr-1">-</span>
              )}
              <span className="text-lg font-bold">
                {quizAnalytics.performanceTrends.percentage}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderParticipationChart = () => {
    if (isLoading) {
      return <Skeleton className="h-72 w-full" />;
    }
    
    if (!quizAnalytics || !quizAnalytics.participationOverTime.length) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500 dark:text-gray-400">
          <p>No participation data available yet</p>
        </div>
      );
    }
    
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={quizAnalytics.participationOverTime}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end"
              tick={{ fontSize: 12 }}
              height={60}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, 'Participants']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="count" 
              name="Participants" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorParticipants)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderScoreDistribution = () => {
    if (isLoading) {
      return <Skeleton className="h-72 w-full" />;
    }
    
    if (!quizAnalytics || !quizAnalytics.scoreDistribution.length) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500 dark:text-gray-400">
          <p>No score distribution data available yet</p>
        </div>
      );
    }
    
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={quizAnalytics.scoreDistribution}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="range"
            >
              {quizAnalytics.scoreDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value} participants`, props.payload.range]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderQuestionAnalytics = () => {
    if (isLoading) {
      return <Skeleton className="h-96 w-full" />;
    }
    
    if (!quizAnalytics || !quizAnalytics.questionAnalytics.length) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500 dark:text-gray-400">
          <p>No question analytics data available yet</p>
        </div>
      );
    }
    
    // Format data for chart
    const chartData = quizAnalytics.questionAnalytics.map((q, idx) => ({
      name: `Q${idx + 1}`,
      correct: q.correctPercentage,
      difficulty: q.difficulty
    }));
    
    return (
      <div className="space-y-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Correct Answers']}
                labelFormatter={(label) => `Question ${label.substring(1)}`}
              />
              <Legend />
              <Bar 
                dataKey="correct" 
                name="Correct Answers %" 
                fill="#8884d8" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <h3 className="text-lg font-medium mt-8 mb-4">Question Details</h3>
        <div className="space-y-6">
          {quizAnalytics.questionAnalytics.map((question, idx) => {
            let difficultyColor = 'bg-red-500';
            if (question.correctPercentage >= 80) {
              difficultyColor = 'bg-green-500';
            } else if (question.correctPercentage >= 50) {
              difficultyColor = 'bg-yellow-500';
            }
            
            return (
              <Card key={idx} className="bg-white dark:bg-[#1e1e1e]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Question {idx + 1}</h4>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        question.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : question.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {question.correctPercentage}% correct
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {question.text}
                  </p>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className={`${difficultyColor} h-2 rounded-full`} 
                      style={{ width: `${question.correctPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="space-y-2">
                    {question.optionAnalytics.map((option, optIdx) => (
                      <div 
                        key={optIdx} 
                        className={`p-2 text-sm rounded ${
                          option.isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : 'bg-gray-50 dark:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className={option.isCorrect 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-gray-700 dark:text-gray-300'
                          }>
                            {option.text}
                          </span>
                          <span className="font-medium">
                            {option.percentage}%
                          </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className={`${option.isCorrect ? 'bg-green-500' : 'bg-gray-400'} h-1 rounded-full`} 
                            style={{ width: `${option.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };
  
  if (compact) {
    // Compact view for embedding in other components
    return (
      <div className={className}>
        {renderOverviewStats()}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-[#1e1e1e]">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-sm">Participation</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {renderParticipationChart()}
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1e1e1e]">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-sm">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {renderScoreDistribution()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Full detailed view
  return (
    <div className={className}>
      <div className="mb-6">
        {!isLoading && quizAnalytics && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {quizAnalytics.quiz.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {quizAnalytics.quiz.description}
            </p>
            <div className="flex space-x-4 mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {quizAnalytics.quiz.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {quizAnalytics.quiz.difficulty}
              </span>
            </div>
          </div>
        )}
        
        {renderOverviewStats()}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-[#1e1e1e]">
              <CardHeader>
                <CardTitle>Participation Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {renderParticipationChart()}
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-[#1e1e1e]">
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {renderScoreDistribution()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="questions">
          <Card className="bg-white dark:bg-[#1e1e1e]">
            <CardHeader>
              <CardTitle>Question Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {renderQuestionAnalytics()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}