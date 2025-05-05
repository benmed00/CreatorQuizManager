import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, HelpCircle, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup } from "@/components/ui/radio-group";
import { FirestoreQuestion } from "@/lib/firestore-service";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

// Import our new animated components
import QuizProgressBar from "./quiz-progress-bar";
import QuizAnswerOption from "./quiz-answer-option";
import QuizNavigationButtons from "./quiz-navigation-buttons";

interface QuizQuestionAnimatedProps {
  question: FirestoreQuestion;
  index: number;
  totalQuestions: number;
  timeRemaining: string;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  selectedAnswer: string | null;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
  isFirst: boolean;
  isLast: boolean;
}

// Report Dialog component
function ReportDialog({
  open,
  onOpenChange,
  reason,
  onReasonChange,
  onSubmit,
  isSubmitting
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            Report an Issue
          </DialogTitle>
          <DialogDescription>
            Please describe the problem with this question or its answers. Our team will review your feedback.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="report-reason" className="text-sm font-medium">
              What's wrong with this question?
            </Label>
            <Textarea
              id="report-reason"
              placeholder="Explain the issue (e.g., incorrect answer, unclear wording, etc.)"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function QuizQuestionAnimated({
  question,
  index,
  totalQuestions,
  timeRemaining,
  onAnswerSelect,
  selectedAnswer,
  onNext,
  onPrevious,
  onExit,
  isFirst,
  isLast
}: QuizQuestionAnimatedProps) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { toast } = useToast();

  // Reset hasAnswered when question changes
  useEffect(() => {
    setHasAnswered(selectedAnswer !== null);
  }, [selectedAnswer, question.id]);

  const handleAnswerChange = (id: string) => {
    if (question.id) {
      onAnswerSelect(question.id, id);
      setHasAnswered(true);
    }
  };
  
  const handleReportSubmit = () => {
    if (!reportReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your report",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating API call with timeout
    setTimeout(() => {
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting this issue. We'll review it as soon as possible.",
      });
      setReportReason("");
      setReportDialogOpen(false);
      setIsSubmitting(false);
    }, 1000);
    
    // In a real implementation, you would send this data to your API
    console.log("Reporting issue for question:", question.id, "Reason:", reportReason);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-[#1e1e1e] shadow sm:rounded-lg overflow-hidden">
          <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {"Quiz Question"}
              </h3>
            </motion.div>
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex items-center text-sm mr-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      repeatDelay: 5,
                      duration: 0.5
                    }}
                  >
                    <Clock className="h-4 w-4 mr-1.5" />
                  </motion.div>
                  {timeRemaining}
                </Badge>
              </motion.div>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onExit}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Exit Quiz</span>
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Animated Progress Bar */}
            <QuizProgressBar 
              currentQuestion={index}
              totalQuestions={totalQuestions}
              answered={hasAnswered}
              timeRemaining={timeRemaining}
            />
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {question?.text || "Loading question..."}
                </h4>
                
                <div className="flex flex-wrap gap-3 mt-1">
                  {/* Explanation/context with asterisk tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div 
                          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 cursor-help"
                          whileHover={{ scale: 1.05 }}
                        >
                          <HelpCircle className="h-4 w-4 mr-1" />
                          <span>Context *</span>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm shadow-lg rounded-md">
                        <p>
                          This question refers to Angular's router configuration approach. Understanding how route guards work is essential for controlling access to routes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Documentation link */}
                  <motion.a 
                    href="https://angular.io/guide/router" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:underline"
                    whileHover={{ scale: 1.05, x: 2 }}
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                      <path d="M2 2l7.586 7.586"></path>
                      <path d="M11 11l4 4"></path>
                    </svg>
                    <span>Documentation</span>
                  </motion.a>
                  
                  {/* Report error button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-0 h-auto inline-flex items-center text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                      onClick={() => setReportDialogOpen(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span>Report Issue</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
              
              {question?.codeSnippet && (
                <motion.div 
                  className="bg-gray-800 text-gray-200 p-4 rounded-md mb-4 font-mono text-sm overflow-auto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.5 }}
                >
                  <pre>{question.codeSnippet}</pre>
                </motion.div>
              )}
              
              <RadioGroup 
                value={selectedAnswer?.toString() || ""} 
                className="space-y-3"
              >
                <AnimatePresence>
                  {question?.options?.map((option, optionIndex) => (
                    <QuizAnswerOption
                      key={option.id}
                      id={option.id}
                      index={optionIndex}
                      text={option.text}
                      isSelected={selectedAnswer === option.id}
                      onSelect={handleAnswerChange}
                    />
                  ))}
                </AnimatePresence>
              </RadioGroup>
            </motion.div>
          </CardContent>
          
          <CardFooter className="flex justify-between p-6">
            <QuizNavigationButtons
              onPrevious={onPrevious}
              onNext={onNext}
              isFirst={isFirst}
              isLast={isLast}
              isAnswered={hasAnswered}
            />
          </CardFooter>
        </Card>
      </motion.div>

      {/* Use the ReportDialog component */}
      <ReportDialog 
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        reason={reportReason}
        onReasonChange={setReportReason}
        onSubmit={handleReportSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

// Animated clock component
function Clock({ className = "h-4 w-4" }) {
  return (
    <motion.svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <motion.path
        d="M12 6v6l4 2"
        animate={{ 
          rotate: [0, 360] 
        }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ transformOrigin: "12px 12px" }}
      />
    </motion.svg>
  );
}