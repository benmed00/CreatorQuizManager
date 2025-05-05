import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HelpCircle, Info, PlayCircle, FileText } from 'lucide-react';
import { useFeatureTour } from '@/hooks/use-feature-tour';
import { useLocation } from 'wouter';

interface HelpButtonProps {
  className?: string;
}

export const HelpButton = ({ className }: HelpButtonProps) => {
  const { startTour } = useFeatureTour();
  const [, navigate] = useLocation();

  // Navigate to documentation
  const goToDocs = () => {
    navigate('/docs');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full feature-tour-help ${className}`}
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={startTour} className="cursor-pointer">
          <PlayCircle className="mr-2 h-4 w-4" />
          <span>Start Feature Tour</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={goToDocs} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>Documentation</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/contact')} className="cursor-pointer">
          <Info className="mr-2 h-4 w-4" />
          <span>Contact Support</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpButton;