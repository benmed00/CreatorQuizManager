import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

interface QuestionSkeletonProps {
  count?: number;
}

export default function QuestionSkeleton({ count = 3 }: QuestionSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="divide-y">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="py-4"
          >
            <div className="flex gap-3">
              <div className="pt-1">
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-5 w-full max-w-xl" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Array.from({ length: 4 }).map((_, optIndex) => (
                    <Skeleton 
                      key={optIndex} 
                      className="h-9 w-full rounded" 
                    />
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}