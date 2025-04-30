import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateQuiz } from "./openai";
import { sendQuizResult } from "./email";
import { z } from "zod";
import { 
  quizGenerationSchema, 
  insertQuizResultSchema,
  UserAnswer,
  Question,
  Leaderboard,
  Achievement,
  UserAchievement
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all quizzes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const quizzes = userId 
        ? await storage.getQuizzesByUserId(userId)
        : await storage.getAllQuizzes();
      
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  // Get a specific quiz
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Get questions for a quiz
  app.get("/api/quizzes/:id/questions", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const questions = await storage.getQuestionsByQuizId(quizId);
      
      if (!questions || questions.length === 0) {
        return res.status(404).json({ message: "No questions found for this quiz" });
      }
      
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Generate a quiz using OpenAI
  app.post("/api/quizzes/generate", async (req, res) => {
    try {
      const validatedData = quizGenerationSchema.parse(req.body);
      
      // Call OpenAI to generate quiz content
      const generatedQuiz = await generateQuiz(validatedData);
      
      // Save the generated quiz to storage
      const quiz = await storage.createQuiz({
        title: generatedQuiz.title,
        description: generatedQuiz.description,
        userId: validatedData.userId,
        difficulty: validatedData.difficulty,
        category: generatedQuiz.category,
        questionCount: parseInt(validatedData.questionCount),
        timeLimit: validatedData.timeLimit,
        active: true
      });
      
      // Create questions and options
      for (const questionData of generatedQuiz.questions) {
        const question = await storage.createQuestion({
          quizId: quiz.id,
          quizTitle: quiz.title,
          text: questionData.text,
          codeSnippet: questionData.codeSnippet || null
        });
        
        let correctOptionId: number | null = null;
        
        // Create options for the question
        for (let i = 0; i < questionData.options.length; i++) {
          const option = await storage.createOption({
            questionId: question.id,
            text: questionData.options[i],
            isCorrect: i === questionData.correctOptionIndex
          });
          
          if (i === questionData.correctOptionIndex) {
            correctOptionId = option.id;
          }
        }
        
        // Update question with correct answer ID
        if (correctOptionId) {
          await storage.updateQuestionCorrectAnswer(question.id, correctOptionId);
        }
      }
      
      res.status(201).json({ 
        message: "Quiz generated successfully", 
        id: quiz.id 
      });
    } catch (error) {
      console.error("Error generating quiz:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  // Submit a completed quiz
  app.post("/api/quizzes/:id/submit", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const { userId, answers } = req.body;
      
      if (!userId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Get the quiz and its questions
      const quiz = await storage.getQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      const questions = await storage.getQuestionsByQuizId(quizId);
      
      // Calculate score
      let score = 0;
      const userAnswers = answers as UserAnswer[];
      
      for (const answer of userAnswers) {
        const question = questions.find(q => q.id === answer.questionId);
        if (question && answer.answerId === question.correctAnswerId) {
          score++;
        }
      }
      
      // Create quiz result
      const timeTaken = `${Math.floor(Math.random() * 10) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
      const result = await storage.createQuizResult({
        quizId,
        userId,
        score,
        timeTaken,
        answers: userAnswers
      });
      
      // Update quiz completion rate and participant count
      await storage.incrementQuizParticipantCount(quizId);
      
      res.status(201).json({ 
        message: "Quiz submitted successfully", 
        resultId: result.id,
        score
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Get a specific quiz result
  app.get("/api/results/:id", async (req, res) => {
    try {
      const resultId = parseInt(req.params.id);
      const result = await storage.getQuizResult(resultId);
      
      if (!result) {
        return res.status(404).json({ message: "Quiz result not found" });
      }
      
      // Get quiz and questions for the result
      const quiz = await storage.getQuiz(result.quizId);
      const questions = await storage.getQuestionsByQuizId(result.quizId);
      
      // Format questions with user answers for the result page
      const formattedQuestions = await Promise.all(
        questions.map(async (question) => {
          const userAnswer = (result.answers as UserAnswer[]).find(
            a => a.questionId === question.id
          );
          
          const selectedOption = userAnswer?.answerId 
            ? question.options.find(o => o.id === userAnswer.answerId)
            : null;
            
          const correctOption = question.options.find(o => o.id === question.correctAnswerId);
          
          return {
            id: question.id,
            text: question.text,
            codeSnippet: question.codeSnippet,
            userAnswer: selectedOption?.text || "No answer",
            correctAnswer: correctOption?.text || "",
            isCorrect: userAnswer?.answerId === question.correctAnswerId
          };
        })
      );
      
      // Send formatted result
      res.json({
        id: result.id,
        quizId: result.quizId,
        quizTitle: quiz?.title || "Unknown Quiz",
        score: result.score,
        totalQuestions: questions.length,
        correctAnswers: result.score,
        timeTaken: result.timeTaken,
        completedAt: result.completedAt,
        questions: formattedQuestions
      });
    } catch (error) {
      console.error("Error fetching quiz result:", error);
      res.status(500).json({ message: "Failed to fetch quiz result" });
    }
  });
  
  // Email a quiz result to the user
  app.post("/api/results/:id/email", async (req, res) => {
    try {
      const resultId = parseInt(req.params.id);
      const { email, userName, pdfContent } = req.body;
      
      if (!email || !pdfContent) {
        return res.status(400).json({ 
          message: "Email address and PDF content are required" 
        });
      }
      
      // Get the quiz result
      const result = await storage.getQuizResult(resultId);
      if (!result) {
        return res.status(404).json({ message: "Quiz result not found" });
      }
      
      // Get the quiz title
      const quiz = await storage.getQuiz(result.quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      // Calculate score percentage
      const questions = await storage.getQuestionsByQuizId(result.quizId);
      const scorePercentage = Math.round((result.score / questions.length) * 100);
      
      // Send the email with the PDF
      const success = await sendQuizResult(
        email,
        userName || "User",
        quiz.title,
        scorePercentage,
        pdfContent
      );
      
      if (success) {
        res.json({ 
          message: "Quiz result sent successfully to " + email 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to send quiz result email" 
        });
      }
    } catch (error) {
      console.error("Error emailing quiz result:", error);
      res.status(500).json({ 
        message: "Failed to email quiz result",
        error: error.message 
      });
    }
  });
  
  // Delete a quiz
  app.delete("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      
      // Check if quiz exists
      const quiz = await storage.getQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      // Delete questions, options, and results related to the quiz
      const questions = await storage.getQuestionsByQuizId(quizId);
      
      for (const question of questions) {
        // Delete options for each question
        await storage.deleteOptionsByQuestionId(question.id);
      }
      
      // Delete all questions for the quiz
      await storage.deleteQuestionsByQuizId(quizId);
      
      // Delete quiz results
      await storage.deleteQuizResultsByQuizId(quizId);
      
      // Delete the quiz
      await storage.deleteQuiz(quizId);
      
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  });
  
  // Get analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      const { quizId, timeRange } = req.query;
      
      // For now, return mock analytics data
      // In a real implementation, this would query the database
      res.json({
        participationData: [
          { name: 'Mon', participants: 12 },
          { name: 'Tue', participants: 19 },
          { name: 'Wed', participants: 15 },
          { name: 'Thu', participants: 25 },
          { name: 'Fri', participants: 27 },
          { name: 'Sat', participants: 18 },
          { name: 'Sun', participants: 22 }
        ],
        scoreDistribution: [
          { name: '0-20%', value: 5 },
          { name: '21-40%', value: 15 },
          { name: '41-60%', value: 25 },
          { name: '61-80%', value: 35 },
          { name: '81-100%', value: 20 }
        ]
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Leaderboard Routes
  
  // Get global leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  
  // Get user's leaderboard entry
  app.get("/api/leaderboard/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const leaderboard = await storage.getUserLeaderboard(userId);
      
      if (!leaderboard) {
        return res.status(404).json({ message: "Leaderboard entry not found" });
      }
      
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching user leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch user leaderboard" });
    }
  });
  
  // Update leaderboard after quiz completion
  app.post("/api/leaderboard/update", async (req, res) => {
    try {
      const { userId, quizResultId } = req.body;
      
      if (!userId || !quizResultId) {
        return res.status(400).json({ message: "User ID and quiz result ID are required" });
      }
      
      const quizResult = await storage.getQuizResult(quizResultId);
      if (!quizResult) {
        return res.status(404).json({ message: "Quiz result not found" });
      }
      
      const leaderboard = await storage.createOrUpdateLeaderboard(userId, quizResult);
      
      // Check for new achievements
      const newAchievements = await storage.checkAndAwardAchievements(userId);
      
      res.json({ 
        leaderboard,
        newAchievements: newAchievements.length > 0 ? newAchievements : null
      });
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      res.status(500).json({ message: "Failed to update leaderboard" });
    }
  });
  
  // Achievement Routes
  
  // Get all achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });
  
  // Get user's achievements
  app.get("/api/achievements/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });
  
  // Award achievement to user (admin endpoint)
  app.post("/api/achievements/award", async (req, res) => {
    try {
      const { userId, achievementId } = req.body;
      
      if (!userId || !achievementId) {
        return res.status(400).json({ message: "User ID and achievement ID are required" });
      }
      
      const userAchievement = await storage.awardAchievement(userId, achievementId);
      res.status(201).json(userAchievement);
    } catch (error) {
      console.error("Error awarding achievement:", error);
      res.status(500).json({ message: "Failed to award achievement" });
    }
  });
  
  // Check and award achievements based on user activity
  app.post("/api/achievements/check", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const newAchievements = await storage.checkAndAwardAchievements(userId);
      res.json({ 
        newAchievements: newAchievements.length > 0 ? newAchievements : null
      });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
