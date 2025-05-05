import { 
  users, 
  quizzes, 
  questions, 
  options, 
  quizResults,
  leaderboards,
  achievements,
  userAchievements,
  categories,
  tags,
  quizTags,
  type User, 
  type Quiz, 
  type Question, 
  type Option, 
  type QuizResult,
  type Leaderboard,
  type Achievement,
  type UserAchievement,
  type Category,
  type Tag,
  type QuizTag,
  type InsertUser,
  type InsertQuiz,
  type InsertQuestion,
  type InsertOption,
  type InsertQuizResult,
  type InsertLeaderboard,
  type InsertAchievement,
  type InsertUserAchievement,
  type InsertCategory,
  type InsertTag,
  type InsertQuizTag
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { angularQuestions } from "./angular-questions";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Tag operations
  getAllTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  getTagsByQuizId(quizId: number): Promise<Tag[]>;
  addTagToQuiz(quizId: number, tagId: number): Promise<QuizTag>;
  removeTagFromQuiz(quizId: number, tagId: number): Promise<void>;
  
  // Quiz operations
  getAllQuizzes(): Promise<Quiz[]>;
  getQuizzesByUserId(userId: string): Promise<Quiz[]>;
  getQuizzesByCategory(categoryId: number): Promise<Quiz[]>;
  getQuizzesByTag(tagId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<Quiz>;
  deleteQuiz(id: number): Promise<void>;
  incrementQuizParticipantCount(id: number): Promise<void>;
  
  // Question operations
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByQuizId(quizId: number): Promise<Question[]>;
  getAllQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question>;
  updateQuestionCorrectAnswer(id: number, correctAnswerId: number): Promise<void>;
  deleteQuestionsByQuizId(quizId: number): Promise<void>;
  deleteQuestion(id: number): Promise<void>;
  getTagsByQuestionId(questionId: number): Promise<Tag[]>;
  addTagToQuestion(questionId: number, tagId: number): Promise<void>;
  removeTagFromQuestion(questionId: number, tagId: number): Promise<void>;
  removeAllTagsFromQuestion(questionId: number): Promise<void>;
  
  // Option operations
  getOption(id: number): Promise<Option | undefined>;
  getOptionsByQuestionId(questionId: number): Promise<Option[]>;
  createOption(option: InsertOption): Promise<Option>;
  deleteOptionsByQuestionId(questionId: number): Promise<void>;
  
  // Quiz result operations
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  getQuizResultsByQuizId(quizId: number): Promise<QuizResult[]>;
  getQuizResultsByUserId(userId: string): Promise<QuizResult[]>;
  getAllQuizResults(): Promise<QuizResult[]>; // Added for analytics
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  deleteQuizResultsByQuizId(quizId: number): Promise<void>;
  
  // Leaderboard operations
  getLeaderboard(limit?: number): Promise<Leaderboard[]>;
  getUserLeaderboard(userId: string): Promise<Leaderboard | undefined>;
  createOrUpdateLeaderboard(userId: string, quizResult: QuizResult): Promise<Leaderboard>;
  updateRankings(): Promise<void>;
  
  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // User achievement operations
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  awardAchievement(userId: string, achievementId: number): Promise<UserAchievement>;
  checkAndAwardAchievements(userId: string): Promise<string[]>;
  
  // Analytics operations
  getQuizStatistics(quizId: number): Promise<{
    participantCount: number;
    averageScore: number;
    completionRate: number;
    averageTimeTaken: string;
  }>;
  getUserStatistics(userId: string): Promise<{
    quizzesTaken: number;
    averageScore: number;
    bestScore: number;
    totalTimeTaken: string;
    rank: number;
    percentile: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private tags: Map<number, Tag>;
  private quizTags: Map<number, QuizTag>;
  private quizzes: Map<number, Quiz>;
  private questions: Map<number, Question>;
  private options: Map<number, Option>;
  private quizResults: Map<number, QuizResult>;
  private leaderboards: Map<number, Leaderboard>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  
  private userId: number;
  private categoryId: number;
  private tagId: number;
  private quizTagId: number;
  private quizId: number;
  private questionId: number;
  private optionId: number;
  private resultId: number;
  private leaderboardId: number;
  private achievementId: number;
  private userAchievementId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.tags = new Map();
    this.quizTags = new Map();
    this.quizzes = new Map();
    this.questions = new Map();
    this.options = new Map();
    this.quizResults = new Map();
    this.leaderboards = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.tagId = 1;
    this.quizTagId = 1;
    this.quizId = 1;
    this.questionId = 1;
    this.optionId = 1;
    this.resultId = 1;
    this.leaderboardId = 1;
    this.achievementId = 1;
    this.userAchievementId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
    
    // Initialize Angular questions
    this.initializeAngularQuestions();
  }
  
  // Initialize Angular questions from the imported data
  private async initializeAngularQuestions() {
    console.log("Initializing Angular questions...");
    
    // Create tags for Angular questions
    const angularTag = await this.getTagByName("angular");
    const angularTagId = angularTag 
      ? angularTag.id
      : (await this.createTag({ name: "angular" })).id;
      
    // Create required categories if they don't exist
    let frameworkCategory = await this.getCategoryByName("Frameworks");
    if (!frameworkCategory) {
      frameworkCategory = await this.createCategory({
        name: "Frameworks",
        description: "Web and app development frameworks and libraries",
        iconName: "package"
      });
    }
    
    // Ensure all Angular questions have the proper category ID
    const categoryId = frameworkCategory.id;
    
    // Check for existing Angular questions to avoid duplicates by comparing texts
    const existingQuestions = await this.getAllQuestions();
    const existingAngularQuestionTexts = existingQuestions
      .filter(q => q.text.includes("Angular") || q.text.includes("NgModule") || q.text.includes("Component"))
      .map(q => q.text);
    
    // Only add questions that don't already exist by text comparison
    const questionsToAdd = angularQuestions.filter(q => 
      !existingAngularQuestionTexts.includes(q.text)
    );
    
    console.log(`Found ${questionsToAdd.length} new Angular questions to add.`);
    
    if (questionsToAdd.length === 0) {
      console.log("No new Angular questions to add. Skipping initialization.");
      return;
    }
      
    // For each Angular question that needs to be added
    for (const questionData of questionsToAdd) {
      try {
        // Create the question
        const question: InsertQuestion = {
          text: questionData.text,
          categoryId: questionData.categoryId,
          codeSnippet: questionData.codeSnippet || null,
          quizId: undefined, // Not attached to a specific quiz
          difficulty: questionData.difficulty || "intermediate"
        };
        
        const createdQuestion = await this.createQuestion(question);
        
        // Create options for the question
        for (const optionData of questionData.options) {
          const option: InsertOption = {
            questionId: createdQuestion.id,
            text: optionData.text,
            isCorrect: optionData.isCorrect
          };
          
          const createdOption = await this.createOption(option);
          
          // If this is the correct option, update the question with the correct answer ID
          if (optionData.isCorrect) {
            await this.updateQuestionCorrectAnswer(createdQuestion.id, createdOption.id);
          }
        }
        
        // Add tags to the question
        if (questionData.tags && questionData.tags.length > 0) {
          // Add the angular tag
          await this.addTagToQuestion(createdQuestion.id, angularTagId);
          
          // Add additional tags
          for (const tagName of questionData.tags) {
            if (tagName !== "angular") {
              let tag = await this.getTagByName(tagName);
              if (!tag) {
                tag = await this.createTag({ name: tagName });
              }
              await this.addTagToQuestion(createdQuestion.id, tag.id);
            }
          }
        }
      } catch (error) {
        console.error("Error creating Angular question:", error);
      }
    }
    
    console.log("Finished initializing Angular questions.");
  }

  // Initialize sample data for testing
  private initializeSampleData() {
    // Sample categories
    const sampleCategories: InsertCategory[] = [
      {
        name: "Web Development",
        description: "Web development tutorials and questions",
        iconName: "code"
      },
      {
        name: "Frameworks",
        description: "Web and app development frameworks and libraries",
        iconName: "package"
      },
      {
        name: "Data Science",
        description: "Data science and machine learning content",
        iconName: "database"
      },
      {
        name: "UX Design",
        description: "User experience design principles and practices",
        iconName: "layers"
      }
    ];
    
    // Create sample categories
    sampleCategories.forEach(categoryData => {
      const category: Category = {
        ...categoryData,
        id: this.categoryId++,
        createdAt: new Date()
      };
      this.categories.set(category.id, category);
    });
    
    // Sample quizzes
    const sampleQuizzes: InsertQuiz[] = [
      {
        title: "Web Development Fundamentals",
        description: "Test your knowledge of HTML, CSS, and JavaScript with this comprehensive quiz.",
        userId: "sample-user-1",
        difficulty: "intermediate",
        categoryId: 1, // Web Development
        questionCount: 10,
        timeLimit: "15",
        active: true
      },
      {
        title: "Data Science Essentials",
        description: "Explore core concepts in data analysis, statistics, and machine learning algorithms.",
        userId: "sample-user-1",
        difficulty: "intermediate",
        categoryId: 2, // Data Science
        questionCount: 15,
        timeLimit: "25",
        active: true
      },
      {
        title: "UX Design Principles",
        description: "Test your knowledge of user experience design concepts, methods, and best practices.",
        userId: "sample-user-1",
        difficulty: "intermediate",
        categoryId: 3, // UX Design
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
        updatedAt: new Date(),
        active: quizData.active ?? true
      };
      
      this.quizzes.set(quiz.id, quiz);
    });
    
    // Sample achievements
    const sampleAchievements: InsertAchievement[] = [
      {
        name: "First Quiz",
        description: "Completed your first quiz",
        criteria: "Complete 1 quiz",
        icon: "award"
      },
      {
        name: "Quiz Master",
        description: "Score 100% on a quiz",
        criteria: "Score 100% on any quiz",
        icon: "trophy"
      },
      {
        name: "Speed Demon",
        description: "Complete a quiz in less than half the allotted time",
        criteria: "Complete quiz in < 50% of time limit",
        icon: "zap"
      },
      {
        name: "Perfect Streak",
        description: "Complete 5 quizzes with scores above 90%",
        criteria: "5 quizzes with scores > 90%",
        icon: "star"
      },
      {
        name: "Knowledge Explorer",
        description: "Take quizzes in 3 different categories",
        criteria: "Quizzes in 3+ categories",
        icon: "compass"
      }
    ];
    
    // Create sample achievements
    sampleAchievements.forEach(achievementData => {
      const achievement: Achievement = {
        ...achievementData,
        id: this.achievementId++,
        createdAt: new Date()
      };
      
      this.achievements.set(achievement.id, achievement);
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
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name === name
    );
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = {
      ...category,
      id,
      createdAt: new Date()
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category> {
    const category = this.categories.get(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    const updatedCategory: Category = {
      ...category,
      ...updateData
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<void> {
    this.categories.delete(id);
  }
  
  // Tag operations
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async getTagByName(name: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(
      (tag) => tag.name === name
    );
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const id = this.tagId++;
    const newTag: Tag = {
      ...tag,
      id,
      createdAt: new Date()
    };
    this.tags.set(id, newTag);
    return newTag;
  }
  
  async getTagsByQuizId(quizId: number): Promise<Tag[]> {
    const quizTagEntries = Array.from(this.quizTags.values()).filter(
      (quizTag) => quizTag.quizId === quizId
    );
    
    const tagIds = quizTagEntries.map(entry => entry.tagId);
    return Array.from(this.tags.values()).filter(tag => 
      tagIds.includes(tag.id)
    );
  }
  
  async addTagToQuiz(quizId: number, tagId: number): Promise<QuizTag> {
    // Check if quiz and tag exist
    const quiz = await this.getQuiz(quizId);
    const tag = await this.getTag(tagId);
    
    if (!quiz || !tag) {
      throw new Error(`Quiz or tag not found`);
    }
    
    // Check if relation already exists
    const existing = Array.from(this.quizTags.values()).find(
      (quizTag) => quizTag.quizId === quizId && quizTag.tagId === tagId
    );
    
    if (existing) {
      return existing;
    }
    
    // Create new relation
    const id = this.quizTagId++;
    const quizTag: QuizTag = {
      id,
      quizId,
      tagId
    };
    
    this.quizTags.set(id, quizTag);
    return quizTag;
  }
  
  async removeTagFromQuiz(quizId: number, tagId: number): Promise<void> {
    const quizTagIds = Array.from(this.quizTags.values())
      .filter(qt => qt.quizId === quizId && qt.tagId === tagId)
      .map(qt => qt.id);
    
    quizTagIds.forEach(id => {
      this.quizTags.delete(id);
    });
  }
  
  // Quiz operations by category and tag
  async getQuizzesByCategory(categoryId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.categoryId === categoryId
    );
  }
  
  async getQuizzesByTag(tagId: number): Promise<Quiz[]> {
    const quizIds = Array.from(this.quizTags.values())
      .filter(quizTag => quizTag.tagId === tagId)
      .map(quizTag => quizTag.quizId);
    
    return Array.from(this.quizzes.values()).filter(quiz => 
      quizIds.includes(quiz.id)
    );
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
      updatedAt: new Date(),
      active: insertQuiz.active ?? true
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
      const currentParticipants = quiz.participantCount || 0;
      quiz.participantCount = currentParticipants + 1;
      
      // Update completion rate - in a real app, this would be calculated based on all results
      const results = await this.getQuizResultsByQuizId(id);
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const totalPossibleScore = results.length * (quiz.questionCount || 0);
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
  
  async getAllQuestions(): Promise<Question[]> {
    const allQuestions = Array.from(this.questions.values());
    
    // Attach options to each question
    for (const question of allQuestions) {
      question.options = await this.getOptionsByQuestionId(question.id);
    }
    
    return allQuestions;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const question: Question = {
      ...insertQuestion,
      id,
      correctAnswerId: null,
      createdAt: new Date(),
      codeSnippet: insertQuestion.codeSnippet || null,
      options: []
    };
    this.questions.set(id, question);
    return question;
  }
  
  async updateQuestion(id: number, updateData: Partial<InsertQuestion>): Promise<Question> {
    const question = this.questions.get(id);
    if (!question) {
      throw new Error(`Question with id ${id} not found`);
    }
    
    const updatedQuestion: Question = {
      ...question,
      ...updateData,
      // Preserve existing options
      options: question.options
    };
    
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
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
  
  async deleteQuestion(id: number): Promise<void> {
    // Delete options first
    await this.deleteOptionsByQuestionId(id);
    
    // Delete the question
    this.questions.delete(id);
  }
  
  // Question tag operations
  async getTagsByQuestionId(questionId: number): Promise<Tag[]> {
    // For simplicity, we'll use the same QuizTag system but with questionId instead of quizId
    // In a real implementation, you might want a separate QuestionTag entity
    const questionTagEntries = Array.from(this.quizTags.values()).filter(
      (tag) => tag.quizId === -questionId // Use negative quizId to differentiate from real quiz tags
    );
    
    const tagIds = questionTagEntries.map(entry => entry.tagId);
    return Array.from(this.tags.values()).filter(tag => 
      tagIds.includes(tag.id)
    );
  }
  
  async addTagToQuestion(questionId: number, tagId: number): Promise<void> {
    // Check if question and tag exist
    const question = await this.getQuestion(questionId);
    const tag = await this.getTag(tagId);
    
    if (!question || !tag) {
      throw new Error(`Question or tag not found`);
    }
    
    // Check if relation already exists
    const existing = Array.from(this.quizTags.values()).find(
      (quizTag) => quizTag.quizId === -questionId && quizTag.tagId === tagId
    );
    
    if (existing) {
      return; // Already exists
    }
    
    // Create new relation
    const id = this.quizTagId++;
    const questionTag: QuizTag = {
      id,
      quizId: -questionId, // Use negative quizId to differentiate from real quiz tags
      tagId
    };
    
    this.quizTags.set(id, questionTag);
  }
  
  async removeTagFromQuestion(questionId: number, tagId: number): Promise<void> {
    const questionTagIds = Array.from(this.quizTags.values())
      .filter(qt => qt.quizId === -questionId && qt.tagId === tagId)
      .map(qt => qt.id);
    
    questionTagIds.forEach(id => {
      this.quizTags.delete(id);
    });
  }
  
  async removeAllTagsFromQuestion(questionId: number): Promise<void> {
    const questionTagIds = Array.from(this.quizTags.values())
      .filter(qt => qt.quizId === -questionId)
      .map(qt => qt.id);
    
    questionTagIds.forEach(id => {
      this.quizTags.delete(id);
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
      id,
      isCorrect: insertOption.isCorrect ?? false
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
  
  async getAllQuizResults(): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values());
  }
  
  async getQuizStatistics(quizId: number): Promise<{ 
    participantCount: number; 
    averageScore: number; 
    completionRate: number;
    averageTimeTaken: string;
  }> {
    // Get the quiz
    const quiz = await this.getQuiz(quizId);
    if (!quiz) {
      throw new Error(`Quiz with id ${quizId} not found`);
    }
    
    // Get all results for this quiz
    const results = await this.getQuizResultsByQuizId(quizId);
    
    // Calculate average score
    const totalScore = results.reduce((sum: number, result) => sum + result.score, 0);
    const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;
    
    // Calculate completion rate based on scores
    const totalPossibleScore = results.length * 100; // 100% per quiz
    const completionRate = totalPossibleScore > 0 
      ? Math.round((totalScore / totalPossibleScore) * 100) 
      : 0;
    
    // Calculate average time taken
    let totalMinutes = 0;
    let totalSeconds = 0;
    
    results.forEach(result => {
      const timeParts = result.timeTaken.split(':');
      if (timeParts.length === 2) {
        totalMinutes += parseInt(timeParts[0]);
        totalSeconds += parseInt(timeParts[1]);
      }
    });
    
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    
    const averageMinutes = results.length > 0 ? Math.floor(totalMinutes / results.length) : 0;
    const averageSeconds = results.length > 0 ? Math.floor(totalSeconds / results.length) : 0;
    
    const averageTimeTaken = `${averageMinutes.toString().padStart(2, '0')}:${averageSeconds.toString().padStart(2, '0')}`;
    
    return {
      participantCount: quiz.participantCount || 0,
      averageScore,
      completionRate,
      averageTimeTaken
    };
  }
  
  async getUserStatistics(userId: string): Promise<{
    quizzesTaken: number;
    averageScore: number;
    bestScore: number;
    totalTimeTaken: string;
    rank: number;
    percentile: number;
  }> {
    // Get all results for this user
    const userResults = await this.getQuizResultsByUserId(userId);
    
    // Get leaderboard to calculate rank and percentile
    let leaderboard = await this.getUserLeaderboard(userId);
    if (!leaderboard) {
      return {
        quizzesTaken: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeTaken: "00:00",
        rank: 0,
        percentile: 0
      };
    }
    
    // Get all leaderboard entries to calculate percentile
    const allLeaderboards = Array.from(this.leaderboards.values());
    
    // Calculate percentile
    const totalUsers = allLeaderboards.length;
    const usersBelow = allLeaderboards.filter(l => 
      l.totalScore < leaderboard!.totalScore
    ).length;
    
    const percentile = totalUsers > 0 ? Math.round((usersBelow / totalUsers) * 100) : 0;
    
    // Calculate best score
    const scores = userResults.map(result => result.score);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    
    // Calculate average score
    const totalScore = userResults.reduce((sum: number, result) => sum + result.score, 0);
    const averageScore = userResults.length > 0 ? Math.round(totalScore / userResults.length) : 0;
    
    // Calculate total time taken
    let totalMinutes = 0;
    let totalSeconds = 0;
    
    userResults.forEach(result => {
      const timeParts = result.timeTaken.split(':');
      if (timeParts.length === 2) {
        totalMinutes += parseInt(timeParts[0]);
        totalSeconds += parseInt(timeParts[1]);
      }
    });
    
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    
    const totalTimeTaken = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    
    return {
      quizzesTaken: userResults.length,
      averageScore,
      bestScore,
      totalTimeTaken,
      rank: leaderboard.ranking || 0,
      percentile
    };
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
  
  // Leaderboard operations
  async getLeaderboard(limit: number = 10): Promise<Leaderboard[]> {
    return Array.from(this.leaderboards.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  }
  
  async getUserLeaderboard(userId: string): Promise<Leaderboard | undefined> {
    return Array.from(this.leaderboards.values()).find(
      (leaderboard) => leaderboard.userId === userId
    );
  }
  
  async createOrUpdateLeaderboard(userId: string, quizResult: QuizResult): Promise<Leaderboard> {
    // Find existing leaderboard entry or create new one
    let leaderboard = await this.getUserLeaderboard(userId);
    
    if (!leaderboard) {
      // Create new leaderboard entry
      const id = this.leaderboardId++;
      leaderboard = {
        id,
        userId,
        totalScore: 0,
        quizzesCompleted: 0,
        averageScore: 0,
        bestStreak: 0,
        currentStreak: 0,
        lastActive: new Date(),
        ranking: 0,
        updatedAt: new Date()
      };
    }
    
    // Update leaderboard stats
    const quiz = await this.getQuiz(quizResult.quizId);
    if (!quiz) {
      throw new Error(`Quiz with id ${quizResult.quizId} not found`);
    }
    
    const maxPossibleScore = quiz.questionCount;
    const scorePercentage = (quizResult.score / maxPossibleScore) * 100;
    
    // Update stats
    leaderboard.totalScore += quizResult.score;
    leaderboard.quizzesCompleted += 1;
    leaderboard.averageScore = Math.round(leaderboard.totalScore / leaderboard.quizzesCompleted);
    leaderboard.lastActive = new Date();
    
    // Update streak
    if (scorePercentage >= 70) {
      leaderboard.currentStreak += 1;
      if (leaderboard.currentStreak > leaderboard.bestStreak) {
        leaderboard.bestStreak = leaderboard.currentStreak;
      }
    } else {
      leaderboard.currentStreak = 0;
    }
    
    this.leaderboards.set(leaderboard.id, leaderboard);
    await this.updateRankings();
    
    return leaderboard;
  }
  
  async updateRankings(): Promise<void> {
    // Get all leaderboards and sort by total score
    const sortedLeaderboards = Array.from(this.leaderboards.values())
      .sort((a, b) => b.totalScore - a.totalScore);
    
    // Update rankings
    for (let i = 0; i < sortedLeaderboards.length; i++) {
      const leaderboard = sortedLeaderboards[i];
      leaderboard.ranking = i + 1;
      this.leaderboards.set(leaderboard.id, leaderboard);
    }
  }
  
  // Achievement operations
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementId++;
    const newAchievement: Achievement = {
      ...achievement,
      id,
      createdAt: new Date()
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }
  
  // User achievement operations
  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
    
    // Attach achievement details
    return userAchievements.map(ua => {
      const achievement = this.achievements.get(ua.achievementId);
      if (!achievement) {
        throw new Error(`Achievement with id ${ua.achievementId} not found`);
      }
      return { ...ua, achievement };
    });
  }
  
  async awardAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    // Check if achievement exists
    const achievement = await this.getAchievement(achievementId);
    if (!achievement) {
      throw new Error(`Achievement with id ${achievementId} not found`);
    }
    
    // Check if user already has this achievement
    const existingUserAchievement = Array.from(this.userAchievements.values())
      .find(ua => ua.userId === userId && ua.achievementId === achievementId);
    
    if (existingUserAchievement) {
      return existingUserAchievement;
    }
    
    // Award new achievement
    const id = this.userAchievementId++;
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      earnedAt: new Date()
    };
    
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }
  
  async checkAndAwardAchievements(userId: string): Promise<string[]> {
    const awardedAchievements: string[] = [];
    
    // Get user data
    const userResults = await this.getQuizResultsByUserId(userId);
    const userLeaderboard = await this.getUserLeaderboard(userId);
    
    if (!userLeaderboard || userResults.length === 0) {
      return awardedAchievements;
    }
    
    // Check achievement criteria
    const achievements = await this.getAllAchievements();
    
    // "First Quiz" achievement
    if (userResults.length === 1) {
      const firstQuizAchievement = achievements.find(a => a.name === "First Quiz");
      if (firstQuizAchievement) {
        await this.awardAchievement(userId, firstQuizAchievement.id);
        awardedAchievements.push(firstQuizAchievement.name);
      }
    }
    
    // "Quiz Master" achievement
    const perfectScores = userResults.filter(r => {
      const quiz = this.quizzes.get(r.quizId);
      return quiz && r.score === quiz.questionCount;
    });
    
    if (perfectScores.length > 0) {
      const quizMasterAchievement = achievements.find(a => a.name === "Quiz Master");
      if (quizMasterAchievement) {
        await this.awardAchievement(userId, quizMasterAchievement.id);
        awardedAchievements.push(quizMasterAchievement.name);
      }
    }
    
    // "Speed Demon" achievement
    const speedyResults = userResults.filter(r => {
      const quiz = this.quizzes.get(r.quizId);
      if (!quiz) return false;
      
      // Check if completed in less than half the time limit
      const timeLimitMinutes = parseInt(quiz.timeLimit, 10);
      const timeTakenMinutes = parseInt(r.timeTaken.split(':')[0], 10);
      
      return timeTakenMinutes < (timeLimitMinutes / 2);
    });
    
    if (speedyResults.length > 0) {
      const speedDemonAchievement = achievements.find(a => a.name === "Speed Demon");
      if (speedDemonAchievement) {
        await this.awardAchievement(userId, speedDemonAchievement.id);
        awardedAchievements.push(speedDemonAchievement.name);
      }
    }
    
    // "Perfect Streak" achievement
    if (userLeaderboard.bestStreak >= 5) {
      const perfectStreakAchievement = achievements.find(a => a.name === "Perfect Streak");
      if (perfectStreakAchievement) {
        await this.awardAchievement(userId, perfectStreakAchievement.id);
        awardedAchievements.push(perfectStreakAchievement.name);
      }
    }
    
    // "Knowledge Explorer" achievement
    const categories = new Set<string>();
    for (const result of userResults) {
      const quiz = this.quizzes.get(result.quizId);
      if (quiz) {
        categories.add(quiz.category);
      }
    }
    
    if (categories.size >= 3) {
      const explorerAchievement = achievements.find(a => a.name === "Knowledge Explorer");
      if (explorerAchievement) {
        await this.awardAchievement(userId, explorerAchievement.id);
        awardedAchievements.push(explorerAchievement.name);
      }
    }
    
    return awardedAchievements;
  }
}

// Database-backed storage implementation

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Quiz operations
  async getAllQuizzes(): Promise<Quiz[]> {
    return await db.select().from(quizzes);
  }

  async getQuizzesByUserId(userId: string): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.userId, userId));
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const now = new Date();
    const [quiz] = await db.insert(quizzes).values({
      ...insertQuiz,
      completionRate: 0,
      participantCount: 0,
      createdAt: now,
      updatedAt: now
    }).returning();
    return quiz;
  }

  async updateQuiz(id: number, updateData: Partial<InsertQuiz>): Promise<Quiz> {
    const [updatedQuiz] = await db.update(quizzes)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(quizzes.id, id))
      .returning();
    
    if (!updatedQuiz) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    
    return updatedQuiz;
  }

  async deleteQuiz(id: number): Promise<void> {
    // First delete related entities (cascade delete)
    await this.deleteQuizResultsByQuizId(id);
    
    // Delete questions will also delete options
    await this.deleteQuestionsByQuizId(id);
    
    // Then delete the quiz
    await db.delete(quizzes).where(eq(quizzes.id, id));
  }

  async incrementQuizParticipantCount(id: number): Promise<void> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    
    if (quiz) {
      // Get all results for this quiz to calculate completion rate
      const results = await this.getQuizResultsByQuizId(id);
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const totalPossibleScore = results.length * (quiz.questionCount || 0);
      const completionRate = totalPossibleScore > 0 
        ? Math.round((totalScore / totalPossibleScore) * 100) 
        : 0;
      
      await db.update(quizzes)
        .set({
          participantCount: (quiz.participantCount || 0) + 1,
          completionRate: completionRate,
          updatedAt: new Date()
        })
        .where(eq(quizzes.id, id));
    }
  }

  // Question operations
  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    
    if (question) {
      const questionOptions = await this.getOptionsByQuestionId(id);
      return {
        ...question,
        options: questionOptions
      };
    }
    
    return undefined;
  }

  async getQuestionsByQuizId(quizId: number): Promise<Question[]> {
    const quizQuestions = await db.select().from(questions).where(eq(questions.quizId, quizId));
    
    // Get options for each question
    const questionsWithOptions: Question[] = [];
    const seenQuestionIds = new Set(); // Track question IDs to prevent duplicates
    
    for (const question of quizQuestions) {
      // Skip duplicate questions
      if (seenQuestionIds.has(question.id)) {
        console.log(`Skipping duplicate question with ID: ${question.id}`);
        continue;
      }
      
      // Mark this question as processed
      seenQuestionIds.add(question.id);
      
      const options = await this.getOptionsByQuestionId(question.id);
      questionsWithOptions.push({
        ...question,
        options: options
      });
    }
    
    console.log(`Questions loaded: ${questionsWithOptions.length}`);
    return questionsWithOptions;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values({
      ...insertQuestion,
      createdAt: new Date()
    }).returning();
    
    return {
      ...question,
      options: []
    };
  }

  async updateQuestionCorrectAnswer(id: number, correctAnswerId: number): Promise<void> {
    await db.update(questions)
      .set({ correctAnswerId })
      .where(eq(questions.id, id));
  }

  async deleteQuestionsByQuizId(quizId: number): Promise<void> {
    // First get all question IDs
    const questionsToDelete = await db.select().from(questions).where(eq(questions.quizId, quizId));
    
    // Delete options for each question
    for (const question of questionsToDelete) {
      await this.deleteOptionsByQuestionId(question.id);
    }
    
    // Then delete the questions
    await db.delete(questions).where(eq(questions.quizId, quizId));
  }

  // Option operations
  async getOption(id: number): Promise<Option | undefined> {
    const [option] = await db.select().from(options).where(eq(options.id, id));
    return option;
  }

  async getOptionsByQuestionId(questionId: number): Promise<Option[]> {
    return await db.select().from(options).where(eq(options.questionId, questionId));
  }

  async createOption(insertOption: InsertOption): Promise<Option> {
    const [option] = await db.insert(options).values(insertOption).returning();
    return option;
  }

  async deleteOptionsByQuestionId(questionId: number): Promise<void> {
    await db.delete(options).where(eq(options.questionId, questionId));
  }

  // Quiz result operations
  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    const [result] = await db.select().from(quizResults).where(eq(quizResults.id, id));
    return result;
  }

  async getQuizResultsByQuizId(quizId: number): Promise<QuizResult[]> {
    return await db.select()
      .from(quizResults)
      .where(eq(quizResults.quizId, quizId))
      .orderBy(desc(quizResults.completedAt));
  }

  async getQuizResultsByUserId(userId: string): Promise<QuizResult[]> {
    return await db.select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId))
      .orderBy(desc(quizResults.completedAt));
  }
  
  async getAllQuizResults(): Promise<QuizResult[]> {
    return await db.select()
      .from(quizResults)
      .orderBy(desc(quizResults.completedAt));
  }
  
  async getQuizStatistics(quizId: number): Promise<{ 
    participantCount: number; 
    averageScore: number; 
    completionRate: number;
    averageTimeTaken: string;
  }> {
    // Get the quiz
    const quiz = await this.getQuiz(quizId);
    if (!quiz) {
      throw new Error(`Quiz with id ${quizId} not found`);
    }
    
    // Get all results for this quiz
    const results = await this.getQuizResultsByQuizId(quizId);
    
    // Calculate average score
    const totalScore = results.reduce((sum: number, result) => sum + result.score, 0);
    const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;
    
    // Calculate completion rate based on scores
    const totalPossibleScore = results.length * 100; // 100% per quiz
    const completionRate = totalPossibleScore > 0 
      ? Math.round((totalScore / totalPossibleScore) * 100) 
      : 0;
    
    // Calculate average time taken
    let totalMinutes = 0;
    let totalSeconds = 0;
    
    results.forEach(result => {
      const timeParts = result.timeTaken.split(':');
      if (timeParts.length === 2) {
        totalMinutes += parseInt(timeParts[0]);
        totalSeconds += parseInt(timeParts[1]);
      }
    });
    
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    
    const averageMinutes = results.length > 0 ? Math.floor(totalMinutes / results.length) : 0;
    const averageSeconds = results.length > 0 ? Math.floor(totalSeconds / results.length) : 0;
    
    const averageTimeTaken = `${averageMinutes.toString().padStart(2, '0')}:${averageSeconds.toString().padStart(2, '0')}`;
    
    return {
      participantCount: quiz.participantCount || 0,
      averageScore,
      completionRate,
      averageTimeTaken
    };
  }
  
  async getUserStatistics(userId: string): Promise<{
    quizzesTaken: number;
    averageScore: number;
    bestScore: number;
    totalTimeTaken: string;
    rank: number;
    percentile: number;
  }> {
    // Get all results for this user
    const userResults = await this.getQuizResultsByUserId(userId);
    
    // Get leaderboard to calculate rank and percentile
    let leaderboard = await this.getUserLeaderboard(userId);
    if (!leaderboard) {
      return {
        quizzesTaken: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeTaken: "00:00",
        rank: 0,
        percentile: 0
      };
    }
    
    // Get all leaderboard entries to calculate percentile
    const allLeaderboards = await this.getLeaderboard(1000); // Get all leaderboards
    
    // Calculate percentile
    const totalUsers = allLeaderboards.length;
    const usersBelow = allLeaderboards.filter(l => 
      l.totalScore < leaderboard!.totalScore
    ).length;
    
    const percentile = totalUsers > 0 ? Math.round((usersBelow / totalUsers) * 100) : 0;
    
    // Calculate best score
    const scores = userResults.map(result => result.score);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    
    // Calculate average score
    const totalScore = userResults.reduce((sum: number, result) => sum + result.score, 0);
    const averageScore = userResults.length > 0 ? Math.round(totalScore / userResults.length) : 0;
    
    // Calculate total time taken
    let totalMinutes = 0;
    let totalSeconds = 0;
    
    userResults.forEach(result => {
      const timeParts = result.timeTaken.split(':');
      if (timeParts.length === 2) {
        totalMinutes += parseInt(timeParts[0]);
        totalSeconds += parseInt(timeParts[1]);
      }
    });
    
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    
    const totalTimeTaken = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    
    return {
      quizzesTaken: userResults.length,
      averageScore,
      bestScore,
      totalTimeTaken,
      rank: leaderboard.ranking || 0,
      percentile
    };
  }

  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db.insert(quizResults)
      .values({
        ...insertResult,
        completedAt: new Date()
      })
      .returning();
      
    return result;
  }

  async deleteQuizResultsByQuizId(quizId: number): Promise<void> {
    await db.delete(quizResults).where(eq(quizResults.quizId, quizId));
  }
  
  // Leaderboard operations
  async getLeaderboard(limit: number = 10): Promise<Leaderboard[]> {
    return await db.select()
      .from(leaderboards)
      .orderBy(desc(leaderboards.totalScore))
      .limit(limit);
  }
  
  async getUserLeaderboard(userId: string): Promise<Leaderboard | undefined> {
    const [leaderboard] = await db.select()
      .from(leaderboards)
      .where(eq(leaderboards.userId, userId));
    
    return leaderboard;
  }
  
  async createOrUpdateLeaderboard(userId: string, quizResult: QuizResult): Promise<Leaderboard> {
    // Find existing leaderboard entry
    const [existingLeaderboard] = await db.select()
      .from(leaderboards)
      .where(eq(leaderboards.userId, userId));
    
    const quiz = await this.getQuiz(quizResult.quizId);
    if (!quiz) {
      throw new Error(`Quiz with id ${quizResult.quizId} not found`);
    }
    
    const maxPossibleScore = quiz.questionCount;
    const scorePercentage = (quizResult.score / maxPossibleScore) * 100;
    
    if (existingLeaderboard) {
      // Update existing leaderboard
      const currentStreak = scorePercentage >= 70 
        ? existingLeaderboard.currentStreak + 1 
        : 0;
      
      const bestStreak = Math.max(existingLeaderboard.bestStreak, currentStreak);
      
      const totalScore = existingLeaderboard.totalScore + quizResult.score;
      const quizzesCompleted = existingLeaderboard.quizzesCompleted + 1;
      const averageScore = Math.round(totalScore / quizzesCompleted);
      
      const [updatedLeaderboard] = await db.update(leaderboards)
        .set({
          totalScore,
          quizzesCompleted,
          averageScore,
          bestStreak,
          currentStreak,
          lastActive: new Date(),
          updatedAt: new Date()
        })
        .where(eq(leaderboards.id, existingLeaderboard.id))
        .returning();
      
      await this.updateRankings();
      return updatedLeaderboard;
    } else {
      // Create new leaderboard entry
      const [newLeaderboard] = await db.insert(leaderboards)
        .values({
          userId,
          totalScore: quizResult.score,
          quizzesCompleted: 1,
          averageScore: quizResult.score,
          bestStreak: scorePercentage >= 70 ? 1 : 0,
          currentStreak: scorePercentage >= 70 ? 1 : 0,
          lastActive: new Date(),
          ranking: 0,
          updatedAt: new Date()
        })
        .returning();
      
      await this.updateRankings();
      return newLeaderboard;
    }
  }
  
  async updateRankings(): Promise<void> {
    // Get all leaderboards sorted by total score
    const allLeaderboards = await db.select()
      .from(leaderboards)
      .orderBy(desc(leaderboards.totalScore));
    
    // Update rankings for each leaderboard
    for (let i = 0; i < allLeaderboards.length; i++) {
      const leaderboard = allLeaderboards[i];
      await db.update(leaderboards)
        .set({ ranking: i + 1 })
        .where(eq(leaderboards.id, leaderboard.id));
    }
  }
  
  // Achievement operations
  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }
  
  async getAchievement(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db.select()
      .from(achievements)
      .where(eq(achievements.id, id));
    
    return achievement;
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements)
      .values({
        ...achievement,
        createdAt: new Date()
      })
      .returning();
    
    return newAchievement;
  }
  
  // User achievement operations
  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievementData = await db.select({
      id: userAchievements.id,
      userId: userAchievements.userId,
      achievementId: userAchievements.achievementId,
      earnedAt: userAchievements.earnedAt,
      achievement: achievements
    })
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId))
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id));
    
    return userAchievementData as (UserAchievement & { achievement: Achievement })[];
  }
  
  async awardAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    // Check if achievement exists
    const achievement = await this.getAchievement(achievementId);
    if (!achievement) {
      throw new Error(`Achievement with id ${achievementId} not found`);
    }
    
    // Check if user already has this achievement
    const [existingUserAchievement] = await db.select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));
    
    if (existingUserAchievement) {
      return existingUserAchievement;
    }
    
    // Award new achievement
    const [newUserAchievement] = await db.insert(userAchievements)
      .values({
        userId,
        achievementId,
        earnedAt: new Date()
      })
      .returning();
    
    return newUserAchievement;
  }
  
  async checkAndAwardAchievements(userId: string): Promise<string[]> {
    const awardedAchievements: string[] = [];
    
    // Get user quiz results
    const userResults = await this.getQuizResultsByUserId(userId);
    
    // Get user leaderboard
    const userLeaderboard = await this.getUserLeaderboard(userId);
    
    if (!userLeaderboard || userResults.length === 0) {
      return awardedAchievements;
    }
    
    // Get all achievements
    const allAchievements = await this.getAllAchievements();
    
    // Check for "First Quiz" achievement
    if (userResults.length === 1) {
      const firstQuizAchievement = allAchievements.find(a => a.name === "First Quiz");
      if (firstQuizAchievement) {
        await this.awardAchievement(userId, firstQuizAchievement.id);
        awardedAchievements.push(firstQuizAchievement.name);
      }
    }
    
    // Check for "Quiz Master" achievement (perfect score)
    const perfectScoreQuizzes: number[] = [];
    for (const result of userResults) {
      const quiz = await this.getQuiz(result.quizId);
      if (quiz && result.score === quiz.questionCount) {
        perfectScoreQuizzes.push(result.quizId);
      }
    }
    
    if (perfectScoreQuizzes.length > 0) {
      const quizMasterAchievement = allAchievements.find(a => a.name === "Quiz Master");
      if (quizMasterAchievement) {
        await this.awardAchievement(userId, quizMasterAchievement.id);
        awardedAchievements.push(quizMasterAchievement.name);
      }
    }
    
    // Check for "Speed Demon" achievement
    const speedyResults: number[] = [];
    for (const result of userResults) {
      const quiz = await this.getQuiz(result.quizId);
      if (!quiz) continue;
      
      // Check if completed in less than half the time limit
      const timeLimitMinutes = parseInt(quiz.timeLimit, 10);
      const timeTakenMinutes = parseInt(result.timeTaken.split(':')[0], 10);
      
      if (timeTakenMinutes < (timeLimitMinutes / 2)) {
        speedyResults.push(result.quizId);
      }
    }
    
    if (speedyResults.length > 0) {
      const speedDemonAchievement = allAchievements.find(a => a.name === "Speed Demon");
      if (speedDemonAchievement) {
        await this.awardAchievement(userId, speedDemonAchievement.id);
        awardedAchievements.push(speedDemonAchievement.name);
      }
    }
    
    // Check for "Perfect Streak" achievement
    if (userLeaderboard.bestStreak >= 5) {
      const perfectStreakAchievement = allAchievements.find(a => a.name === "Perfect Streak");
      if (perfectStreakAchievement) {
        await this.awardAchievement(userId, perfectStreakAchievement.id);
        awardedAchievements.push(perfectStreakAchievement.name);
      }
    }
    
    // Check for "Knowledge Explorer" achievement
    const categories = new Set<string>();
    for (const result of userResults) {
      const quiz = await this.getQuiz(result.quizId);
      if (quiz) {
        categories.add(quiz.category);
      }
    }
    
    if (categories.size >= 3) {
      const explorerAchievement = allAchievements.find(a => a.name === "Knowledge Explorer");
      if (explorerAchievement) {
        await this.awardAchievement(userId, explorerAchievement.id);
        awardedAchievements.push(explorerAchievement.name);
      }
    }
    
    return awardedAchievements;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
