import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import QuizCard from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Trash2, Edit, Link as LinkIcon, Play } from "lucide-react";
import { useStore } from "@/store/auth-store";
import { Quiz } from "@shared/schema";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export default function Quizzes() {
  const { user } = useStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState<string | number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Parse the URL to determine filters
  const getURLParams = () => {
    // Extract category from path like /my-quizzes/category/:category
    if (location.startsWith('/my-quizzes/category/')) {
      const category = location.split('/my-quizzes/category/')[1];
      return { category };
    }
    
    // Handle /my-quizzes/shared
    if (location === '/my-quizzes/shared') {
      return { shared: true };
    }
    
    // Handle /my-quizzes/recent
    if (location === '/my-quizzes/recent') {
      return { recent: true };
    }
    
    return {}; // No filters
  };
  
  const urlParams = getURLParams();
  
  // Fetch all quizzes for the current user
  const { data: quizzes, isLoading } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes', user?.id, urlParams],
    enabled: !!user?.id,
  });

  // Mutation for deleting a quiz
  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string | number) => {
      await apiRequest("DELETE", `/api/quizzes/${quizId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      toast({
        title: t("quiz_deleted"),
        description: t("quiz_deleted_description"),
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: t("error_deleting_quiz"),
        description: error.message || t("could_not_delete_quiz"),
        variant: "destructive",
      });
    }
  });

  const filteredQuizzes = quizzes && Array.isArray(quizzes)
    ? quizzes.filter((quiz: Quiz) => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleManageQuiz = (quizId: string | number) => {
    setSelectedQuizId(quizId);
  };

  const handleDeleteQuiz = () => {
    if (selectedQuizId) {
      deleteQuizMutation.mutate(selectedQuizId);
    }
  };

  const handleEditQuiz = (quizId: string | number) => {
    // Navigate to edit page using the updated route structure
    setLocation(`/quiz/${quizId}/edit`);
  };

  const handleCopyLink = (quizId: string | number) => {
    // Copy the quiz link to clipboard
    const quizUrl = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(quizUrl);
    toast({
      title: t("link_copied"),
      description: t("link_copied_description"),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t("my_quizzes")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("manage_all_quizzes")}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button 
            onClick={() => setLocation("/create-quiz")}
          >
            {t("create_new_quiz")}
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Input
            type="text"
            placeholder={t("search_quizzes_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        {/* Filter options */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant={location === '/my-quizzes' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setLocation('/my-quizzes')}
          >
            {t("all")}
          </Button>
          <Button 
            variant={location === '/my-quizzes/recent' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setLocation('/my-quizzes/recent')}
          >
            {t("recent")}
          </Button>
          <Button 
            variant={location === '/my-quizzes/shared' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setLocation('/my-quizzes/shared')}
          >
            {t("shared")}
          </Button>
          <Button 
            variant={location.includes('/my-quizzes/category/programming') ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setLocation('/my-quizzes/category/programming')}
          >
            {t("programming")}
          </Button>
          <Button 
            variant={location.includes('/my-quizzes/category/technology') ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setLocation('/my-quizzes/category/technology')}
          >
            {t("technology")}
          </Button>
        </div>
      </div>

      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz: Quiz) => (
            <div key={quiz.id} className="relative group">
              <QuizCard quiz={quiz} onManage={() => handleManageQuiz(quiz.id)} />
              
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setLocation(`/quiz/${quiz.id}`)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {t("take")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopyLink(quiz.id)}
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    {t("share")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedQuizId(quiz.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t("delete")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Delete confirmation dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("confirm_delete_quiz")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("confirm_delete_quiz_description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteQuiz} className="bg-red-600 text-white hover:bg-red-700">
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-[#1e1e1e] rounded-lg shadow">
          {searchQuery ? (
            <>
              <p className="text-gray-500 dark:text-gray-400 mb-2">{t("no_quizzes_found_search", { query: searchQuery })}</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                {t("clear_search")}
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t("no_quizzes_created_yet")}
              </p>
              <Button onClick={() => setLocation("/create-quiz")}>
                {t("create_your_first_quiz")}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
