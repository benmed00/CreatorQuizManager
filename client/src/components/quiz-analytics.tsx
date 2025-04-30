import { Card, CardContent } from "@/components/ui/card";
import { QuizResult } from "@shared/schema";

interface QuestionAnalyticsProps {
  questionNumber: number;
  correctPercentage: number;
}

function QuestionAnalytics({ questionNumber, correctPercentage }: QuestionAnalyticsProps) {
  let barColor = "bg-red-500";
  if (correctPercentage >= 70) {
    barColor = "bg-green-500";
  } else if (correctPercentage >= 50) {
    barColor = "bg-yellow-500";
  }

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-800 dark:text-gray-200">Question {questionNumber}</span>
        <span className="text-gray-600 dark:text-gray-400">{correctPercentage}% correct</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${correctPercentage}%` }}></div>
      </div>
    </div>
  );
}

interface ScoreBarProps {
  range: string;
  percentage: number;
  color: string;
}

function ScoreBar({ range, percentage, color }: ScoreBarProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 ${color} rounded-t`} style={{ height: `${percentage}%` }}></div>
      <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{range}</span>
    </div>
  );
}

interface QuizAnalyticsProps {
  quizTitle: string;
  participantCount: number;
  questionAnalytics: Array<{
    questionNumber: number;
    correctPercentage: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    percentage: number;
    color: string;
  }>;
}

export default function QuizAnalytics({
  quizTitle,
  participantCount,
  questionAnalytics,
  scoreDistribution,
}: QuizAnalyticsProps) {
  return (
    <Card className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg mb-8">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{quizTitle}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quiz completed by {participantCount} participants
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Score Distribution
            </h4>
            <div className="bg-gray-100 dark:bg-[#111] rounded-lg p-4 h-64 flex items-end justify-between">
              {scoreDistribution.map((score) => (
                <ScoreBar
                  key={score.range}
                  range={score.range}
                  percentage={score.percentage}
                  color={score.color}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Difficulty Analysis
            </h4>
            <div className="space-y-4">
              {questionAnalytics.map((question) => (
                <QuestionAnalytics
                  key={question.questionNumber}
                  questionNumber={question.questionNumber}
                  correctPercentage={question.correctPercentage}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-right">
          <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm">
            View detailed analytics
            <i className="fas fa-chevron-right ml-1"></i>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
