import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Share } from "lucide-react";
import { Link } from "wouter";
import { Quiz } from "@shared/schema";
import { ShareButton } from "@/components/share";
import { useTranslation } from "react-i18next";

interface QuizCardProps {
  quiz: Quiz;
  onManage?: (id: number) => void;
}

export default function QuizCard({ quiz, onManage }: QuizCardProps) {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg overflow-hidden flex flex-col h-full">
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant="outline" 
            className={`
              ${quiz.active 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}
            `}
          >
            {quiz.active ? t("active") : t("inactive")}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {quiz.participantCount} {t("participants")}
          </span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t(quiz.title)}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {t(quiz.description)}
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{t("completion_rate")}</span>
            <span className="font-medium">{quiz.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ width: `${quiz.completionRate}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-[#111] px-5 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-3 w-full">
          <div className="flex justify-between items-center w-full">
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1.5" />
              {quiz.questionCount} {t("questions")} | {quiz.timeLimit} {t("mins")}
            </span>
            <div className="flex items-center space-x-3">
              <ShareButton 
                title={`Quiz: ${quiz.title}`}
                description={quiz.description}
                url={`${window.location.origin}/quiz/${quiz.id}`}
                hashtags={["QuizGenius", "Quiz"]}
                iconOnly
                size="sm"
                variant="ghost"
              />
              {onManage ? (
                <Button 
                  variant="link" 
                  className="px-0 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  onClick={() => onManage(quiz.id)}
                >
                  {t("manage")}
                </Button>
              ) : (
                <Button 
                  variant="link" 
                  className="px-0 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  asChild
                >
                  <Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
