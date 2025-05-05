import { useState } from "react";
import { Check, Copy, Terminal, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Code Copied!",
          description: "Code snippet copied to clipboard",
        });
        
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };
  
  // Function to get the icon based on language
  const getLanguageIcon = () => {
    switch (language.toLowerCase()) {
      case "bash":
      case "shell":
      case "sh":
        return <Terminal className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };
  
  // Function to get styles based on language
  const getLanguageClass = () => {
    switch (language.toLowerCase()) {
      case "bash":
      case "shell":
      case "sh":
        return "bg-gray-900 text-gray-100";
      case "js":
      case "javascript":
      case "typescript":
      case "ts":
        return "bg-blue-950 text-blue-100";
      case "html":
      case "xml":
        return "bg-orange-950 text-orange-100";
      case "css":
      case "scss":
        return "bg-pink-950 text-pink-100";
      default:
        return "bg-gray-900 text-gray-100";
    }
  };
  
  return (
    <div className="relative my-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
      {/* Header with language and filename */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-medium">
        <div className="flex items-center gap-2">
          {getLanguageIcon()}
          <span className="uppercase">{language}</span>
          {filename && (
            <>
              <span className="text-gray-500 dark:text-gray-400">&middot;</span>
              <span className="font-mono">{filename}</span>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      
      {/* Code content */}
      <div className={`overflow-x-auto font-mono text-sm ${getLanguageClass()}`}>
        <pre className="p-4">
          {showLineNumbers ? (
            <table className="border-collapse">
              <tbody>
                {code.split('\n').map((line, i) => (
                  <tr key={i} className="whitespace-pre">
                    <td className="pr-4 text-right select-none opacity-50">
                      {i + 1}
                    </td>
                    <td>{line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}