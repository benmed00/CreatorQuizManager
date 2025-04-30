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
    } catch (error: any) {
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
  
  // Get general analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      const { quizId, timeRange, userId } = req.query;
      
      // Get the date range filter based on timeRange
      const startDate = getStartDateForTimeRange(timeRange as string);
      
      // Get quiz results
      let quizResults;
      
      if (quizId && quizId !== 'all') {
        quizResults = await storage.getQuizResultsByQuizId(parseInt(quizId as string));
      } else {
        quizResults = await storage.getAllQuizResults();
      }
      
      // Filter by time range if specified
      if (startDate) {
        quizResults = quizResults.filter(result => {
          if (!result.completedAt) return false;
          const completedDate = new Date(result.completedAt);
          return completedDate >= startDate;
        });
      }
      
      // Generate analytics data from quiz results
      const analyticsData = generateAnalyticsData(quizResults);
      
      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });
  
  // Get user-specific analytics data
  app.get("/api/analytics/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { timeRange } = req.query;
      
      // Get the date range filter based on timeRange
      const startDate = getStartDateForTimeRange(timeRange as string);
      
      // Get user quiz results
      let userResults = await storage.getQuizResultsByUserId(userId);
      
      // Filter by time range if specified
      if (startDate) {
        userResults = userResults.filter(result => {
          if (!result.completedAt) return false;
          const completedDate = new Date(result.completedAt);
          return completedDate >= startDate;
        });
      }
      
      // Calculate user analytics
      const userAnalytics = await generateUserAnalytics(userId, userResults);
      
      res.json(userAnalytics);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ message: "Failed to fetch user analytics data" });
    }
  });
  
  // Get detailed quiz analytics
  app.get("/api/analytics/quiz/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      
      // Get quiz details
      const quiz = await storage.getQuiz(parseInt(quizId));
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      // Get all quiz results for this quiz
      const quizResults = await storage.getQuizResultsByQuizId(parseInt(quizId));
      
      // Get all questions for this quiz
      const questions = await storage.getQuestionsByQuizId(parseInt(quizId));
      
      // Calculate question-level analytics
      const questionAnalytics = await generateQuestionAnalytics(questions, quizResults);
      
      // Calculate overall quiz analytics
      const quizAnalytics = {
        quiz: {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          difficulty: quiz.difficulty,
          participantCount: quiz.participantCount,
          averageScore: calculateAverageScore(quizResults),
          completionRate: quiz.completionRate || 0,
        },
        participationOverTime: generateParticipationOverTime(quizResults),
        scoreDistribution: generateScoreDistribution(quizResults),
        questionAnalytics,
        performanceTrends: calculatePerformanceTrends(quizResults)
      };
      
      res.json(quizAnalytics);
    } catch (error) {
      console.error("Error fetching quiz analytics:", error);
      res.status(500).json({ message: "Failed to fetch quiz analytics data" });
    }
  });
  
  // Helper functions for analytics data generation
  
  function getStartDateForTimeRange(timeRange: string): Date | null {
    if (!timeRange || timeRange === 'all') {
      return null;
    }
    
    const now = new Date();
    const startDate = new Date(now);
    
    switch(timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return null;
    }
    
    return startDate;
  }
  
  function generateAnalyticsData(quizResults: any[]) {
    // Participation data by day of week
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const participationByDay = Array(7).fill(0);
    
    quizResults.forEach(result => {
      const date = new Date(result.completedAt);
      const dayIndex = date.getDay(); // 0 = Sunday, 6 = Saturday
      participationByDay[dayIndex]++;
    });
    
    const participationData = dayNames.map((name, index) => ({
      name,
      participants: participationByDay[index]
    }));
    
    // Score distribution
    const scoreRanges = [
      { min: 0, max: 20, name: '0-20%' },
      { min: 21, max: 40, name: '21-40%' },
      { min: 41, max: 60, name: '41-60%' },
      { min: 61, max: 80, name: '61-80%' },
      { min: 81, max: 100, name: '81-100%' }
    ];
    
    const scoreDistributionCounts = Array(scoreRanges.length).fill(0);
    
    quizResults.forEach(result => {
      const score = result.score;
      for (let i = 0; i < scoreRanges.length; i++) {
        if (score >= scoreRanges[i].min && score <= scoreRanges[i].max) {
          scoreDistributionCounts[i]++;
          break;
        }
      }
    });
    
    const scoreDistribution = scoreRanges.map((range, index) => ({
      name: range.name,
      value: scoreDistributionCounts[index]
    }));
    
    // Calculate time metrics
    const timeTakenValues = quizResults.map(result => {
      const timeParts = result.timeTaken.split(':');
      return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    });
    
    const avgTimeTaken = timeTakenValues.length > 0 
      ? Math.round(timeTakenValues.reduce((a, b) => a + b, 0) / timeTakenValues.length) 
      : 0;
    
    // Calculate average score
    const avgScore = quizResults.length > 0 
      ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length) 
      : 0;
    
    const totalParticipants = quizResults.length;
    
    // Get top categories
    const categoryCounts: Record<string, number> = {};
    quizResults.forEach(result => {
      const category = result.quiz?.category || 'Unknown';
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });
    
    const categoryData = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    return {
      overallMetrics: {
        totalParticipants,
        avgScore,
        avgTimeTaken
      },
      participationData,
      scoreDistribution,
      categoryData
    };
  }
  
  async function generateUserAnalytics(userId: string, userResults: any[]) {
    // Get all results for comparison
    const allResults = await storage.getAllQuizResults();
    
    // Calculate user metrics
    const userAvgScore = userResults.length > 0 
      ? Math.round(userResults.reduce((sum, result) => sum + result.score, 0) / userResults.length) 
      : 0;
    
    // Calculate global average for comparison
    const globalAvgScore = allResults.length > 0 
      ? Math.round(allResults.reduce((sum, result) => sum + result.score, 0) / allResults.length) 
      : 0;
    
    // Calculate score percentile
    let userPercentile = 0;
    if (userResults.length > 0 && allResults.length > 0) {
      const userAvg = userAvgScore;
      const lowerScores = allResults.filter(r => 
        r.score < userAvg
      ).length;
      userPercentile = Math.round((lowerScores / allResults.length) * 100);
    }
    
    // Get performance by category
    const categoryPerformance: Record<string, { count: number, totalScore: number, avgScore: number }> = {};
    
    userResults.forEach(result => {
      const category = result.quiz?.category || 'Unknown';
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { count: 0, totalScore: 0, avgScore: 0 };
      }
      categoryPerformance[category].count++;
      categoryPerformance[category].totalScore += result.score;
    });
    
    // Calculate average scores for each category
    Object.keys(categoryPerformance).forEach(category => {
      const data = categoryPerformance[category];
      data.avgScore = Math.round(data.totalScore / data.count);
    });
    
    // Progress over time (last 10 quizzes)
    const recentResults = [...userResults]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10)
      .reverse();
    
    const progressData = recentResults.map((result, index) => ({
      quiz: result.quizTitle,
      score: result.score,
      date: new Date(result.completedAt).toLocaleDateString(),
      number: index + 1
    }));
    
    // Identify strengths and weaknesses based on category performance
    const strengths = Object.entries(categoryPerformance)
      .filter(([_, data]) => data.avgScore >= 80)
      .map(([category, data]) => ({
        category,
        avgScore: data.avgScore,
        count: data.count
      }))
      .sort((a, b) => b.avgScore - a.avgScore);
    
    const weaknesses = Object.entries(categoryPerformance)
      .filter(([_, data]) => data.avgScore < 70)
      .map(([category, data]) => ({
        category,
        avgScore: data.avgScore,
        count: data.count
      }))
      .sort((a, b) => a.avgScore - b.avgScore);
    
    return {
      summary: {
        quizzesTaken: userResults.length,
        avgScore: userAvgScore,
        globalAvgScore,
        percentile: userPercentile
      },
      progressData,
      categoryPerformance: Object.entries(categoryPerformance).map(([category, data]) => ({
        category,
        count: data.count,
        avgScore: data.avgScore
      })),
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      recentActivity: recentResults.slice(0, 5).map(result => ({
        quizId: result.quizId,
        quizTitle: result.quizTitle,
        score: result.score,
        date: new Date(result.completedAt).toLocaleDateString(),
        timeTaken: result.timeTaken
      }))
    };
  }
  
  async function generateQuestionAnalytics(questions: any[], quizResults: any[]) {
    const questionAnalytics = [];
    
    for (const question of questions) {
      // Count correct vs. incorrect answers for this question
      let correctCount = 0;
      let totalAnswers = 0;
      
      for (const result of quizResults) {
        const userAnswers = JSON.parse(result.answers);
        const questionAnswer = userAnswers.find((a: any) => a.questionId === question.id);
        
        if (questionAnswer) {
          totalAnswers++;
          if (questionAnswer.answerId === question.correctAnswerId) {
            correctCount++;
          }
        }
      }
      
      const correctPercentage = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;
      
      // Get options for this question
      const options = await storage.getOptionsByQuestionId(question.id);
      
      // Count selection frequency for each option
      const optionCounts = options.map(option => {
        let count = 0;
        for (const result of quizResults) {
          const userAnswers = JSON.parse(result.answers);
          const questionAnswer = userAnswers.find((a: any) => a.questionId === question.id);
          if (questionAnswer && questionAnswer.answerId === option.id) {
            count++;
          }
        }
        
        return {
          optionId: option.id,
          text: option.text,
          count,
          percentage: totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0,
          isCorrect: option.id === question.correctAnswerId
        };
      });
      
      questionAnalytics.push({
        questionId: question.id,
        text: question.text,
        correctPercentage,
        difficulty: getDifficultyLevel(correctPercentage),
        totalAnswers,
        correctCount,
        optionAnalytics: optionCounts
      });
    }
    
    return questionAnalytics;
  }
  
  function getDifficultyLevel(correctPercentage: number): string {
    if (correctPercentage >= 80) {
      return 'Easy';
    } else if (correctPercentage >= 50) {
      return 'Medium';
    } else {
      return 'Hard';
    }
  }
  
  function generateParticipationOverTime(quizResults: any[]) {
    // Group results by date
    const resultsByDate: Record<string, number> = {};
    
    quizResults.forEach(result => {
      const date = new Date(result.completedAt).toLocaleDateString();
      if (!resultsByDate[date]) {
        resultsByDate[date] = 0;
      }
      resultsByDate[date]++;
    });
    
    // Convert to array and sort by date
    return Object.entries(resultsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  function generateScoreDistribution(quizResults: any[]) {
    const scoreRanges = [
      { min: 0, max: 20, name: '0-20%' },
      { min: 21, max: 40, name: '21-40%' },
      { min: 41, max: 60, name: '41-60%' },
      { min: 61, max: 80, name: '61-80%' },
      { min: 81, max: 100, name: '81-100%' }
    ];
    
    const distribution = scoreRanges.map(range => ({
      range: range.name,
      count: 0
    }));
    
    quizResults.forEach(result => {
      const score = result.score;
      for (let i = 0; i < scoreRanges.length; i++) {
        if (score >= scoreRanges[i].min && score <= scoreRanges[i].max) {
          distribution[i].count++;
          break;
        }
      }
    });
    
    return distribution;
  }
  
  function calculateAverageScore(quizResults: any[]): number {
    if (quizResults.length === 0) {
      return 0;
    }
    
    const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / quizResults.length);
  }
  
  function calculatePerformanceTrends(quizResults: any[]) {
    if (quizResults.length < 2) {
      return { trend: 'neutral', percentage: 0 };
    }
    
    // Sort results by date
    const sortedResults = [...quizResults].sort((a, b) => 
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    
    // Split into two halves to compare performance
    const midpoint = Math.floor(sortedResults.length / 2);
    const firstHalf = sortedResults.slice(0, midpoint);
    const secondHalf = sortedResults.slice(midpoint);
    
    // Calculate average scores for each half
    const firstHalfAvg = firstHalf.reduce((sum, result) => sum + result.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, result) => sum + result.score, 0) / secondHalf.length;
    
    // Calculate the percentage change
    const percentageChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    let trend = 'neutral';
    if (percentageChange > 5) {
      trend = 'improving';
    } else if (percentageChange < -5) {
      trend = 'declining';
    }
    
    return {
      trend,
      percentage: Math.abs(Math.round(percentageChange))
    };
  }

  // Leaderboard Routes
  
  // Get global leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const timeFrame = req.query.timeFrame as string || 'all-time';
      const category = req.query.category as string || 'all';
      
      // Get basic leaderboard
      let leaderboard = await storage.getLeaderboard(limit);
      
      // Apply time-based filtering (if implemented in storage)
      if (timeFrame === 'this-week' || timeFrame === 'this-month') {
        // For demonstration, we'll filter client-side
        // In a production app, this would be handled by database queries
        const now = new Date();
        const filterDate = new Date();
        
        if (timeFrame === 'this-week') {
          filterDate.setDate(now.getDate() - 7);
        } else if (timeFrame === 'this-month') {
          filterDate.setMonth(now.getMonth() - 1);
        }
        
        // Filter by lastActive date
        leaderboard = leaderboard.filter(entry => {
          if (!entry.lastActive) return false;
          const lastActiveDate = new Date(entry.lastActive);
          return lastActiveDate >= filterDate;
        });
        
        // Sort by totalScore after filtering
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);
        
        // Update ranking after filtering
        leaderboard.forEach((entry, index) => {
          entry.ranking = index + 1;
        });
      }
      
      // Apply category filtering if needed
      if (category && category !== 'all') {
        // This would ideally be a database query
        // For now, we'll keep the unfiltered results
      }
      
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
  
  // Get weekly challenges
  app.get("/api/leaderboard/challenges", async (req, res) => {
    try {
      // In a production app, this would be fetched from the database
      // For now, we'll return a mock weekly challenge
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 2); // Challenge ends in 2 days
      
      // Format the remaining time
      const diffTime = Math.abs(endDate.getTime() - currentDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      
      const timeRemaining = `${diffDays}d ${diffHours}h ${diffMinutes}m`;
      
      const challenges = [
        {
          id: 1,
          title: "CSS Flexbox Master",
          description: "Complete this quiz with a score of 80% or higher to earn the 'Flexbox Hero' achievement and 500 bonus points.",
          category: "css",
          difficulty: "intermediate",
          quizId: 3, // Reference to the actual quiz
          reward: {
            points: 500,
            achievement: "Flexbox Hero"
          },
          timeRemaining,
          endDate: endDate.toISOString()
        }
      ];
      
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  
  // Get category rankings
  app.get("/api/leaderboard/categories/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      // In a production app, this would filter by category in the database
      // For now, we'll return the global leaderboard
      const leaderboard = await storage.getLeaderboard(limit);
      
      res.json({
        category,
        leaderboard
      });
    } catch (error) {
      console.error(`Error fetching ${req.params.category} leaderboard:`, error);
      res.status(500).json({ message: `Failed to fetch ${req.params.category} leaderboard` });
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
      
      // Check if this completion fulfills a weekly challenge
      const isWeeklyChallenge = quizResult.quizId === 3 && quizResult.score >= 80;
      let challengeCompleted = null;
      
      if (isWeeklyChallenge) {
        // In a production app, update the user's achievements and points here
        challengeCompleted = {
          name: "CSS Flexbox Master",
          points: 500,
          badge: "Flexbox Hero"
        };
      }
      
      res.json({ 
        leaderboard,
        newAchievements: newAchievements.length > 0 ? newAchievements : null,
        challengeCompleted
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
