import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, PlusCircle, Save, BookOpen, Trash2, Edit, Clock, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useStore } from "@/store/auth-store";
import QuestionForm from "./question-form";
import { useLocation } from "wouter";

// Define the question interface
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

// Create a schema for quiz details form
const quizDetailsSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  categoryId: z.coerce.number().int().positive(),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
  timeLimit: z.string().min(1, { message: "Please specify a time limit" }),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

type QuizDetailsFormValues = z.infer<typeof quizDetailsSchema>;

export default function ManualQuizCreator() {
  const { user } = useStore();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  
  // Form setup for quiz details
  const form = useForm<QuizDetailsFormValues>({
    resolver: zodResolver(quizDetailsSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: 0,
      difficulty: "beginner",
      timeLimit: "10",
      isPublic: true,
      tags: [],
    },
  });
  
  // Query for categories
  const categoriesQuery = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      return await apiRequest<{ id: number; name: string }[]>("GET", "/api/categories");
    },
  });
  
  // Query for questions
  const questionsQuery = useQuery({
    queryKey: ["/api/questions"],
    queryFn: async () => {
      return await apiRequest<Question[]>("GET", "/api/questions");
    },
  });
  
  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest<{ id: number }>("POST", "/api/quizzes", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      toast({
        title: "Success!",
        description: "Your quiz has been created successfully.",
        variant: "default",
      });
      navigate(`/quizzes/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleAddQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
    setIsEditingQuestion(false);
    
    toast({
      title: "Question Added",
      description: "Your question has been added to the quiz.",
    });
  };
  
  const handleEditQuestion = (question: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? question : q))
    );
    setSelectedQuestion(null);
    setIsEditingQuestion(false);
    
    toast({
      title: "Question Updated",
      description: "Your question has been updated successfully.",
    });
  };
  
  const handleRemoveQuestion = (questionId: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    
    toast({
      title: "Question Removed",
      description: "The question has been removed from the quiz.",
    });
  };
  
  const handleSelectExistingQuestion = (question: Question) => {
    if (questions.some((q) => q.id === question.id)) {
      toast({
        title: "Question Already Added",
        description: "This question is already in your quiz.",
        variant: "destructive",
      });
      return;
    }
    
    setQuestions((prev) => [...prev, question]);
    
    toast({
      title: "Question Added",
      description: "The existing question has been added to your quiz.",
    });
  };
  
  const handleQuizSubmit = (formData: QuizDetailsFormValues) => {
    if (questions.length === 0) {
      toast({
        title: "No Questions",
        description: "Please add at least one question to your quiz.",
        variant: "destructive",
      });
      return;
    }
    
    const quizData = {
      ...formData,
      userId: user?.id || "anonymous",
      questionCount: questions.length,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        codeSnippet: q.codeSnippet,
        options: q.options,
        categoryId: q.categoryId,
      })),
    };
    
    createQuizMutation.mutate(quizData);
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      form.handleSubmit(() => setStep(2))();
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
                <CardDescription>
                  Start by providing general information about your quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quiz Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter quiz title" {...field} />
                            </FormControl>
                            <FormDescription>
                              A clear and concise title for your quiz
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categoriesQuery.isLoading ? (
                                  <SelectItem value="0">Loading categories...</SelectItem>
                                ) : categoriesQuery.data ? (
                                  categoriesQuery.data.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                      {category.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="0">No categories available</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The subject area of your quiz
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How challenging your quiz will be
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timeLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Limit (minutes)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time limit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="5">5 minutes</SelectItem>
                                <SelectItem value="10">10 minutes</SelectItem>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="20">20 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How long users have to complete the quiz
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter a detailed description of your quiz"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Explain what the quiz covers and who it's for
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Make this quiz public</FormLabel>
                            <FormDescription>
                              Public quizzes can be taken by anyone and will appear in search results.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Next: Add Questions
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>
                      Add questions to your quiz
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1"
                  >
                    Back to Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!isEditingQuestion && questions.length === 0 && (
                  <div className="text-center py-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Questions Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Your quiz needs at least one question. You can create new questions or add existing ones from your question bank.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => setIsEditingQuestion(true)}
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Create New Question
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {}}
                        className="flex items-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        Browse Question Bank
                      </Button>
                    </div>
                  </div>
                )}
                
                {!isEditingQuestion && questions.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Your Questions ({questions.length})
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsEditingQuestion(true)}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Question
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <BookOpen className="h-4 w-4" />
                          Question Bank
                        </Button>
                      </div>
                    </div>
                    
                    <ScrollArea className="max-h-[400px] pr-4">
                      <div className="space-y-3">
                        {questions.map((question, index) => (
                          <Card key={question.id} className="relative">
                            <div className="absolute -left-2 -top-2 bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <CardContent className="pt-6 pb-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-base line-clamp-2">
                                    {question.text}
                                  </h4>
                                  
                                  {question.codeSnippet && (
                                    <div className="mt-2 bg-slate-100 dark:bg-slate-800 rounded p-2 text-xs overflow-auto max-h-[100px]">
                                      <code className="text-xs whitespace-pre-wrap font-mono">
                                        {question.codeSnippet}
                                      </code>
                                    </div>
                                  )}
                                  
                                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {question.options.map((option) => (
                                      <div 
                                        key={option.id}
                                        className={`text-sm p-2 rounded-md border ${
                                          option.isCorrect
                                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                                            : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                                        }`}
                                      >
                                        {option.isCorrect && (
                                          <Star className="inline-block h-3 w-3 text-green-500 dark:text-green-400 mr-1" />
                                        )}
                                        {option.text}
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {question.categoryName && (
                                    <div className="mt-3">
                                      <Badge variant="outline" className="text-xs">
                                        {question.categoryName}
                                      </Badge>
                                      {question.tags?.map((tag) => (
                                        <Badge 
                                          key={tag} 
                                          variant="secondary"
                                          className="ml-2 text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedQuestion(question);
                                      setIsEditingQuestion(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveQuestion(question.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            Quiz Summary
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {form.getValues().title} • {questions.length} questions • {form.getValues().timeLimit} minutes • {form.getValues().difficulty}
                          </p>
                        </div>
                        <Button 
                          onClick={() => handleQuizSubmit(form.getValues())}
                          disabled={questions.length === 0 || createQuizMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Quiz
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {isEditingQuestion && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {selectedQuestion ? "Edit Question" : "Create Question"}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingQuestion(false);
                          setSelectedQuestion(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    
                    <QuestionForm 
                      initialData={selectedQuestion ? {
                        text: selectedQuestion.text,
                        codeSnippet: selectedQuestion.codeSnippet,
                        categoryId: selectedQuestion.categoryId,
                        options: selectedQuestion.options,
                      } : undefined}
                      onSave={selectedQuestion ? handleEditQuestion : handleAddQuestion}
                      mode="standalone"
                      questionId={selectedQuestion?.id}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}