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
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
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
              <span className="ml-2 text-xl font-bold">{t('app_name')}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('footer_description')}
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('resources')}</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/docs">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('documentation')}
                </span>
              </Link>
              <Link href="/contact">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {t('support')}
                </span>
              </Link>
              <Link href="/use-cases">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t('use_cases')}
                </span>
              </Link>
              <Link href="/contact">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('contact')}
                </span>
              </Link>
              <Link href="/terms">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('terms')}
                </span>
              </Link>
              <Link href="/privacy">
                <span className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('privacy')}
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('connect')}</h3>
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
                {t('made_with')} <Heart className="h-4 w-4 mx-1 text-red-500" /> {t('by_team')}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                &copy; {new Date().getFullYear()} {t('app_name')}. {t('all_rights_reserved')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
