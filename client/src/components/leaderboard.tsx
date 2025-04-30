import { useQuery } from "@tanstack/react-query";
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
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardItemProps {
  rank: number;
  userName: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  bestStreak: number;
  isCurrentUser: boolean;
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
      <TableCell className="text-center">{averageScore}</TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          {bestStreak}
          {bestStreak >= 5 && <Award className="h-4 w-4 text-yellow-500" />}
        </div>
      </TableCell>
    </TableRow>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function Leaderboard({ currentUserId }: { currentUserId?: string }) {
  const { data: leaderboard = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/leaderboard"],
    enabled: true,
  });

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Global Leaderboard</CardTitle>
        <CardDescription>
          See how you rank against other quiz takers worldwide
        </CardDescription>
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
    </Card>
  );
}