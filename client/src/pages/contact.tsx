import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2 
} from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Have questions or feedback about QuizGenius? We'd love to hear from you! 
          Fill out the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Our team is here to help you with any questions or concerns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-primary-500 mt-1" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  support@quizgenius.com
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  info@quizgenius.com
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-primary-500 mt-1" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-primary-500 mt-1" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  123 Quiz Lane<br />
                  San Francisco, CA 94103<br />
                  United States
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Clock className="h-6 w-6 text-primary-500 mt-1" />
              <div>
                <h3 className="font-medium">Hours</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monday - Friday: 9AM - 5PM PST<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll respond as soon as possible.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting || submitSuccess}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    disabled={isSubmitting || submitSuccess}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  required
                  disabled={isSubmitting || submitSuccess}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your question or issue in detail..."
                  rows={6}
                  required
                  disabled={isSubmitting || submitSuccess}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || submitSuccess}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              question: "How do I create my first quiz?",
              answer: "To create your first quiz, log in to your account, navigate to the 'Create Quiz' page, and follow the step-by-step instructions."
            },
            {
              question: "Can I share my quizzes with others?",
              answer: "Yes! After creating a quiz, you can share it via a unique link or embed it on your website."
            },
            {
              question: "Is QuizGenius free to use?",
              answer: "QuizGenius offers both free and premium plans. The free plan allows you to create basic quizzes, while premium plans offer advanced features."
            },
            {
              question: "How do I reset my password?",
              answer: "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email."
            }
          ].map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-900/50 py-4">
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-500 dark:text-gray-400">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}