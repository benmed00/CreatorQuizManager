import { 
  users, 
  quizzes, 
  questions, 
  options, 
  quizResults,
  type User, 
  type Quiz, 
  type Question, 
  type Option, 
  type QuizResult,
  type InsertUser,
  type InsertQuiz,
  type InsertQuestion,
  type InsertOption,
  type InsertQuizResult
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quiz operations
  getAllQuizzes(): Promise<Quiz[]>;
  getQuizzesByUserId(userId: string): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<Quiz>;
  deleteQuiz(id: number): Promise<void>;
  incrementQuizParticipantCount(id: number): Promise<void>;
  
  // Question operations
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByQuizId(quizId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestionCorrectAnswer(id: number, correctAnswerId: number): Promise<void>;
  deleteQuestionsByQuizId(quizId: number): Promise<void>;
  
  // Option operations
  getOption(id: number): Promise<Option | undefined>;
  getOptionsByQuestionId(questionId: number): Promise<Option[]>;
  createOption(option: InsertOption): Promise<Option>;
  deleteOptionsByQuestionId(questionId: number): Promise<void>;
  
  // Quiz result operations
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  getQuizResultsByQuizId(quizId: number): Promise<QuizResult[]>;
  getQuizResultsByUserId(userId: string): Promise<QuizResult[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  deleteQuizResultsByQuizId(quizId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizzes: Map<number, Quiz>;
  private questions: Map<number, Question>;
  private options: Map<number, Option>;
  private quizResults: Map<number, QuizResult>;
  
  private userId: number;
  private quizId: number;
  private questionId: number;
  private optionId: number;
  private resultId: number;

  constructor() {
    this.users = new Map();
    this.quizzes = new Map();
    this.questions = new Map();
    this.options = new Map();
    this.quizResults = new Map();
    
    this.userId = 1;
    this.quizId = 1;
    this.questionId = 1;
    this.optionId = 1;
    this.resultId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Initialize sample data for testing
  private initializeSampleData() {
    // Sample quizzes
    const sampleQuizzes: InsertQuiz[] = [
      {
        title: "Web Development Fundamentals",
        description: "Test your knowledge of HTML, CSS, and JavaScript with this comprehensive quiz.",
        userId: "sample-user-1",
        difficulty: "intermediate",
        category: "Web Development",
        questionCount: 10,
        timeLimit: "15",
        active: true
      },
      {
        title: "Data Science Essentials",
        description: "Explore core concepts in data analysis, statistics, and machine learning algorithms.",
        userId: "sample-user-1",
        difficulty: "intermediate",
        category: "Data Science",
        questionCount: 15,
        timeLimit: "25",
        active: true
      },
      {
        title: "UX Design Principles",
        description: "Test your knowledge of user experience design concepts, methods, and best practices.",
        userId: "sample-user-1",
        difficulty: "intermediate",
        category: "UX Design",
        questionCount: 12,
        timeLimit: "20",
        active: true
      }
    ];

    // Create sample quizzes
    sampleQuizzes.forEach(quizData => {
      const quiz: Quiz = {
        ...quizData,
        id: this.quizId++,
        completionRate: Math.floor(Math.random() * 100),
        participantCount: Math.floor(Math.random() * 50) + 10,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.quizzes.set(quiz.id, quiz);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Quiz operations
  async getAllQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }

  async getQuizzesByUserId(userId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.userId === userId
    );
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.quizId++;
    const quiz: Quiz = {
      ...insertQuiz,
      id,
      completionRate: 0,
      participantCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async updateQuiz(id: number, updateData: Partial<InsertQuiz>): Promise<Quiz> {
    const quiz = this.quizzes.get(id);
    if (!quiz) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    
    const updatedQuiz: Quiz = {
      ...quiz,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.quizzes.set(id, updatedQuiz);
    return updatedQuiz;
  }

  async deleteQuiz(id: number): Promise<void> {
    this.quizzes.delete(id);
  }

  async incrementQuizParticipantCount(id: number): Promise<void> {
    const quiz = this.quizzes.get(id);
    if (quiz) {
      quiz.participantCount += 1;
      
      // Update completion rate - in a real app, this would be calculated based on all results
      const results = await this.getQuizResultsByQuizId(id);
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const totalPossibleScore = results.length * quiz.questionCount;
      const completionRate = totalPossibleScore > 0 
        ? Math.round((totalScore / totalPossibleScore) * 100) 
        : 0;
      
      quiz.completionRate = completionRate;
      this.quizzes.set(id, quiz);
    }
  }

  // Question operations
  async getQuestion(id: number): Promise<Question | undefined> {
    const question = this.questions.get(id);
    if (question) {
      question.options = await this.getOptionsByQuestionId(id);
    }
    return question;
  }

  async getQuestionsByQuizId(quizId: number): Promise<Question[]> {
    const quizQuestions = Array.from(this.questions.values()).filter(
      (question) => question.quizId === quizId
    );
    
    // Attach options to each question
    for (const question of quizQuestions) {
      question.options = await this.getOptionsByQuestionId(question.id);
    }
    
    return quizQuestions;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const question: Question = {
      ...insertQuestion,
      id,
      correctAnswerId: null,
      createdAt: new Date(),
      options: []
    };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestionCorrectAnswer(id: number, correctAnswerId: number): Promise<void> {
    const question = this.questions.get(id);
    if (question) {
      question.correctAnswerId = correctAnswerId;
      this.questions.set(id, question);
    }
  }

  async deleteQuestionsByQuizId(quizId: number): Promise<void> {
    const questionIds = Array.from(this.questions.values())
      .filter(q => q.quizId === quizId)
      .map(q => q.id);
    
    questionIds.forEach(id => {
      this.questions.delete(id);
    });
  }

  // Option operations
  async getOption(id: number): Promise<Option | undefined> {
    return this.options.get(id);
  }

  async getOptionsByQuestionId(questionId: number): Promise<Option[]> {
    return Array.from(this.options.values()).filter(
      (option) => option.questionId === questionId
    );
  }

  async createOption(insertOption: InsertOption): Promise<Option> {
    const id = this.optionId++;
    const option: Option = {
      ...insertOption,
      id
    };
    this.options.set(id, option);
    return option;
  }

  async deleteOptionsByQuestionId(questionId: number): Promise<void> {
    const optionIds = Array.from(this.options.values())
      .filter(o => o.questionId === questionId)
      .map(o => o.id);
    
    optionIds.forEach(id => {
      this.options.delete(id);
    });
  }

  // Quiz result operations
  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    return this.quizResults.get(id);
  }

  async getQuizResultsByQuizId(quizId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(
      (result) => result.quizId === quizId
    );
  }

  async getQuizResultsByUserId(userId: string): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(
      (result) => result.userId === userId
    );
  }

  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.resultId++;
    const result: QuizResult = {
      ...insertResult,
      id,
      completedAt: new Date()
    };
    this.quizResults.set(id, result);
    return result;
  }

  async deleteQuizResultsByQuizId(quizId: number): Promise<void> {
    const resultIds = Array.from(this.quizResults.values())
      .filter(r => r.quizId === quizId)
      .map(r => r.id);
    
    resultIds.forEach(id => {
      this.quizResults.delete(id);
    });
  }
}

export const storage = new MemStorage();
