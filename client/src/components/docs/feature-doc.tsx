import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code, Navigation, ArrowRight, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserActionType = 'click' | 'input' | 'submit' | 'hover' | 'scroll' | 'view';

interface UserAction {
  type: UserActionType;
  description: string;
  element: string;
  result: string;
}

interface LinkInfo {
  label: string;
  path: string;
  isExternal?: boolean;
  description?: string;
}

interface FeatureDocProps {
  title: string;
  description: string;
  path: string;
  userActions?: UserAction[];
  links?: LinkInfo[];
  screenshot?: string;
  children?: ReactNode;
  tags?: string[];
  notes?: string[];
}

export default function FeatureDoc({
  title,
  description,
  path,
  userActions = [],
  links = [],
  screenshot,
  children,
  tags = [],
  notes = []
}: FeatureDocProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-12"
    >
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        
        <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md">
          <Code className="mr-2 h-4 w-4" />
          <span className="font-mono">Path: {path}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-10">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">User Actions</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Flows</TabsTrigger>
          {screenshot && <TabsTrigger value="visuals">Screenshots</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              {children}
              
              {notes.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-md font-semibold">Important Notes</h3>
                  {notes.map((note, index) => (
                    <div key={index} className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <p>{note}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>User Interactions</CardTitle>
              <CardDescription>
                All possible user actions and their outcomes on this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userActions.length > 0 ? (
                <div className="space-y-4">
                  {userActions.map((action, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                      <div className="flex gap-1 items-center mb-2">
                        <Badge variant="outline" className="text-xs capitalize font-medium">
                          {action.type}
                        </Badge>
                        <span className="text-gray-500 dark:text-gray-400">→</span>
                        <span className="font-medium">{action.element}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{action.description}</p>
                      <div className="flex items-center text-sm text-primary">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        <span>Result: {action.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No user actions documented for this feature.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigation & Links</CardTitle>
              <CardDescription>
                Navigation flows and link destinations from this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              {links.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {links.map((link, index) => (
                    <Card key={index} className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Navigation className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <CardTitle className="text-sm font-medium">{link.label}</CardTitle>
                          </div>
                          {link.isExternal && (
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {link.path}
                        </div>
                      </CardContent>
                      {link.description && (
                        <CardFooter className="py-2 px-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
                          {link.description}
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No navigation links documented for this feature.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {screenshot && (
          <TabsContent value="visuals">
            <Card>
              <CardHeader>
                <CardTitle>Visual Reference</CardTitle>
                <CardDescription>
                  Screenshots and visual elements of this feature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={screenshot} 
                    alt={`Screenshot of ${title}`} 
                    className="w-full h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </motion.div>
  );
}