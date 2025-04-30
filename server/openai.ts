import OpenAI from "openai";
import { QuizGenerationRequest } from "@shared/schema";

/**
 * OpenAI Quiz Generation Module
 * 
 * This module handles all interactions with the OpenAI API for quiz generation.
 * It can operate in two modes:
 * 1. MOCK mode: Uses predefined mock responses for development without an API key
 * 2. REAL mode: Uses the actual OpenAI API when a valid API key is provided
 * 
 * USAGE:
 * - For local development, mock mode will be used if OPENAI_API_KEY is not provided
 * - For production, ensure the OPENAI_API_KEY environment variable is set
 * 
 * To transition from mock to real implementation:
 * 1. Obtain an API key from OpenAI (https://platform.openai.com/)
 * 2. Set the OPENAI_API_KEY environment variable
 * 3. The system will automatically use the real API when a valid key is provided
 */

// Check if we should use mock mode (no API key or using dummy key)
const useMockApi = !process.env.OPENAI_API_KEY || 
                   process.env.OPENAI_API_KEY === "dummy-key-for-development";

// Initialize OpenAI client if we have a real API key
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = !useMockApi 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

// Define interfaces for quiz generation
export interface GeneratedQuestion {
  text: string;
  options: string[];
  correctOptionIndex: number;
  codeSnippet?: string;
}

export interface GeneratedQuiz {
  title: string;
  description: string;
  category: string;
  questions: GeneratedQuestion[];
}

// Create realistic mock quizzes for different topics and difficulties
const mockQuizzes: { [key: string]: GeneratedQuiz } = {
  "javascript-beginner": {
    title: "JavaScript Basics Quiz",
    description: "Test your knowledge of JavaScript fundamentals including variables, functions, and basic syntax.",
    category: "Web Development",
    questions: [
      {
        text: "Which of the following is used to declare a variable in JavaScript?",
        options: ["var", "variable", "v", "declare"],
        correctOptionIndex: 0
      },
      {
        text: "What will console.log(typeof []) output?",
        options: ["array", "object", "list", "undefined"],
        correctOptionIndex: 1,
        codeSnippet: "console.log(typeof []);"
      },
      {
        text: "How do you write a comment in JavaScript?",
        options: ["<!-- comment -->", "/* comment */", "// comment", "# comment"],
        correctOptionIndex: 2
      },
      {
        text: "Which method is used to add an element to the end of an array?",
        options: ["push()", "append()", "add()", "insert()"],
        correctOptionIndex: 0,
        codeSnippet: "let arr = [1, 2, 3];\narr.push(4);"
      },
      {
        text: "What is the result of '5' + 2 in JavaScript?",
        options: ["7", "52", "5 + 2", "TypeError"],
        correctOptionIndex: 1,
        codeSnippet: "console.log('5' + 2);"
      }
    ]
  },
  "python-intermediate": {
    title: "Python Programming Challenge",
    description: "Test your intermediate knowledge of Python concepts including list comprehensions, decorators, and more.",
    category: "Programming",
    questions: [
      {
        text: "What is the output of the following code?",
        options: ["[1, 4, 9, 16, 25]", "[0, 1, 4, 9, 16]", "[1, 4, 9, 16]", "[1, 2, 3, 4, 5]"],
        correctOptionIndex: 0,
        codeSnippet: "print([x**2 for x in range(1, 6)])"
      },
      {
        text: "Which of the following is a Python decorator?",
        options: ["@staticmethod", "@decorator", "@python", "@function"],
        correctOptionIndex: 0
      },
      {
        text: "What does the 'yield' keyword do in Python?",
        options: ["Returns a value from a function", "Creates a generator function", "Pauses execution", "Both B and C"],
        correctOptionIndex: 3
      },
      {
        text: "Which method would you use to remove duplicates from a list while preserving order?",
        options: ["list(set(my_list))", "OrderedDict.fromkeys(my_list)", "remove_duplicates(my_list)", "list(dict.fromkeys(my_list))"],
        correctOptionIndex: 3
      },
      {
        text: "What is the output of this code?",
        options: ["2", "3", "None", "Error"],
        correctOptionIndex: 1,
        codeSnippet: "def func(a, b=2):\n    return a + b\n\nprint(func(1))"
      }
    ]
  },
  "history-advanced": {
    title: "World History Advanced Quiz",
    description: "Test your in-depth knowledge of world history across different eras and civilizations.",
    category: "History",
    questions: [
      {
        text: "Which treaty ended the Thirty Years' War in 1648?",
        options: ["Treaty of Versailles", "Peace of Westphalia", "Treaty of Paris", "Treaty of Tordesillas"],
        correctOptionIndex: 1
      },
      {
        text: "Who was the last emperor of the Byzantine Empire?",
        options: ["Constantine XI Palaiologos", "Justinian I", "Alexios I Komnenos", "Michael VIII Palaiologos"],
        correctOptionIndex: 0
      },
      {
        text: "The Battle of Adwa in 1896 was a significant victory for which African nation against European colonialism?",
        options: ["South Africa", "Ethiopia", "Nigeria", "Egypt"],
        correctOptionIndex: 1
      },
      {
        text: "Which Chinese dynasty was contemporary with the Roman Empire?",
        options: ["Ming", "Tang", "Han", "Qing"],
        correctOptionIndex: 2
      },
      {
        text: "The 'Great Game' was a political and diplomatic confrontation between which empires?",
        options: ["France and Germany", "Britain and France", "Britain and Russia", "Russia and Ottoman Empire"],
        correctOptionIndex: 2
      }
    ]
  }
};

