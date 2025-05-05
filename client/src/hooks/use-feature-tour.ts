import { useState, useEffect } from 'react';
import { useStore } from '@/store/auth-store';

// Key for storing tour completion in localStorage
const TOUR_COMPLETED_KEY = 'quizgenius_tour_completed';

export const useFeatureTour = () => {
  // Get the current user from auth store
  const { user } = useStore();
  
  // Tour state
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  
  // Check localStorage on initial load to see if user has completed the tour
  useEffect(() => {
    // Only show tour to authenticated users who haven't completed it
    if (user) {
      const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
      if (!tourCompleted) {
        // Delay showing the tour to allow the page to fully render
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  // Mark tour as completed
  const completeTour = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    setShowTour(false);
  };

  // Reset tour state to start over
  const resetTour = () => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    setTourStep(0);
    setShowTour(true);
  };

  // Start tour manually (e.g., from help menu)
  const startTour = () => {
    setTourStep(0);
    setShowTour(true);
  };

  return {
    showTour,
    tourStep,
    setTourStep,
    completeTour,
    resetTour,
    startTour
  };
};