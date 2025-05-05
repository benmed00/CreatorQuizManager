import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFeatureTour, TourName } from '@/hooks/use-feature-tour';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpButtonProps {
  className?: string;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ className = '' }) => {
  const [location] = useLocation();
  const tourName: TourName = 
    location.startsWith('/dashboard') 
      ? 'dashboard' 
      : location.startsWith('/create-quiz') 
        ? 'create-quiz' 
        : location.startsWith('/quiz/') 
          ? 'quiz-taking' 
          : 'dashboard';
  
  const { resetTourStatus } = useFeatureTour(tourName);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${className} text-gray-500 hover:text-primary-500`}
            onClick={resetTourStatus}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Start the feature tour</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};