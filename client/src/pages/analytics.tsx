import { useState } from "react";
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
} from "recharts";

export default function Analytics() {
  const { user } = useStore();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("month");

  // Fetch quizzes for dropdown
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['/api/quizzes'],
    enabled: !!user,
  });

  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/analytics', selectedQuiz, timeRange],
    enabled: !!user,
  });

  // Sample data for charts
  const sampleParticipationData = [
    { name: 'Mon', participants: 12 },
    { name: 'Tue', participants: 19 },
    { name: 'Wed', participants: 15 },
    { name: 'Thu', participants: 25 },
    { name: 'Fri', participants: 27 },
    { name: 'Sat', participants: 18 },
    { name: 'Sun', participants: 22 }
  ];

  const sampleScoreDistribution = [
    { name: '0-20%', value: 5 },
    { name: '21-40%', value: 15 },
    { name: '41-60%', value: 25 },
    { name: '61-80%', value: 35 },
    { name: '81-100%', value: 20 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const isLoading = isLoadingQuizzes || isLoadingAnalytics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get insights into quiz performance and participant engagement
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
              {quizzes?.map((quiz: any) => (
                <SelectItem key={quiz.id} value={quiz.id.toString()}>
                  {quiz.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Participants</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">528</div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500 inline-flex items-center">
                <i className="fas fa-arrow-up mr-1.5 text-xs"></i>
                23%
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">76%</div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500 inline-flex items-center">
                <i className="fas fa-arrow-up mr-1.5 text-xs"></i>
                5%
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">84%</div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-500 inline-flex items-center">
                <i className="fas fa-arrow-down mr-1.5 text-xs"></i>
                3%
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="participation" className="mb-8">
        <TabsList>
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="participation" className="mt-6">
          <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
            <CardHeader>
              <CardTitle>Participation Over Time</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sampleParticipationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="participants" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sampleScoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sampleScoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} participants`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-6">
          <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
            <CardHeader>
              <CardTitle>Question Difficulty Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 dark:text-gray-200">Question 1</span>
                    <span className="text-gray-600 dark:text-gray-400">85% correct</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 dark:text-gray-200">Question 2</span>
                    <span className="text-gray-600 dark:text-gray-400">62% correct</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 dark:text-gray-200">Question 3</span>
                    <span className="text-gray-600 dark:text-gray-400">38% correct</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 dark:text-gray-200">Question 4</span>
                    <span className="text-gray-600 dark:text-gray-400">72% correct</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 dark:text-gray-200">Question 5</span>
                    <span className="text-gray-600 dark:text-gray-400">56% correct</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "56%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
