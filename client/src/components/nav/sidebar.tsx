import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Home,
  LayoutDashboard,
  PlusCircle,
  Settings,
  FileQuestion
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: location === "/dashboard" || location === "/",
    },
    {
      label: "My Quizzes",
      icon: FileQuestion,
      href: "/my-quizzes",
      active: location === "/my-quizzes",
    },
    {
      label: "Create Quiz",
      icon: PlusCircle,
      href: "/create-quiz",
      active: location === "/create-quiz",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: location === "/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: location === "/settings",
    },
  ];

  return (
    <div className={cn("pb-12 w-64 border-r dark:border-gray-700", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex items-center mb-6">
            <svg className="h-8 w-8 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path fill="white" d="M15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              <path fill="white" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              <path fill="white" d="M15.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              <path fill="white" d="M8.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            </svg>
            <span className="ml-2 text-xl font-bold">QuizGenius</span>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className={cn("w-full justify-start", {
                  "bg-secondary text-secondary-foreground": route.active,
                  "hover:bg-transparent hover:text-primary-500": !route.active,
                })}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
