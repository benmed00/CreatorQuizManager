import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isIncrease: boolean;
  };
  changeText?: string;
}

export default function StatsCard({ title, value, change, changeText }: StatsCardProps) {
  return (
    <Card className="bg-white dark:bg-[#1e1e1e] overflow-hidden">
      <CardContent className="p-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</div>
        <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</div>
        
        {change && (
          <div className="mt-2 flex items-center text-sm">
            <span className={`${change.isIncrease ? 'text-green-500' : 'text-red-500'} inline-flex items-center`}>
              {change.isIncrease ? (
                <ArrowUp className="mr-1.5 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1.5 h-3 w-3" />
              )}
              {Math.abs(change.value)}%
            </span>
            {changeText && <span className="ml-2 text-gray-500 dark:text-gray-400">{changeText}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
