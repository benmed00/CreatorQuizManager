import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (already implemented)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  userId: text("user_id").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
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
  quizId: integer("quiz_id").notNull(),
  quizTitle: text("quiz_title").notNull(),
  text: text("text").notNull(),
  codeSnippet: text("code_snippet"),
  correctAnswerId: integer("correct_answer_id"),
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

// Define types for frontend use
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type Question = typeof questions.$inferSelect & {
  options: Option[];
};
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Option = typeof options.$inferSelect;
export type InsertOption = z.infer<typeof insertOptionSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

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
});

export type QuizGenerationRequest = z.infer<typeof quizGenerationSchema>;
