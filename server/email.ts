import sgMail from '@sendgrid/mail';

/**
 * Initializes the SendGrid mail service with the API key
 */
function initializeSendGrid() {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set. Using mock email functionality.');
    return 'mock';
  }
  
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return true;
  } catch (error) {
    console.error('Failed to initialize SendGrid:', error);
    return false;
  }
}

// Initialize SendGrid when this module is imported
const isInitialized = initializeSendGrid();

/**
 * Interface for email parameters
 */
export interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

/**
 * Sends an email using SendGrid (or mock implementation if API key is not available)
 * @param params Email parameters
 * @returns Promise resolving to boolean indicating success
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (isInitialized === 'mock') {
    console.log(`[MOCK EMAIL] Would send email to ${params.to}`);
    console.log(`[MOCK EMAIL] Subject: ${params.subject}`);
    if (params.attachments && params.attachments.length > 0) {
      console.log(`[MOCK EMAIL] With ${params.attachments.length} attachment(s)`);
    }
    // Mock implementation always succeeds
    return true;
  }
  
  if (!isInitialized) {
    console.error('SendGrid not initialized. Cannot send email.');
    return false;
  }
  
  try {
    const msg = {
      to: params.to,
      from: 'noreply@quizgenius.com', // This should be a verified sender in SendGrid
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
      attachments: params.attachments,
    };
    
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Sends a quiz result via email
 * @param to Recipient email address
 * @param userName User's name
 * @param quizTitle Quiz title
 * @param score Score in percentage
 * @param pdfContent Base64 encoded PDF content
 * @returns Promise resolving to boolean indicating success
 */
export async function sendQuizResult(
  to: string, 
  userName: string, 
  quizTitle: string, 
  score: number,
  pdfContent: string
): Promise<boolean> {
  const subject = `Your Quiz Results: ${quizTitle}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366f1; text-align: center; padding: 20px 0;">QuizGenius</h1>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #111827;">Hello ${userName},</h2>
        <p style="color: #4b5563; line-height: 1.5;">
          Thank you for completing the quiz <strong>${quizTitle}</strong>. 
          Your results are attached to this email.
        </p>
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h3 style="color: #111827; margin-top: 0;">Quiz Summary:</h3>
          <ul style="color: #4b5563; line-height: 1.6;">
            <li>Quiz: <strong>${quizTitle}</strong></li>
            <li>Your Score: <strong>${score}%</strong></li>
            <li>Date: <strong>${new Date().toLocaleDateString()}</strong></li>
          </ul>
        </div>
        <p style="color: #4b5563; line-height: 1.5;">
          You can view your complete results in the attached PDF document. 
          For a more detailed analysis, please visit your QuizGenius dashboard.
        </p>
      </div>
      <div style="text-align: center; padding: 20px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
        <p>QuizGenius - Smart Quiz Generation Platform</p>
        <p>© ${new Date().getFullYear()} QuizGenius. All rights reserved.</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to,
    subject,
    html,
    attachments: [
      {
        content: pdfContent,
        filename: `${quizTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.pdf`,
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  });
}