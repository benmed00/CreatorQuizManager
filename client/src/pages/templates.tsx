import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { motion } from 'framer-motion';
// Define the template interfaces 
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
  categoryId: number; // Added categoryId for database reference
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  icon: string;
  template: QuizGenerationRequest;
  popularity: number;
}

// Template data
export const quizTemplates: QuizTemplate[] = [
  {
    id: "javascript-basics",
    name: "JavaScript Fundamentals",
    description: "Core concepts of JavaScript including variables, functions, objects, and more",
    category: "Programming",
    categoryId: 2, // Programming category
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
    categoryId: 2, // Programming category
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
    categoryId: 8, // Web Development category
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
    id: "business-fundamentals",
    name: "Business Fundamentals",
    description: "Comprehensive overview of business strategy and operations concepts",
    category: "Business",
    categoryId: 3, // Business category
    difficulty: "Intermediate",
    questionCount: 15,
    timeLimit: 25,
    icon: "building",
    popularity: 88,
    template: {
      topic: "Business strategy, operations management, marketing fundamentals, financial basics, and organizational behavior",
      difficulty: "intermediate",
      questionCount: 15,
      includeCodeSnippets: false
    }
  },
  {
    id: "general-knowledge",
    name: "General Knowledge",
    description: "Wide-ranging trivia questions covering various topics and subjects",
    category: "Trivia",
    categoryId: 1, // General Knowledge category
    difficulty: "Mixed",
    questionCount: 20,
    timeLimit: 30,
    icon: "book",
    popularity: 92,
    template: {
      topic: "General knowledge covering history, science, geography, literature, arts, sports, and current events",
      difficulty: "mixed",
      questionCount: 20,
      includeCodeSnippets: false
    }
  },
  {
    id: "python-basics",
    name: "Python Essentials",
    description: "Fundamental Python programming concepts and best practices",
    category: "Programming",
    categoryId: 2, // Programming category
    difficulty: "Beginner",
    questionCount: 12,
    timeLimit: 20,
    icon: "code",
    popularity: 90,
    template: {
      topic: "Python basics, data types, functions, modules, error handling, and file operations",
      difficulty: "beginner",
      questionCount: 12,
      includeCodeSnippets: true
    }
  }
];

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Icons
import {
  Code,
  Layout,
  Server,
  FileCode,
  PaintBucket,
  Search,
  Sliders,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  Building,
  BookOpen
} from 'lucide-react';

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'code':
      return <Code className="h-5 w-5" />;
    case 'component':
      return <Layers className="h-5 w-5" />;
    case 'layout':
      return <Layout className="h-5 w-5" />;
    case 'server':
      return <Server className="h-5 w-5" />;
    case 'typescript':
      return <FileCode className="h-5 w-5" />;
    case 'nextjs':
      return <Layers className="h-5 w-5" />;
    case 'python':
      return <Code className="h-5 w-5" />;
    case 'design':
      return <PaintBucket className="h-5 w-5" />;
    case 'building':
      return <Building className="h-5 w-5" />;
    case 'book':
      return <BookOpen className="h-5 w-5" />;
    default:
      return <Code className="h-5 w-5" />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter templates based on selected filters
  const filteredTemplates = quizTemplates.filter((template) => {
    // Category filter
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all' && template.difficulty !== selectedDifficulty) {
      return false;
    }

    // Search filter
    if (
      searchQuery &&
      !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Extract unique categories
  const categoriesSet = new Set(quizTemplates.map((template) => template.category));
  const categories = Array.from(categoriesSet);

  // Extract unique difficulties
  const difficultiesSet = new Set(quizTemplates.map((template) => template.difficulty));
  const difficulties = Array.from(difficultiesSet);

  // Handle use template
  const handleUseTemplate = (template: QuizTemplate) => {
    queryClient.setQueryData(['create-quiz-template'], template);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quiz Templates</h1>
          <p className="text-muted-foreground mt-1">
            Start with a pre-designed template or customize your own quiz
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2 sm:ml-auto">
            <div className="w-40">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
            >
              <Sliders className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
          <TabsTrigger value="custom">My Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {filteredTemplates.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try changing your search criteria or filters
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTemplates.map((template) => (
                <motion.div key={template.id} variants={item}>
                  <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          {getIconComponent(template.icon)}
                        </div>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <span className="text-sm font-medium">{template.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Questions:</span>
                          <span className="text-sm font-medium">{template.questionCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Time Limit:</span>
                          <span className="text-sm font-medium">{template.timeLimit} min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Popularity:</span>
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 text-amber-500 mr-1 fill-amber-500" />
                            <span className="text-sm font-medium">{template.popularity}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-4">
                      <Link href="/create-quiz" onClick={() => handleUseTemplate(template)}>
                        <Button className="w-full">
                          Use Template
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}

              {/* Create Custom Template Card */}
              <motion.div variants={item}>
                <Card className="h-full flex flex-col overflow-hidden border-dashed transition-all hover:shadow-md hover:border-primary">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>
                    <CardTitle className="mt-3">Create Custom Template</CardTitle>
                    <CardDescription>Design your own quiz template from scratch</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 flex-grow">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>• Custom category and difficulty</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>• Define your own question count</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>• Set your own time limit</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>• Save for future use</span>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-4">
                    <Link href="/create-quiz">
                      <Button variant="outline" className="w-full">
                        Start from Scratch
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredTemplates
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 6)
              .map((template) => (
                <motion.div key={template.id} variants={item}>
                  <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          {getIconComponent(template.icon)}
                        </div>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <span className="text-sm font-medium">{template.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Questions:</span>
                          <span className="text-sm font-medium">{template.questionCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Time Limit:</span>
                          <span className="text-sm font-medium">{template.timeLimit} min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Popularity:</span>
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 text-amber-500 mr-1 fill-amber-500" />
                            <span className="text-sm font-medium">{template.popularity}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-4">
                      <Link href="/create-quiz" onClick={() => handleUseTemplate(template)}>
                        <Button className="w-full">
                          Use Template
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No recent templates</h3>
            <p className="text-muted-foreground mb-4">
              Templates you've recently used will appear here
            </p>
            <Button variant="outline" onClick={() => setActiveTab('all')}>
              Browse Templates
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-0">
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No custom templates</h3>
            <p className="text-muted-foreground mb-4">
              Start creating and saving your own custom templates
            </p>
            <Link href="/create-quiz">
              <Button>Create Custom Template</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}