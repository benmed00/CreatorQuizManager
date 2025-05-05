import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Trash2, Code, PlusCircle, FileCode, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id?: number;
  text: string;
  options: Option[];
  codeSnippet?: string | null;
  categoryId?: number;
  difficulty?: string;
  tags?: string[];
}

interface QuestionEditorProps {
  question: Question;
  index: number;
  totalQuestions: number;
  onChange: (question: Question, index: number) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export default function QuestionEditor({
  question,
  index,
  totalQuestions,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown
}: QuestionEditorProps) {
  const { toast } = useToast();
  const [showCodeEditor, setShowCodeEditor] = useState(!!question.codeSnippet);
  const [options, setOptions] = useState<Option[]>(question.options);
  const [questionText, setQuestionText] = useState(question.text);
  const [codeSnippet, setCodeSnippet] = useState(question.codeSnippet || "");
  
  // Update the parent component when this question changes
  useEffect(() => {
    const updatedQuestion: Question = {
      ...question,
      text: questionText,
      options: options,
      codeSnippet: showCodeEditor ? codeSnippet : null
    };
    onChange(updatedQuestion, index);
  }, [questionText, options, codeSnippet, showCodeEditor]);
  
  // Handle option text change
  const handleOptionTextChange = (id: number, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };
  
  // Handle correct option change
  const handleCorrectOptionChange = (id: number) => {
    setOptions(options.map(option => 
      ({ ...option, isCorrect: option.id === id })
    ));
  };
  
  // Add a new option
  const addOption = () => {
    if (options.length >= 5) {
      toast({
        title: "Maximum options reached",
        description: "You can have a maximum of 5 options per question.",
        variant: "destructive",
      });
      return;
    }
    
    const newOption: Option = {
      id: Date.now(), // Use timestamp as temporary ID
      text: "",
      isCorrect: false
    };
    setOptions([...options, newOption]);
  };
  
  // Remove an option
  const removeOption = (id: number) => {
    if (options.length <= 2) {
      toast({
        title: "Minimum options required",
        description: "You need at least 2 options per question.",
        variant: "destructive",
      });
      return;
    }
    
    // If removing the correct option, make the first remaining option correct
    const wasCorrect = options.find(o => o.id === id)?.isCorrect;
    let newOptions = options.filter(option => option.id !== id);
    
    if (wasCorrect && newOptions.length > 0) {
      newOptions = newOptions.map((option, idx) => 
        ({ ...option, isCorrect: idx === 0 })
      );
    }
    
    setOptions(newOptions);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 border-2 hover:shadow-md transition-all">
        <CardHeader className="pb-3 flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              #{index + 1}
            </Badge>
            <CardTitle className="text-lg">Question</CardTitle>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="h-8 w-8"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onMoveDown(index)}
              disabled={index === totalQuestions - 1}
              className="h-8 w-8"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(index)}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label htmlFor={`question-${index}`} className="text-base font-semibold">
              Question Text
            </Label>
            <Textarea 
              id={`question-${index}`}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
              className="mt-2 resize-none min-h-[100px] dark:bg-gray-900"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              checked={showCodeEditor}
              onCheckedChange={setShowCodeEditor}
              id={`code-toggle-${index}`}
            />
            <Label htmlFor={`code-toggle-${index}`} className="flex items-center cursor-pointer">
              <Code className="h-4 w-4 mr-2" />
              Include Code Snippet
            </Label>
          </div>
          
          {showCodeEditor && (
            <div className="relative">
              <Label htmlFor={`code-snippet-${index}`} className="flex items-center text-base font-semibold">
                <FileCode className="h-4 w-4 mr-2" />
                Code Snippet
              </Label>
              <Textarea 
                id={`code-snippet-${index}`}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Enter code snippet here..."
                className="mt-2 resize-none font-mono text-sm min-h-[150px] bg-gray-900 text-gray-50"
              />
            </div>
          )}
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Answer Options</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={addOption}
                className="h-8 px-2 text-xs"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Add Option
              </Button>
            </div>
            
            <RadioGroup value={options.find(o => o.isCorrect)?.id.toString()}>
              {options.map((option, optIdx) => (
                <div key={option.id} className="flex items-start space-x-2 py-3 border-b last:border-0">
                  <div className="pt-2">
                    <RadioGroupItem 
                      value={option.id.toString()} 
                      id={`option-${index}-${option.id}`}
                      checked={option.isCorrect}
                      onClick={() => handleCorrectOptionChange(option.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor={`option-${index}-${option.id}`} 
                        className={`font-medium ${option.isCorrect ? 'text-green-600 dark:text-green-400' : ''}`}
                      >
                        Option {String.fromCharCode(65 + optIdx)}
                        {option.isCorrect && (
                          <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                            Correct Answer
                          </Badge>
                        )}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input 
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                      placeholder={`Enter option ${String.fromCharCode(65 + optIdx)} text...`}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Reset to default state
              setQuestionText(question.text);
              setOptions(question.options);
              setCodeSnippet(question.codeSnippet || "");
              setShowCodeEditor(!!question.codeSnippet);
            }}
            className="text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset Changes
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}