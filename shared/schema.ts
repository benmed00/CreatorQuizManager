import { pgTable, text, serial, integer, boolean, timestamp, jsonb, primaryKey, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (already implemented)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tags table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz-Tags join table
export const quizTags = pgTable("quiz_tags", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  tagId: integer("tag_id").notNull(),
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  userId: text("user_id").notNull(),
  difficulty: text("difficulty").notNull(),
  categoryId: integer("category_id").notNull(),
  questionCount: integer("question_count").notNull(),
  timeLimit: text("time_limit").notNull(),
  active: boolean("active").default(true),
  completionRate: integer("completion_rate").default(0),
  participantCount: integer("participant_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id"), // Can be null for standalone questions in the question bank
  quizTitle: text("quiz_title").default("Question Bank"), // Default for standalone questions
  text: text("text").notNull(),
  codeSnippet: text("code_snippet"),
  correctAnswerId: integer("correct_answer_id"),
  categoryId: integer("category_id"), // Added for categorization
  difficulty: text("difficulty").default("intermediate"), // Added for difficulty level
  createdAt: timestamp("created_at").defaultNow(),
});

// Options table
export const options = pgTable("options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull(),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").default(false),
});

// Quiz results table
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  userId: text("user_id").notNull(),
  score: integer("score").notNull(),
  timeTaken: text("time_taken").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  answers: jsonb("answers").notNull(),
});

// Leaderboard table for tracking user rankings
export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  totalScore: integer("total_score").notNull().default(0),
  quizzesCompleted: integer("quizzes_completed").notNull().default(0),
  averageScore: integer("average_score").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  lastActive: timestamp("last_active").defaultNow(),
  ranking: integer("ranking").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievements table for badges and rewards
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  criteria: text("criteria").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements to track which users have earned which achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.achievementId),
  };
});

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  quizzes: many(quizzes),
  quizResults: many(quizResults),
  leaderboard: one(leaderboards, {
    fields: [users.id],
    references: [leaderboards.userId],
  }),
  userAchievements: many(userAchievements),
}));

// Relations for categories
export const categoriesRelations = relations(categories, ({ many }) => ({
  quizzes: many(quizzes),
}));

// Relations for tags
export const tagsRelations = relations(tags, ({ many }) => ({
  quizTags: many(quizTags),
}));

// Relations for quiz tags
export const quizTagsRelations = relations(quizTags, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizTags.quizId],
    references: [quizzes.id],
  }),
  tag: one(tags, {
    fields: [quizTags.tagId],
    references: [tags.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  user: one(users, {
    fields: [quizzes.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [quizzes.categoryId],
    references: [categories.id],
  }),
  questions: many(questions),
  results: many(quizResults),
  quizTags: many(quizTags),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
    relationName: "questionToQuiz"
  }),
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
    relationName: "questionToCategory"
  }),
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizResults.quizId],
    references: [quizzes.id],
  }),
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
}));

// Relations for leaderboards
export const leaderboardsRelations = relations(leaderboards, ({ one }) => ({
  user: one(users, {
    fields: [leaderboards.userId],
    references: [users.id],
  }),
}));

// Relations for achievements
export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

// Relations for user achievements
export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Schema for inserting quizzes
export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  completionRate: true,
  participantCount: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for inserting questions
export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  correctAnswerId: true,
  createdAt: true,
});

// Schema for inserting options
export const insertOptionSchema = createInsertSchema(options).omit({
  id: true,
});

// Schema for inserting quiz results
export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  completedAt: true,
});

// Schema for inserting leaderboard entries
export const insertLeaderboardSchema = createInsertSchema(leaderboards).omit({
  id: true,
  totalScore: true,
  quizzesCompleted: true,
  averageScore: true,
  bestStreak: true,
  currentStreak: true,
  lastActive: true,
  ranking: true,
  updatedAt: true,
});

// Schema for inserting achievements
export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

// Schema for inserting user achievements
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

// Schema for categories
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

// Schema for tags
export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

// Schema for quiz tags
export const insertQuizTagSchema = createInsertSchema(quizTags).omit({
  id: true,
});

// Define types for frontend use
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type QuizTag = typeof quizTags.$inferSelect;
export type InsertQuizTag = z.infer<typeof insertQuizTagSchema>;

export type Quiz = typeof quizzes.$inferSelect & {
  category?: Category;
  tags?: Tag[];
};
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type Question = typeof questions.$inferSelect & {
  options: Option[];
};
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Option = typeof options.$inferSelect;
export type InsertOption = z.infer<typeof insertOptionSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

export type Leaderboard = typeof leaderboards.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

// Define type for user answers during quiz
export type UserAnswer = {
  questionId: number;
  answerId: number | null;
};

// Schema for OpenAI quiz generation request
export const quizGenerationSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  questionCount: z.string().min(1, "Question count is required"),
  timeLimit: z.string().min(1, "Time limit is required"),
  includeCode: z.boolean().optional(),
  userId: z.string().min(1, "User ID is required"),
  categoryId: z.number().optional().default(1), // Default to General Knowledge if not provided
});

export type QuizGenerationRequest = z.infer<typeof quizGenerationSchema>;
