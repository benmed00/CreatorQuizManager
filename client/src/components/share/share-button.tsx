import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share } from "lucide-react";
import SocialShare from "./social-share";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  buttonText?: string;
  iconOnly?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function ShareButton({
  title,
  description = "",
  url = "",
  hashtags = ["QuizGenius"],
  buttonText = "Share",
  iconOnly = false,
  variant = "default",
  size = "default",
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate a shareable URL if none is provided
  const shareableUrl = url || window.location.href;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share className={`h-4 w-4 ${!iconOnly ? "mr-2" : ""}`} />
          {!iconOnly && buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Share this {title.toLowerCase()} with your friends and colleagues.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
            <p className="text-sm">{title}</p>
          </div>
          {description && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-sm line-clamp-3">{description}</p>
            </div>
          )}
          <div className="border-t pt-4 mt-4">
            <SocialShare
              url={shareableUrl}
              title={title}
              description={description}
              hashtags={hashtags}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}