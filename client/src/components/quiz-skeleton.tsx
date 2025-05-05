import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

interface QuizSkeletonProps {
  questionCount?: number;
}

export default function QuizSkeleton({ questionCount = 5 }: QuizSkeletonProps) {
  return (
    <div className="space-y-5 w-full max-w-3xl mx-auto">
      {/* Quiz title and description skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Progress bar skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      {/* Question card skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-24 w-full" />

          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Skeleton className="h-12 w-full" />
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>

      {/* More questions indicator */}
      {questionCount > 1 && (
        <div className="flex justify-center space-x-2 pt-2">
          {Array.from({ length: Math.min(questionCount, 5) }).map((_, index) => (
            <Skeleton key={index} className="h-2 w-2 rounded-full" />
          ))}
          {questionCount > 5 && <div className="text-xs text-muted-foreground">...</div>}
        </div>
      )}
    </div>
  );
}