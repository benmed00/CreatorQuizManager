import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

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
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  // Show completion animation when an answer is selected
  useEffect(() => {
    if (answered) {
      setShowCompletion(true);
      const timer = setTimeout(() => {
        setShowCompletion(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [answered]);

  return (
    <div className="w-full mb-6 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Question {currentQuestion + 1} of {totalQuestions}
        </div>

        {timeRemaining && (
          <motion.div
            className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center"
            initial={{ opacity: 0.8 }}
            animate={{ 
              opacity: [0.8, 1, 0.8], 
              scale: [1, 1.05, 1] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }}
          >
            <svg 
              className="w-4 h-4 mr-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              strokeWidth="2" 
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <motion.path
                d="M12 6v6l4 2"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
            </svg>
            {timeRemaining}
          </motion.div>
        )}
      </div>

      {/* Progress track */}
      <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Progress bar with animated width */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          initial={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut" 
          }}
        />

        {/* Progress markers */}
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between px-[1px]">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isCompleted = index <= currentQuestion;
            const isCurrent = index === currentQuestion;
            
            return (
              <motion.div
                key={index}
                className={`h-4 w-4 rounded-full absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center ${
                  isCurrent 
                    ? "bg-white dark:bg-gray-900 border-2 border-primary" 
                    : isCompleted 
                      ? "bg-primary" 
                      : "bg-gray-300 dark:bg-gray-600"
                }`}
                style={{ 
                  left: `calc(${(index / (totalQuestions - 1)) * 100}% - 2px)`
                }}
                animate={isCurrent ? {
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{ 
                  duration: 1, 
                  repeat: isCurrent ? Infinity : 0,
                  repeatDelay: 1
                }}
              >
                {isCompleted && !isCurrent && (
                  <CheckCircle className="w-2 h-2 text-white" />
                )}
                {isCurrent && (
                  <motion.div 
                    className="w-1 h-1 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step completion notification */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 text-sm font-medium py-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Answer recorded!</span>
            {currentQuestion < totalQuestions - 1 && (
              <span className="flex items-center">
                Continue to next question <ArrowRight className="ml-1 w-3 h-3" />
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}