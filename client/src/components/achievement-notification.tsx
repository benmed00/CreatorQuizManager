import { useEffect } from "react";
import { 
  Award, 
  Trophy, 
  Zap, 
  Star, 
  Compass, 
  LucideIcon 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AchievementNotificationProps {
  achievements: string[];
  onClose: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  "First Quiz": Award,
  "Quiz Master": Trophy,
  "Speed Demon": Zap,
  "Perfect Streak": Star,
  "Knowledge Explorer": Compass,
};

const achievementDescriptions: Record<string, string> = {
  "First Quiz": "Completed your first quiz",
  "Quiz Master": "Score 100% on a quiz",
  "Speed Demon": "Complete a quiz in less than half the allotted time",
  "Perfect Streak": "Complete 5 quizzes with scores above 90%",
  "Knowledge Explorer": "Take quizzes in 3 different categories"
};

export default function AchievementNotification({ 
  achievements, 
  onClose 
}: AchievementNotificationProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!achievements || achievements.length === 0) return;
    
    achievements.forEach((achievement, index) => {
      // Stagger notifications
      setTimeout(() => {
        const IconComponent = iconMap[achievement] || Award;
        
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement}: ${achievementDescriptions[achievement] || ""}`,
          duration: 5000,
        });

        // Close notification when all toasts have been shown
        if (index === achievements.length - 1) {
          setTimeout(onClose, 5000);
        }
      }, index * 1500); // Show each notification 1.5 seconds apart
    });
  }, [achievements, toast, onClose]);

  if (!achievements || achievements.length === 0) return null;

  return null; // The actual notification is handled by the toast system
}

export function AchievementCard({ 
  achievement, 
  description 
}: { 
  achievement: string; 
  description: string;
}) {
  const IconComponent = iconMap[achievement] || Award;

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/5 shadow-md mb-4">
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <div className="bg-yellow-500/20 p-2 rounded-full">
          <IconComponent className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <CardTitle className="text-md">Achievement Unlocked!</CardTitle>
          <CardDescription>You've earned a new achievement</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold">{achievement}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}