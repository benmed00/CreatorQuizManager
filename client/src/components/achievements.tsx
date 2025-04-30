import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Trophy, 
  Zap, 
  Star, 
  Compass, 
  LucideIcon 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Achievement {
  id: number;
  name: string;
  description: string;
  criteria: string;
  icon: string;
  createdAt: string;
  earnedAt?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  earned: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  trophy: Trophy,
  zap: Zap,
  star: Star,
  compass: Compass,
};

function AchievementCard({ achievement, earned }: AchievementCardProps) {
  const IconComponent = iconMap[achievement.icon] || Award;
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      earned ? "border-yellow-500/50" : "border-muted opacity-70 grayscale"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md">{achievement.name}</CardTitle>
          <div 
            className={cn(
              "p-2 rounded-full", 
              earned ? "bg-yellow-500/20" : "bg-muted"
            )}
          >
            <IconComponent className={cn(
              "h-5 w-5", 
              earned ? "text-yellow-500" : "text-muted-foreground"
            )} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs">{achievement.description}</CardDescription>
        <div className="flex items-center justify-between mt-4">
          <Badge variant={earned ? "default" : "outline"}>
            {earned ? "Earned" : "Locked"}
          </Badge>
          {earned && (
            <span className="text-xs text-muted-foreground">
              {new Date(achievement.earnedAt!).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[180px] w-full" />
      ))}
    </div>
  );
}

export default function Achievements({ userId }: { userId: string }) {
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const { data: userAchievements, isLoading: isLoadingUserAchievements } = useQuery({
    queryKey: [`/api/achievements/user/${userId}`],
    enabled: !!userId,
  });

  const { data: allAchievements, isLoading: isLoadingAllAchievements } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: true,
  });

  const isLoading = isLoadingUserAchievements || isLoadingAllAchievements;

  if (isLoading) {
    return <AchievementsSkeleton />;
  }

  // Create a map of earned achievements
  const earnedAchievementsMap = new Map(
    userAchievements?.map((ua: any) => [ua.achievementId, ua]) || []
  );

  // Prepare achievement list with earned status
  const achievements = allAchievements?.map((achievement: Achievement) => {
    const earned = earnedAchievementsMap.has(achievement.id);
    return {
      ...achievement,
      earned,
      earnedAt: earned ? earnedAchievementsMap.get(achievement.id).earnedAt : undefined,
    };
  });

  // Filter achievements based on selected tab
  const filteredAchievements = achievements?.filter((achievement: Achievement & { earned: boolean }) => {
    if (filter === 'all') return true;
    if (filter === 'earned') return achievement.earned;
    if (filter === 'locked') return !achievement.earned;
    return true;
  });

  const earnedCount = achievements?.filter((a: any) => a.earned).length || 0;
  const totalCount = achievements?.length || 0;
  const earnedPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Achievements</CardTitle>
        <CardDescription>
          You've earned {earnedCount} out of {totalCount} achievements ({earnedPercentage}%)
        </CardDescription>
        <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {filteredAchievements?.map((achievement: Achievement & { earned: boolean }) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                earned={achievement.earned} 
              />
            ))}
            {filteredAchievements?.length === 0 && (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                No achievements found in this category.
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}