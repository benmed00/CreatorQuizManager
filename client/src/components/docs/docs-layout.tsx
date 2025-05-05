import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/theme-toggle";

interface DocsSidebarItemProps {
  title: string;
  path: string;
  icon?: ReactNode;
  items?: { title: string; path: string }[];
  currentPath: string;
}

interface DocsLayoutProps {
  children: ReactNode;
  title: string;
}

const DocsSidebarItem = ({ 
  title, 
  path, 
  icon, 
  items = [], 
  currentPath 
}: DocsSidebarItemProps) => {
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(
    currentPath === path || items.some(item => item.path === currentPath)
  );

  return (
    <div className="mb-1">
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
          currentPath === path 
            ? "bg-primary/10 text-primary dark:bg-primary/20" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        onClick={() => items.length ? setIsOpen(!isOpen) : navigate(path)}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
          <span className="font-medium">{title}</span>
        </div>
        {items.length > 0 && (
          <ChevronRight 
            className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-90" : ""}`} 
          />
        )}
      </div>

      {items.length > 0 && isOpen && (
        <div className="ml-4 pl-2 mt-1 border-l border-gray-200 dark:border-gray-700">
          {items.map((item, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-md cursor-pointer flex items-center text-sm ${
                currentPath === item.path 
                  ? "bg-primary/10 text-primary dark:bg-primary/20" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DocsLayout({ children, title }: DocsLayoutProps) {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // For handling animations properly
  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation items in the sidebar
  const navigationItems = [
    {
      title: "Getting Started",
      path: "/docs",
      items: [
        { title: "Introduction", path: "/docs" },
        { title: "Installation", path: "/docs/installation" },
        { title: "Features Overview", path: "/docs/features" }
      ]
    },
    {
      title: "Authentication",
      path: "/docs/auth",
      items: [
        { title: "Login Process", path: "/docs/auth/login" },
        { title: "Registration", path: "/docs/auth/register" },
        { title: "Password Reset", path: "/docs/auth/password-reset" }
      ]
    },
    {
      title: "Quiz Management",
      path: "/docs/quizzes",
      items: [
        { title: "Creating Quizzes", path: "/docs/quizzes/create" },
        { title: "Taking Quizzes", path: "/docs/quizzes/take" },
        { title: "Viewing Results", path: "/docs/quizzes/results" }
      ]
    },
    {
      title: "User Profile",
      path: "/docs/profile",
      items: [
        { title: "Settings", path: "/docs/profile/settings" },
        { title: "Analytics", path: "/docs/profile/analytics" }
      ]
    }
  ];

  // Function to generate PDF from current page
  const generatePDF = () => {
    toast({
      title: "Generating PDF",
      description: "Your documentation has been saved as a PDF file.",
    });
    
    // In a real implementation, we would use a library like html2pdf.js
    // html2pdf().from(document.getElementById('docs-content')).save();
  };

  // Function to share current page
  const sharePage = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - Documentation`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link Copied",
          description: "Documentation link copied to clipboard!",
        });
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Documentation</h2>
          <ThemeToggle />
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          {navigationItems.map((item, index) => (
            <DocsSidebarItem
              key={index}
              title={item.title}
              path={item.path}
              items={item.items}
              currentPath={location}
            />
          ))}
        </ScrollArea>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button 
            variant="outline" 
            className="w-full justify-start mb-2"
            onClick={() => navigate("/")}
          >
            Back to App
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[300px] p-0 bg-gray-50 dark:bg-gray-900">
          <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Documentation</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-10rem)]">
              {navigationItems.map((item, index) => (
                <DocsSidebarItem
                  key={index}
                  title={item.title}
                  path={item.path}
                  items={item.items}
                  currentPath={location}
                />
              ))}
            </ScrollArea>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Button 
                variant="outline" 
                className="w-full justify-start mb-2"
                onClick={() => {
                  navigate("/");
                  setIsSidebarOpen(false);
                }}
              >
                Back to App
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-2"
              onClick={generatePDF}
            >
              <span className="h-4 w-4 mr-1">📄</span>
              Save as PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-2"
              onClick={sharePage}
            >
              <span className="h-4 w-4 mr-1">🔗</span>
              Share
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="sm:hidden"
              onClick={generatePDF}
            >
              <span>📄</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="sm:hidden"
              onClick={sharePage}
            >
              <span>🔗</span>
            </Button>
            <span className="md:hidden">
              <ThemeToggle />
            </span>
          </div>
        </header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {mounted && (
            <motion.main
              id="docs-content"
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 py-8"
            >
              {children}
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}