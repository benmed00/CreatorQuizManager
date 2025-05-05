import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/auth-store";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTY_LEVELS, TIME_LIMITS } from "@/lib/constants";
import { Trash2, Plus, ArrowRight, Save, HelpCircle, AlertCircle, Shuffle } from "lucide-react";
import QuestionBank from "./question-bank";
import QuestionForm from "./question-form";

// Define schemas for form validation
const quizDetailsSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  difficulty: z.string().min(1, { message: "Difficulty is required" }),
  categoryId: z.number({
    required_error: "Please select a category",
    invalid_type_error: "Category must be a number",
  }),
  timeLimit: z.string().min(1, { message: "Time limit is required" }),
  active: z.boolean().default(true),
  randomizeQuestions: z.boolean().default(false),
});

type QuizDetailsFormValues = z.infer<typeof quizDetailsSchema>;

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
  tags?: string[];
}

export default function ManualQuizCreator() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { user } = useStore();
  const [currentTab, setCurrentTab] = useState("details");
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  
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
  
  // Initialize form for quiz details
  const detailsForm = useForm<QuizDetailsFormValues>({
    resolver: zodResolver(quizDetailsSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "intermediate",
      categoryId: 0,
      timeLimit: "15",
      active: true,
      randomizeQuestions: false,
    },
  });
  
  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (data: QuizDetailsFormValues & { questions: Question[], userId: string }) => {
      const response = await apiRequest("POST", "/api/quizzes", data);
      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      toast({
        title: "Quiz created successfully",
        description: "Your quiz is now available.",
      });
      navigate(`/quiz/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create quiz",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });
  
  // Handle adding a question from the bank
  const handleAddQuestion = (question: Question) => {
    setSelectedQuestions([...selectedQuestions, question]);
  };
  
  // Handle removing a question
  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
  };
  
  // Handle moving a question up in the list
  const handleMoveQuestionUp = (index: number) => {
    if (index === 0) return;
    const newQuestions = [...selectedQuestions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index - 1];
    newQuestions[index - 1] = temp;
    setSelectedQuestions(newQuestions);
  };
  
  // Handle moving a question down in the list
  const handleMoveQuestionDown = (index: number) => {
    if (index === selectedQuestions.length - 1) return;
    const newQuestions = [...selectedQuestions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + 1];
    newQuestions[index + 1] = temp;
    setSelectedQuestions(newQuestions);
  };
  
  // Handle quiz creation submission
  const handleCreateQuiz = () => {
    // Validate basic quiz details
    const detailsResult = detailsForm.trigger();
    if (!detailsResult) {
      setCurrentTab("details");
      toast({
        title: "Incomplete quiz details",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate that we have questions
    if (selectedQuestions.length === 0) {
      setCurrentTab("questions");
      toast({
        title: "No questions added",
        description: "Please add at least one question to your quiz.",
        variant: "destructive",
      });
      return;
    }
    
    // Get form values and create the quiz
    const detailsData = detailsForm.getValues();
    
    createQuizMutation.mutate({
      ...detailsData,
      questions: selectedQuestions,
      userId: user?.id || "",
    });
  };
  
  // Handle randomizing the question order
  const handleRandomizeQuestions = () => {
    if (selectedQuestions.length <= 1) return;
    
    const newQuestions = [...selectedQuestions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(newQuestions);
    
    toast({
      title: "Questions randomized",
      description: "The order of questions has been shuffled.",
    });
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
              <CardDescription>
                Provide the basic details for your quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...detailsForm}>
                <form className="space-y-4">
                  <FormField
                    control={detailsForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title for your quiz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={detailsForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what your quiz is about" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={detailsForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DIFFICULTY_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={detailsForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category: any) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={detailsForm.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time limit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIME_LIMITS.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-4">
                    <FormField
                      control={detailsForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Make quiz active</FormLabel>
                            <FormDescription>
                              Active quizzes are immediately available to participants
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={detailsForm.control}
                      name="randomizeQuestions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Randomize questions</FormLabel>
                            <FormDescription>
                              Shuffle question order each time the quiz is taken
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="justify-between">
              <div></div> {/* Empty div for spacing */}
              <Button onClick={() => setCurrentTab("questions")}>
                Continue to Questions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="pt-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Selected Questions</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRandomizeQuestions}
                      disabled={selectedQuestions.length <= 1}
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Randomize Order
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Questions that will be included in your quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedQuestions.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <AlertCircle className="h-10 w-10 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white">No questions selected</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Add questions from the question bank below or create new ones
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedQuestions.map((question, index) => (
                      <Card key={question.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 text-xs font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{question.text}</h4>
                                {question.codeSnippet && (
                                  <div className="mt-2 bg-gray-50 dark:bg-gray-900 rounded p-2 text-sm font-mono overflow-x-auto">
                                    <pre className="text-xs">{question.codeSnippet}</pre>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveQuestionUp(index)}
                                disabled={index === 0}
                                className="h-8 w-8 p-0"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveQuestionDown(index)}
                                disabled={index === selectedQuestions.length - 1}
                                className="h-8 w-8 p-0"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveQuestion(question.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Tabs defaultValue="bank">
              <TabsList>
                <TabsTrigger value="bank">Question Bank</TabsTrigger>
                <TabsTrigger value="new">Create New Question</TabsTrigger>
              </TabsList>
              <TabsContent value="bank" className="pt-4">
                <QuestionBank 
                  onSelectQuestion={handleAddQuestion} 
                  mode="select"
                  selectedQuestions={selectedQuestions}
                />
              </TabsContent>
              <TabsContent value="new" className="pt-4">
                <QuestionForm
                  mode="create"
                  onSave={(data) => {
                    // This will be called after the question is created
                    // The new question will be fetched from the question bank
                    queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
                  }}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentTab("details")}>
                Back to Quiz Details
              </Button>
              <Button 
                onClick={handleCreateQuiz}
                disabled={createQuizMutation.isPending || selectedQuestions.length === 0}
              >
                {createQuizMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-t-2 border-r-2 border-white border-solid rounded-full animate-spin" />
                    Creating Quiz...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Quiz
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}