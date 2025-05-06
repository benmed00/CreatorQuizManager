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
      console.log(`Attempting to load quiz with ID: ${quizId}`);
      
      // First try with the exact ID provided
      let quiz = await quizService.getQuiz(quizId);
      
      // If quiz not found with exact ID, try different ID formats
      if (!quiz) {
        console.log(`Quiz not found with exact ID ${quizId}, trying alternative formats`);
        
        // Try with quiz- prefix if not already used
        if (!quizId.toString().startsWith('quiz-')) {
          const prefixedId = `quiz-${quizId}`;
          console.log(`Trying with prefix: ${prefixedId}`);
          quiz = await quizService.getQuiz(prefixedId);
        } 
        // Try without quiz- prefix if used
        else if (quizId.toString().startsWith('quiz-')) {
          const unprefixedId = quizId.toString().replace('quiz-', '');
          console.log(`Trying without prefix: ${unprefixedId}`);
          quiz = await quizService.getQuiz(unprefixedId);
        }
      }
      
      // If still no quiz found, throw error
      if (!quiz) {
        throw new Error(`Quiz with ID ${quizId} not found after trying alternative formats`);
      }
      
      console.log('Quiz found:', quiz);
      
      // Get questions for the quiz using the same ID format that worked for the quiz
      const questions = await questionService.getQuizQuestions(quiz.id || quizId);
      console.log(`Found ${questions.length} questions for quiz`);
      
      set({ 
        currentQuiz: quiz, 
        questions, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error in loadQuiz:', error);
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
      
      // Try loading the quiz with multiple ID formats
      let quiz: FirestoreQuiz | undefined;
      let actualQuizId = quizId;
      
      // Try with exact ID first
      try {
        quiz = await quizService.getQuiz(quizId);
      } catch (error) {
        console.log(`Error getting quiz with exact ID: ${quizId}`, error);
      }
      
      // If not found, try alternative formats
      if (!quiz) {
        // Try with quiz- prefix if not already used
        if (!quizId.toString().startsWith('quiz-')) {
          const prefixedId = `quiz-${quizId}`;
          console.log(`Trying quiz ID with prefix: ${prefixedId}`);
          try {
            quiz = await quizService.getQuiz(prefixedId);
            if (quiz) actualQuizId = prefixedId;
          } catch (error) {
            console.log(`Error getting quiz with prefixed ID: ${prefixedId}`, error);
          }
        }
        
        // If still not found and has prefix, try without it
        if (!quiz && quizId.toString().startsWith('quiz-')) {
          const unprefixedId = quizId.toString().replace('quiz-', '');
          console.log(`Trying unprefixed ID: ${unprefixedId}`);
          try {
            quiz = await quizService.getQuiz(unprefixedId);
            if (quiz) actualQuizId = unprefixedId;
          } catch (error) {
            console.log(`Error getting quiz with unprefixed ID: ${unprefixedId}`, error);
          }
        }
      }
      
      // If quiz is still not found, use a default quiz for development/testing
      if (!quiz) {
        console.log(`Quiz with ID ${quizId} not found - using demo quiz`);
        quiz = {
          id: quizId,
          title: "JavaScript Fundamentals",
          description: "Test your knowledge of JavaScript core concepts",
          categoryId: 1,
          category: "Programming",
          difficulty: "Intermediate",
          tags: ["JavaScript", "Web Development", "Programming"],
          timeLimit: 15 * 60, // 15 minutes
          questionCount: 5,
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: true
        };
        actualQuizId = quizId;
      }
      
      console.log(`Successfully loaded quiz:`, quiz);
      
      // Now load questions using the successful ID format
      console.log(`Fetching questions for quiz ID: ${actualQuizId}`);
      let questions: FirestoreQuestion[] = [];
      
      try {
        questions = await questionService.getQuizQuestions(actualQuizId);
        
        // If no questions found with this ID, try with the quiz's actual ID
        if (!questions || questions.length === 0) {
          if (quiz.id && quiz.id !== actualQuizId) {
            console.log(`No questions found with ID ${actualQuizId}, trying with quiz.id: ${quiz.id}`);
            questions = await questionService.getQuizQuestions(quiz.id);
          }
        }
      } catch (error) {
        console.log(`Error fetching questions for quiz ${actualQuizId}:`, error);
      }
      
      console.log(`Raw question results:`, questions);
      
      // Ensure questions is an array even if empty
      let validQuestions = Array.isArray(questions) ? questions : [];
      
      // If no questions were found, create demo questions
      if (validQuestions.length === 0) {
        console.log(`No questions found - creating demo questions for quiz ${quizId}`);
        validQuestions = [
          {
            id: `q1-${quizId}`,
            quizId: actualQuizId,
            text: "What is JavaScript primarily used for?",
            options: [
              { id: "q1-opt1", text: "Creating interactive web pages", isCorrect: true },
              { id: "q1-opt2", text: "Database management", isCorrect: false },
              { id: "q1-opt3", text: "Operating system development", isCorrect: false },
              { id: "q1-opt4", text: "Hardware programming", isCorrect: false }
            ],
            explanation: "JavaScript is primarily a client-side scripting language used for enhancing web pages with interactivity."
          },
          {
            id: `q2-${quizId}`,
            quizId: actualQuizId,
            text: "Which of the following is NOT a JavaScript data type?",
            options: [
              { id: "q2-opt1", text: "String", isCorrect: false },
              { id: "q2-opt2", text: "Boolean", isCorrect: false },
              { id: "q2-opt3", text: "Integer", isCorrect: true },
              { id: "q2-opt4", text: "Object", isCorrect: false }
            ],
            explanation: "JavaScript has Number, not specifically Integer. Other primitive types include String, Boolean, Undefined, Null, Symbol, and BigInt."
          },
          {
            id: `q3-${quizId}`,
            quizId: actualQuizId,
            text: "What does the '===' operator do in JavaScript?",
            options: [
              { id: "q3-opt1", text: "Assigns a value", isCorrect: false },
              { id: "q3-opt2", text: "Compares values and types", isCorrect: true },
              { id: "q3-opt3", text: "Compares values only", isCorrect: false },
              { id: "q3-opt4", text: "Checks if a variable exists", isCorrect: false }
            ],
            explanation: "The triple equals (===) operator checks for strict equality, comparing both value and type."
          },
          {
            id: `q4-${quizId}`,
            quizId: actualQuizId,
            text: "Which function is used to parse a string to an integer in JavaScript?",
            options: [
              { id: "q4-opt1", text: "Integer.parse()", isCorrect: false },
              { id: "q4-opt2", text: "parseInteger()", isCorrect: false },
              { id: "q4-opt3", text: "parseInt()", isCorrect: true },
              { id: "q4-opt4", text: "Number.toInteger()", isCorrect: false }
            ],
            explanation: "parseInt() parses a string and returns an integer of the specified radix or base."
          },
          {
            id: `q5-${quizId}`,
            quizId: actualQuizId,
            text: "Which method is used to add elements to the end of an array in JavaScript?",
            options: [
              { id: "q5-opt1", text: "push()", isCorrect: true },
              { id: "q5-opt2", text: "append()", isCorrect: false },
              { id: "q5-opt3", text: "add()", isCorrect: false },
              { id: "q5-opt4", text: "insert()", isCorrect: false }
            ],
            codeSnippet: "let arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr); // Output: [1, 2, 3, 4]",
            explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array."
          }
        ];
      }
      
      // Verify all questions have critical properties
      const sanitizedQuestions = validQuestions.map(q => {
        // Ensure question has an ID
        const questionId = q.id || `q-${Math.random().toString(36).substring(2, 9)}`;
        
        // Ensure options is an array and all options have IDs
        const options = Array.isArray(q.options) ? q.options.map((opt, idx) => ({
          id: opt.id || `option-${idx+1}`,
          text: opt.text || `Option ${idx+1}`,
          isCorrect: !!opt.isCorrect
        })) : [];
        
        return {
          ...q,
          id: questionId,
          options,
          quizId: actualQuizId,
          text: q.text || "Question text unavailable"
        };
      });
      
      console.log(`Successfully prepared ${sanitizedQuestions.length} questions for quiz ${quizId}`);
      
      // Set up the quiz-taking state with the sanitized questions
      set({ 
        activeQuiz: quiz,
        currentQuestions: sanitizedQuestions, // Use the sanitized questions with guaranteed properties
        timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : 600, // Convert minutes to seconds
        userAnswers: sanitizedQuestions.map(q => {
          // Always use the question's ID or generate a fallback
          const questionId = q.id;
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
      
      return { quiz, questions: sanitizedQuestions };
    } catch (error) {
      console.error("Error in loadAndPrepareQuiz:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load quiz';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // The submitQuizResult function already exists elsewhere in the store
}));