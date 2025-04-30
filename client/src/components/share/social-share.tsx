import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Link as LinkIcon, 
  Copy 
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  compact?: boolean;
  showCopyLink?: boolean;
}

export default function SocialShare({
  url,
  title,
  description = "",
  hashtags = [],
  className = "",
  compact = false,
  showCopyLink = true,
}: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Use the current URL if none is provided
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.join(',');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Link has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };
  
  type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'email';
  
  const handleShare = (platform: SharePlatform) => {
    window.open(shareLinks[platform], '_blank');
    // Custom event that can be listened to by parent components
    const shareEvent = new CustomEvent('share-completed', { 
      detail: { platform, url: shareUrl } 
    });
    window.dispatchEvent(shareEvent);
  };

  if (compact) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare('twitter')}
                className="bg-[#1DA1F2] hover:bg-[#1a94df] text-white hover:text-white rounded-full w-8 h-8 p-1.5"
              >
                <Twitter className="h-full w-full" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Twitter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(shareLinks.facebook, '_blank')}
                className="bg-[#4267B2] hover:bg-[#385796] text-white hover:text-white rounded-full w-8 h-8 p-1.5"
              >
                <Facebook className="h-full w-full" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {showCopyLink && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full w-8 h-8 p-1.5"
                >
                  {copied ? (
                    <Copy className="h-full w-full" />
                  ) : (
                    <LinkIcon className="h-full w-full" />
                  )}
                  <span className="sr-only">Copy link</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
        Share
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          className="bg-[#1DA1F2] hover:bg-[#1a94df] text-white hover:text-white"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(shareLinks.facebook, '_blank')}
          className="bg-[#4267B2] hover:bg-[#385796] text-white hover:text-white"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(shareLinks.linkedin, '_blank')}
          className="bg-[#0077B5] hover:bg-[#006699] text-white hover:text-white"
        >
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(shareLinks.email, '_blank')}
          className="bg-gray-500 hover:bg-gray-600 text-white hover:text-white"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        {showCopyLink && (
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {copied ? (
              <Copy className="h-4 w-4 mr-2" />
            ) : (
              <LinkIcon className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        )}
      </div>
    </div>
  );
}