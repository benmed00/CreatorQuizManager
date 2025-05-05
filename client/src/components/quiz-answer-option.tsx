import React from "react";
import { motion } from "framer-motion";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface QuizAnswerOptionProps {
  id: string;
  index: number;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function QuizAnswerOption({
  id,
  index,
  text,
  isSelected,
  onSelect
}: QuizAnswerOptionProps) {
  // Options for letter labels: A, B, C, D, etc.
  const letterLabel = String.fromCharCode(65 + index);
  
  return (
    <motion.div 
      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
        ${isSelected 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 dark:border-primary-700' 
          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}
      onClick={() => onSelect(id)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.2,
        delay: index * 0.1  // Stagger the animations
      }}
    >
      <RadioGroupItem 
        value={id.toString()} 
        id={`option-${id}`} 
        className="h-4 w-4 text-primary-600"
      />
      
      <div className="ml-3 flex items-start flex-1">
        <motion.span 
          className={`mr-2 flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
            ${isSelected 
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-800/30 dark:text-primary-300' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}
          animate={isSelected ? {
            scale: [1, 1.2, 1],
            backgroundColor: [
              'rgba(59, 130, 246, 0.1)', 
              'rgba(59, 130, 246, 0.2)', 
              'rgba(59, 130, 246, 0.1)'
            ]
          } : {}}
          transition={{ 
            duration: 0.3,
            repeat: isSelected ? 1 : 0,
          }}
        >
          {letterLabel}
        </motion.span>
        
        <Label 
          htmlFor={`option-${id}`}
          className={`cursor-pointer flex-1 ${isSelected 
            ? 'text-primary-700 dark:text-primary-400 font-medium' 
            : 'text-gray-800 dark:text-gray-200'}`}
        >
          {text}
        </Label>
        
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-2 text-primary-600 dark:text-primary-400"
          >
            <CheckCircle className="h-5 w-5" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}