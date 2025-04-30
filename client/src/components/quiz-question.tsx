import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@shared/schema";

interface QuizQuestionProps {
  question: Question;
  index: number;
  totalQuestions: number;
  timeRemaining: string;
  onAnswerSelect: (questionId: number, answerId: number) => void;
  selectedAnswer: number | null;
  onNext: () => void;
  onPrevious: () => void;
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
  isFirst,
  isLast
}: QuizQuestionProps) {
  const handleAnswerChange = (value: string) => {
    onAnswerSelect(question.id, parseInt(value));
  };

  return (
    <Card className="bg-white dark:bg-[#1e1e1e] shadow sm:rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {question.quizTitle || "Quiz Question"}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Badge className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium">
              <Clock className="h-4 w-4 mr-1.5" />
              {timeRemaining} remaining
            </Badge>
          </div>
        </div>
        
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
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {question.text}
          </h4>
          
          {question.codeSnippet && (
            <div className="bg-gray-800 text-gray-200 p-4 rounded-md mb-4 font-mono text-sm overflow-auto">
              <pre>{question.codeSnippet}</pre>
            </div>
          )}
          
          <RadioGroup 
            value={selectedAnswer?.toString() || ""} 
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div 
                key={option.id} 
                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#222] transition-colors"
              >
                <RadioGroupItem 
                  value={option.id.toString()} 
                  id={`option-${option.id}`} 
                  className="h-4 w-4 text-primary-600"
                />
                <Label 
                  htmlFor={`option-${option.id}`}
                  className="ml-3 text-gray-800 dark:text-gray-200 cursor-pointer flex-1"
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