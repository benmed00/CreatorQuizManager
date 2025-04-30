export interface QuizGenerationRequest {
  topic: string;
  difficulty: string;
  questionCount: number;
  includeCodeSnippets: boolean;
}

export interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  icon: string;
  template: QuizGenerationRequest;
  popularity: number;
}

export const quizTemplates: QuizTemplate[] = [
  {
    id: "javascript-basics",
    name: "JavaScript Fundamentals",
    description: "Core concepts of JavaScript including variables, functions, objects, and more",
    category: "Programming",
    difficulty: "Beginner",
    questionCount: 10,
    timeLimit: 15,
    icon: "code",
    popularity: 95,
    template: {
      topic: "JavaScript fundamentals, variables, functions, objects, arrays, and basic DOM manipulation",
      difficulty: "beginner",
      questionCount: 10,
      includeCodeSnippets: true
    }
  },
  {
    id: "react-components",
    name: "React Component Patterns",
    description: "Advanced patterns for React components including hooks, context, and performance optimization",
    category: "Programming",
    difficulty: "Advanced",
    questionCount: 12,
    timeLimit: 20,
    icon: "component",
    popularity: 87,
    template: {
      topic: "React component patterns, hooks, context API, performance optimization, and component lifecycle",
      difficulty: "advanced",
      questionCount: 12,
      includeCodeSnippets: true
    }
  },
  {
    id: "css-grid-flexbox",
    name: "CSS Grid & Flexbox",
    description: "Modern CSS layout techniques using Grid and Flexbox",
    category: "Web Design",
    difficulty: "Intermediate",
    questionCount: 8,
    timeLimit: 12,
    icon: "layout",
    popularity: 91,
    template: {
      topic: "CSS Grid and Flexbox layout, responsive design, and modern layout techniques",
      difficulty: "intermediate",
      questionCount: 8,
      includeCodeSnippets: true
    }
  },
  {
    id: "node-express",
    name: "Node.js & Express",
    description: "Server-side JavaScript with Node.js and Express framework",
    category: "Backend",
    difficulty: "Intermediate",
    questionCount: 15,
    timeLimit: 25, 
    icon: "server",
    popularity: 82,
    template: {
      topic: "Node.js basics, Express framework, middleware, routing, and RESTful API design",
      difficulty: "intermediate",
      questionCount: 15,
      includeCodeSnippets: true
    }
  },
  {
    id: "typescript-essentials",
    name: "TypeScript Essentials",
    description: "Core TypeScript concepts including types, interfaces, and advanced features",
    category: "Programming",
    difficulty: "Intermediate", 
    questionCount: 10,
    timeLimit: 15,
    icon: "typescript",
    popularity: 89,
    template: {
      topic: "TypeScript types, interfaces, type guards, generics, and integration with JavaScript",
      difficulty: "intermediate",
      questionCount: 10,
      includeCodeSnippets: true
    }
  },
  {
    id: "nextjs-fundamentals",
    name: "Next.js Fundamentals",
    description: "Core concepts of Next.js framework including routing, data fetching, and SSR/SSG",
    category: "Frontend",
    difficulty: "Intermediate",
    questionCount: 12,
    timeLimit: 20,
    icon: "nextjs",
    popularity: 78,
    template: {
      topic: "Next.js routing, data fetching, Server-Side Rendering (SSR), Static Site Generation (SSG), and API routes",
      difficulty: "intermediate",
      questionCount: 12,
      includeCodeSnippets: true
    }
  },
  {
    id: "python-basics",
    name: "Python Basics",
    description: "Fundamental Python concepts including data types, functions, and control flow",
    category: "Programming",
    difficulty: "Beginner",
    questionCount: 10,
    timeLimit: 15,
    icon: "python",
    popularity: 93,
    template: {
      topic: "Python basics including data types, functions, classes, and control flow",
      difficulty: "beginner",
      questionCount: 10,
      includeCodeSnippets: true
    }
  },
  {
    id: "ui-design-principles",
    name: "UI Design Principles",
    description: "Core principles of effective user interface design",
    category: "Design",
    difficulty: "Beginner",
    questionCount: 8,
    timeLimit: 12,
    icon: "design",
    popularity: 75,
    template: {
      topic: "UI design principles, color theory, typography, layout, and accessibility",
      difficulty: "beginner",
      questionCount: 8,
      includeCodeSnippets: false
    }
  }
];