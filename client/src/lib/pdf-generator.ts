import { jsPDF } from 'jspdf';

/**
 * Creates a professional PDF report for quiz results
 * @param element The DOM element with result data
 * @param filename The filename for the PDF (without extension)
 */
export async function downloadPDF(element: HTMLElement, filename: string): Promise<void> {
  try {
    // Extract the quiz title and result data
    const titleElement = element.querySelector('.text-xl') as HTMLElement;
    const quizTitle = titleElement?.textContent?.replace('Quiz Results: ', '') || 'Quiz Results';
    
    // Get score
    const scoreElement = element.querySelector('.text-4xl') as HTMLElement;
    const score = scoreElement?.textContent || '0%';
    
    // Get additional data
    const scoreMessageElement = element.querySelector('.text-xl.font-semibold') as HTMLElement;
    const scoreMessage = scoreMessageElement?.textContent || '';
    
    const correctAnswersElement = element.querySelector('.mt-2.text-gray-500') as HTMLElement;
    const correctAnswersText = correctAnswersElement?.textContent || '';
    
    const timeTakenElement = element.querySelector('.text-sm.text-gray-500') as HTMLElement;
    const timeTaken = timeTakenElement?.textContent?.replace('Time taken: ', '') || '';
    
    // Create PDF with professional formatting
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Colors
    const primaryColor = [26, 115, 232]; // blue
    const successColor = [52, 168, 83]; // green
    const errorColor = [217, 48, 37]; // red
    
    // Header
    pdf.setFillColor(26, 115, 232);
    pdf.rect(0, 0, 210, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('QuizGenius', 20, 15);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text('Professional Assessment Report', 20, 22);
    
    pdf.setFontSize(10);
    pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 150, 15);
    
    // Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(`Quiz Results: ${quizTitle}`, 20, 45);
    
    // Score section
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(20, 55, 170, 40, 3, 3, 'F');
    
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.circle(45, 75, 15, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(score, 39, 77);
    
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(14);
    pdf.text(scoreMessage, 70, 70);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(correctAnswersText, 70, 80);
    pdf.text(`Time taken: ${timeTaken}`, 70, 90);
    
    // Performance section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Performance Overview', 20, 115);
    
    // Collect questions
    const questions = Array.from(element.querySelectorAll('.space-y-4 > .border')).map((card, index) => {
      const questionText = (card.querySelector('.text-sm.font-medium')?.textContent || '')
        .replace(`Question ${index + 1}: `, '');
      const isCorrect = card.querySelector('.h-4.w-4.text-green-600') !== null;
      const userAnswer = card.querySelector('.pl-9 .text-sm')?.textContent || '';
      const correctAnswer = isCorrect 
        ? userAnswer 
        : card.querySelector('.text-sm.text-green-600')?.textContent || '';
      
      return { 
        number: index + 1,
        text: questionText,
        isCorrect,
        userAnswer,
        correctAnswer
      };
    });
    
    // Draw question summary
    const correctCount = questions.filter(q => q.isCorrect).length;
    const incorrectCount = questions.length - correctCount;
    
    pdf.setFillColor(successColor[0], successColor[1], successColor[2], 0.1);
    pdf.roundedRect(20, 125, 75, 30, 3, 3, 'F');
    
    pdf.setFillColor(errorColor[0], errorColor[1], errorColor[2], 0.1);
    pdf.roundedRect(105, 125, 75, 30, 3, 3, 'F');
    
    pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Correct Answers', 30, 135);
    pdf.setFontSize(18);
    pdf.text(correctCount.toString(), 55, 145);
    
    pdf.setTextColor(errorColor[0], errorColor[1], errorColor[2]);
    pdf.setFontSize(12);
    pdf.text('Incorrect Answers', 115, 135);
    pdf.setFontSize(18);
    pdf.text(incorrectCount.toString(), 145, 145);
    
    // Progress bar
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(230, 230, 230);
    pdf.roundedRect(20, 165, 170, 5, 2, 2, 'F');
    
    const percentage = parseInt(score.replace('%', ''));
    const progressWidth = Math.min(170 * (percentage / 100), 170);
    
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(20, 165, progressWidth, 5, 2, 2, 'F');
    
    // Questions section
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Question Review', 20, 185);
    
    let y = 195;
    questions.forEach((q, index) => {
      // Check if we need a new page
      if (y > 260) {
        pdf.addPage();
        y = 30;
      }
      
      // Question box
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(20, y, 170, 24, 2, 2, 'F');
      
      // Question number & text
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`Q${q.number}:`, 25, y + 7);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(q.text, 40, y + 7);
      
      // Question result
      if (q.isCorrect) {
        pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
        pdf.text('✓ Correct', 25, y + 15);
      } else {
        pdf.setTextColor(errorColor[0], errorColor[1], errorColor[2]);
        pdf.text('✗ Incorrect', 25, y + 15);
      }
      
      // User answer
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text(`Your answer: ${q.userAnswer}`, 25, y + 20);
      
      // If incorrect, show correct answer
      if (!q.isCorrect) {
        pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
        pdf.text(`Correct answer: ${q.correctAnswer}`, 120, y + 20);
      }
      
      y += 30;
    });
    
    // Add footer with pagination
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${i} of ${totalPages}`, 20, 287);
      pdf.text('© QuizGenius', 100, 287);
      pdf.text(new Date().toLocaleString(), 160, 287);
    }
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Generates a base64 string of the professional PDF
 * @param element The DOM element with result data
 * @returns Promise that resolves to a base64 string of the PDF
 */
export async function generatePDFBase64(element: HTMLElement): Promise<string> {
  try {
    // Extract the quiz title and result data
    const titleElement = element.querySelector('.text-xl') as HTMLElement;
    const quizTitle = titleElement?.textContent?.replace('Quiz Results: ', '') || 'Quiz Results';
    
    // Get score
    const scoreElement = element.querySelector('.text-4xl') as HTMLElement;
    const score = scoreElement?.textContent || '0%';
    
    // Get additional data
    const scoreMessageElement = element.querySelector('.text-xl.font-semibold') as HTMLElement;
    const scoreMessage = scoreMessageElement?.textContent || '';
    
    const correctAnswersElement = element.querySelector('.mt-2.text-gray-500') as HTMLElement;
    const correctAnswersText = correctAnswersElement?.textContent || '';
    
    const timeTakenElement = element.querySelector('.text-sm.text-gray-500') as HTMLElement;
    const timeTaken = timeTakenElement?.textContent?.replace('Time taken: ', '') || '';
    
    // Create PDF with professional formatting
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Colors
    const primaryColor = [26, 115, 232]; // blue
    const successColor = [52, 168, 83]; // green
    const errorColor = [217, 48, 37]; // red
    
    // Header
    pdf.setFillColor(26, 115, 232);
    pdf.rect(0, 0, 210, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('QuizGenius', 20, 15);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text('Professional Assessment Report', 20, 22);
    
    pdf.setFontSize(10);
    pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 150, 15);
    
    // Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(`Quiz Results: ${quizTitle}`, 20, 45);
    
    // Score section
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(20, 55, 170, 40, 3, 3, 'F');
    
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.circle(45, 75, 15, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(score, 39, 77);
    
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(14);
    pdf.text(scoreMessage, 70, 70);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(correctAnswersText, 70, 80);
    pdf.text(`Time taken: ${timeTaken}`, 70, 90);
    
    // Performance section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Performance Overview', 20, 115);
    
    // Collect questions
    const questions = Array.from(element.querySelectorAll('.space-y-4 > .border')).map((card, index) => {
      const questionText = (card.querySelector('.text-sm.font-medium')?.textContent || '')
        .replace(`Question ${index + 1}: `, '');
      const isCorrect = card.querySelector('.h-4.w-4.text-green-600') !== null;
      const userAnswer = card.querySelector('.pl-9 .text-sm')?.textContent || '';
      const correctAnswer = isCorrect 
        ? userAnswer 
        : card.querySelector('.text-sm.text-green-600')?.textContent || '';
      
      return { 
        number: index + 1,
        text: questionText,
        isCorrect,
        userAnswer,
        correctAnswer
      };
    });
    
    // Draw question summary
    const correctCount = questions.filter(q => q.isCorrect).length;
    const incorrectCount = questions.length - correctCount;
    
    pdf.setFillColor(successColor[0], successColor[1], successColor[2], 0.1);
    pdf.roundedRect(20, 125, 75, 30, 3, 3, 'F');
    
    pdf.setFillColor(errorColor[0], errorColor[1], errorColor[2], 0.1);
    pdf.roundedRect(105, 125, 75, 30, 3, 3, 'F');
    
    pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Correct Answers', 30, 135);
    pdf.setFontSize(18);
    pdf.text(correctCount.toString(), 55, 145);
    
    pdf.setTextColor(errorColor[0], errorColor[1], errorColor[2]);
    pdf.setFontSize(12);
    pdf.text('Incorrect Answers', 115, 135);
    pdf.setFontSize(18);
    pdf.text(incorrectCount.toString(), 145, 145);
    
    // Progress bar
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(230, 230, 230);
    pdf.roundedRect(20, 165, 170, 5, 2, 2, 'F');
    
    const percentage = parseInt(score.replace('%', ''));
    const progressWidth = Math.min(170 * (percentage / 100), 170);
    
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(20, 165, progressWidth, 5, 2, 2, 'F');
    
    // Questions section
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Question Review', 20, 185);
    
    let y = 195;
    questions.forEach((q, index) => {
      // Check if we need a new page
      if (y > 260) {
        pdf.addPage();
        y = 30;
      }
      
      // Question box
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(20, y, 170, 24, 2, 2, 'F');
      
      // Question number & text
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`Q${q.number}:`, 25, y + 7);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(q.text, 40, y + 7);
      
      // Question result
      if (q.isCorrect) {
        pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
        pdf.text('✓ Correct', 25, y + 15);
      } else {
        pdf.setTextColor(errorColor[0], errorColor[1], errorColor[2]);
        pdf.text('✗ Incorrect', 25, y + 15);
      }
      
      // User answer
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text(`Your answer: ${q.userAnswer}`, 25, y + 20);
      
      // If incorrect, show correct answer
      if (!q.isCorrect) {
        pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
        pdf.text(`Correct answer: ${q.correctAnswer}`, 120, y + 20);
      }
      
      y += 30;
    });
    
    // Add footer with pagination
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${i} of ${totalPages}`, 20, 287);
      pdf.text('© QuizGenius', 100, 287);
      pdf.text(new Date().toLocaleString(), 160, 287);
    }
    
    // Return as base64 string
    return pdf.output('datauristring').split(',')[1];
  } catch (error) {
    console.error('Error generating PDF base64:', error);
    throw error;
  }
}