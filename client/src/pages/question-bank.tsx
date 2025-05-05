import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Plus,
  Filter,
  Tag,
  Code,
  Star,
  ThumbsUp,
  ThumbsDown,
  X,
  ChevronDown,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionForm from "@/components/question-form";

// Define the interfaces
interface Question {
  id: number;
  text: string;
  codeSnippet?: string | null;
  options: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
  categoryId: number;
  categoryName?: string;
  difficulty?: string;
  createdAt?: string;
  tags?: string[];
  useCount?: number;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function QuestionBank() {
  const { user } = useStore();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("any");
  const [codeOnly, setCodeOnly] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Fetch questions
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["/api/questions"],
    queryFn: async () => {
      return await apiRequest<Question[]>("GET", "/api/questions");
    },
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      return await apiRequest<Category[]>("GET", "/api/categories");
    },
  });

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ["/api/tags"],
    queryFn: async () => {
      return await apiRequest<Tag[]>("GET", "/api/tags");
    },
  });

  // Filter questions based on criteria
  const filteredQuestions = questions.filter((question) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.codeSnippet?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(question.categoryId);

    // Tags filter
    const matchesTags =
      selectedTags.length === 0 ||
      (question.tags &&
        question.tags.some((tag) =>
          selectedTags.includes(parseInt(tag as unknown as string))
        ));

    // Difficulty filter
    const matchesDifficulty =
      selectedDifficulty === "any" || selectedDifficulty === "" || question.difficulty === selectedDifficulty;

    // Code filter
    const matchesCodeFilter =
      !codeOnly || (question.codeSnippet && question.codeSnippet.length > 0);

    // Tab filter
    // Assume all questions are viewable if no user filtering needed
    const matchesTab = activeTab === "all" || (activeTab === "my-questions" && true);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesTags &&
      matchesDifficulty &&
      matchesCodeFilter &&
      matchesTab
    );
  });

  // Toggle question selection
  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedDifficulty("any");
    setCodeOnly(false);
  };

  // Start creating a new quiz with selected questions
  const createQuizWithSelected = () => {
    if (selectedQuestions.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select at least one question to continue.",
        variant: "destructive",
      });
      return;
    }

    // Store selected question IDs in session storage
    sessionStorage.setItem(
      "selectedQuestionIds",
      JSON.stringify(selectedQuestions)
    );
    navigate("/create-quiz");
  };

  // Handle edit question
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Question Bank</h1>
            <p className="text-muted-foreground text-sm">
              Manage your questions and use them in multiple quizzes
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => createQuizWithSelected()}
            disabled={selectedQuestions.length === 0}
          >
            Create Quiz from Selected ({selectedQuestions.length})
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" onClick={() => setIsCreatingQuestion(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Create New Question</SheetTitle>
                <SheetDescription>
                  Add a new question to your question bank
                </SheetDescription>
              </SheetHeader>
              <div className="mb-4">
                <QuestionForm
                  mode="standalone"
                  onSave={() => {
                    queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
                    setIsCreatingQuestion(false);
                    toast({
                      title: "Question Created",
                      description: "Your question has been added to the question bank.",
                    });
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters panel */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center justify-between">
              <span>Filters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs"
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1.5 h-7 w-7"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Categories
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {categoriesLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading categories...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No categories available
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories((prev) =>
                            checked
                              ? [...prev, category.id]
                              : prev.filter((id) => id !== category.id)
                          );
                        }}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {tagsLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading tags...
                  </div>
                ) : tags.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No tags available
                  </div>
                ) : (
                  tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={
                        selectedTags.includes(tag.id) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Difficulty
              </label>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Difficulty</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Code snippet filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="code-snippet"
                checked={codeOnly}
                onCheckedChange={(checked) => setCodeOnly(!!checked)}
              />
              <label
                htmlFor="code-snippet"
                className="text-sm leading-none flex items-center peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Code className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                Only questions with code
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Questions list */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full max-w-xs grid-cols-2">
                    <TabsTrigger value="all">All Questions</TabsTrigger>
                    <TabsTrigger value="my-questions">My Questions</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center space-x-2">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {questionsLoading ? (
                <div className="text-center py-8">
                  <p>Loading questions...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No Questions Found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm || selectedCategories.length > 0 || selectedTags.length > 0 || selectedDifficulty !== "any" || codeOnly
                      ? "Try adjusting your filters to see more results."
                      : "Your question bank is empty. Add some questions to get started."}
                  </p>
                  {(searchTerm || selectedCategories.length > 0 || selectedTags.length > 0 || selectedDifficulty || codeOnly) && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    {filteredQuestions.length} questions found
                  </div>
                  <div className="divide-y">
                    {filteredQuestions.map((question) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="py-4"
                      >
                        <div className="flex gap-3">
                          <div className="pt-1">
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() =>
                                toggleQuestionSelection(question.id)
                              }
                            />
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium">{question.text}</h3>
                              <div className="flex space-x-1">
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleEditQuestion(question)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-pencil"
                                      >
                                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-auto">
                                    <SheetHeader className="mb-4">
                                      <SheetTitle>Edit Question</SheetTitle>
                                      <SheetDescription>
                                        Make changes to your question
                                      </SheetDescription>
                                    </SheetHeader>
                                    <div className="mb-4">
                                      {editingQuestion && (
                                        <QuestionForm
                                          questionId={editingQuestion.id}
                                          initialData={{
                                            text: editingQuestion.text,
                                            codeSnippet: editingQuestion.codeSnippet,
                                            categoryId: editingQuestion.categoryId,
                                            options: editingQuestion.options,
                                            tags: editingQuestion.tags,
                                          }}
                                          mode="edit"
                                          onSave={() => {
                                            queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
                                            setEditingQuestion(null);
                                            toast({
                                              title: "Question Updated",
                                              description: "Your changes have been saved.",
                                            });
                                          }}
                                        />
                                      )}
                                    </div>
                                  </SheetContent>
                                </Sheet>
                              </div>
                            </div>
                            
                            {question.codeSnippet && (
                              <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-3 text-sm font-mono overflow-x-auto max-h-24">
                                <pre className="text-xs">{question.codeSnippet}</pre>
                              </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-2">
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className={`text-sm p-2 rounded border ${
                                    option.isCorrect
                                      ? "border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                                  }`}
                                >
                                  {option.isCorrect ? (
                                    <CheckCircle className="inline-block h-3 w-3 text-green-500 dark:text-green-400 mr-1.5" />
                                  ) : (
                                    <Circle className="inline-block h-3 w-3 text-gray-400 mr-1.5" />
                                  )}
                                  {option.text}
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {question.categoryName && (
                                <Badge variant="outline" className="text-xs">
                                  {question.categoryName}
                                </Badge>
                              )}
                              
                              {question.tags &&
                                question.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              
                              {question.difficulty && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    question.difficulty === "beginner"
                                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                      : question.difficulty === "intermediate"
                                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                      : question.difficulty === "advanced"
                                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                  }`}
                                >
                                  {question.difficulty}
                                </Badge>
                              )}
                              
                              {question.useCount !== undefined && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Used in {question.useCount} quiz(es)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {selectedQuestions.length > 0 && (
                <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-950 p-3 border-t border-gray-200 dark:border-gray-800 mt-4 -mx-6 -mb-6 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{selectedQuestions.length}</span>{" "}
                    question(s) selected
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuestions([])}
                    >
                      Clear Selection
                    </Button>
                    <Button size="sm" onClick={createQuizWithSelected}>
                      Create Quiz
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}