// Mock quizzes for technology topics
const technologyQuizzes: { [key: string]: GeneratedQuiz } = {
  "ai-machine-learning": {
    title: "AI & Machine Learning Fundamentals",
    description: "Explore the key concepts of artificial intelligence and machine learning algorithms.",
    category: "Technology",
    questions: [
      {
        text: "Which of the following is NOT a type of machine learning?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Prescriptive Learning"],
        correctOptionIndex: 3
      },
      {
        text: "What is the primary purpose of a loss function in machine learning?",
        options: ["Data preprocessing", "Measure model performance", "Feature selection", "Data visualization"],
        correctOptionIndex: 1
      },
      {
        text: "Which algorithm is commonly used for image classification?",
        options: ["Linear Regression", "Convolutional Neural Network", "K-means Clustering", "Decision Trees"],
        correctOptionIndex: 1
      },
      {
        text: "What does 'overfitting' refer to in machine learning?",
        options: ["Model performs well on training data but poorly on new data", "Model is too simple to capture patterns", "Model takes too long to train", "Model requires too much memory"],
        correctOptionIndex: 0
      },
      {
        text: "Which technique is used to prevent overfitting?",
        options: ["Increasing model complexity", "Dropout", "Using all available features", "Training for more epochs"],
        correctOptionIndex: 1
      }
    ]
  }
};

// Generate a mock quiz based on topic and difficulty
function generateMockQuiz(topic: string, difficulty: string, questionCount: number): GeneratedQuiz {
  // Try to match the topic and difficulty to our mock quizzes
  let mockQuiz: GeneratedQuiz | null = null;
  
  // Normalize the topic and try to find a match
  const normalizedTopic = topic.toLowerCase().trim();
  
  if (normalizedTopic.includes("javascript") || normalizedTopic.includes("js")) {
    if (difficulty === "beginner") {
      mockQuiz = mockQuizzes["javascript-beginner"];
    }
  } else if (normalizedTopic.includes("python")) {
    if (difficulty === "intermediate") {
      mockQuiz = mockQuizzes["python-intermediate"];
    }
  } else if (normalizedTopic.includes("history") || normalizedTopic.includes("world")) {
    if (difficulty === "advanced") {
      mockQuiz = mockQuizzes["history-advanced"];
    }
  } else if (normalizedTopic.includes("ai") || normalizedTopic.includes("machine learning")) {
    mockQuiz = technologyQuizzes["ai-machine-learning"];
  }
  
  // If we don't have a specific mock for this topic/difficulty, use a generic one
  if (!mockQuiz) {
    // Pick a random mock quiz as a fallback
    const allMocks = [...Object.values(mockQuizzes), ...Object.values(technologyQuizzes)];
    mockQuiz = allMocks[Math.floor(Math.random() * allMocks.length)];
    
    // Adjust title and description to match the requested topic
    mockQuiz = {
      ...mockQuiz,
      title: `${topic} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz`,
      description: `Test your ${difficulty} knowledge about ${topic}.`
    };
  }
  
  // Ensure we return the requested number of questions
  const adjustedQuiz = {
    ...mockQuiz,
    questions: [...mockQuiz.questions]
  };
  
  // If we need more questions than available in the mock, duplicate some
  while (adjustedQuiz.questions.length < questionCount) {
    const randomQuestion = mockQuiz.questions[
      Math.floor(Math.random() * mockQuiz.questions.length)
    ];
    adjustedQuiz.questions.push({...randomQuestion});
  }
  
  // If we have too many questions, trim the list
  if (adjustedQuiz.questions.length > questionCount) {
    adjustedQuiz.questions = adjustedQuiz.questions.slice(0, questionCount);
  }
  
  return adjustedQuiz;
}

