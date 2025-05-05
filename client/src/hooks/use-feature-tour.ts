import { useState, useEffect } from 'react';
import { STATUS } from 'react-joyride';

// Interface for the tour step
export interface TourStep {
  target: string;
  content: string;
  title?: string;
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' | 'auto' | 'center';
  disableBeacon?: boolean;
}

export type TourName = 'dashboard' | 'create-quiz' | 'quiz-taking';

// Local storage keys
const TOUR_COMPLETED_KEY = 'quizgenius_tour_completed';
const TOUR_SKIPPED_KEY = 'quizgenius_tour_skipped';

export const useFeatureTour = (tourName: TourName = 'dashboard') => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  // Preset tour steps for different tours
  const dashboardTourSteps: TourStep[] = [
    {
      target: '.feature-tour-dashboard',
      content: 'Welcome to QuizGenius! This is your personal dashboard where you can manage all your quizzes and see your progress.',
      title: 'Dashboard Overview',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '.feature-tour-create-quiz',
      content: 'Start creating your own quiz with our AI-powered quiz generator or from scratch.',
      title: 'Create New Quiz',
      placement: 'bottom'
    },
    {
      target: '.feature-tour-stats',
      content: 'Track your quiz statistics here. See how many quizzes you\'ve created and their details.',
      title: 'Quiz Statistics',
      placement: 'top'
    }
  ];

  const createQuizTourSteps: TourStep[] = [
    {
      target: '.feature-tour-create-form',
      content: 'This is where you can create a new quiz. You can generate quizzes using AI or create them manually.',
      title: 'Create Quiz',
      disableBeacon: true
    },
    {
      target: '.feature-tour-topics',
      content: 'Select a topic for your quiz. Choose something you\'re interested in!',
      title: 'Quiz Topic'
    },
    {
      target: '.feature-tour-difficulty',
      content: 'Set the difficulty level of your quiz to match your expertise.',
      title: 'Difficulty Level'
    },
    {
      target: '.feature-tour-generate',
      content: 'Click here to generate your quiz with AI or continue to create it manually.',
      title: 'Generate Quiz'
    }
  ];

  const quizTakingTourSteps: TourStep[] = [
    {
      target: '.feature-tour-quiz',
      content: 'This is the quiz interface. Answer the questions and track your progress.',
      title: 'Taking a Quiz',
      disableBeacon: true
    },
    {
      target: '.feature-tour-timer',
      content: 'Watch the timer to make sure you complete the quiz in time.',
      title: 'Quiz Timer'
    },
    {
      target: '.feature-tour-next',
      content: 'After selecting your answer, click Next to proceed to the following question.',
      title: 'Navigation'
    }
  ];

  // Determine the appropriate tour steps based on the tour name
  useEffect(() => {
    switch (tourName) {
      case 'dashboard':
        setSteps(dashboardTourSteps);
        break;
      case 'create-quiz':
        setSteps(createQuizTourSteps);
        break;
      case 'quiz-taking':
        setSteps(quizTakingTourSteps);
        break;
      default:
        setSteps(dashboardTourSteps);
    }
  }, [tourName]);

  // Check if tour should run based on local storage settings
  useEffect(() => {
    try {
      const tourCompleted = localStorage.getItem(`${TOUR_COMPLETED_KEY}_${tourName}`);
      const tourSkipped = localStorage.getItem(`${TOUR_SKIPPED_KEY}_${tourName}`);
      
      // Only start tour if localStorage is accessible and tour hasn't been completed/skipped
      if (!tourCompleted && !tourSkipped) {
        // Delay tour start to allow page to fully render
        const timer = setTimeout(() => {
          setRun(true);
        }, 2000); // Increased delay to ensure all elements load
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      // If localStorage is not available, don't start the tour
      console.log("Failed to access localStorage for tour state:", error);
    }
  }, [tourName]);

  // Function to handle tour status changes
  const handleTourCallback = (data: { status?: string; action?: string; type?: string; index?: number }) => {
    const { status, action, index } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as STATUS)) {
      setRun(false);
      
      try {
        if (status === STATUS.FINISHED) {
          localStorage.setItem(`${TOUR_COMPLETED_KEY}_${tourName}`, 'true');
        } else if (status === STATUS.SKIPPED) {
          localStorage.setItem(`${TOUR_SKIPPED_KEY}_${tourName}`, 'true');
        }
      } catch (error) {
        console.log("Failed to store tour status:", error);
      }
    } else if (action === 'next' && typeof index === 'number') {
      setStepIndex(index + 1);
    } else if (action === 'prev' && typeof index === 'number') {
      setStepIndex(index - 1);
    }
  };

  // Function to start the tour manually
  const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  // Function to reset tour status (for help button)
  const resetTourStatus = () => {
    try {
      localStorage.removeItem(`${TOUR_COMPLETED_KEY}_${tourName}`);
      localStorage.removeItem(`${TOUR_SKIPPED_KEY}_${tourName}`);
      startTour();
    } catch (error) {
      console.log("Failed to reset tour status:", error);
      // Still try to start the tour even if localStorage fails
      startTour();
    }
  };

  return {
    run,
    stepIndex,
    steps,
    handleTourCallback,
    startTour,
    resetTourStatus
  };
};