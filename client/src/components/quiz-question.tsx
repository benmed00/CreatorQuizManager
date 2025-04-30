import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Home, HelpCircle, X } from "lucide-react";
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

interface QuizQuestionProps {
  question: Question;
  index: number;
  totalQuestions: number;
  timeRemaining: string;
  onAnswerSelect: (questionId: number, answerId: number) => void;
  selectedAnswer: number | null;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void; // Added exit handler
  isFirst: boolean;
  isLast: boolean;
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
  const handleAnswerChange = (value: string) => {
    onAnswerSelect(question.id, parseInt(value));
  };

  return (
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
            
            {/* Explanation/context with asterisk tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 mt-1">
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
            {question?.options?.map((option) => (
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
                <Label 
                  htmlFor={`option-${option.id}`}
                  className={`ml-3 cursor-pointer flex-1 ${selectedAnswer === option.id 
                    ? 'text-primary-700 dark:text-primary-400 font-medium' 
                    : 'text-gray-800 dark:text-gray-200'}`}
                >
                  {option.text}
                </Label>
              </div>
            ))}
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
  );
}