import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { DIFFICULTY_LEVELS, QUESTION_COUNTS, TIME_LIMITS } from "@/lib/constants";
import { useStore } from "@/store/auth-store";
import { useLocation } from "wouter";

export default function QuizForm() {
  const { toast } = useToast();
  const { user } = useStore();
  const [_, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "intermediate",
    questionCount: "10",
    timeLimit: "15",
    includeCode: false
  });

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
      const response = await apiRequest("POST", "/api/quizzes/generate", {
        ...data,
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      toast({
        title: "Quiz generated successfully",
        description: "Your quiz has been created and is now available.",
      });
      setLocation(`/quiz/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate quiz",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      toast({
        title: "Topic is required",
        description: "Please enter a quiz topic",
        variant: "destructive",
      });
      return;
    }
    
    generateQuizMutation.mutate(formData);
  };

  return (
    <Card className="bg-white dark:bg-[#1e1e1e] shadow sm:rounded-lg">
      <CardContent className="p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Generate a quiz with AI
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>Our AI will create a comprehensive quiz based on your topic. Just provide the subject area and customization options.</p>
        </div>
        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="topic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quiz Topic
            </Label>
            <Input 
              id="topic" 
              name="topic" 
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-[#111] dark:text-white"
              placeholder="e.g. JavaScript Fundamentals"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Difficulty Level
              </Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value) => handleSelectChange("difficulty", value)}
              >
                <SelectTrigger className="mt-1 w-full dark:bg-[#111]">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="questionCount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Questions
              </Label>
              <Select 
                value={formData.questionCount} 
                onValueChange={(value) => handleSelectChange("questionCount", value)}
              >
                <SelectTrigger className="mt-1 w-full dark:bg-[#111]">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_COUNTS.map((count) => (
                    <SelectItem key={count.value} value={count.value}>
                      {count.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timeLimit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Limit
              </Label>
              <Select 
                value={formData.timeLimit} 
                onValueChange={(value) => handleSelectChange("timeLimit", value)}
              >
                <SelectTrigger className="mt-1 w-full dark:bg-[#111]">
                  <SelectValue placeholder="Select time limit" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_LIMITS.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
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
                  Include code snippets
                </Label>
                <p className="text-gray-500 dark:text-gray-400">
                  Include code examples in questions where applicable
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <Button 
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-[#111]"
              disabled={generateQuizMutation.isPending}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {generateQuizMutation.isPending ? "Generating..." : "Generate Quiz"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