/**
 * Generates a quiz using OpenAI API or mock data
 * @param request Quiz generation request parameters
 * @returns Promise resolving to a generated quiz
 */
export async function generateQuiz(request: QuizGenerationRequest): Promise<GeneratedQuiz> {
  try {
    const { topic, difficulty, questionCount, includeCode } = request;
    
    // If we're using mock mode or don't have an API key, return mock data
    if (useMockApi) {
      console.log("Using mock quiz data - provide OPENAI_API_KEY to use real API");
      
      // Add a slight delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock quiz data
      return generateMockQuiz(topic, difficulty, parseInt(questionCount));
    }
    
    // REAL IMPLEMENTATION - Only runs if we have a valid OpenAI API key
    
    if (!openai) {
      throw new Error("OpenAI client is not initialized");
    }
    
    // Create a detailed prompt for OpenAI
    const prompt = `
      Generate a ${difficulty} level quiz about "${topic}" with ${questionCount} multiple-choice questions.
      ${includeCode ? "Include code snippets where appropriate." : ""}
      
      Please format your response as a JSON object with the following structure:
      {
        "title": "A catchy title for the quiz",
        "description": "A brief description of the quiz content",
        "category": "The main category this quiz belongs to",
        "questions": [
          {
            "text": "The question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctOptionIndex": 0, // Index of the correct answer (0-3)
            "codeSnippet": "Optional code example if relevant (can be null)"
          }
        ]
      }
      
      Make sure each question has exactly 4 options, with one correct answer.
      Ensure the questions are varied in difficulty and cover different aspects of the topic.
      The questions should be educational and factually accurate.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an educational quiz creation assistant capable of generating high-quality quiz questions on various topics." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("Failed to generate quiz content");
    }
    
    const generatedQuiz = JSON.parse(content) as GeneratedQuiz;
    
    // Validate the generated quiz structure
    if (!generatedQuiz.title || !generatedQuiz.description || !generatedQuiz.questions || !Array.isArray(generatedQuiz.questions)) {
      throw new Error("Generated quiz data is incomplete or malformed");
    }
    
    // Ensure we have the requested number of questions
    if (generatedQuiz.questions.length < parseInt(questionCount)) {
      throw new Error(`Generated quiz has fewer questions than requested (${generatedQuiz.questions.length} < ${questionCount})`);
    }
    
    // Trim to requested number of questions if we got more
    generatedQuiz.questions = generatedQuiz.questions.slice(0, parseInt(questionCount));
    
    // Set a default category if none was provided
    if (!generatedQuiz.category) {
      generatedQuiz.category = "General Knowledge";
    }
    
    // Ensure each question has 4 options and a valid correctOptionIndex
    for (const question of generatedQuiz.questions) {
      if (!question.options || question.options.length !== 4) {
        question.options = question.options || [];
        while (question.options.length < 4) {
          question.options.push(`Option ${question.options.length + 1}`);
        }
      }
      
      if (question.correctOptionIndex === undefined || question.correctOptionIndex < 0 || question.correctOptionIndex > 3) {
        question.correctOptionIndex = 0;
      }
    }
    
    return generatedQuiz;
  } catch (error) {
    console.error("Error generating quiz with OpenAI:", error);
    throw new Error("Failed to generate quiz with AI. Please try again later.");
  }
}
