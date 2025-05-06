import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Home, HelpCircle, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@shared/schema";
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

interface QuizQuestionProps {
  question: Question;
  index: number;
  totalQuestions: number;
  timeRemaining: string;
  onAnswerSelect: (questionId: number, answerId: number) => void;
  selectedAnswer: number | null;
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

export default function QuizQuestion({
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
}: QuizQuestionProps) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (value: string) => {
    if (question && question.id !== undefined) {
      onAnswerSelect(question.id, parseInt(value));
    } else {
      console.error("Cannot select answer: question is undefined or missing ID");
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
      <Card className="bg-white dark:bg-[#1e1e1e] shadow sm:rounded-lg overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {"Quiz Question"}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm mr-2">
              <Badge className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
                <Clock className="h-4 w-4 mr-1.5" />
                {timeRemaining}
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExit}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Exit Quiz</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex mb-5">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Question {index + 1} of {totalQuestions}
            </div>
            <div className="ml-auto">
              <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${((index + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {question?.text || "Loading question..."}
              </h4>
              
              <div className="flex flex-wrap gap-3 mt-1">
                {/* Explanation/context with asterisk tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        <span>Context *</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm shadow-lg rounded-md">
                      <p>
                        This question refers to Angular's router configuration approach. Understanding how route guards work is essential for controlling access to routes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Documentation link */}
                <a 
                  href="https://angular.io/guide/router" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:underline"
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
                </a>
                
                {/* Report error button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-0 h-auto inline-flex items-center text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                  onClick={() => setReportDialogOpen(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Report Issue</span>
                </Button>
              </div>
            </div>
            
            {question?.codeSnippet && (
              <div className="bg-gray-800 text-gray-200 p-4 rounded-md mb-4 font-mono text-sm overflow-auto">
                <pre>{question.codeSnippet}</pre>
              </div>
            )}
            
            <RadioGroup 
              value={selectedAnswer?.toString() || ""} 
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {question?.options && Array.isArray(question.options) && question.options.length > 0 ? (
                question.options.map((option, optionIndex) => (
                  <div 
                    key={option.id} 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                      ${selectedAnswer === option.id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 dark:border-primary-700' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}
                  >
                    <RadioGroupItem 
                      value={option.id.toString()} 
                      id={`option-${option.id}`} 
                      className="h-4 w-4 text-primary-600"
                    />
                    <div className="ml-3 flex items-start">
                      <span 
                        className={`mr-2 flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                        ${selectedAnswer === option.id 
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-800/30 dark:text-primary-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <Label 
                        htmlFor={`option-${option.id}`}
                        className={`cursor-pointer flex-1 ${selectedAnswer === option.id 
                          ? 'text-primary-700 dark:text-primary-400 font-medium' 
                          : 'text-gray-800 dark:text-gray-200'}`}
                      >
                        {option.text}
                      </Label>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 border border-yellow-300 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-yellow-700 dark:text-yellow-500 text-sm">
                    No options available for this question. Please report this issue.
                  </p>
                </div>
              )}
            </RadioGroup>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between p-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#222]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            className="inline-flex items-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            {isLast ? "Submit" : "Next"}
            {!isLast && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>

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