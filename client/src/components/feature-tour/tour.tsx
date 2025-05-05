import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useLocation } from 'wouter';
import { useFeatureTour, TourName } from '@/hooks/use-feature-tour';

export const FeatureTour: React.FC = () => {
  const [location] = useLocation();
  const [tourName, setTourName] = useState<TourName>('dashboard');
  
  // Determine which tour to show based on the current route
  useEffect(() => {
    if (location.startsWith('/dashboard')) {
      setTourName('dashboard');
    } else if (location.startsWith('/create-quiz')) {
      setTourName('create-quiz');
    } else if (location.startsWith('/quiz/')) {
      setTourName('quiz-taking');
    }
  }, [location]);

  const { run, steps, stepIndex, handleTourCallback } = useFeatureTour(tourName);

  // Convert our simplified TourStep format to the format required by Joyride
  const joyrideSteps: Step[] = steps.map(step => ({
    target: step.target,
    content: (
      <div>
        {step.title && <h3 className="text-lg font-medium mb-2">{step.title}</h3>}
        <p>{step.content}</p>
      </div>
    ),
    placement: step.placement,
    disableBeacon: step.disableBeacon
  }));

  const handleJoyrideCallback = (data: CallBackProps) => {
    handleTourCallback(data);
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      steps={joyrideSteps}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          textColor: '#374151',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
        spotlight: {
          backgroundColor: 'transparent',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          fontSize: 14,
          padding: '8px 16px',
        },
        buttonBack: {
          marginRight: 10,
          fontSize: 14,
          padding: '8px 16px',
        },
        buttonSkip: {
          color: '#718096',
          fontSize: 14,
        },
      }}
      floaterProps={{
        hideArrow: false,
        disableAnimation: false,
      }}
      locale={{
        last: 'Finish',
        skip: 'Skip tour',
        next: 'Next',
        back: 'Back',
      }}
    />
  );
};