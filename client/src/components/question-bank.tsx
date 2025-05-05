import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Plus, Filter, Code, Edit, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: number;
  text: string;
  codeSnippet?: string | null;
  options: Option[];
  categoryId: number;
  categoryName?: string;
  tags?: string[];
}

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuestionBankProps {
  onSelectQuestion?: (question: Question) => void;
  mode?: 'select' | 'manage';
  selectedQuestions?: Question[];
}

export default function QuestionBank({ 
  onSelectQuestion, 
  mode = 'manage',
  selectedQuestions = []
}: QuestionBankProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get questions from API
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/questions'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      return response.json();
    }
  });
  
  // Get categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    }
  });
  
  // Get tags from API
  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['/api/tags'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      return response.json();
    }
  });
  
  // Filter questions based on search term, category, and tags
  const filteredQuestions = questions.filter((question: Question) => {
    const matchesSearch = searchTerm === "" || 
      question.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === null || 
      question.categoryId === categoryFilter;
    
    const matchesTags = selectedTags.length === 0 || 
      (question.tags && selectedTags.every(tag => question.tags?.includes(tag)));
    
    return matchesSearch && matchesCategory && matchesTags;
  });
  
  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: number) => {
      const response = await apiRequest("DELETE", `/api/questions/${questionId}`);
      if (!response.ok) {
        throw new Error("Failed to delete question");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      toast({
        title: "Question deleted",
        description: "The question has been removed from your question bank.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete question",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });
  
  // Handle delete question
  const handleDeleteQuestion = (questionId: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestionMutation.mutate(questionId);
    }
  };
  
  // Check if a question is already selected (for select mode)
  const isQuestionSelected = (questionId: number) => {
    return selectedQuestions.some(q => q.id === questionId);
  };
  
  return (
    <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Question Bank</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <a href="/create-question">
              <Plus className="h-4 w-4 mr-2" /> Add New Question
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and filter controls */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={categoryFilter?.toString() || ""} onValueChange={(value) => setCategoryFilter(value ? parseInt(value) : null)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{categoryFilter ? categories.find((c: any) => c.id === categoryFilter)?.name : "All Categories"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: any) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedTags.includes(tag.name)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag.name));
                  } else {
                    setSelectedTags([...selectedTags, tag.name]);
                  }
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          
          {/* Questions list */}
          <div className="space-y-3 mt-4">
            {questionsLoading ? (
              <div className="text-center py-10">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading questions...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">No questions found. Try adjusting your filters or add a new question.</p>
              </div>
            ) : (
              filteredQuestions.map((question: Question) => (
                <Card key={question.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-medium">{question.text}</h3>
                        <div className="flex space-x-1">
                          {mode === 'manage' ? (
                            <>
                              <Button variant="ghost" size="sm" 
                                onClick={() => window.location.href = `/edit-question/${question.id}`}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="sm" 
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </>
                          ) : (
                            <Button variant="secondary" size="sm" 
                              onClick={() => onSelectQuestion && onSelectQuestion(question)}
                              disabled={isQuestionSelected(question.id)}
                              className="h-8 px-2 py-0"
                            >
                              {isQuestionSelected(question.id) ? (
                                "Added"
                              ) : (
                                <>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {question.codeSnippet && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 mb-2 text-sm font-mono overflow-x-auto">
                          <div className="flex items-center mb-1 text-xs text-gray-500 dark:text-gray-400">
                            <Code className="h-3 w-3 mr-1" /> Code snippet
                          </div>
                          <pre className="text-xs">{question.codeSnippet}</pre>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {question.options.map((option, index) => (
                          <div key={option.id} className="flex items-start">
                            <div className={`flex-shrink-0 h-5 w-5 rounded-full border mr-2 flex items-center justify-center ${
                              option.isCorrect 
                                ? "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400" 
                                : "border-gray-300 dark:border-gray-700"
                            }`}>
                              {option.isCorrect && (
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm">{option.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {question.categoryName || "Uncategorized"}
                        </Badge>
                        {question.tags && question.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}