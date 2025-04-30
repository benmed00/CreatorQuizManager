import { Link } from "wouter";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex items-center mb-6">
        <Link href="/home">
          <Button variant="ghost" className="mr-2 p-0 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Terms of Service for QuizGenius</CardTitle>
          </div>
          <CardDescription>Last Updated: April 30, 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to QuizGenius. By accessing or using our website, mobile applications, or any other services we offer (collectively, the "Services"), you agree to be bound by these Terms of Service. Please read these terms carefully before using our Services.
            </p>
            <p>
              By using QuizGenius, you represent that you are at least 13 years of age, or that you are a legal adult in your jurisdiction and that you have the authority to enter into these Terms of Service. If you're agreeing to these Terms on behalf of an organization or entity, you represent and warrant that you are authorized to agree to these Terms on their behalf.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Account Registration and Security</h2>
            <p>
              To access certain features of our Services, you may need to create an account. When you register, you agree to provide accurate, current, and complete information about yourself. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p>
              You must immediately notify QuizGenius of any unauthorized use of your account or any other breach of security. QuizGenius will not be liable for any loss or damage arising from your failure to protect your account credentials.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">3. User Content</h2>
            <p>
              Our Services allow you to create, upload, store, and share content, including text, images, and other materials ("User Content"). You retain ownership of any intellectual property rights you hold in that User Content.
            </p>
            <p>
              By submitting User Content, you grant QuizGenius a worldwide, non-exclusive, royalty-free license to use, copy, modify, create derivative works based on, distribute, publicly display, and perform your User Content in connection with operating and providing the Services.
            </p>
            <p>
              You are solely responsible for your User Content and the consequences of posting or publishing it. QuizGenius has no obligation to monitor or review User Content, but we reserve the right to remove any User Content at our sole discretion.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">4. Prohibited Uses</h2>
            <p>
              You agree not to use the Services to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe the intellectual property rights of others</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Interfere with or disrupt the Services or servers or networks</li>
              <li>Attempt to gain unauthorized access to any part of the Services</li>
              <li>Use the Services for any illegal or unauthorized purpose</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property Rights</h2>
            <p>
              The Services and their original content, features, and functionality are and will remain the exclusive property of QuizGenius and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of QuizGenius.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <p>
              The Services are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              QuizGenius does not warrant that the Services will be uninterrupted or error-free, that defects will be corrected, or that the Services or the server that makes it available are free of viruses or other harmful components.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              In no event shall QuizGenius, its officers, directors, employees, or agents, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the Services</li>
              <li>Any conduct or content of any third party on the Services</li>
              <li>Any content obtained from the Services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">9. Changes to Terms of Service</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-medium">
              support@quizgenius.com
            </p>
          </section>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8">
        <Link href="/privacy">
          <Button variant="outline" className="mx-2">
            Privacy Policy
          </Button>
        </Link>
        <Link href="/home">
          <Button variant="outline" className="mx-2">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}