import { create } from "zustand";
import { Quiz, Question, UserAnswer } from "@shared/schema";

interface QuizState {
  activeQuiz: Quiz | null;
  currentQuestions: Question[];
  userAnswers: UserAnswer[];
  currentQuestionIndex: number;
  timeRemaining: number;
  quizStarted: boolean;
  quizCompleted: boolean;
  
  setActiveQuiz: (quiz: Quiz | null) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswer: (questionId: number, answerId: number) => void;
  startQuiz: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  decrementTimer: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  activeQuiz: null,
  currentQuestions: [],
  userAnswers: [],
  currentQuestionIndex: 0,
  timeRemaining: 0,
  quizStarted: false,
  quizCompleted: false,
  
  setActiveQuiz: (quiz) => set({ 
    activeQuiz: quiz,
    timeRemaining: quiz ? parseInt(quiz.timeLimit) * 60 : 0
  }),
  
  setQuestions: (questions) => {
    // Enhanced filtering for unique questions by ID
    const questionMap = new Map<number, Question>();
    
    // Add each question to the map, with ID as key
    // This automatically handles duplicates since Map only keeps one key
    questions.forEach(question => {
      if (!questionMap.has(question.id)) {
        questionMap.set(question.id, question);
      }
    });
    
    // Convert map values back to array
    const uniqueQuestions = Array.from(questionMap.values());
    
    // Log the filtering results
    if (uniqueQuestions.length !== questions.length) {
      console.log(`Filtered out ${questions.length - uniqueQuestions.length} duplicate questions. Keeping ${uniqueQuestions.length} unique questions.`);
    }
    
    // Create user answers array from unique questions
    const userAnswers = uniqueQuestions.map(q => ({ 
      questionId: q.id, 
      answerId: null 
    }));
    
    console.log(`Quiz started with ${uniqueQuestions.length} questions`);
    
    return set({ 
      currentQuestions: uniqueQuestions,
      userAnswers: userAnswers
    });
  },
  
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  
  setUserAnswer: (questionId, answerId) => set((state) => ({
    userAnswers: state.userAnswers.map((answer) =>
      answer.questionId === questionId
        ? { ...answer, answerId }
        : answer
    )
  })),
  
  startQuiz: () => set({ quizStarted: true }),
  
  completeQuiz: () => set({ quizCompleted: true }),
  
  resetQuiz: () => set({
    activeQuiz: null,
    currentQuestions: [],
    userAnswers: [],
    currentQuestionIndex: 0,
    timeRemaining: 0,
    quizStarted: false,
    quizCompleted: false
  }),
  
  decrementTimer: () => set((state) => ({
    timeRemaining: Math.max(0, state.timeRemaining - 1)
  }))
}));
