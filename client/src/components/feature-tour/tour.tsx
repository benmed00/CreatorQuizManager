import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useFeatureTour } from '@/hooks/use-feature-tour';
import { useLocation } from 'wouter';

// Define tour steps based on the current route
const getTourSteps = (currentPath: string): Step[] => {
  // Default dashboard tour steps
  const dashboardSteps: Step[] = [
    {
      target: '.feature-tour-dashboard',
      content: 'Welcome to QuizGenius! This is your dashboard where you can see an overview of your quizzes and performance.',
      disableBeacon: true,
      placement: 'center',
      title: 'Welcome to QuizGenius'
    },
    {
      target: '.feature-tour-create-quiz',
      content: 'Click here to create a new quiz. You can create quizzes using our AI generator or manually.',
      disableBeacon: true,
      title: 'Create Quizzes'
    },
    {
      target: '.feature-tour-analytics',
      content: 'View detailed analytics about quiz performance, participation trends, and user progress.',
      disableBeacon: true,
      title: 'Analytics'
    },
    {
      target: '.feature-tour-my-quizzes',
      content: 'Access all your created quizzes here. You can edit, share, or delete them.',
      disableBeacon: true,
      title: 'My Quizzes'
    },
    {
      target: '.feature-tour-profile',
      content: 'Update your profile settings, preferences, and account information.',
      disableBeacon: true,
      title: 'Profile Settings'
    },
    {
      target: '.feature-tour-help',
      content: 'Need help? You can always restart this tour from the help menu or access our documentation.',
      disableBeacon: true,
      title: 'Help & Support'
    }
  ];

  // Route-specific steps
  switch (currentPath) {
    case '/create-quiz':
      return [
        {
          target: '.feature-tour-quiz-type',
          content: 'Choose whether to create a quiz with AI assistance or manually.',
          disableBeacon: true,
          title: 'Quiz Creation Type'
        },
        {
          target: '.feature-tour-quiz-settings',
          content: 'Configure quiz settings such as time limits, question types, and difficulty.',
          disableBeacon: true,
          title: 'Quiz Settings'
        },
        {
          target: '.feature-tour-question-editor',
          content: 'Create and edit questions with our intuitive editor.',
          disableBeacon: true,
          title: 'Question Editor'
        }
      ];
    case '/analytics':
      return [
        {
          target: '.feature-tour-analytics-overview',
          content: 'Here you can see an overview of all your quiz analytics.',
          disableBeacon: true,
          title: 'Analytics Overview'
        },
        {
          target: '.feature-tour-performance-metrics',
          content: 'These charts show key performance metrics for your quizzes.',
          disableBeacon: true,
          title: 'Performance Metrics'
        },
        {
          target: '.feature-tour-export-data',
          content: 'Export your analytics data in various formats for further analysis.',
          disableBeacon: true,
          title: 'Export Data'
        }
      ];
    case '/my-quizzes':
      return [
        {
          target: '.feature-tour-quiz-list',
          content: 'Here are all the quizzes you\'ve created.',
          disableBeacon: true,
          title: 'Quiz List'
        },
        {
          target: '.feature-tour-quiz-actions',
          content: 'Use these actions to edit, share, duplicate, or delete your quizzes.',
          disableBeacon: true,
          title: 'Quiz Actions'
        },
        {
          target: '.feature-tour-quiz-filters',
          content: 'Filter and sort your quizzes to find what you\'re looking for quickly.',
          disableBeacon: true,
          title: 'Quiz Filters'
        }
      ];
    // Default to dashboard steps for other routes
    default:
      return dashboardSteps;
  }
};

interface FeatureTourProps {
  className?: string;
}

export const FeatureTour = ({ className }: FeatureTourProps) => {
  const [location] = useLocation();
  const { showTour, tourStep, setTourStep, completeTour } = useFeatureTour();
  const [steps, setSteps] = useState<Step[]>([]);

  // Update steps when location changes
  useEffect(() => {
    setSteps(getTourSteps(location));
  }, [location]);

  // Handle tour callbacks
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    
    // Update current step
    setTourStep(index);
    
    // Handle tour completion
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      completeTour();
    }
  };

  if (!showTour || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={showTour}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      stepIndex={tourStep}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#0f172a',
          textColor: '#334155',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
        },
        buttonClose: {
          display: 'none',
        },
        buttonBack: {
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
          fontSize: 14,
        },
        buttonNext: {
          backgroundColor: '#0f172a',
          fontSize: 14,
        },
        buttonSkip: {
          color: '#94a3b8',
          fontSize: 14,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip tour',
      }}
    />
  );
};

export default FeatureTour;