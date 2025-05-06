import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { useStore } from "@/store/auth-store";
import { signOut } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { HelpButton } from "@/components/feature-tour";
import LanguageSelector from "@/components/language-selector";

export default function Header() {
  const [_, setLocation] = useLocation();
  const { user, setUser } = useStore();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setLocation("/home");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing out of your account",
        variant: "destructive",
      });
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href}>
      <span
        className={`${
          location === href
            ? "text-blue-600 dark:text-blue-500 font-medium border-b-2 border-blue-600 dark:border-blue-500"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700"
        } inline-flex items-center px-2 py-5 text-sm relative cursor-pointer transition-colors duration-150`}
      >
        {label}
      </span>
    </Link>
  );

  const MobileNavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href}>
      <span
        className={`${
          location === href
            ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-500 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80"
        } block px-4 py-3 rounded-md text-sm cursor-pointer transition-colors duration-150`}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <header className="bg-white shadow-sm z-10 relative border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-500">
                <rect width="48" height="48" rx="8" fill="currentColor" fillOpacity="0.1"/>
                <path d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10ZM24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C30.627 12 36 17.373 36 24C36 30.627 30.627 36 24 36Z" fill="currentColor"/>
                <path d="M30 22C28.343 22 27 20.657 27 19C27 17.343 28.343 16 30 16C31.657 16 33 17.343 33 19C33 20.657 31.657 22 30 22Z" fill="currentColor"/>
                <path d="M18 22C16.343 22 15 20.657 15 19C15 17.343 16.343 16 18 16C19.657 16 21 17.343 21 19C21 20.657 19.657 22 18 22Z" fill="currentColor"/>
                <path d="M30 32C28.343 32 27 30.657 27 29C27 27.343 28.343 26 30 26C31.657 26 33 27.343 33 29C33 30.657 31.657 32 30 32Z" fill="currentColor"/>
                <path d="M18 32C16.343 32 15 30.657 15 29C15 27.343 16.343 26 18 26C19.657 26 21 27.343 21 29C21 30.657 19.657 32 18 32Z" fill="currentColor"/>
              </svg>
              <span className="ml-2.5 text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">QuizGenius</span>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/my-quizzes" label="My Quizzes" />
              <NavLink href="/create-quiz" label="Create Quiz" />
              <NavLink href="/leaderboard" label="Leaderboard" />
              <NavLink href="/analytics" label="Analytics" />
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1.5 border border-gray-200 dark:border-gray-700">
              <LanguageSelector />
              <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <ThemeToggle />
            </div>
            <HelpButton className="hidden sm:inline-flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors" />
            
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700"
                    onClick={(e) => {
                      if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                        e.preventDefault();
                        setLocation("/profile");
                        return false;
                      }
                    }}
                  >
                    <Avatar className="h-full w-full cursor-pointer">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400">
                        {user?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-gray-200 dark:border-gray-700 shadow-lg rounded-lg w-56 overflow-hidden bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-start gap-3 p-3 border-b border-gray-100 dark:border-gray-800">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400">
                        {user?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-tight">
                      {user?.displayName && (
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{user.displayName}</p>
                      )}
                      {user?.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-md my-1 text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setLocation("/profile")}
                    >
                      Profile & Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-md my-1 text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={handleSignOut}
                    >
                      Log out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center sm:hidden">
              <Button 
                variant="ghost" 
                onClick={toggleMenu} 
                className="p-1 ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top">
          <div className="pt-2 pb-3 space-y-0.5 px-1">
            <MobileNavLink href="/dashboard" label="Dashboard" />
            <MobileNavLink href="/my-quizzes" label="My Quizzes" />
            <MobileNavLink href="/create-quiz" label="Create Quiz" />
            <MobileNavLink href="/leaderboard" label="Leaderboard" />
            <MobileNavLink href="/analytics" label="Analytics" />
            <MobileNavLink href="/profile" label="Profile & Account" />
            <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-800 mt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
              <div className="w-28">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
