import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export interface WalkthroughProps {
  title: string;
  description?: string;
  steps: {
    title: string;
    description: ReactNode;
    image?: string;
  }[];
}

export default function Walkthrough({ 
  title, 
  description,
  steps 
}: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };
  
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{description}</p>}
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Step {currentStep + 1}: {steps[currentStep]?.title}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[120px]"
          >
            <div className="text-gray-700 dark:text-gray-300">
              {steps[currentStep]?.description}
            </div>
            
            {steps[currentStep]?.image && (
              <div className="mt-4">
                <img
                  src={steps[currentStep].image}
                  alt={`Step ${currentStep + 1}: ${steps[currentStep].title}`}
                  className="rounded-md border border-gray-200 dark:border-gray-700 max-w-full"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
        {/* Step indicators */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className="focus:outline-none"
              aria-label={`Go to step ${index + 1}`}
            >
              {index === currentStep ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
              )}
            </button>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={goToNextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}