import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="/help">
              <a className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Help Center</span>
                <i className="fas fa-question-circle text-lg"></i>
              </a>
            </Link>
            <Link href="/docs">
              <a className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Documentation</span>
                <i className="fas fa-book text-lg"></i>
              </a>
            </Link>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Twitter</span>
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">GitHub</span>
              <i className="fab fa-github text-lg"></i>
            </a>
          </div>
          <p className="mt-8 text-center md:mt-0 md:text-right text-base text-gray-400">
            &copy; {new Date().getFullYear()} QuizGenius. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
