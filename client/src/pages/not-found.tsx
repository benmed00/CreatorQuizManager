import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Home, Mail, BookOpen, AlertCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [, navigate] = useLocation();
  const [mounted, setMounted] = useState(false);

  // Ensure animations run properly after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // SVG animation
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        delay: 0.5
      }
    }
  };

  const quickLinks = [
    { title: "Home", icon: <Home className="h-4 w-4 mr-2" />, path: "/" },
    { title: "Contact", icon: <Mail className="h-4 w-4 mr-2" />, path: "/contact" },
    { title: "Quizzes", icon: <BookOpen className="h-4 w-4 mr-2" />, path: "/my-quizzes" },
    { title: "Help", icon: <HelpCircle className="h-4 w-4 mr-2" />, path: "/contact" }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 relative">
      {/* Theme toggle in the top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Main content - using Framer Motion for animations */}
      <motion.div
        className="max-w-4xl w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
      >
        {/* 404 SVG Animation */}
        <motion.div 
          className="w-full max-w-md"
          variants={itemVariants}
        >
          <div className="relative w-full h-64 md:h-80">
            {/* 404 Text with animated stroke */}
            <svg
              viewBox="0 0 400 200"
              className="w-full h-full"
              aria-label="404 Not Found Illustration"
              role="img"
            >
              <motion.path
                d="M50,100 L80,30 L80,170 M110,100 L140,30 L140,170 M170,30 C220,30 220,170 170,170 C120,170 120,30 170,30 Z M230,100 C280,100 280,170 230,170 C180,170 180,100 230,100 Z"
                fill="transparent"
                strokeWidth="8"
                stroke="currentColor"
                className="text-primary"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
              
              {/* Flying objects around the 404 */}
              <motion.circle
                cx="30"
                cy="50"
                r="8"
                className="fill-primary/30 dark:fill-primary/50"
                variants={numberVariants}
                custom={1}
              />
              <motion.circle
                cx="350"
                cy="150"
                r="12"
                className="fill-primary/40 dark:fill-primary/60"
                variants={numberVariants}
                custom={2}
              />
              <motion.rect
                x="300"
                y="40"
                width="20"
                height="20"
                rx="4"
                className="fill-primary/50 dark:fill-primary/70"
                variants={numberVariants}
                custom={3}
              />
              <motion.path
                d="M200,20 L210,35 L190,35 Z"
                className="fill-primary/60 dark:fill-primary/80"
                variants={numberVariants}
                custom={4}
              />
            </svg>
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div 
          className="text-center lg:text-left"
          variants={itemVariants}
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20"
            variants={itemVariants}
          >
            <AlertCircle className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Error 404</span>
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3"
            variants={itemVariants}
          >
            Oops! Page not found
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-6 max-w-md"
            variants={itemVariants}
          >
            The page you're looking for seems to have gone on an adventure. It might be taking a quiz or just got lost in cyberspace.
          </motion.p>
          
          {/* Action buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 mb-8 justify-center lg:justify-start"
            variants={itemVariants}
          >
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            
            <Button
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </motion.div>
          
          {/* Quick links */}
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Or check out these popular pages:
            </p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(link.path)}
                    className="flex items-center"
                  >
                    {link.icon}
                    {link.title}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
