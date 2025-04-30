import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface QuizProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  answered: boolean; 
  timeRemaining?: string;
}

export default function QuizProgressBar({
  currentQuestion,
  totalQuestions,
  answered,
  timeRemaining
}: QuizProgressBarProps) {
  const progressControls = useAnimation();
  
  // Calculate the progress percentage
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  // Update the animation when the progress changes
  useEffect(() => {
    progressControls.start({
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeOut" }
    });
  }, [progress, progressControls]);
  
  // Add a pulse effect when a question is answered
  useEffect(() => {
    if (answered) {
      progressControls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.3 }
      });
    }
  }, [answered, progressControls]);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Question {currentQuestion + 1} of {totalQuestions}
        </div>
        {timeRemaining && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Time Remaining: {timeRemaining}
          </div>
        )}
      </div>
      
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
          style={{ width: 0 }}
          animate={progressControls}
          initial={{ width: 0 }}
        />
      </div>
      
      {/* Add visual indicators for each question */}
      <div className="mt-2 flex justify-between">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isActive = index === currentQuestion;
          const isCompleted = index < currentQuestion;
          const isCurrent = index === currentQuestion;
          
          return (
            <motion.div
              key={index}
              className={`
                w-3 h-3 rounded-full
                ${isCompleted 
                  ? 'bg-primary-600 dark:bg-primary-500' 
                  : isActive 
                    ? 'bg-primary-500 dark:bg-primary-400' 
                    : 'bg-gray-300 dark:bg-gray-600'}
              `}
              initial={false}
              animate={isCurrent && answered ? {
                scale: [1, 1.5, 1],
                backgroundColor: [
                  'rgba(59, 130, 246, 0.5)', 
                  'rgba(59, 130, 246, 1)', 
                  'rgba(59, 130, 246, 0.7)'
                ]
              } : {}}
              transition={{
                duration: 0.4,
                repeat: 0
              }}
            />
          );
        })}
      </div>
    </div>
  );
}