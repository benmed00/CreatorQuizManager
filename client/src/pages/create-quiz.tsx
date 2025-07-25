import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuizForm from "@/components/quiz-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/auth-store";
import ManualQuizCreator from "@/components/manual-quiz-creator";
import QuestionsContainer from "@/components/questions-container";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Building, Code, Wand2, BookOpen, ArrowRight, ExternalLink, ListTodo } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { QuizTemplate } from "./templates";
import { useTranslation } from "react-i18next";

export default function CreateQuiz() {
  const { user } = useStore();
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("ai-generated");
  const [selectedTemplate, setSelectedTemplate] = useState<QuizTemplate | null>(null);
  const [editorQuestions, setEditorQuestions] = useState<any[]>([]);
  const [editorSettings, setEditorSettings] = useState({
    randomizeQuestions: false,
    timeLimit: "10",
    difficulty: "intermediate"
  });
  
  // Check if a template was selected from the templates page
  useEffect(() => {
    const template = queryClient.getQueryData<QuizTemplate>(['create-quiz-template']);
    if (template) {
      setSelectedTemplate(template);
      setActiveTab("ai-generated");
      // Clear the template data to prevent it from being reapplied on page refresh
      queryClient.removeQueries({ queryKey: ['create-quiz-template'] });
    }
  }, []);
  
  // Generate some sample questions for the editor when a template is selected
  useEffect(() => {
    if (selectedTemplate) {
      // Advanced utility to generate realistic sample questions based on template type
      const generateSampleQuestionsFromTemplate = () => {
        const { template } = selectedTemplate;
        const topic = template.topic;
        const templateId = selectedTemplate.id;
        
        // Define specific questions for different templates
        if (templateId === "javascript-basics") {
          return [
            {
              text: "What is the output of: console.log(typeof null)?",
              options: [
                { id: Date.now() + 1, text: "null", isCorrect: false },
                { id: Date.now() + 2, text: "object", isCorrect: true },
                { id: Date.now() + 3, text: "undefined", isCorrect: false },
                { id: Date.now() + 4, text: "number", isCorrect: false }
              ],
              codeSnippet: "console.log(typeof null);"
            },
            {
              text: "Which method is used to add an element to the end of an array?",
              options: [
                { id: Date.now() + 5, text: "push()", isCorrect: true },
                { id: Date.now() + 6, text: "append()", isCorrect: false },
                { id: Date.now() + 7, text: "addToEnd()", isCorrect: false },
                { id: Date.now() + 8, text: "concat()", isCorrect: false }
              ],
              codeSnippet: null
            },
            {
              text: "What is the result of the following expression?",
              options: [
                { id: Date.now() + 9, text: "0", isCorrect: false },
                { id: Date.now() + 10, text: "1", isCorrect: false },
                { id: Date.now() + 11, text: "true", isCorrect: false },
                { id: Date.now() + 12, text: "false", isCorrect: true }
              ],
              codeSnippet: "'5' === 5"
            }
          ];
        } else if (templateId === "business-fundamentals") {
          return [
            {
              text: "Which of the following is NOT one of Porter's Five Forces?",
              options: [
                { id: Date.now() + 1, text: "Threat of new entrants", isCorrect: false },
                { id: Date.now() + 2, text: "Bargaining power of suppliers", isCorrect: false },
                { id: Date.now() + 3, text: "Economic scalability", isCorrect: true },
                { id: Date.now() + 4, text: "Rivalry among existing competitors", isCorrect: false }
              ],
              codeSnippet: null
            },
            {
              text: "What does SWOT stand for in business analysis?",
              options: [
                { id: Date.now() + 5, text: "Strengths, Weaknesses, Operations, Threats", isCorrect: false },
                { id: Date.now() + 6, text: "Strengths, Weaknesses, Opportunities, Threats", isCorrect: true },
                { id: Date.now() + 7, text: "Strategic, Workable, Operational, Tactical", isCorrect: false },
                { id: Date.now() + 8, text: "Simple, Workable, Original, Truthful", isCorrect: false }
              ],
              codeSnippet: null
            },
            {
              text: "Which of these is a key component of a balanced scorecard?",
              options: [
                { id: Date.now() + 9, text: "Financial perspective", isCorrect: true },
                { id: Date.now() + 10, text: "Marketing investments", isCorrect: false },
                { id: Date.now() + 11, text: "Production schedules", isCorrect: false },
                { id: Date.now() + 12, text: "Inventory turnover", isCorrect: false }
              ],
              codeSnippet: null
            }
          ];
        } else if (templateId === "general-knowledge") {
          return [
            {
              text: "Which planet is known as the Red Planet?",
              options: [
                { id: Date.now() + 1, text: "Venus", isCorrect: false },
                { id: Date.now() + 2, text: "Jupiter", isCorrect: false },
                { id: Date.now() + 3, text: "Mars", isCorrect: true },
                { id: Date.now() + 4, text: "Saturn", isCorrect: false }
              ],
              codeSnippet: null
            },
            {
              text: "Who painted the Mona Lisa?",
              options: [
                { id: Date.now() + 5, text: "Michelangelo", isCorrect: false },
                { id: Date.now() + 6, text: "Leonardo da Vinci", isCorrect: true },
                { id: Date.now() + 7, text: "Vincent van Gogh", isCorrect: false },
                { id: Date.now() + 8, text: "Pablo Picasso", isCorrect: false }
              ],
              codeSnippet: null
            },
            {
              text: "Which country is known as the Land of the Rising Sun?",
              options: [
                { id: Date.now() + 9, text: "China", isCorrect: false },
                { id: Date.now() + 10, text: "South Korea", isCorrect: false },
                { id: Date.now() + 11, text: "Japan", isCorrect: true },
                { id: Date.now() + 12, text: "Thailand", isCorrect: false }
              ],
              codeSnippet: null
            }
          ];
        } else {
          // Generic sample questions if template is not specifically handled
          const sampleQuestions = [];
          const questionCount = Math.min(3, template.questionCount);
          
          for (let i = 0; i < questionCount; i++) {
            const sampleQuestion = {
              text: `Sample question ${i+1} about ${topic.split(',')[0]}?`,
              options: [
                { id: Date.now() + i*10 + 1, text: "First option", isCorrect: i === 0 },
                { id: Date.now() + i*10 + 2, text: "Second option", isCorrect: i === 1 },
                { id: Date.now() + i*10 + 3, text: "Third option", isCorrect: i === 2 && questionCount > 2 },
                { id: Date.now() + i*10 + 4, text: "Fourth option", isCorrect: false }
              ],
              codeSnippet: template.includeCodeSnippets ? 
                `// Example code for ${topic.split(',')[0]}\nconsole.log("This is a sample code snippet");` : null
            };
            sampleQuestions.push(sampleQuestion);
          }
          
          return sampleQuestions;
        }
      };
      
      setEditorQuestions(generateSampleQuestionsFromTemplate());
      setEditorSettings({
        randomizeQuestions: false,
        timeLimit: selectedTemplate.timeLimit.toString(),
        difficulty: selectedTemplate.template.difficulty
      });
    }
  }, [selectedTemplate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
{t('create_new_quiz')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('create_quiz_description')}
          </p>
        </div>
      </div>

      <Tabs defaultValue="ai-generated" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <TabsTrigger value="manual">{t('create_manually')}</TabsTrigger>
          <TabsTrigger value="ai-generated">{t('ai_generated_quiz')}</TabsTrigger>
          <TabsTrigger value="templates">{t('quiz_templates')}</TabsTrigger>
          <TabsTrigger value="question-editor" id="question-editor-tab">
            <ListTodo className="h-4 w-4 mr-1.5" />
            {t('advanced_editor')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <div className="mb-6">
            <ManualQuizCreator />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <Code className="h-4 w-4 mr-2" />
              {t('pro_tip')}
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {t('question_bank_tip')}
            </p>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                onClick={() => navigate("/question-bank")}
              >
{t('go_to_question_bank')}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ai-generated">
          <QuizForm selectedTemplate={selectedTemplate} />
        </TabsContent>
        
        <TabsContent value="question-editor">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListTodo className="h-5 w-5 mr-2 text-primary" />
{t('advanced_question_editor')}
              </CardTitle>
              <CardDescription>
                {t('advanced_editor_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('advanced_editor_features')}
              </p>
            </CardContent>
          </Card>
          
          <QuestionsContainer 
            initialQuestions={editorQuestions}
            initialSettings={editorSettings}
            onSave={(questions, settings) => {
              console.log('Saving questions:', questions);
              console.log('Settings:', settings);
              
              // Create a quiz object to save to the backend
              const quizToSave = {
                title: selectedTemplate ? selectedTemplate.name : "New Custom Quiz",
                description: selectedTemplate ? selectedTemplate.description : "Custom created quiz",
                difficulty: settings.difficulty,
                timeLimit: settings.timeLimit,
                questions: questions,
                categoryId: selectedTemplate ? selectedTemplate.categoryId : 1 // Use template category or default to General Knowledge
              };
              
              console.log('Quiz to save:', quizToSave);
              
              // Save the quiz to the backend
              fetch('/api/quizzes/custom', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: quizToSave.title,
                  description: quizToSave.description,
                  userId: user ? user.id : 'guest-user', // Use actual user ID if logged in
                  difficulty: quizToSave.difficulty,
                  categoryId: quizToSave.categoryId,
                  questionCount: questions.length,
                  timeLimit: quizToSave.timeLimit,
                  questions: questions.map(q => ({
                    text: q.text,
                    codeSnippet: q.codeSnippet,
                    options: q.options.map(o => ({
                      text: o.text,
                      isCorrect: o.isCorrect
                    }))
                  }))
                }),
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to save quiz');
                }
                return response.json();
              })
              .then(data => {
                alert(`Quiz successfully saved with ID: ${data.id}!`);
                navigate('/quizzes');
              })
              .catch(error => {
                console.error('Error saving quiz:', error);
                alert('Failed to save quiz. Please try again.');
              });
            }}
            allowSettings={true}
          />
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Templates</CardTitle>
              <CardDescription>
                Choose from our pre-made quiz templates to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-2 border-blue-200 dark:border-blue-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 flex-grow">
                        <Code className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">JavaScript Fundamentals</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">10 questions covering core JavaScript concepts</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Beginner
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            Programming
                          </span>
                        </div>
                      </div>
                      <div className="p-4 mt-auto">
                        <Button 
                          className="w-full"
                          onClick={() => {
                            const template = {
                              id: "javascript-basics",
                              name: "JavaScript Fundamentals",
                              description: "Core concepts of JavaScript including variables, functions, objects, and more",
                              category: "Programming",
                              categoryId: 2, // Programming category
                              difficulty: "Beginner",
                              questionCount: 10,
                              timeLimit: 15,
                              icon: "code",
                              popularity: 95,
                              template: {
                                topic: "JavaScript fundamentals, variables, functions, objects, arrays, and basic DOM manipulation",
                                difficulty: "beginner",
                                questionCount: 10,
                                includeCodeSnippets: true
                              }
                            };
                            setSelectedTemplate(template);
                            
                            // Show options to the user
                            const useEditor = confirm("Do you want to use the Advanced Editor to customize this template?");
                            setActiveTab(useEditor ? "question-editor" : "ai-generated");
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 p-6 flex-grow">
                        <Building className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
                        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300">Business Fundamentals</h3>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">15 questions about business strategy and operations</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                            Intermediate
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            Business
                          </span>
                        </div>
                      </div>
                      <div className="p-4 mt-auto">
                        <Button 
                          className="w-full"
                          onClick={() => {
                            const template = {
                              id: "business-fundamentals",
                              name: "Business Fundamentals",
                              description: "Comprehensive overview of business strategy and operations concepts",
                              category: "Business",
                              categoryId: 3, // Business category
                              difficulty: "Intermediate",
                              questionCount: 15,
                              timeLimit: 25,
                              icon: "building",
                              popularity: 88,
                              template: {
                                topic: "Business strategy, operations management, marketing fundamentals, financial basics, and organizational behavior",
                                difficulty: "intermediate",
                                questionCount: 15,
                                includeCodeSnippets: false
                              }
                            };
                            setSelectedTemplate(template);
                            
                            // Show options to the user
                            const useEditor = confirm("Do you want to use the Advanced Editor to customize this template?");
                            setActiveTab(useEditor ? "question-editor" : "ai-generated");
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-2 border-amber-200 dark:border-amber-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-6 flex-grow">
                        <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
                        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300">General Knowledge</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">20 questions covering a variety of trivia topics</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            All Levels
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            Trivia
                          </span>
                        </div>
                      </div>
                      <div className="p-4 mt-auto">
                        <Button 
                          className="w-full"
                          onClick={() => {
                            const template = {
                              id: "general-knowledge",
                              name: "General Knowledge",
                              description: "Wide-ranging trivia questions covering various topics and subjects",
                              category: "Trivia",
                              categoryId: 1, // General Knowledge category
                              difficulty: "Mixed",
                              questionCount: 20,
                              timeLimit: 30,
                              icon: "book",
                              popularity: 92,
                              template: {
                                topic: "General knowledge covering history, science, geography, literature, arts, sports, and current events",
                                difficulty: "mixed",
                                questionCount: 20,
                                includeCodeSnippets: false
                              }
                            };
                            setSelectedTemplate(template);
                            
                            // Show options to the user
                            const useEditor = confirm("Do you want to use the Advanced Editor to customize this template?");
                            setActiveTab(useEditor ? "question-editor" : "ai-generated");
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-4 gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <p>More templates will be added regularly. Check back soon!</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("question-editor")}
                  className="whitespace-nowrap text-xs text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <ListTodo className="h-3.5 w-3.5 mr-1.5" />
                  Try Advanced Editor
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/templates")}
                className="whitespace-nowrap"
              >
                Browse All Templates
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {activeTab === "manual" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Need inspiration? Our AI can help you generate questions for your quiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("ai-generated")}
              className="group"
            >
              <Wand2 className="h-4 w-4 mr-2 group-hover:animate-pulse text-indigo-500" />
              Try AI Generation
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("question-editor")}
              className="group"
            >
              <ListTodo className="h-4 w-4 mr-2 group-hover:animate-pulse text-purple-500" />
              Advanced Question Editor
            </Button>
          </div>
        </motion.div>
      )}
      
      {activeTab === "ai-generated" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {t('need_more_control_questions')}
          </p>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab("question-editor")}
            className="group"
          >
            <ListTodo className="h-4 w-4 mr-2 group-hover:animate-pulse text-purple-500" />
            {t('open_advanced_editor')}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
