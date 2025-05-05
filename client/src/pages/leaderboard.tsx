import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/auth-store";
import { Link, useLocation } from "wouter";
import Leaderboard from "@/components/leaderboard";
import Achievements from "@/components/achievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Award, 
  Trophy, 
  Users, 
  Calendar, 
  BarChart, 
  Target, 
  TrendingUp, 
  Medal,
  FlameIcon,
  Star
} from "lucide-react";
import AchievementNotification from "@/components/achievement-notification";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShareButton } from "@/components/share";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LeaderboardPage() {
  const { user } = useStore();
  const userId = user?.id || '';
  const [location, setLocation] = useLocation();
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all-time' | 'this-week' | 'this-month'>('all-time');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Determine the active section based on URL
  const isAchievementsTab = location.includes('/achievements');
  const activeTab = isAchievementsTab ? 'achievements' : 'leaderboard';
  
  // Weekly challenge data
  const weeklyChallenge = {
    title: "JavaScript Mastery Challenge",
    description: "Test your JavaScript knowledge with this comprehensive quiz covering advanced concepts, closures, promises, and more!",
    category: "Programming",
    difficulty: "Advanced",
    timeRemaining: "2d 14h 36m",
    quizId: 2,
    reward: {
      points: 500,
      achievement: "JavaScript Master"
    }
  };
  
  // Get user leaderboard data
  const { data: userLeaderboard = {} } = useQuery<any>({
    queryKey: [`/api/leaderboard/user/${userId}`],
    enabled: !!userId,
  });
  
  // Get user achievements
  const { data: userAchievements = [] } = useQuery<any[]>({
    queryKey: [`/api/achievements/user/${userId}`],
    enabled: !!userId,
  });
  
  // Get all achievements (for progress calculation)
  const { data: allAchievements = [] } = useQuery<any[]>({
    queryKey: ["/api/achievements"],
    enabled: true,
  });
  
  // Get user quizzes and results for stats
  const { data: userQuizResults = [] } = useQuery<any[]>({
    queryKey: [`/api/results/user/${userId}`],
    enabled: !!userId,
  });
  
  // Get all leaderboard entries for comparison
  const { data: leaderboardEntries = [] } = useQuery<any[]>({
    queryKey: ["/api/leaderboard"],
    enabled: true,
  });
  
  // Check for new achievements when the page loads
  useEffect(() => {
    if (!userId) return;
    
    // Function to check for new achievements
    const checkAchievements = async () => {
      try {
        const response = await fetch('/api/achievements/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        const data = await response.json();
        
        if (data.newAchievements) {
          setNewAchievements(data.newAchievements);
        }
      } catch (error) {
        console.error('Failed to check achievements:', error);
      }
    };
    
    checkAchievements();
  }, [userId]);
  
  // Prepare stats data
  const averageUserScore = leaderboardEntries.length > 0 
    ? Math.round(leaderboardEntries.reduce((sum, entry) => sum + entry.averageScore, 0) / leaderboardEntries.length) 
    : 0;
  
  const userRank = userLeaderboard?.ranking || 0;
  const totalUsers = leaderboardEntries.length;
  const userPercentile = totalUsers > 0 && userRank > 0 
    ? Math.round(((totalUsers - userRank) / totalUsers) * 100) 
    : 0;
  
  // Calculate achievement progress
  const achievementCount = userAchievements?.length || 0;
  const totalAchievements = allAchievements?.length || 0;
  const achievementProgress = totalAchievements > 0 
    ? Math.round((achievementCount / totalAchievements) * 100) 
    : 0;
  
  // Calculate category distribution
  const quizCategories = userQuizResults.reduce((acc, result) => {
    const category = result.quizCategory || 'Unknown';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);
  
  // Find strongest category
  let strongestCategory = 'None';
  let highestCount = 0;
  
  Object.entries(quizCategories).forEach(([category, count]) => {
    const countValue = count as number;
    if (countValue > highestCount) {
      highestCount = countValue;
      strongestCategory = category;
    }
  });
  
  if (!userId) {
    return (
      <div className="container mx-auto py-10">
        <Card className="text-center p-6">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view leaderboards and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="mt-4">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 space-y-8">
      {newAchievements?.length > 0 && (
        <AchievementNotification 
          achievements={newAchievements} 
          onClose={() => setNewAchievements([])} 
        />
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Competition Hub</h1>
          <p className="text-muted-foreground">Challenge yourself, track your progress, and climb the leaderboard!</p>
        </div>
        
        <ShareButton 
          title="Check out my position on the QuizGenius leaderboard!"
          description={`I'm ranked #${userLeaderboard?.ranking || 'N/A'} globally with ${userLeaderboard?.quizzesCompleted || 0} quizzes completed and an average score of ${userLeaderboard?.averageScore || 0}%. I've also unlocked ${achievementCount} of ${totalAchievements} achievements!`}
          hashtags={["QuizGenius", "Leaderboard", "Learning"]}
          buttonText="Share My Ranking"
          variant="secondary"
        />
      </div>
      
      {/* Ranking Overview */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Your Competitive Standing</CardTitle>
            <Badge variant="outline" className="text-white border-white">
              Top {userPercentile}%
            </Badge>
          </div>
          <CardDescription className="text-blue-100">
            How you rank against other quiz masters
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
              <p className="text-sm text-muted-foreground">Global Rank</p>
              <h3 className="text-3xl font-bold">#{userLeaderboard?.ranking || 'N/A'}</h3>
              <p className="text-xs text-muted-foreground mt-1">of {totalUsers} users</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Award className="h-8 w-8 text-purple-500 mb-2" />
              <p className="text-sm text-muted-foreground">Achievements</p>
              <h3 className="text-3xl font-bold">{achievementCount}</h3>
              <p className="text-xs text-muted-foreground mt-1">of {totalAchievements} total</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <BarChart className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm text-muted-foreground">Average Score</p>
              <h3 className="text-3xl font-bold">{userLeaderboard?.averageScore || 0}%</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {userLeaderboard?.averageScore > averageUserScore 
                  ? <span className="text-green-500 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Above average</span>
                  : <span>Average: {averageUserScore}%</span>
                }
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <FlameIcon className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm text-muted-foreground">Best Streak</p>
              <h3 className="text-3xl font-bold">{userLeaderboard?.bestStreak || 0}</h3>
              <p className="text-xs text-muted-foreground mt-1">Current: {userLeaderboard?.currentStreak || 0}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Performance Insights
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Quizzes Completed</span>
                  <span className="font-medium">{userLeaderboard?.quizzesCompleted || 0}</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Total Score</span>
                  <span className="font-medium">{userLeaderboard?.totalScore || 0} points</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Percentile Ranking</span>
                  <span className="font-medium">{userPercentile}th percentile</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="font-medium">
                    {userLeaderboard?.lastActive 
                      ? new Date(userLeaderboard.lastActive).toLocaleDateString() 
                      : 'N/A'}
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Competitive Highlights
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Strongest Category</span>
                  <span className="font-medium">{strongestCategory}</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Achievement Progress</span>
                  <div className="flex items-center gap-2">
                    <Progress value={achievementProgress} className="h-2 w-24" />
                    <span className="font-medium">{achievementProgress}%</span>
                  </div>
                </li>
                <li className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Current Rank Trend</span>
                  <span className="font-medium flex items-center gap-1 text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    Improving
                  </span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Next Achievement</span>
                  <Badge variant="outline" className="font-medium">In Progress</Badge>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Leaderboard and Achievements Navigation */}
      <div>
        <div className="w-full mb-6">
          <div className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted rounded-lg p-1">
            <Button 
              variant={!isAchievementsTab ? "default" : "ghost"}
              className="rounded-md"
              onClick={() => setLocation('/leaderboard')}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </Button>
            <Button 
              variant={isAchievementsTab ? "default" : "ghost"} 
              className="rounded-md"
              onClick={() => setLocation('/leaderboard/achievements')}
            >
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </Button>
          </div>
          
          {!isAchievementsTab ? (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold">Global Rankings</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-time">All Time</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Target className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Leaderboard currentUserId={userId} />
            </div>
          ) : (
            <div className="mt-6">
              <Achievements userId={userId} />
            </div>
          )}
        </div>
      </div>
      
      {/* Weekly Challenge Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Weekly Challenge
              </CardTitle>
              <CardDescription>
                Complete this week's challenge to earn bonus points and exclusive achievements
              </CardDescription>
            </div>
            {weeklyChallenge && (
              <Badge variant="outline" className="flex gap-1">
                <Calendar className="h-4 w-4" />
                {weeklyChallenge.timeRemaining ? `Ends in: ${weeklyChallenge.timeRemaining}` : "Current Challenge"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {weeklyChallenge ? (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                {weeklyChallenge.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {weeklyChallenge.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="capitalize">
                  {weeklyChallenge.category}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {weeklyChallenge.difficulty}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  +{weeklyChallenge.reward.points} points
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
                <p className="text-sm text-muted-foreground">
                  Challenge ends in: <span className="font-medium">{weeklyChallenge.timeRemaining}</span>
                </p>
                <Link href={`/quizzes/${weeklyChallenge.quizId}`}>
                  <Button size="sm">Take Challenge</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950 p-8 rounded-lg text-center">
              <Trophy className="h-12 w-12 text-blue-400 mx-auto mb-2 opacity-60" />
              <h3 className="font-semibold text-lg mb-1">No Active Challenge</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check back soon for new weekly challenges with special rewards!
              </p>
              <Link href="/quizzes">
                <Button variant="outline" size="sm">Browse Quizzes</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}