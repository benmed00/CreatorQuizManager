import { Link } from "wouter";
import { 
  HelpCircle, 
  FileText, 
  Twitter, 
  Github, 
  Mail, 
  BookOpen, 
  Heart,
  Shield
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path fill="white" d="M15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M15.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path fill="white" d="M8.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              <span className="ml-2 text-xl font-bold">QuizGenius</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              QuizGenius is an AI-powered quiz platform designed to make learning fun and interactive. Create, share, and take quizzes on any topic.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resources</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/docs">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </span>
              </Link>
              <Link href="/contact">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </span>
              </Link>
              <Link href="/use-cases">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Use Cases
                </span>
              </Link>
              <Link href="/contact">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </span>
              </Link>
              <Link href="/terms">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </span>
              </Link>
              <Link href="/privacy">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Connect</h3>
            <div className="flex items-center space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by the QuizGenius Team
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                &copy; {new Date().getFullYear()} QuizGenius. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
