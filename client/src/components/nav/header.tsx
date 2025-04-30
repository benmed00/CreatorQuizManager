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
      setLocation("/login");
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
      <a
        className={`${
          location === href
            ? "border-primary-500 text-primary-600 dark:text-primary-500 border-b-2"
            : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 border-b-2"
        } inline-flex items-center px-1 pt-1 text-sm font-medium`}
      >
        {label}
      </a>
    </Link>
  );

  const MobileNavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href}>
      <a
        className={`${
          location === href
            ? "bg-primary-50 dark:bg-primary-900/10 border-primary-500 text-primary-700 dark:text-primary-500 border-l-4"
            : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-gray-300 dark:hover:border-gray-600 border-l-4"
        } block pl-3 pr-4 py-2 text-base font-medium`}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </a>
    </Link>
  );

  return (
    <header className="bg-white dark:bg-[#1e1e1e] shadow-sm z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path fill="white" d="M15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M15.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              <span className="ml-2 text-xl font-bold">QuizGenius</span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/" label="Dashboard" />
              <NavLink href="/my-quizzes" label="My Quizzes" />
              <NavLink href="/create-quiz" label="Create Quiz" />
              <NavLink href="/analytics" label="Analytics" />
            </nav>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
            
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                      <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                    onClick={handleSignOut}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center sm:hidden ml-2">
              <Button variant="ghost" onClick={toggleMenu} className="p-1">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-[#1e1e1e] border-t dark:border-gray-700 animate-in slide-in-from-top">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink href="/" label="Dashboard" />
            <MobileNavLink href="/my-quizzes" label="My Quizzes" />
            <MobileNavLink href="/create-quiz" label="Create Quiz" />
            <MobileNavLink href="/analytics" label="Analytics" />
          </div>
        </div>
      )}
    </header>
  );
}
