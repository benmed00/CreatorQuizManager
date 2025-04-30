import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Flame, ArrowUp, Star, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/share";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardItemProps {
  rank: number;
  userName: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  bestStreak: number;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  currentUserId?: string;
  timeFilter?: string;
  categoryFilter?: string;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Trophy className="h-5 w-5 text-yellow-500" />;
  } else if (rank === 2) {
    return <Medal className="h-5 w-5 text-gray-400" />;
  } else if (rank === 3) {
    return <Medal className="h-5 w-5 text-amber-600" />;
  }
  return <span className="font-semibold">{rank}</span>;
}

function LeaderboardItem({
  rank,
  userName,
  totalScore,
  quizzesCompleted,
  averageScore,
  bestStreak,
  isCurrentUser,
}: LeaderboardItemProps) {
  return (
    <TableRow className={isCurrentUser ? "bg-muted/50" : ""}>
      <TableCell className="w-[80px]">
        <div className="flex items-center justify-center">
          <RankIcon rank={rank} />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${userName}`} />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="font-medium">
            {userName}
            {isCurrentUser && (
              <Badge variant="outline" className="ml-2">
                You
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">{totalScore}</TableCell>
      <TableCell className="text-center">{quizzesCompleted}</TableCell>
      <TableCell className="text-center">{averageScore}%</TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          {bestStreak}
          {bestStreak >= 5 && <Flame className="h-4 w-4 text-yellow-500" />}
        </div>
      </TableCell>
    </TableRow>
  );
}

function LeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Leaderboard({ currentUserId, timeFilter, categoryFilter }: LeaderboardProps) {
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'weekly' | 'monthly'>('global');
  const [weeklyChallenge, setWeeklyChallenge] = useState<any>(null);
  
  // Get leaderboard data with filters
  const { data: leaderboard = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/leaderboard", timeFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (timeFilter) {
        params.append('timeFrame', timeFilter as string);
      }
      
      if (categoryFilter && categoryFilter !== 'all') {
        params.append('category', categoryFilter as string);
      }
      
      const response = await fetch(`/api/leaderboard?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      return response.json();
    },
    enabled: true,
  });
  
  // Get weekly challenge data
  const { data: challenges = [] } = useQuery<any[]>({
    queryKey: ["/api/leaderboard/challenges"],
    enabled: true,
  });
  
  // Set the first challenge as the weekly challenge
  useEffect(() => {
    if (challenges.length > 0) {
      setWeeklyChallenge(challenges[0]);
    }
  }, [challenges]);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="global" onValueChange={(value) => setLeaderboardType(value as any)}>
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
          <TabsTrigger value="global" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>Global</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Weekly</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>Monthly</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Global Rankings</CardTitle>
                  <CardDescription>
                    See how you rank against other quiz takers worldwide
                  </CardDescription>
                </div>
                <ShareButton 
                  title="Check out the QuizGenius Global Leaderboard!"
                  description="Join the community, test your knowledge, and climb the rankings. Can you make it to the top spot?"
                  hashtags={["QuizGenius", "Leaderboard", "Learning"]}
                  buttonText="Share Leaderboard"
                  variant="outline"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">Total Score</TableHead>
                    <TableHead className="text-center">Quizzes</TableHead>
                    <TableHead className="text-center">Avg. Score</TableHead>
                    <TableHead className="text-center">Best Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard?.map((item: any) => (
                    <LeaderboardItem
                      key={item.id}
                      rank={item.ranking}
                      userName={item.userId.split('-')[0]}
                      totalScore={item.totalScore}
                      quizzesCompleted={item.quizzesCompleted}
                      averageScore={item.averageScore}
                      bestStreak={item.bestStreak}
                      isCurrentUser={currentUserId === item.userId}
                    />
                  ))}
                  {!leaderboard?.length && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No leaderboard data found. Be the first to complete a quiz!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing top {leaderboard.length} users
              </div>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span>Updated in real-time</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Weekly Challenge</CardTitle>
                  <CardDescription>
                    This week's special challenge and top performers
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex gap-1">
                  <Calendar className="h-4 w-4" />
                  {weeklyChallenge?.timeRemaining ? `Ends in: ${weeklyChallenge.timeRemaining}` : "Current Challenge"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {weeklyChallenge ? (
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    {weeklyChallenge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {weeklyChallenge.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {weeklyChallenge.category}
                      </Badge>
                      <Badge variant="secondary">
                        {weeklyChallenge.difficulty}
                      </Badge>
                    </div>
                    <Button size="sm">Take Challenge</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active challenges this week. Check back soon!
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Weekly Leaderboard</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-center">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Quizzes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.slice(0, 5).map((item: any, index: number) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">
                          <RankIcon rank={index + 1} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`https://avatar.vercel.sh/${item.userId.split('-')[0]}`} />
                              <AvatarFallback>{item.userId.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{item.userId.split('-')[0]}</span>
                            {currentUserId === item.userId && (
                              <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.totalScore}</TableCell>
                        <TableCell className="text-center">{item.quizzesCompleted}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Monthly Champions</CardTitle>
                  <CardDescription>
                    Top performers for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {leaderboard.slice(0, 3).map((item: any, index: number) => (
                  <Card key={item.id} className={`
                    ${index === 0 ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' : ''}
                    ${index === 1 ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700' : ''}
                    ${index === 2 ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' : ''}
                  `}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="relative mb-2">
                        <Avatar className="h-16 w-16 mb-1">
                          <AvatarImage src={`https://avatar.vercel.sh/${item.userId.split('-')[0]}`} />
                          <AvatarFallback>{item.userId.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          {index === 0 && <Trophy className="h-8 w-8 text-yellow-500" />}
                          {index === 1 && <Medal className="h-7 w-7 text-gray-400" />}
                          {index === 2 && <Medal className="h-7 w-7 text-amber-600" />}
                        </div>
                      </div>
                      <div className="font-semibold text-lg">{item.userId.split('-')[0]}</div>
                      {currentUserId === item.userId && (
                        <Badge variant="outline" className="mt-1">You</Badge>
                      )}
                      <div className="text-muted-foreground text-sm mt-2">Score: {item.totalScore}</div>
                      <div className="mt-1 text-sm">
                        <span className="flex items-center justify-center gap-1 mt-1">
                          <Award className="h-4 w-4 text-green-500" />
                          {item.quizzesCompleted} quizzes completed
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Monthly Leaderboard</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-center">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Avg. Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.slice(0, 10).map((item: any, index: number) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`https://avatar.vercel.sh/${item.userId.split('-')[0]}`} />
                              <AvatarFallback>{item.userId.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{item.userId.split('-')[0]}</span>
                            {currentUserId === item.userId && (
                              <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.totalScore}</TableCell>
                        <TableCell className="text-center">{item.averageScore}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}