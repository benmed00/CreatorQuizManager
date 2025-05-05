/**
 * Firestore Data Service
 * 
 * This module provides a higher-level abstraction for working with quiz data in Firestore.
 * It handles the persistence of quizzes, questions, results, and other entities.
 */

import { 
  createDocument, 
  updateDocument, 
  getDocument, 
  deleteDocument, 
  queryDocuments,
  COLLECTIONS 
} from './firebase';
import { where, orderBy, limit, query } from 'firebase/firestore';

// Define interfaces for our data models
export interface FirestoreQuiz {
  id?: string;
  title: string;
  description: string;
  category: string;
  categoryId: number;
  difficulty: string;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
  questionCount: number;
  timeLimit: number;
  isPublic: boolean;
  tags?: string[];
}

export interface FirestoreQuestion {
  id?: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctOptionId?: string;
  explanation?: string;
  quizId: string;
  categoryId: number;
  difficulty: string;
  codeSnippet?: string | null;
  createdAt?: any;
  updatedAt?: any;
  tags?: string[];
}

export interface FirestoreQuizResult {
  id?: string;
  quizId: string;
  userId: string;
  userName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: any;
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    timeSpent: number; // in seconds
  }[];
  createdAt?: any;
}

export interface FirestoreCategory {
  id?: string;
  name: string;
  description: string;
  iconName: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreTemplate {
  id?: string;
  name: string;
  description: string;
  categoryId: number;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  createdBy: string;
  isPublic: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreUser {
  id?: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreUserProfile {
  id?: string;
  userId: string;
  displayName: string;
  bio?: string;
  expertise?: string[];
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
  };
  stats?: {
    quizzesTaken: number;
    quizzesCreated: number;
    averageScore: number;
    totalPoints: number;
  };
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Quiz Data Service
 */
export const quizService = {
  /**
   * Create a new quiz
   * @param quiz Quiz data
   * @returns Promise resolving to the quiz ID
   */
  createQuiz: async (quiz: FirestoreQuiz): Promise<string> => {
    return createDocument<FirestoreQuiz>(COLLECTIONS.QUIZZES, quiz);
  },

  /**
   * Update an existing quiz
   * @param id Quiz ID
   * @param quiz Quiz data to update
   * @returns Promise<void>
   */
  updateQuiz: async (id: string, quiz: Partial<FirestoreQuiz>): Promise<void> => {
    return updateDocument<FirestoreQuiz>(COLLECTIONS.QUIZZES, id, quiz);
  },

  /**
   * Get a quiz by ID
   * @param id Quiz ID
   * @returns Promise resolving to the quiz or undefined if not found
   */
  getQuiz: async (id: string): Promise<FirestoreQuiz | undefined> => {
    return getDocument<FirestoreQuiz>(COLLECTIONS.QUIZZES, id);
  },

  /**
   * Delete a quiz by ID
   * @param id Quiz ID
   * @returns Promise<void>
   */
  deleteQuiz: async (id: string): Promise<void> => {
    return deleteDocument(COLLECTIONS.QUIZZES, id);
  },

  /**
   * Get all quizzes for a user
   * @param userId User ID
   * @returns Promise resolving to an array of quizzes
   */
  getUserQuizzes: async (userId: string): Promise<FirestoreQuiz[]> => {
    return queryDocuments<FirestoreQuiz>(
      COLLECTIONS.QUIZZES,
      [where('createdBy', '==', userId), orderBy('createdAt', 'desc')]
    );
  },

  /**
   * Get public quizzes
   * @param limit Maximum number of quizzes to return
   * @returns Promise resolving to an array of quizzes
   */
  getPublicQuizzes: async (limitCount: number = 10): Promise<FirestoreQuiz[]> => {
    return queryDocuments<FirestoreQuiz>(
      COLLECTIONS.QUIZZES,
      [where('isPublic', '==', true), orderBy('createdAt', 'desc'), limit(limitCount)]
    );
  },

  /**
   * Get quizzes by category
   * @param categoryId Category ID
   * @param limitCount Maximum number of quizzes to return
   * @returns Promise resolving to an array of quizzes
   */
  getQuizzesByCategory: async (categoryId: number, limitCount: number = 10): Promise<FirestoreQuiz[]> => {
    return queryDocuments<FirestoreQuiz>(
      COLLECTIONS.QUIZZES,
      [where('categoryId', '==', categoryId), where('isPublic', '==', true), orderBy('createdAt', 'desc'), limit(limitCount)]
    );
  }
};

/**
 * Question Data Service
 */
export const questionService = {
  /**
   * Create a new question
   * @param question Question data
   * @returns Promise resolving to the question ID
   */
  createQuestion: async (question: FirestoreQuestion): Promise<string> => {
    return createDocument<FirestoreQuestion>(COLLECTIONS.QUESTIONS, question);
  },

  /**
   * Update an existing question
   * @param id Question ID
   * @param question Question data to update
   * @returns Promise<void>
   */
  updateQuestion: async (id: string, question: Partial<FirestoreQuestion>): Promise<void> => {
    return updateDocument<FirestoreQuestion>(COLLECTIONS.QUESTIONS, id, question);
  },

  /**
   * Get a question by ID
   * @param id Question ID
   * @returns Promise resolving to the question or undefined if not found
   */
  getQuestion: async (id: string): Promise<FirestoreQuestion | undefined> => {
    return getDocument<FirestoreQuestion>(COLLECTIONS.QUESTIONS, id);
  },

  /**
   * Delete a question by ID
   * @param id Question ID
   * @returns Promise<void>
   */
  deleteQuestion: async (id: string): Promise<void> => {
    return deleteDocument(COLLECTIONS.QUESTIONS, id);
  },

  /**
   * Get all questions for a quiz
   * @param quizId Quiz ID
   * @returns Promise resolving to an array of questions
   */
  getQuizQuestions: async (quizId: string): Promise<FirestoreQuestion[]> => {
    return queryDocuments<FirestoreQuestion>(
      COLLECTIONS.QUESTIONS,
      [where('quizId', '==', quizId)]
    );
  },

  /**
   * Get questions by category
   * @param categoryId Category ID
   * @param limitCount Maximum number of questions to return
   * @returns Promise resolving to an array of questions
   */
  getQuestionsByCategory: async (categoryId: number, limitCount: number = 50): Promise<FirestoreQuestion[]> => {
    return queryDocuments<FirestoreQuestion>(
      COLLECTIONS.QUESTIONS,
      [where('categoryId', '==', categoryId), limit(limitCount)]
    );
  },

  /**
   * Create multiple questions for a quiz
   * @param questions Array of question data
   * @param quizId Quiz ID
   * @returns Promise resolving to an array of question IDs
   */
  createQuizQuestions: async (questions: Omit<FirestoreQuestion, 'id' | 'quizId'>[], quizId: string): Promise<string[]> => {
    const promises = questions.map(question => 
      createDocument<FirestoreQuestion>(COLLECTIONS.QUESTIONS, {
        ...question,
        quizId
      })
    );
    
    return Promise.all(promises);
  }
};

/**
 * Quiz Result Data Service
 */
export const resultService = {
  /**
   * Create a new quiz result
   * @param result Quiz result data
   * @returns Promise resolving to the result ID
   */
  createResult: async (result: FirestoreQuizResult): Promise<string> => {
    return createDocument<FirestoreQuizResult>(COLLECTIONS.RESULTS, result);
  },

  /**
   * Get a quiz result by ID
   * @param id Result ID
   * @returns Promise resolving to the result or undefined if not found
   */
  getResult: async (id: string): Promise<FirestoreQuizResult | undefined> => {
    return getDocument<FirestoreQuizResult>(COLLECTIONS.RESULTS, id);
  },

  /**
   * Get all results for a user
   * @param userId User ID
   * @returns Promise resolving to an array of results
   */
  getUserResults: async (userId: string): Promise<FirestoreQuizResult[]> => {
    return queryDocuments<FirestoreQuizResult>(
      COLLECTIONS.RESULTS,
      [where('userId', '==', userId), orderBy('completedAt', 'desc')]
    );
  },

  /**
   * Get all results for a quiz
   * @param quizId Quiz ID
   * @returns Promise resolving to an array of results
   */
  getQuizResults: async (quizId: string): Promise<FirestoreQuizResult[]> => {
    return queryDocuments<FirestoreQuizResult>(
      COLLECTIONS.RESULTS,
      [where('quizId', '==', quizId), orderBy('completedAt', 'desc')]
    );
  },

  /**
   * Get leaderboard for a quiz
   * @param quizId Quiz ID
   * @param limitCount Maximum number of results to return
   * @returns Promise resolving to an array of results
   */
  getQuizLeaderboard: async (quizId: string, limitCount: number = 10): Promise<FirestoreQuizResult[]> => {
    return queryDocuments<FirestoreQuizResult>(
      COLLECTIONS.RESULTS,
      [where('quizId', '==', quizId), orderBy('score', 'desc'), limit(limitCount)]
    );
  }
};

/**
 * Category Data Service
 */
export const categoryService = {
  /**
   * Create a new category
   * @param category Category data
   * @returns Promise resolving to the category ID
   */
  createCategory: async (category: FirestoreCategory): Promise<string> => {
    return createDocument<FirestoreCategory>(COLLECTIONS.CATEGORIES, category);
  },

  /**
   * Update an existing category
   * @param id Category ID
   * @param category Category data to update
   * @returns Promise<void>
   */
  updateCategory: async (id: string, category: Partial<FirestoreCategory>): Promise<void> => {
    return updateDocument<FirestoreCategory>(COLLECTIONS.CATEGORIES, id, category);
  },

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Promise resolving to the category or undefined if not found
   */
  getCategory: async (id: string): Promise<FirestoreCategory | undefined> => {
    return getDocument<FirestoreCategory>(COLLECTIONS.CATEGORIES, id);
  },

  /**
   * Get all categories
   * @returns Promise resolving to an array of categories
   */
  getAllCategories: async (): Promise<FirestoreCategory[]> => {
    return queryDocuments<FirestoreCategory>(
      COLLECTIONS.CATEGORIES,
      [orderBy('name', 'asc')]
    );
  }
};

/**
 * Template Data Service
 */
export const templateService = {
  /**
   * Create a new template
   * @param template Template data
   * @returns Promise resolving to the template ID
   */
  createTemplate: async (template: FirestoreTemplate): Promise<string> => {
    return createDocument<FirestoreTemplate>(COLLECTIONS.TEMPLATES, template);
  },

  /**
   * Update an existing template
   * @param id Template ID
   * @param template Template data to update
   * @returns Promise<void>
   */
  updateTemplate: async (id: string, template: Partial<FirestoreTemplate>): Promise<void> => {
    return updateDocument<FirestoreTemplate>(COLLECTIONS.TEMPLATES, id, template);
  },

  /**
   * Get a template by ID
   * @param id Template ID
   * @returns Promise resolving to the template or undefined if not found
   */
  getTemplate: async (id: string): Promise<FirestoreTemplate | undefined> => {
    return getDocument<FirestoreTemplate>(COLLECTIONS.TEMPLATES, id);
  },

  /**
   * Delete a template by ID
   * @param id Template ID
   * @returns Promise<void>
   */
  deleteTemplate: async (id: string): Promise<void> => {
    return deleteDocument(COLLECTIONS.TEMPLATES, id);
  },

  /**
   * Get all templates for a user
   * @param userId User ID
   * @returns Promise resolving to an array of templates
   */
  getUserTemplates: async (userId: string): Promise<FirestoreTemplate[]> => {
    return queryDocuments<FirestoreTemplate>(
      COLLECTIONS.TEMPLATES,
      [where('createdBy', '==', userId), orderBy('createdAt', 'desc')]
    );
  },

  /**
   * Get public templates
   * @param limitCount Maximum number of templates to return
   * @returns Promise resolving to an array of templates
   */
  getPublicTemplates: async (limitCount: number = 10): Promise<FirestoreTemplate[]> => {
    return queryDocuments<FirestoreTemplate>(
      COLLECTIONS.TEMPLATES,
      [where('isPublic', '==', true), orderBy('createdAt', 'desc'), limit(limitCount)]
    );
  }
};

/**
 * User Data Service
 */
export const userService = {
  /**
   * Create a new user
   * @param user User data
   * @returns Promise resolving to the user ID
   */
  createUser: async (user: FirestoreUser): Promise<string> => {
    return createDocument<FirestoreUser>(COLLECTIONS.USERS, user, user.uid);
  },

  /**
   * Update an existing user
   * @param uid User's Firebase UID
   * @param user User data to update
   * @returns Promise<void>
   */
  updateUser: async (uid: string, user: Partial<FirestoreUser>): Promise<void> => {
    return updateDocument<FirestoreUser>(COLLECTIONS.USERS, uid, user);
  },

  /**
   * Get a user by Firebase UID
   * @param uid User's Firebase UID
   * @returns Promise resolving to the user or undefined if not found
   */
  getUser: async (uid: string): Promise<FirestoreUser | undefined> => {
    return getDocument<FirestoreUser>(COLLECTIONS.USERS, uid);
  }
};

/**
 * User Profile Data Service
 */
export const profileService = {
  /**
   * Create a new user profile
   * @param profile User profile data
   * @returns Promise resolving to the profile ID
   */
  createProfile: async (profile: FirestoreUserProfile): Promise<string> => {
    return createDocument<FirestoreUserProfile>(COLLECTIONS.PROFILES, profile, profile.userId);
  },

  /**
   * Update an existing user profile
   * @param userId User ID
   * @param profile User profile data to update
   * @returns Promise<void>
   */
  updateProfile: async (userId: string, profile: Partial<FirestoreUserProfile>): Promise<void> => {
    return updateDocument<FirestoreUserProfile>(COLLECTIONS.PROFILES, userId, profile);
  },

  /**
   * Get a user profile by user ID
   * @param userId User ID
   * @returns Promise resolving to the profile or undefined if not found
   */
  getProfile: async (userId: string): Promise<FirestoreUserProfile | undefined> => {
    return getDocument<FirestoreUserProfile>(COLLECTIONS.PROFILES, userId);
  }
};

// Export the collections for direct access if needed
export { COLLECTIONS } from './firebase';