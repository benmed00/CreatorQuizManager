import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuizStore } from "@/store/quiz-store";
import { useStore } from "@/store/auth-store";
import QuizQuestionAnimated from "@/components/quiz-question-animated";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Quiz, Question } from "@shared/schema";

export default function QuizPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { user } = useStore();
  const {
    activeQuiz,
    currentQuestions,
    userAnswers,
    currentQuestionIndex,
    timeRemaining,
    quizStarted,
    quizCompleted,
    setActiveQuiz,
    setQuestions,
    setCurrentQuestionIndex,
    setUserAnswer,
    startQuiz,
    completeQuiz,
    resetQuiz,
    decrementTimer
  } = useQuizStore();

  // Format the time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        decrementTimer();
      }, 1000);
    } else if (quizStarted && timeRemaining === 0 && !quizCompleted) {
      // Time's up! Submit the quiz
      handleSubmitQuiz();
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [quizStarted, quizCompleted, timeRemaining]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (!quizCompleted) {
        resetQuiz();
      }
    };
  }, []);

  // Fetch quiz details
  const { data: quiz, isLoading: isLoadingQuiz } = useQuery<Quiz>({
    queryKey: [`/api/quizzes/${id}`],
    enabled: !!id && !activeQuiz,
  });
  
  // Set active quiz when data is available
  useEffect(() => {
    if (quiz && !activeQuiz) {
      console.log("Setting active quiz:", quiz.title);
      setActiveQuiz(quiz);
    }
  }, [quiz, activeQuiz, setActiveQuiz]);

  // Fetch quiz questions
  const { data: questions, isLoading: isLoadingQuestions } = useQuery<Question[]>({
    queryKey: [`/api/quizzes/${id}/questions`],
    enabled: !!id && !currentQuestions.length,
  });
  
  // Set questions when data is available
  useEffect(() => {
    if (questions && questions.length > 0 && currentQuestions.length === 0) {
      console.log("Questions loaded:", questions.length);
      
      // Make sure the quiz title is included in each question
      if (quiz) {
        // Ensure each question has the quiz title
        const questionsWithTitle = questions.map(question => ({
          ...question,
          quizTitle: quiz.title // Add the quiz title to each question
        }));
        setQuestions(questionsWithTitle);
      } else {
        setQuestions(questions);
      }
      
      // Reset question index whenever we load new questions
      setCurrentQuestionIndex(0);
    }
  }, [questions, quiz, currentQuestions.length, setQuestions, setCurrentQuestionIndex]);
  
  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async () => {
      // Safety check - don't submit if we haven't properly started the quiz
      if (!quizStarted || currentQuestions.length === 0) {
        throw new Error("Quiz not properly started");
      }
      
      console.log("Submitting quiz with answers:", userAnswers);
      
      const response = await apiRequest("POST", `/api/quizzes/${id}/submit`, {
        userId: user?.id,
        answers: userAnswers
      });
      return response.json();
    },
    onSuccess: (data) => {
      completeQuiz();
      setLocation(`/results/${data.resultId}`);
    },
    onError: (error) => {
      toast({
        title: "Error submitting quiz",
        description: error.message || "Could not submit your answers",
        variant: "destructive",
      });
    }
  });

  const handleStartQuiz = () => {
    // Make sure we've loaded questions before starting the quiz
    if (currentQuestions.length === 0) {
      toast({
        title: "Loading Questions",
        description: "Please wait while we prepare your quiz...",
      });
      return;
    }
    
    startQuiz();
    console.log("Quiz started with", currentQuestions.length, "questions");
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // This is the last question, submit the quiz
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleExitQuiz = () => {
    // Confirm before exiting
    if (window.confirm("Are you sure you want to exit the quiz? Your progress will be lost.")) {
      resetQuiz();
      setLocation("/dashboard");
    }
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setUserAnswer(questionId, answerId);
  };

  const handleSubmitQuiz = () => {
    // Check if all questions have been answered
    const unansweredCount = userAnswers.filter(a => a.answerId === null).length;
    
    if (unansweredCount > 0) {
      toast({
        title: `${unansweredCount} question${unansweredCount > 1 ? 's' : ''} unanswered`,
        description: "Are you sure you want to submit? You can go back and review your answers.",
        variant: "destructive",
        action: (
          <Button 
            onClick={() => submitQuizMutation.mutate()}
            variant="outline"
            className="bg-white text-red-600 border-red-600 hover:bg-red-50"
          >
            Submit Anyway
          </Button>
        )
      });
    } else {
      submitQuizMutation.mutate();
    }
  };

  const isLoading = isLoadingQuiz || isLoadingQuestions || !quiz || !questions;
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted && quiz) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white dark:bg-[#1e1e1e] shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              {quiz.title}
            </h1>
            <div className="text-center mb-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">{quiz.description}</p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium">{quiz.questionCount}</span> questions
                </div>
                <div>
                  <span className="font-medium">{quiz.timeLimit}</span> minutes
                </div>
                <div>
                  <span className="font-medium capitalize">{quiz.difficulty}</span> difficulty
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4 mb-8">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Instructions:</h3>
              <ul className="list-disc pl-5 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>You have {quiz.timeLimit} minutes to complete the quiz</li>
                <li>There are {quiz.questionCount} questions in total</li>
                <li>You can navigate between questions using the previous/next buttons</li>
                <li>Your progress will be saved as you go</li>
                <li>Submit your quiz before the timer runs out</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleStartQuiz}
                size="lg"
                className="px-8 py-6 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  // Make sure we have a proper Question with all required properties
  const currentQuestion = currentQuestions[currentQuestionIndex] as Question | undefined || {} as Question;
  
  // If questions exist and we've started but current index doesn't yield a question,
  // reset to first question
  if (currentQuestions.length > 0 && !currentQuestion.id && quizStarted) {
    console.log("Resetting to first question");
    // Set up the first question
    setCurrentQuestionIndex(0);
  }
  
  const selectedAnswer = currentQuestion?.id ? 
    userAnswers.find(a => a.questionId === currentQuestion.id)?.answerId || null : 
    null;
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <QuizQuestion
        question={currentQuestion}
        index={currentQuestionIndex}
        totalQuestions={currentQuestions.length}
        timeRemaining={formatTimeRemaining()}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={selectedAnswer}
        onNext={handleNextQuestion}
        onPrevious={handlePreviousQuestion}
        onExit={handleExitQuiz}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === currentQuestions.length - 1}
      />
    </div>
  );
}
