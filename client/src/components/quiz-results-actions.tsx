import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { downloadPDF } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/auth-store';
import { Download, Mail, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface QuizResultsActionsProps {
  resultId: number;
  quizTitle: string;
  resultRef: React.RefObject<HTMLDivElement>;
}

export default function QuizResultsActions({ resultId, quizTitle, resultRef }: QuizResultsActionsProps) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useStore();
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      if (!resultRef.current) {
        throw new Error('Result content not found');
      }
      
      toast({
        title: "Generating PDF",
        description: "Preparing your quiz results...",
      });
      
      await downloadPDF(resultRef.current, `${quizTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results`);
      
      toast({
        title: "Download Complete",
        description: "Your quiz results have been downloaded as a PDF",
      });
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailResults = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSending(true);
      
      if (!resultRef.current) {
        throw new Error('Result content not found');
      }
      
      // Generate PDF and convert to base64
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1e1e1e' : '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      
      // Send to server
      const response = await fetch(`/api/results/${resultId}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userName: user?.displayName || user?.username || 'User',
          pdfContent: pdfBase64,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email');
      }
      
      toast({
        title: "Email Sent",
        description: `Quiz results have been sent to ${email}`,
      });
      
      setEmailOpen(false);
    } catch (error: any) {
      console.error('Error emailing results:', error);
      toast({
        title: "Email Failed",
        description: error.message || "There was an error sending your results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handleDownloadPDF}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        <span>Download PDF</span>
      </Button>
      
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>Email Results</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Quiz Results</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter your email address to receive a PDF copy of your quiz results.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEmailResults}
              disabled={isSending || !email}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}