import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Code, Save, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Define schema for the form
const questionFormSchema = z.object({
  text: z.string().min(5, { message: "Question text must be at least 5 characters" }),
  codeSnippet: z.string().optional(),
  categoryId: z.number({
    required_error: "Please select a category",
    invalid_type_error: "Category must be a number",
  }),
  tags: z.array(z.string()).optional(),
  options: z.array(
    z.object({
      text: z.string().min(1, { message: "Option text is required" }),
      isCorrect: z.boolean().default(false),
    })
  ).min(2, { message: "At least 2 options are required" })
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
  questionId?: number;
  initialData?: QuestionFormValues;
  onSave?: (data: QuestionFormValues) => void;
  mode?: 'create' | 'edit' | 'standalone';
  quizId?: number;
}

export default function QuestionForm({
  questionId,
  initialData,
  onSave,
  mode = 'standalone',
  quizId
}: QuestionFormProps) {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  
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
  
  // Get specific question if in edit mode
  const { data: questionData, isLoading: questionLoading } = useQuery({
    queryKey: ['/api/questions', questionId],
    queryFn: async () => {
      if (!questionId) return null;
      const response = await apiRequest("GET", `/api/questions/${questionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }
      return response.json();
    },
    enabled: !!questionId,
  });
  
  // Initialize the form
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData || {
      text: "",
      codeSnippet: "",
      categoryId: 0,
      tags: [],
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });
  
  // Fill form when editing existing question
  useEffect(() => {
    if (questionData && questionId) {
      form.reset({
        text: questionData.text,
        codeSnippet: questionData.codeSnippet || "",
        categoryId: questionData.categoryId,
        tags: questionData.tags || [],
        options: questionData.options.map((opt: any) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      });
      setSelectedTags(questionData.tags || []);
    }
  }, [questionData, questionId, form]);
  
  // Add question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: QuestionFormValues) => {
      const response = await apiRequest("POST", "/api/questions", {
        ...data,
        quizId: quizId || null, // If this is a standalone question, it won't be associated with a quiz
      });
      if (!response.ok) {
        throw new Error("Failed to create question");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      toast({
        title: "Question created",
        description: "Your question has been added to the question bank.",
      });
      
      // Reset form if in standalone mode
      if (mode === 'standalone') {
        form.reset({
          text: "",
          codeSnippet: "",
          categoryId: form.getValues().categoryId, // Keep the same category
          tags: [],
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
        setSelectedTags([]);
      }
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave(form.getValues());
      } else {
        navigate("/question-bank");
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to create question",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });
  
  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async (data: QuestionFormValues) => {
      if (!questionId) throw new Error("Question ID is required for updates");
      const response = await apiRequest("PUT", `/api/questions/${questionId}`, data);
      if (!response.ok) {
        throw new Error("Failed to update question");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/questions', questionId] });
      toast({
        title: "Question updated",
        description: "Your changes have been saved.",
      });
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave(form.getValues());
      } else {
        navigate("/question-bank");
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update question",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  function onSubmit(data: QuestionFormValues) {
    // Ensure at least one option is marked as correct
    const hasCorrectOption = data.options.some(option => option.isCorrect);
    
    if (!hasCorrectOption) {
      toast({
        title: "No correct answer",
        description: "Please mark at least one option as the correct answer.",
        variant: "destructive",
      });
      return;
    }
    
    // Include the selected tags
    data.tags = selectedTags;
    
    if (questionId) {
      updateQuestionMutation.mutate(data);
    } else {
      createQuestionMutation.mutate(data);
    }
  }
  
  // Add a new option field
  const addOption = () => {
    const options = form.getValues().options;
    form.setValue("options", [...options, { text: "", isCorrect: false }]);
  };
  
  // Remove an option field
  const removeOption = (index: number) => {
    const options = form.getValues().options;
    if (options.length <= 2) {
      toast({
        title: "Cannot remove option",
        description: "A question must have at least 2 options.",
        variant: "destructive",
      });
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    form.setValue("options", newOptions);
  };
  
  // Set an option as correct (radio button behavior)
  const setCorrectOption = (index: number) => {
    const options = form.getValues().options;
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    form.setValue("options", newOptions);
  };
  
  // Add a new tag
  const addTag = () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists in the selected tags
    if (selectedTags.includes(newTag.trim())) {
      toast({
        title: "Tag already added",
        description: "This tag is already in your selection.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTags([...selectedTags, newTag.trim()]);
    setNewTag("");
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  // Toggle existing tag
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{questionId ? "Edit Question" : "Create New Question"}</CardTitle>
            <CardDescription>
              {questionId 
                ? "Update this question in your question bank" 
                : "Add a new question to your question bank"}
            </CardDescription>
          </div>
          {mode === 'standalone' && (
            <Button variant="outline" size="sm" onClick={() => navigate("/question-bank")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Question Bank
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Question text */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your question here..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Code snippet (optional) */}
            <FormField
              control={form.control}
              name="codeSnippet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Code Snippet (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste code snippet here if applicable..." 
                      className="min-h-[100px] font-mono text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    If your question includes a code example, paste it here. The code will be formatted properly in the quiz.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Category selection */}
            <FormField
              control={form.control}
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
            
            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: any) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Label className="w-full text-sm text-gray-500 dark:text-gray-400">Selected tags:</Label>
                  {selectedTags.map(tag => (
                    <Badge key={tag} className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 p-0 ml-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Answer options */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Answer Options</Label>
                <Button
                  type="button"
                  onClick={addOption}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
              </div>
              
              {form.getValues().options.map((_, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_auto] gap-2 items-start p-3 rounded-md border dark:border-gray-700">
                  <div className="pt-2">
                    <input
                      type="radio"
                      id={`correct-${index}`}
                      checked={form.getValues().options[index].isCorrect}
                      onChange={() => setCorrectOption(index)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600"
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`options.${index}.text`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter answer option..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="button"
                    onClick={() => removeOption(index)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-500 mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <FormDescription>
                Select the radio button next to the correct answer option.
              </FormDescription>
            </div>
            
            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-4">
              {mode === 'standalone' && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/question-bank")}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
              >
                {createQuestionMutation.isPending || updateQuestionMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-t-2 border-r-2 border-white border-solid rounded-full animate-spin" />
                    {questionId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {questionId ? "Update Question" : "Save Question"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}