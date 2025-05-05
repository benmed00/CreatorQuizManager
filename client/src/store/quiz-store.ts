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

interface QuizState {
  // Current quiz data
  currentQuiz: FirestoreQuiz | null;
  questions: FirestoreQuestion[];
  isLoading: boolean;
  error: string | null;
  
  // Functions for quiz operations
  createQuiz: (quiz: Omit<FirestoreQuiz, 'id' | 'createdBy'>) => Promise<string>;
  loadQuiz: (quizId: string) => Promise<void>;
  updateQuiz: (quizId: string, data: Partial<FirestoreQuiz>) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  
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
  
  // Quiz taking session
  startQuiz: (quizId: string) => Promise<void>;
  resetQuizState: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  currentQuiz: null,
  questions: [],
  isLoading: false,
  error: null,
  
  // Quiz operations
  createQuiz: async (quizData) => {
    set({ isLoading: true, error: null });
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in to create a quiz');
      }
      
      const uid = user.uid;
      const displayName = user.displayName || 'Anonymous';
      
      const quiz: FirestoreQuiz = {
        ...quizData,
        createdBy: uid
      };
      
      const quizId = await quizService.createQuiz(quiz);
      set({ isLoading: false });
      return quizId;
    } catch (error) {
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
  
  // Quiz taking session
  startQuiz: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      // Load the quiz and its questions
      await get().loadQuiz(quizId);
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start quiz';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  resetQuizState: () => {
    set({
      currentQuiz: null,
      questions: [],
      error: null
    });
  }
}));