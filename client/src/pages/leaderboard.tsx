import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/auth-store";
import { Link } from "wouter";
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
import { Award, Trophy, Users } from "lucide-react";
import AchievementNotification from "@/components/achievement-notification";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShareButton } from "@/components/share";

export default function LeaderboardPage() {
  const { user } = useStore();
  const userId = user?.id || '';
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  
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
  
  // Calculate achievement progress
  const achievementCount = userAchievements?.length || 0;
  const totalAchievements = allAchievements?.length || 0;
  const achievementProgress = totalAchievements > 0 
    ? Math.round((achievementCount / totalAchievements) * 100) 
    : 0;
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <CardTitle>Rank</CardTitle>
              <CardDescription>Your global position</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userLeaderboard?.ranking || 'N/A'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Quizzes Completed</CardTitle>
              <CardDescription>Total quizzes taken</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userLeaderboard?.quizzesCompleted || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Award className="h-5 w-5 text-purple-500" />
            <div>
              <CardTitle>Achievement Progress</CardTitle>
              <CardDescription>{achievementCount} of {totalAchievements} unlocked</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={achievementProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rankings & Achievements</h2>
        <ShareButton 
          title="Check out my position on the QuizGenius leaderboard!"
          description={`I'm ranked #${userLeaderboard?.ranking || 'N/A'} globally with ${userLeaderboard?.quizzesCompleted || 0} quizzes completed and an average score of ${userLeaderboard?.averageScore || 0}%. I've also unlocked ${achievementCount} of ${totalAchievements} achievements!`}
          hashtags={["QuizGenius", "Leaderboard", "Learning"]}
          buttonText="Share My Ranking"
          variant="secondary"
        />
      </div>
      
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard" className="mt-6">
          <Leaderboard currentUserId={userId} />
        </TabsContent>
        <TabsContent value="achievements" className="mt-6">
          <Achievements userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}