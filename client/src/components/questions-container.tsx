import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Save, Clock, AlarmClock, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionEditor, { Question, Option } from "./question-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIME_LIMITS, DIFFICULTY_LEVELS } from "@/lib/constants";

export interface SequenceSettings {
  randomizeQuestions: boolean;
  timeLimit: string;
  difficulty: string;
}

interface QuestionsContainerProps {
  initialQuestions?: Question[];
  onSave?: (questions: Question[], settings: SequenceSettings) => void;
  allowSettings?: boolean;
}

export default function QuestionsContainer({ 
  initialQuestions = [], 
  onSave,
  allowSettings = true
}: QuestionsContainerProps) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions.length > 0 
    ? initialQuestions 
    : [createEmptyQuestion()]
  );
  const [settings, setSettings] = useState<SequenceSettings>({
    randomizeQuestions: false,
    timeLimit: "10",
    difficulty: "intermediate"
  });
  
  // Create an empty question with default options
  function createEmptyQuestion(): Question {
    return {
      text: "",
      options: [
        { id: Date.now(), text: "", isCorrect: true },
        { id: Date.now() + 1, text: "", isCorrect: false },
      ],
      codeSnippet: null
    };
  }
  
  // Handle adding a new question
  const addQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
  };
  
  // Handle question change
  const handleQuestionChange = (updatedQuestion: Question, index: number) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };
  
  // Handle question deletion
  const handleQuestionDelete = (index: number) => {
    if (questions.length <= 1) {
      toast({
        title: "Cannot delete all questions",
        description: "You need at least one question.",
        variant: "destructive",
      });
      return;
    }
    
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
  };
  
  // Handle moving a question up in the sequence
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index - 1];
    newQuestions[index - 1] = temp;
    setQuestions(newQuestions);
  };
  
  // Handle moving a question down in the sequence
  const handleMoveDown = (index: number) => {
    if (index === questions.length - 1) return;
    
    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + 1];
    newQuestions[index + 1] = temp;
    setQuestions(newQuestions);
  };
  
  // Validate questions before saving
  const validateQuestions = (): boolean => {
    let isValid = true;
    let errorMessage = "";

    // Check if all questions have text
    const emptyQuestions = questions.filter(q => !q.text.trim());
    if (emptyQuestions.length > 0) {
      isValid = false;
      errorMessage = `${emptyQuestions.length} question(s) have no text.`;
    }

    // Check if all questions have at least 2 options
    const invalidOptionCount = questions.filter(q => q.options.length < 2);
    if (invalidOptionCount.length > 0) {
      isValid = false;
      errorMessage = `${invalidOptionCount.length} question(s) have fewer than 2 options.`;
    }

    // Check if all questions have exactly one correct answer
    const invalidCorrectCount = questions.filter(q => {
      const correctCount = q.options.filter(o => o.isCorrect).length;
      return correctCount !== 1;
    });
    if (invalidCorrectCount.length > 0) {
      isValid = false;
      errorMessage = `${invalidCorrectCount.length} question(s) don't have exactly one correct answer.`;
    }

    // Check if all options have text
    let emptyOptionsCount = 0;
    questions.forEach(q => {
      q.options.forEach(o => {
        if (!o.text.trim()) {
          emptyOptionsCount++;
        }
      });
    });
    if (emptyOptionsCount > 0) {
      isValid = false;
      errorMessage = `${emptyOptionsCount} option(s) have no text.`;
    }

    if (!isValid) {
      toast({
        title: "Cannot save questions",
        description: errorMessage,
        variant: "destructive",
      });
    }

    return isValid;
  };
  
  // Handle save
  const handleSave = () => {
    if (!validateQuestions()) return;
    
    if (onSave) {
      onSave(questions, settings);
      toast({
        title: "Questions saved",
        description: `${questions.length} question(s) have been saved.`,
      });
    }
  };
  
  return (
    <div className="space-y-8">
      {allowSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>Configure how your quiz will be presented to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Select 
                  value={settings.timeLimit}
                  onValueChange={(value) => setSettings({...settings, timeLimit: value})}
                >
                  <SelectTrigger id="timeLimit" className="w-full">
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
              
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={settings.difficulty}
                  onValueChange={(value) => setSettings({...settings, difficulty: value})}
                >
                  <SelectTrigger id="difficulty" className="w-full">
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
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Questions
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({questions.length} total)
          </span>
        </h2>
        <Button onClick={addQuestion} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Question
        </Button>
      </div>
      
      <AnimatePresence>
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionEditor
              question={question}
              index={index}
              totalQuestions={questions.length}
              onChange={handleQuestionChange}
              onDelete={handleQuestionDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <div className="flex justify-between items-center mt-8">
        <Button 
          variant="outline" 
          onClick={addQuestion}
          className="gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Another Question
        </Button>
        
        {onSave && (
          <Button 
            onClick={handleSave}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save Questions
          </Button>
        )}
      </div>
    </div>
  );
}