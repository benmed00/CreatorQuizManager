import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useStore } from "@/store/auth-store";
import { useLocation } from "wouter";
import QuestionBank from "@/components/question-bank";

export default function QuestionBankPage() {
  const { user } = useStore();
  const [_, navigate] = useLocation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Question Bank
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your question library and reuse questions across multiple quizzes
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => navigate('/create-question')}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Question
          </Button>
        </div>
      </div>
      
      <QuestionBank />
    </div>
  );
}