import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex items-center mb-6">
        <Link href="/home">
          <Button variant="ghost" className="mr-2 p-0 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Privacy Policy for QuizGenius</CardTitle>
          </div>
          <CardDescription>Last Updated: April 30, 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              QuizGenius ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, or any other services we offer (collectively, the "Services").
            </p>
            <p>
              By accessing or using our Services, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium mt-4 mb-2">2.1 Information You Provide to Us</h3>
            <p>
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account (such as your name, email address, and password)</li>
              <li>Complete your profile (such as your photo, job title, organization)</li>
              <li>Create and interact with quizzes (including questions, answers, results)</li>
              <li>Communicate with us (such as when you contact support)</li>
              <li>Submit feedback or participate in surveys</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4 mb-2">2.2 Information We Collect Automatically</h3>
            <p>
              When you use our Services, we automatically collect certain information about your device and how you interact with our Services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (such as your IP address, browser type, operating system)</li>
              <li>Usage data (such as pages visited, time spent on the Services)</li>
              <li>Quiz-taking patterns and performance statistics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information</li>
              <li>Create and manage your account</li>
              <li>Send administrative messages, updates, and promotional materials</li>
              <li>Monitor and analyze trends, usage, and activities connected to our Services</li>
              <li>Detect, investigate, and prevent fraudulent transactions, abuse, and other illegal activities</li>
              <li>Personalize your experience and provide content and features relevant to your interests</li>
              <li>Generate and review analytics and usage patterns to improve our Services</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">4. How We Share Your Information</h2>
            <p>
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With service providers who perform services on our behalf</li>
              <li>With other users when you share or publish information publicly on our Services</li>
              <li>In response to legal process or when required by law</li>
              <li>To protect the rights, property, and safety of our users, the public, QuizGenius, and others</li>
              <li>In connection with a merger, sale, or acquisition of all or a portion of our company</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">5. Your Choices and Rights</h2>
            <p>
              You have several choices regarding the information you provide to us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> You can update your account information by accessing your account settings.</li>
              <li><strong>Communications:</strong> You can opt out of receiving promotional communications from us by following the instructions in those communications.</li>
              <li><strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually set your browser to remove or reject cookies.</li>
            </ul>
            <p>
              Depending on where you live, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access and obtain a copy of your personal information</li>
              <li>The right to correct or update your personal information</li>
              <li>The right to delete your personal information</li>
              <li>The right to data portability</li>
              <li>The right to object to or restrict processing of your personal information</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information in the "Contact Us" section.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">6. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>
              Our Services are not intended for children under 13 years of age. We do not knowingly collect or solicit personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information as quickly as possible. If you believe a child under 13 has provided us with personal information, please contact us.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">8. International Data Transfers</h2>
            <p>
              We may transfer, store, and process your information in countries other than your own. Our servers are located in the United States. If you are accessing our Services from outside the United States, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by our service providers in other countries.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="font-medium">
              privacy@quizgenius.com
            </p>
          </section>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8">
        <Link href="/terms">
          <Button variant="outline" className="mx-2">
            Terms of Service
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