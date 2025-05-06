/**
 * Quiz Store
 * 
 * This store manages quiz state and operations using Firestore for persistence.
 * It handles loading, saving, and managing quizzes, questions, and results.
 */

import { create } from 'zustand';
import { 
  quizService, 
  questionService, 
  resultService,
  FirestoreQuiz,
  FirestoreQuestion,
  FirestoreQuizResult 
} from '@/lib/firestore-service';
import { getCurrentUser } from '@/lib/firebase';

// Interface for user answers during quiz
interface UserAnswer {
  questionId: string;
  answerId: string | null;
  isCorrect?: boolean;
  timeSpent?: number; // in seconds
}

interface QuizState {
  // Current quiz data
  currentQuiz: FirestoreQuiz | null;
  questions: FirestoreQuestion[];
  isLoading: boolean;
  error: string | null;
  
  // Quiz taking state
  activeQuiz: FirestoreQuiz | null;
  currentQuestions: FirestoreQuestion[];
  userAnswers: UserAnswer[];
  currentQuestionIndex: number;
  timeRemaining: number;
  quizStarted: boolean;
  quizCompleted: boolean;
  
  // Quiz taking functions  
  setActiveQuiz: (quiz: FirestoreQuiz) => void;
  setQuestions: (questions: FirestoreQuestion[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswer: (questionId: string, answerId: string | null) => void;
  startQuiz: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  decrementTimer: () => void;
  
  // Functions for quiz operations
  createQuiz: (quiz: Omit<FirestoreQuiz, 'id' | 'createdBy'>) => Promise<string>;
  loadQuiz: (quizId: string) => Promise<void>;
  updateQuiz: (quizId: string, data: Partial<FirestoreQuiz>) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  loadAndPrepareQuiz: (quizId: string) => Promise<{ quiz: FirestoreQuiz, questions: FirestoreQuestion[] }>;
  
  // Functions for question operations
  addQuestion: (question: Omit<FirestoreQuestion, 'id' | 'quizId'>) => Promise<string>;
  updateQuestion: (questionId: string, data: Partial<FirestoreQuestion>) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
  
  // Functions for user quiz operations
  getUserQuizzes: () => Promise<FirestoreQuiz[]>;
  getPublicQuizzes: (limit?: number) => Promise<FirestoreQuiz[]>;
  
  // Functions for results
  submitQuizResult: (result: Omit<FirestoreQuizResult, 'id'>) => Promise<string>;
  getUserResults: () => Promise<FirestoreQuizResult[]>;
  getQuizLeaderboard: (quizId: string, limit?: number) => Promise<FirestoreQuizResult[]>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  currentQuiz: null,
  questions: [],
  isLoading: false,
  error: null,
  
  // Quiz taking state
  activeQuiz: null,
  currentQuestions: [],
  userAnswers: [],
  currentQuestionIndex: 0,
  timeRemaining: 0,
  quizStarted: false,
  quizCompleted: false,
  
  // Quiz operations
  createQuiz: async (quizData) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Creating quiz with data:', quizData);
      
      const user = getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in to create a quiz');
      }
      
      const uid = user.uid;
      const displayName = user.displayName || 'Anonymous';
      
      // Ensure categoryId is a number
      const categoryId = typeof quizData.categoryId === 'string' 
        ? parseInt(quizData.categoryId, 10) 
        : quizData.categoryId;
      
      const quiz: FirestoreQuiz = {
        ...quizData,
        categoryId: isNaN(categoryId) ? 2 : categoryId, // Default to 2 (Programming) if invalid
        createdBy: uid
      };
      
      console.log('Processed quiz data:', quiz);
      
      const quizId = await quizService.createQuiz(quiz);
      console.log('Quiz created successfully with ID:', quizId);
      
      set({ isLoading: false });
      return quizId;
    } catch (error) {
      console.error('Error in createQuiz:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create quiz';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  loadQuiz: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const quiz = await quizService.getQuiz(quizId);
      
      if (!quiz) {
        throw new Error(`Quiz with ID ${quizId} not found`);
      }
      
      const questions = await questionService.getQuizQuestions(quizId);
      
      set({ 
        currentQuiz: quiz, 
        questions, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load quiz';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  updateQuiz: async (quizId, data) => {
    set({ isLoading: true, error: null });
    try {
      await quizService.updateQuiz(quizId, data);
      
      // Update local state if we're updating the current quiz
      const { currentQuiz } = get();
      if (currentQuiz && currentQuiz.id === quizId) {
        set({ 
          currentQuiz: { 
            ...currentQuiz, 
            ...data 
          } 
        });
      }
      
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update quiz';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  deleteQuiz: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      await quizService.deleteQuiz(quizId);
      
      // Reset state if we're deleting the current quiz
      const { currentQuiz } = get();
      if (currentQuiz && currentQuiz.id === quizId) {
        set({ currentQuiz: null, questions: [] });
      }
      
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete quiz';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Question operations
  addQuestion: async (questionData) => {
    set({ isLoading: true, error: null });
    try {
      const { currentQuiz, questions } = get();
      
      if (!currentQuiz || !currentQuiz.id) {
        throw new Error('No active quiz to add question to');
      }
      
      const question: FirestoreQuestion = {
        ...questionData,
        quizId: currentQuiz.id
      };
      
      const questionId = await questionService.createQuestion(question);
      
      // Update local state
      const newQuestion = { ...question, id: questionId };
      set({ 
        questions: [...questions, newQuestion],
        isLoading: false 
      });
      
      // Update quiz question count
      await quizService.updateQuiz(currentQuiz.id, { 
        questionCount: (currentQuiz.questionCount || 0) + 1 
      });
      
      return questionId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add question';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  updateQuestion: async (questionId, data) => {
    set({ isLoading: true, error: null });
    try {
      await questionService.updateQuestion(questionId, data);
      
      // Update local state
      const { questions } = get();
      const updatedQuestions = questions.map(q => 
        q.id === questionId ? { ...q, ...data } : q
      );
      
      set({ questions: updatedQuestions, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update question';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  deleteQuestion: async (questionId) => {
    set({ isLoading: true, error: null });
    try {
      await questionService.deleteQuestion(questionId);
      
      // Update local state
      const { questions, currentQuiz } = get();
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      
      set({ questions: updatedQuestions, isLoading: false });
      
      // Update quiz question count if we have a current quiz
      if (currentQuiz && currentQuiz.id) {
        await quizService.updateQuiz(currentQuiz.id, { 
          questionCount: Math.max(0, (currentQuiz.questionCount || 0) - 1)
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete question';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // User quiz operations
  getUserQuizzes: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in to view your quizzes');
      }
      
      const quizzes = await quizService.getUserQuizzes(user.uid);
      set({ isLoading: false });
      return quizzes;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load your quizzes';
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },
  
  getPublicQuizzes: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const quizzes = await quizService.getPublicQuizzes(limit);
      set({ isLoading: false });
      return quizzes;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load public quizzes';
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },
  
  // Results operations
  submitQuizResult: async (resultData) => {
    set({ isLoading: true, error: null });
    try {
      const resultId = await resultService.createResult(resultData);
      set({ isLoading: false });
      return resultId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quiz result';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  getUserResults: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in to view your results');
      }
      
      const results = await resultService.getUserResults(user.uid);
      set({ isLoading: false });
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load your results';
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },
  
  getQuizLeaderboard: async (quizId, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const leaderboard = await resultService.getQuizLeaderboard(quizId, limit);
      set({ isLoading: false });
      return leaderboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load leaderboard';
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },
  
  // Quiz taking functions
  setActiveQuiz: (quiz) => {
    set({ 
      activeQuiz: quiz,
      timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : 600, // Convert minutes to seconds
    });
  },
  
  setQuestions: (questions) => {
    set({ 
      currentQuestions: questions,
      // Initialize userAnswers array with one entry per question, all initially null
      userAnswers: questions.map(q => {
        // Ensure we always have a valid string ID for each question
        if (!q.id) {
          console.error('Question is missing ID:', q);
          return { questionId: `temp-${Math.random().toString(36).substr(2, 9)}`, answerId: null };
        }
        return { questionId: q.id, answerId: null };
      })
    });
  },
  
  setCurrentQuestionIndex: (index) => {
    set({ currentQuestionIndex: index });
  },
  
  setUserAnswer: (questionId, answerId) => {
    const { userAnswers, currentQuestions } = get();
    
    // Find the question to determine if the answer is correct
    const question = currentQuestions.find(q => q.id === questionId);
    
    // Update the answer
    const updatedAnswers = userAnswers.map(answer => 
      answer.questionId === questionId 
        ? { 
            ...answer, 
            answerId,
            // If we know the correct answer, set the isCorrect flag
            ...(question?.correctOptionId ? { 
              isCorrect: question.correctOptionId === answerId 
            } : {})
          } 
        : answer
    );
    
    set({ userAnswers: updatedAnswers });
  },
  
  startQuiz: () => {
    set({ 
      quizStarted: true,
      quizCompleted: false,
    });
  },
  
  completeQuiz: () => {
    set({ quizCompleted: true });
  },
  
  resetQuiz: () => {
    set({
      activeQuiz: null,
      currentQuestions: [],
      userAnswers: [],
      currentQuestionIndex: 0,
      timeRemaining: 0,
      quizStarted: false,
      quizCompleted: false,
      error: null
    });
  },
  
  decrementTimer: () => {
    const { timeRemaining } = get();
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },
  
  // Quiz loading and preparation function
  loadAndPrepareQuiz: async (quizId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // First, reset any previous quiz state
      get().resetQuiz();
      
      console.log(`Loading quiz with ID: ${quizId}`);
      
      // Load the quiz from Firestore
      const quiz = await quizService.getQuiz(quizId);
      
      if (!quiz) {
        console.error(`Quiz with ID ${quizId} not found`);
        throw new Error(`Quiz with ID ${quizId} not found`);
      }
      
      console.log(`Successfully loaded quiz:`, quiz);
      
      // Now load questions
      console.log(`Fetching questions for quiz ID: ${quizId}`);
      const questions = await questionService.getQuizQuestions(quizId);
      console.log(`Raw question results:`, questions);
      
      // Ensure questions is an array even if empty
      const validQuestions = Array.isArray(questions) ? questions : [];
      
      if (validQuestions.length === 0) {
        console.warn(`No questions found for quiz ${quizId} - quiz may not work correctly`);
      } else {
        console.log(`Successfully loaded ${validQuestions.length} questions for quiz ${quizId}`);
      }
      
      // Set up the quiz-taking state with the questions we have
      set({ 
        activeQuiz: quiz,
        currentQuestions: validQuestions,
        timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : 600, // Convert minutes to seconds
        userAnswers: validQuestions.map(q => {
          const questionId = q.id ? q.id : `temp-${Math.random().toString(36).substr(2, 9)}`;
          return {
            questionId,
            answerId: null,
            isCorrect: false,
            timeSpent: 0
          } as UserAnswer;
        }),
        currentQuestionIndex: 0,
        isLoading: false
      });
      
      return { quiz, questions: validQuestions };
    } catch (error) {
      console.error("Error in loadAndPrepareQuiz:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load quiz';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // The submitQuizResult function already exists elsewhere in the store
}));