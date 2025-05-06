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
            ? "text-blue-600/90 dark:text-blue-400/90 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500/40 dark:after:bg-blue-400/40 after:rounded-full"
            : "text-gray-600/90 dark:text-gray-400/90 hover:text-gray-800 dark:hover:text-gray-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transform after:scale-0 hover:after:scale-100 after:bg-gray-200 dark:after:bg-gray-700 after:transition-transform"
        } inline-flex items-center px-2 py-5 text-sm font-normal relative cursor-pointer transition-all duration-200 after:transition-all after:duration-300`}
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
            ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/5 dark:to-indigo-900/5 text-blue-600/90 dark:text-blue-400/90 border-l-[3px] border-blue-400/40 dark:border-blue-500/40"
            : "text-gray-600/90 dark:text-gray-400/90 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 border-l-[3px] border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        } block px-4 py-2.5 rounded-md mx-1 text-sm font-normal cursor-pointer transition-all duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <header className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md z-10 relative border-b border-gray-100/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-400/90 to-indigo-500/90 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="ml-2.5 text-lg font-normal text-gray-700 dark:text-gray-300">QuizGenius</span>
            </div>
            <nav className="hidden sm:ml-10 sm:flex sm:space-x-6">
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/my-quizzes" label="My Quizzes" />
              <NavLink href="/create-quiz" label="Create Quiz" />
              <NavLink href="/leaderboard" label="Leaderboard" />
              <NavLink href="/analytics" label="Analytics" />
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/30 dark:bg-slate-800/30 rounded-full px-1.5 py-1 shadow-sm flex items-center space-x-2">
              <LanguageSelector />
              <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-700 mx-0.5"></div>
              <ThemeToggle />
            </div>
            <HelpButton className="hidden sm:inline-flex opacity-70 hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
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
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400">
                        {user?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-gray-200/80 dark:border-gray-700/80 shadow-lg rounded-xl w-56 overflow-hidden backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
                  <div className="flex items-center justify-start gap-3 p-3 border-b border-gray-100 dark:border-gray-800">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400">
                        {user?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-tight">
                      {user?.displayName && (
                        <p className="font-medium text-sm text-gray-700 dark:text-gray-300">{user.displayName}</p>
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
                      className="cursor-pointer rounded-lg my-1 text-sm font-normal text-gray-700 dark:text-gray-300"
                      onClick={() => setLocation("/profile")}
                    >
                      Profile & Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg my-1 text-sm font-normal text-gray-700 dark:text-gray-300"
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
        <div className="sm:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-100/50 dark:border-slate-800/50 animate-in slide-in-from-top">
          <div className="pt-2 pb-3 space-y-0.5 px-1">
            <MobileNavLink href="/dashboard" label="Dashboard" />
            <MobileNavLink href="/my-quizzes" label="My Quizzes" />
            <MobileNavLink href="/create-quiz" label="Create Quiz" />
            <MobileNavLink href="/leaderboard" label="Leaderboard" />
            <MobileNavLink href="/analytics" label="Analytics" />
            <MobileNavLink href="/profile" label="Profile & Account" />
            <div className="flex items-center justify-between px-4 py-3 rounded-lg mx-1 my-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Language</span>
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
