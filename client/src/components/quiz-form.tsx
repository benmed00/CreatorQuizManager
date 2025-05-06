import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTY_LEVELS, QUESTION_COUNTS, TIME_LIMITS } from "@/lib/constants";
import { useStore } from "@/store/auth-store";
import { useQuizStore } from "@/store/quiz-store";
import { useLocation } from "wouter";
import { QuizTemplate } from "@/pages/templates";
import { FirestoreQuiz } from "@/lib/firestore-service";

interface QuizFormProps {
  selectedTemplate?: QuizTemplate | null;
}

export default function QuizForm({ selectedTemplate }: QuizFormProps) {
  const { toast } = useToast();
  const { user } = useStore();
  const [_, navigate] = useLocation();
  const createQuiz = useQuizStore(state => state.createQuiz);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "intermediate",
    questionCount: "10",
    timeLimit: "15",
    includeCode: false
  });
  
  const [usedTemplate, setUsedTemplate] = useState<QuizTemplate | null>(null);
  
  // Apply the template if it's provided
  useEffect(() => {
    if (selectedTemplate && !usedTemplate) {
      const { template } = selectedTemplate;
      setFormData({
        topic: template.topic,
        difficulty: template.difficulty,
        questionCount: template.questionCount.toString(),
        timeLimit: selectedTemplate.timeLimit.toString(),
        includeCode: template.includeCodeSnippets
      });
      setUsedTemplate(selectedTemplate);
      
      toast({
        title: t("template_applied"),
        description: t("template_applied_description", { name: selectedTemplate.name }),
      });
    }
  }, [selectedTemplate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, includeCode: checked }));
  };

  const generateQuizMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      try {
        // First generate quiz with API
        const apiResponse = await apiRequest("POST", "/api/quizzes/generate", {
          ...data,
          userId: user?.id,
          categoryId: usedTemplate?.categoryId || 2 // Default to Programming if no template, otherwise use template's categoryId
        });
        
        // Then create the quiz in Firestore
        const firestoreQuiz: Omit<FirestoreQuiz, 'id'> = {
          title: apiResponse.title || data.topic,
          description: apiResponse.description || `A quiz about ${data.topic}`,
          category: apiResponse.category || "Programming",
          categoryId: usedTemplate?.categoryId || 2,
          difficulty: data.difficulty,
          createdBy: user?.uid || "anonymous",
          createdAt: new Date(),
          updatedAt: new Date(),
          questionCount: parseInt(data.questionCount),
          timeLimit: parseInt(data.timeLimit),
          isPublic: true,
          tags: apiResponse.tags || [data.topic]
        };
        
        // Create the quiz in Firestore
        const quizId = await createQuiz(firestoreQuiz);
        
        // Ensure questions have correct quiz ID reference and format
        const formattedQuestions = apiResponse.questions?.map((q: any) => ({
          text: q.text,
          options: q.options.map((option: string, idx: number) => ({
            id: `option-${idx+1}`,
            text: option,
            isCorrect: idx === q.correctOptionIndex
          })),
          correctOptionId: `option-${q.correctOptionIndex+1}`,
          quizId: quizId,
          categoryId: firestoreQuiz.categoryId,
          difficulty: firestoreQuiz.difficulty,
          codeSnippet: q.codeSnippet || null
        })) || [];
        
        // Log the questions being created for debugging
        console.log(`Creating ${formattedQuestions.length} questions for quiz ID ${quizId}`);
        
        try {
          // Store questions in Firestore
          if (formattedQuestions.length > 0) {
            const questionService = useQuizStore.getState().addQuestion;
            
            // Create each question with explicit reference to the quiz
            for (const question of formattedQuestions) {
              await questionService({
                text: question.text,
                options: question.options,
                correctOptionId: question.correctOptionId,
                categoryId: question.categoryId,
                difficulty: question.difficulty,
                codeSnippet: question.codeSnippet
              });
            }
            
            console.log(`Successfully created ${formattedQuestions.length} questions for quiz ID ${quizId}`);
          }
        } catch (error) {
          console.error("Error creating questions:", error);
          // We still return the quiz ID even if question creation fails
          // This allows the user to edit the quiz later to add questions
        }
        
        return { ...apiResponse, id: quizId, questionCount: formattedQuestions.length };
      } catch (error) {
        console.error("Error creating quiz:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      toast({
        title: t("quiz_generated_success"),
        description: t("quiz_created_description"),
      });
      navigate(`/quiz/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: t("failed_to_generate_quiz"),
        description: error.message || t("try_again_later"),
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      toast({
        title: t("topic_required"),
        description: t("please_enter_topic"),
        variant: "destructive",
      });
      return;
    }
    
    generateQuizMutation.mutate(formData);
  };

  return (
    <Card className="bg-white dark:bg-[#1e1e1e] shadow sm:rounded-lg">
      <CardContent className="p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          {t("generate_quiz_with_ai")}
          {usedTemplate && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              <Sparkles className="h-3 w-3 mr-1" />
              {t("template")}: {usedTemplate.name}
            </span>
          )}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>{t("quiz_ai_description")}</p>
          
          {usedTemplate && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 rounded-md bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800"
            >
              <p className="text-primary-700 dark:text-primary-300 flex items-center font-medium">
                <Sparkles className="h-4 w-4 mr-2 text-primary-500" />
                {t("template_values_applied")}
              </p>
            </motion.div>
          )}
        </div>
        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="topic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("quiz_topic")}
            </Label>
            <Input 
              id="topic" 
              name="topic" 
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-[#111] dark:text-white"
              placeholder={t("topic_placeholder")}
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("difficulty_level")}
              </Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value) => handleSelectChange("difficulty", value)}
              >
                <SelectTrigger className="mt-1 w-full dark:bg-[#111]">
                  <SelectValue placeholder={t("select_difficulty")} />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {t(`difficulty.${level.value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="questionCount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("number_of_questions")}
              </Label>
              <Select 
                value={formData.questionCount} 
                onValueChange={(value) => handleSelectChange("questionCount", value)}
              >
                <SelectTrigger className="mt-1 w-full dark:bg-[#111]">
                  <SelectValue placeholder={t("select_count")} />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_COUNTS.map((count) => (
                    <SelectItem key={count.value} value={count.value}>
                      {t(`question_count.${count.value}`, {defaultValue: count.label})}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timeLimit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("time_limit")}
              </Label>
              <Select 
                value={formData.timeLimit} 
                onValueChange={(value) => handleSelectChange("timeLimit", value)}
              >
                <SelectTrigger className="mt-1 w-full dark:bg-[#111]">
                  <SelectValue placeholder={t("select_time_limit")} />
                </SelectTrigger>
                <SelectContent>
                  {TIME_LIMITS.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {t(`time_limit.${time.value}`, {defaultValue: time.label})}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <div className="flex items-start">
              <Checkbox
                id="includeCode"
                checked={formData.includeCode}
                onCheckedChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded dark:border-gray-700 dark:bg-[#111]"
              />
              <div className="ml-3 text-sm">
                <Label 
                  htmlFor="includeCode" 
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("include_code_snippets")}
                </Label>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("code_snippets_description")}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                type="submit"
                size="lg"
                className="relative overflow-hidden group bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg min-w-[200px]"
                disabled={generateQuizMutation.isPending}
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-lg" />
                <div className="flex items-center justify-center relative z-10 py-3">
                  {!generateQuizMutation.isPending ? (
                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 1 }}
                      animate={{ 
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Wand2 className="h-5 w-5 mr-3 animate-pulse" />
                      <span className="text-base font-medium">{t("generate_quiz")}</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center">
                      <div className="mr-3 h-5 w-5 border-t-2 border-r-2 border-white border-solid rounded-full animate-spin" />
                      <span className="text-base font-medium">{t("generating")}</span>
                    </div>
                  )}
                </div>
              </Button>
            </motion.div>
            
            {!generateQuizMutation.isPending && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                {t("create_quiz_description")}
              </p>
            )}
            
            {generateQuizMutation.isPending && (
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-blue-700 dark:text-blue-300 mt-2 sm:mt-0">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="mr-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <span className="text-sm font-medium">{t("creating_with_ai")}</span>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
