import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export interface FeatureDocProps {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  links?: Array<{
    label: string;
    path: string;
    description?: string;
  }>;
  userActions?: Array<{
    type: string;
    element: string;
    description: string;
    result: string;
  }>;
  notes?: string[];
}

export default function FeatureDoc({
  title,
  description,
  path,
  children,
  createdAt,
  updatedAt = new Date().toISOString().split('T')[0],
  tags = [],
  links = [],
  userActions = [],
  notes = [],
}: FeatureDocProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const copyPathToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link Copied!",
          description: "Documentation link copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {updatedAt && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
            </div>
          )}
          
          {tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="w-4 h-4 mr-1" />
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyPathToClipboard}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main documentation content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
          
          {/* User Actions */}
          {userActions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Actions</h2>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Element</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
                    {userActions.map((action, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{action.type}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{action.element}</td>
                        <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">{action.description}</td>
                        <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">{action.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links */}
          {links.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Related Links</CardTitle>
                <CardDescription>Quick access to related resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="mb-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => navigate(link.path)}
                    >
                      <div>
                        <div className="font-medium">{link.label}</div>
                        {link.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {link.description}
                          </div>
                        )}
                      </div>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Notes */}
          {notes.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  {notes.map((note, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}