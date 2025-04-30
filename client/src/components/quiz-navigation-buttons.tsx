import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface QuizNavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isAnswered: boolean;
}

export default function QuizNavigationButtons({
  onPrevious,
  onNext,
  isFirst,
  isLast,
  isAnswered
}: QuizNavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center w-full">
      <motion.div
        whileHover={!isFirst ? { x: -3 } : {}}
        whileTap={!isFirst ? { scale: 0.95 } : {}}
      >
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#222]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ x: isLast ? 0 : 3 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnswered ? 
          { 
            y: [0, -5, 0],
            transition: { 
              duration: 0.5,
              repeat: 1,
              repeatType: "reverse"
            }
          } : {}
        }
      >
        <Button
          onClick={onNext}
          className={`inline-flex items-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isAnswered ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'}`}
        >
          {isLast ? (
            <>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={isAnswered ? { opacity: 1, scale: 1 } : {}}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Quiz
              </motion.span>
              {!isAnswered && "Submit"}
            </>
          ) : (
            <>
              {isAnswered ? "Continue" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}