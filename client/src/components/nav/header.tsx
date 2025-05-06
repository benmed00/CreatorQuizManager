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
            ? "border-primary-400 text-primary-600 dark:text-primary-400 border-b-2"
            : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-gray-700 border-b-2"
        } inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer transition-colors duration-200`}
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
            ? "bg-primary-50/50 dark:bg-primary-900/5 border-primary-400 text-primary-600 dark:text-primary-400 border-l-2"
            : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/10 hover:border-gray-200 dark:hover:border-gray-700 border-l-2"
        } block pl-3 pr-4 py-2 text-base font-medium cursor-pointer transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <header className="bg-white/90 dark:bg-[#1e1e1e]/95 backdrop-blur-sm shadow-sm z-10 relative border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary-400 dark:text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path fill="white" d="M15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M15.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              <span className="ml-2 text-xl font-medium text-gray-800 dark:text-gray-200">QuizGenius</span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/my-quizzes" label="My Quizzes" />
              <NavLink href="/create-quiz" label="Create Quiz" />
              <NavLink href="/leaderboard" label="Leaderboard" />
              <NavLink href="/analytics" label="Analytics" />
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <ThemeToggle />
            <HelpButton className="hidden sm:inline-flex" />
            
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full"
                    onClick={(e) => {
                      // If directly clicked (not right click or other action), go to profile
                      if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                        e.preventDefault();
                        setLocation("/profile");
                        return false;
                      }
                    }}
                  >
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                      <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.displayName && (
                        <p className="font-medium">{user.displayName}</p>
                      )}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setLocation("/profile")}
                  >
                    Profile & Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center sm:hidden">
              <Button variant="ghost" onClick={toggleMenu} className="p-1 ml-1">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink href="/dashboard" label="Dashboard" />
            <MobileNavLink href="/my-quizzes" label="My Quizzes" />
            <MobileNavLink href="/create-quiz" label="Create Quiz" />
            <MobileNavLink href="/leaderboard" label="Leaderboard" />
            <MobileNavLink href="/analytics" label="Analytics" />
            <MobileNavLink href="/profile" label="Profile & Account" />
            <div className="flex items-center justify-between px-4 py-2 border-l-4 border-transparent">
              <span className="text-gray-500 dark:text-gray-300">Language</span>
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
