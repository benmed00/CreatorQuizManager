import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuizStore } from "@/store/quiz-store";
import { useStore } from "@/store/auth-store";
import QuizQuestionAnimated from "@/components/quiz-question-animated";
import QuizSkeleton from "@/components/quiz-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { FirestoreQuiz, FirestoreQuestion, FirestoreQuizResult } from "@/lib/firestore-service";
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

  // Timer effect - needs to be at the component top level
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        decrementTimer();
      }, 1000);
    } else if (quizStarted && timeRemaining === 0 && !quizCompleted) {
      // Time's up! Submit the quiz
      handleSubmitQuiz();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, quizCompleted, timeRemaining, decrementTimer]);

  // Clean up when component unmounts - needs to be at the component top level
  useEffect(() => {
    return () => {
      if (!quizCompleted) {
        resetQuiz();
      }
    };
  }, [quizCompleted, resetQuiz]);
  
  // Keyboard shortcuts for quiz navigation
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if we're actively taking the quiz
      if (!quizStarted || quizCompleted) return;
      
      switch (e.key) {
        case "ArrowRight":
        case "n":
          // Navigate to next question if not on the last question
          if (currentQuestionIndex < currentQuestions.length - 1) {
            handleNextQuestion();
          }
          break;
        case "ArrowLeft":
        case "p":
          // Navigate to previous question if not on the first question
          if (currentQuestionIndex > 0) {
            handlePreviousQuestion();
          }
          break;
        case "1":
        case "2":
        case "3":
        case "4":
          // Select answer options with number keys
          const numericKey = parseInt(e.key);
          if (numericKey >= 1 && numericKey <= 4) {
            const currentQuestion = currentQuestions[currentQuestionIndex];
            if (currentQuestion?.options && currentQuestion.options.length >= numericKey) {
              const option = currentQuestion.options[numericKey - 1];
              if (option && currentQuestion.id && option.id) {
                handleAnswerSelect(currentQuestion.id, option.id);
              }
            }
          }
          break;
        case "s":
          // Submit quiz with 's' key if on the last question
          if (currentQuestionIndex === currentQuestions.length - 1) {
            handleSubmitQuiz();
          }
          break;
      }
    };
    
    // Add keyboard event listener
    window.addEventListener("keydown", handleKeyDown);
    
    // Show a toast notification about keyboard shortcuts the first time
    const hasSeenShortcutTip = sessionStorage.getItem("hasSeenShortcutTip");
    if (!hasSeenShortcutTip) {
      toast({
        title: "Keyboard Shortcuts Available",
        description: "Use arrow keys to navigate, number keys (1-4) to select answers, and 's' to submit.",
        duration: 5000,
      });
      sessionStorage.setItem("hasSeenShortcutTip", "true");
    }
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [quizStarted, quizCompleted, currentQuestionIndex, currentQuestions]);

  // Load quiz from Firestore
  const { data, isLoading: isLoadingQuiz, error: loadError } = useQuery({
    queryKey: [`firestore/quizzes/${id}`],
    queryFn: async () => {
      if (!id) return null;
      try {
        console.log(`Quiz page attempting to load quiz ID: ${id}`);
        
        // First verify the quiz store has the loadAndPrepareQuiz function
        const quizStore = useQuizStore.getState();
        if (typeof quizStore.loadAndPrepareQuiz !== 'function') {
          console.error('loadAndPrepareQuiz is not a function in quiz store');
          throw new Error('Quiz loading functionality not available');
        }
        
        // Try to load with the provided ID format
        try {
          return await quizStore.loadAndPrepareQuiz(id);
        } catch (originalError) {
          console.log(`Could not load quiz with ID ${id}, trying alternative ID formats`);
          
          // If the ID doesn't start with 'quiz-', try adding it
          if (!id.startsWith('quiz-')) {
            try {
              const prefixedId = `quiz-${id}`;
              console.log(`Trying quiz ID with prefix: ${prefixedId}`);
              return await quizStore.loadAndPrepareQuiz(prefixedId);
            } catch (prefixError) {
              // If that still fails, rethrow the original error
              throw originalError;
            }
          } else {
            // If it already has 'quiz-' prefix, try without it
            try {
              const unprefixedId = id.replace('quiz-', '');
              console.log(`Trying quiz ID without prefix: ${unprefixedId}`);
              return await quizStore.loadAndPrepareQuiz(unprefixedId);
            } catch (unprefixError) {
              // If all attempts fail, rethrow the original error
              throw originalError;
            }
          }
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast({
          title: "Failed to load quiz",
          description: error instanceof Error ? error.message : "Could not load quiz data",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!id && !activeQuiz,
    retry: 1, // Only retry once to avoid excessive retries for non-existent quizzes
  });
  
  // Set isLoadingQuestions based on whether questions are ready
  const isLoadingQuestions = !currentQuestions || currentQuestions.length === 0;
  
  // Start time for quiz
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  
  // Set start time when quiz begins
  useEffect(() => {
    if (quizStarted && !quizStartTime) {
      setQuizStartTime(Date.now());
    }
  }, [quizStarted, quizStartTime]);
  
  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async () => {
      // Safety check - don't submit if we haven't properly started the quiz
      if (!quizStarted || currentQuestions.length === 0 || !activeQuiz) {
        throw new Error("Quiz not properly started");
      }
      
      // Calculate time taken in milliseconds
      const timeTakenMs = quizStartTime ? Date.now() - quizStartTime : 0;
      
      console.log("Submitting quiz with answers:", userAnswers, "Time taken (ms):", timeTakenMs);
      
      // Calculate score
      const totalQuestions = userAnswers.length;
      const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      // Ensure quizId is always defined
      if (!activeQuiz.id) {
        throw new Error("Quiz ID is missing");
      }
      
      // Create quiz result object for Firestore with proper validation
      const quizResult: Omit<FirestoreQuizResult, 'id'> = {
        quizId: activeQuiz.id,
        userId: user?.id || user?.uid || 'anonymous',
        userName: user?.displayName || 'Anonymous User',
        score: isNaN(score) ? 0 : score,
        timeSpent: isNaN(timeTakenMs) ? 0 : Math.round(timeTakenMs / 1000), // Convert to seconds
        correctAnswers: isNaN(correctAnswers) ? 0 : correctAnswers,
        totalQuestions: isNaN(activeQuiz.questionCount) ? userAnswers.length : activeQuiz.questionCount || 0,
        completedAt: new Date(),
        answers: userAnswers.map(answer => ({
          questionId: answer.questionId || '',
          selectedOptionId: answer.answerId || 'none',
          isCorrect: answer.isCorrect || false,
          timeSpent: 0 // Individual question time not tracked yet
        }))
      };
      
      // Submit the result to Firestore through our store
      const resultId = await useQuizStore.getState().submitQuizResult(quizResult);
      
      return { resultId, score, quizResult };
    },
    onSuccess: (data) => {
      completeQuiz();
      // Show a success toast with the score
      toast({
        title: "Quiz submitted successfully!",
        description: `You scored ${data.score}% on this quiz.`,
      });
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

  const handleAnswerSelect = (questionId: string, answerId: string) => {
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

  const isLoading = isLoadingQuiz || isLoadingQuestions || !activeQuiz || currentQuestions.length === 0;
  
  // Back button component for reuse
  const BackToDashboardButton = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 text-muted-foreground"
    >
      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={() => setLocation("/dashboard")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Dashboard
      </Button>
    </motion.div>
  );
  
  // Show error state if quiz failed to load
  if (loadError) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackToDashboardButton />
        </div>
        
        <Card className="bg-white dark:bg-[#1e1e1e] shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" x2="12" y1="8" y2="12"/>
                <line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Quiz Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Sorry, we couldn't find the quiz you're looking for. It may have been deleted or moved.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setLocation("/dashboard")}>
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setLocation("/quizzes")}>
                Browse All Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackToDashboardButton />
        </div>
        
        <QuizSkeleton questionCount={activeQuiz?.questionCount || 5} />
      </div>
    );
  }

  // Check if we have any questions available
  if (currentQuestions.length === 0 && activeQuiz) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackToDashboardButton />
        </div>
        
        <Card className="bg-white dark:bg-[#1e1e1e] shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Questions Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This quiz doesn't have any questions yet. Please check back later or choose a different quiz.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setLocation("/dashboard")}>
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setLocation("/quizzes")}>
                Browse All Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Quiz start screen
  if (!quizStarted && activeQuiz) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white dark:bg-[#1e1e1e] shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              {activeQuiz.title}
            </h1>
            <div className="text-center mb-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">{activeQuiz.description}</p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium">{currentQuestions.length}</span> questions
                </div>
                <div>
                  <span className="font-medium">{activeQuiz.timeLimit}</span> minutes
                </div>
                <div>
                  <span className="font-medium capitalize">{activeQuiz.difficulty}</span> difficulty
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4 mb-8">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Instructions:</h3>
              <ul className="list-disc pl-5 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>You have {activeQuiz.timeLimit} minutes to complete the quiz</li>
                <li>There are {currentQuestions.length} questions in total</li>
                <li>You can navigate between questions using the previous/next buttons</li>
                <li>Use keyboard shortcuts to navigate faster:
                  <ul className="list-circle pl-5 mt-1 text-xs">
                    <li><span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">←</span> or <span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">p</span> Previous question</li>
                    <li><span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">→</span> or <span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">n</span> Next question</li>
                    <li><span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">1-4</span> Select answer option</li>
                    <li><span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">s</span> Submit quiz (on last question)</li>
                  </ul>
                </li>
                <li>Your progress will be saved as you go</li>
                <li>Submit your quiz before the timer runs out</li>
              </ul>
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleStartQuiz}
                  size="lg"
                  className="px-8 py-6 text-lg"
                >
                  <motion.div
                    animate={{ 
                      x: [0, 5, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatDelay: 1.5,
                      duration: 0.5
                    }}
                  >
                    <Play className="mr-2 h-5 w-5" />
                  </motion.div>
                  Start Quiz
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Note: Timer and auto-submit effects are now combined at the top of the component 
  // to ensure hooks are always called in the same order

  // Quiz in progress
  // Make sure we have the current question from Firestore
  const currentQuestion = currentQuestions[currentQuestionIndex] || null;
  
  // If questions exist and we've started but current index doesn't yield a question,
  // reset to first question
  if (currentQuestions.length > 0 && !currentQuestion?.id && quizStarted) {
    console.log("Resetting to first question");
    // Set up the first question
    setCurrentQuestionIndex(0);
  }
  
  const selectedAnswer = currentQuestion?.id ? 
    userAnswers.find(a => a.questionId === currentQuestion.id)?.answerId || null : 
    null;
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentQuestion && (
        <QuizQuestionAnimated
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
      )}
    </div>
  );
}
