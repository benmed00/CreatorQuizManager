import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  X, Plus, Code, Save, Info, Search, 
  FolderTree, FolderClosed, FolderX,
  Loader2 
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Question form schema
const questionFormSchema = z.object({
  text: z.string().min(5, {
    message: "Question text must be at least 5 characters.",
  }),
  codeSnippet: z.string().optional().nullable(),
  categoryId: z.coerce.number().int().min(1, {
    message: "Please select a category.",
  }),
  options: z.array(
    z.object({
      id: z.number().optional(),
      text: z.string().min(1, {
        message: "Option text cannot be empty.",
      }),
      isCorrect: z.boolean().default(false),
    })
  ).min(2, {
    message: "Please add at least 2 options.",
  }).refine(
    (options) => options.some((option) => option.isCorrect),
    {
      message: "Please mark at least one option as correct.",
      path: ["options"],
    }
  ),
  tags: z.array(z.string()).optional(),
  quizId: z.number().optional(),
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
  quizId,
}: QuestionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData || {
      text: "",
      codeSnippet: "",
      categoryId: 0,
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ],
      tags: [],
      quizId: quizId,
    },
  });

  const [showCodeEditor, setShowCodeEditor] = useState(!!initialData?.codeSnippet);

  // Query for categories
  const categoriesQuery = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      return await apiRequest<{ id: number; name: string }[]>("GET", "/api/categories");
    },
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: QuestionFormValues) => {
      return await apiRequest<QuestionFormValues & { id: number }>("POST", "/api/questions", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      if (onSave) {
        onSave(data);
      } else {
        toast({
          title: "Success",
          description: "Question created successfully",
        });
        form.reset();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create question. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async (data: QuestionFormValues) => {
      return await apiRequest<QuestionFormValues & { id: number }>("PATCH", `/api/questions/${questionId}`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      if (onSave) {
        onSave(data);
      } else {
        toast({
          title: "Success",
          description: "Question updated successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: QuestionFormValues) {
    // If in standalone mode with no questionId, create a new question
    if (mode === 'standalone' && !questionId && !onSave) {
      createQuestionMutation.mutate(data);
    } 
    // If updating an existing question (edit mode)
    else if (questionId) {
      updateQuestionMutation.mutate(data);
    } 
    // If a custom onSave handler is provided
    else if (onSave) {
      onSave({
        ...data,
        id: questionId || Math.floor(Math.random() * 1000000), // Temporary ID for new questions
      });
    }
  }

  const addOption = () => {
    const currentOptions = form.getValues("options");
    form.setValue("options", [
      ...currentOptions,
      { id: currentOptions.length + 1, text: "", isCorrect: false },
    ]);
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options");
    if (currentOptions.length <= 2) {
      toast({
        title: "Cannot Remove",
        description: "A question must have at least 2 options.",
        variant: "destructive",
      });
      return;
    }
    form.setValue(
      "options",
      currentOptions.filter((_, i) => i !== index)
    );
  };

  const toggleCodeEditor = () => {
    setShowCodeEditor(!showCodeEditor);
    if (!showCodeEditor) {
      form.setValue("codeSnippet", "");
    }
  };

  return (
    <Card className="border-2 border-gray-100 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
        <CardTitle>{questionId ? "Edit Question" : "Create a New Question"}</CardTitle>
        <CardDescription>
          {mode === 'standalone'
            ? "Create a question that can be reused in multiple quizzes"
            : "Add a question to your quiz"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your question text here..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be clear and specific in your question
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="code-snippet"
                  checked={showCodeEditor}
                  onCheckedChange={toggleCodeEditor}
                />
                <label
                  htmlFor="code-snippet"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  <Code className="h-4 w-4 mr-1 text-muted-foreground" />
                  Include Code Snippet
                </label>
              </div>
            </div>

            {showCodeEditor && (
              <FormField
                control={form.control}
                name="codeSnippet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Snippet</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter code snippet here..."
                        className="min-h-[150px] font-mono text-sm"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Category</FormLabel>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                          <Info className="h-3.5 w-3.5" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Why select a category?</h4>
                          <p className="text-sm text-muted-foreground">
                            Categories help organize questions by topic. They make it easier to find related questions when creating quizzes and help users understand what knowledge areas are covered.
                          </p>
                          <div className="pt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <FolderTree className="h-3.5 w-3.5 text-primary" /> 
                              <span>Used for filtering and organizing questions</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Search className="h-3.5 w-3.5 text-primary" /> 
                              <span>Makes finding specific questions easier</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="flex items-center gap-2">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesQuery.isLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading categories...</span>
                        </div>
                      ) : categoriesQuery.data && categoriesQuery.data.length > 0 ? (
                        categoriesQuery.data.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            <div className="flex items-center gap-2">
                              <FolderClosed className="h-4 w-4 text-muted-foreground" />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <div className="px-2 py-4 text-center">
                            <FolderX className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">No categories available</p>
                            <p className="text-xs text-muted-foreground">Using default category</p>
                          </div>
                          <SelectItem value="1">General Knowledge</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category to help organize your questions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel className="text-base">Options</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="h-8 gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Option
                </Button>
              </div>
              <FormDescription className="mb-3">
                Add multiple options and mark the correct one(s)
              </FormDescription>

              <div className="space-y-3">
                {form.getValues("options").map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-md border p-3"
                  >
                    <FormField
                      control={form.control}
                      name={`options.${index}.isCorrect`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <div className="h-full pt-2">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`Option ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove option {index + 1}</span>
                    </Button>
                  </div>
                ))}
              </div>
              {form.formState.errors.options?.message && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.options?.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              {mode !== 'standalone' && (
                <Button type="button" variant="outline" onClick={() => onSave && onSave(form.getValues())}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={
                  createQuestionMutation.isPending || updateQuestionMutation.isPending
                }
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                {questionId ? "Update Question" : "Save Question"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}