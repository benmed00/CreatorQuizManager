import { useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Share } from "lucide-react";
import { useQuizStore } from "@/store/quiz-store";
import { ShareButton } from "@/components/share";
import QuizResultsActions from "@/components/quiz-results-actions";

interface QuizResultData {
  id: number;
  userId: string;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: string;
  completed: boolean;
  createdAt: string;
  questions: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    codeSnippet?: string;
  }>;
}

export default function Results() {
  const { id } = useParams();
  const { toast } = useToast();
  const { resetQuiz } = useQuizStore();
  const resultRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Reset quiz state when viewing results
  useEffect(() => {
    resetQuiz();
  }, []);

  // Fetch quiz result
  const { data: result, isLoading, error } = useQuery<QuizResultData>({
    queryKey: [`/api/results/${id}`],
    enabled: !!id,
  });
  
  // Handle error
  useEffect(() => {
    if (error) {
      toast({
        title: t("error_loading_results"),
        description: (error as Error).message || t("could_not_load_results"),
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading || !result) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Check if result exists before destructuring
  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg overflow-hidden mb-8">
          <CardContent className="p-6">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t("no_results_found")}
            </p>
            <Button asChild>
              <Link href="/my-quizzes">{t("back_to_quizzes")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Safely destructure the result
  const { 
    score = 0, 
    totalQuestions: rawTotalQuestions = 0, 
    correctAnswers: rawCorrectAnswers = 0, 
    quizTitle = "Quiz", 
    timeTaken = "00:00", 
    questions: rawQuestions = [] 
  } = result;
  
  // Process questions to ensure they are valid - filter out any undefined entries
  const questions = rawQuestions.filter(q => q !== undefined && q !== null);
  
  // Recalculate totals based on available data to ensure consistency
  const totalQuestions = rawTotalQuestions || questions.length;
  
  // Calculate correct answers from questions array if the value appears to be incorrect
  const correctAnswers = rawCorrectAnswers || questions.filter(q => q?.isCorrect).length;
  
  // Prevent division by zero
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Determine the message based on score
  let message = "";
  let messageClass = "";
  
  if (scorePercentage >= 90) {
    message = t("score_excellent");
    messageClass = "text-green-600 dark:text-green-400";
  } else if (scorePercentage >= 70) {
    message = t("score_great");
    messageClass = "text-green-600 dark:text-green-400";
  } else if (scorePercentage >= 50) {
    message = t("score_good");
    messageClass = "text-yellow-600 dark:text-yellow-400";
  } else {
    message = t("score_practice");
    messageClass = "text-red-600 dark:text-red-400";
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg overflow-hidden mb-8" ref={resultRef}>
        <CardHeader className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl">{t("quiz_results")}: {quizTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {scorePercentage}%
              </span>
            </div>
            <h2 className={`text-xl font-semibold ${messageClass}`}>{message}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t("answered_correctly", { correctAnswers, totalQuestions })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("time_taken")}: {timeTaken}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t("performance_overview")}
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t("score")}</span>
                  <span className="font-medium">{scorePercentage}%</span>
                </div>
                <Progress value={scorePercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium">{t("correct_answers")}</span>
                  </div>
                  <p className="ml-7 text-2xl font-bold text-green-600 dark:text-green-400">
                    {correctAnswers}
                  </p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                    <span className="font-medium">{t("incorrect_answers")}</span>
                  </div>
                  <p className="ml-7 text-2xl font-bold text-red-600 dark:text-red-400">
                    {totalQuestions - correctAnswers}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t("question_review")}
            </h3>
            
            <div className="space-y-4">
              {questions.map((question, index: number) => (
                <Card key={question.id} className="border dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start mb-2">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        question.isCorrect 
                          ? "bg-green-100 dark:bg-green-900/30" 
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        {question.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {t("question")} {index + 1}: {question.text}
                        </p>
                      </div>
                    </div>
                    
                    {question.codeSnippet && (
                      <div className="bg-gray-800 text-gray-200 p-3 rounded-md my-2 font-mono text-xs overflow-auto">
                        <pre>{question.codeSnippet}</pre>
                      </div>
                    )}
                    
                    <div className="mt-3 pl-9">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t("your_answer")}:</p>
                      <p className={`text-sm ${
                        question.isCorrect 
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {question.userAnswer}
                      </p>
                      
                      {!question.isCorrect && (
                        <>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-1">
                            Correct answer:
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {question.correctAnswer}
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-[#111] border-t border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
            <ShareButton 
              title={`I scored ${scorePercentage}% on ${quizTitle}!`}
              description={`I got ${correctAnswers} of ${totalQuestions} questions correct in ${timeTaken}. ${message}`}
              hashtags={["QuizGenius", "QuizResult"]}
              variant="outline"
            />
            <QuizResultsActions 
              resultId={result.id} 
              quizTitle={quizTitle} 
              resultRef={resultRef} 
            />
          </div>
          <Button asChild>
            <Link href="/create-quiz">Create a New Quiz</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
