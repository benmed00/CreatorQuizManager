import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: ReactNode;
  image?: string;
}

interface WalkthroughProps {
  title: string;
  steps: Step[];
  className?: string;
}

export default function Walkthrough({ title, steps, className }: WalkthroughProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsOpen(false);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => setCurrentStepIndex(0), 300); // Reset after closing animation
  };

  return (
    <div className={cn("mb-6", className)}>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTimeout(() => setCurrentStepIndex(0), 300);
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <span className="text-lg">🔍</span>
            Walkthrough: {title}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="flex items-center justify-between pb-2 border-b dark:border-gray-800">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={resetAndClose} className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="mt-4">
            {/* Step indicator */}
            <div className="flex items-center mb-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      index === currentStepIndex 
                        ? "bg-primary text-white" 
                        : index < currentStepIndex 
                          ? "bg-primary/20 text-primary" 
                          : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`h-[2px] w-12 ${
                        index < currentStepIndex 
                          ? "bg-primary" 
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">{currentStep.title}</h3>
                  <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                    {currentStep.description}
                  </div>
                </div>
                
                {currentStep.image && (
                  <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={currentStep.image} 
                      alt={`Step ${currentStepIndex + 1}: ${currentStep.title}`} 
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isFirstStep}
              >
                Previous
              </Button>
              <Button onClick={goToNextStep}>
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}