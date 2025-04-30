import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

// Define interfaces for quiz result data
interface QuizResultData {
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: string;
  questions: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    codeSnippet?: string;
  }>;
}

/**
 * Creates a professional PDF report for quiz results
 * @param element The DOM element with result data
 * @param filename The filename for the PDF (without extension)
 */
export async function downloadPDF(element: HTMLElement, filename: string): Promise<void> {
  // Extract quiz data from the DOM element
  const quizData = extractQuizDataFromDOM(element);
  
  // Generate a professional PDF
  const pdf = generateProfessionalPDF(quizData);
  
  // Download the PDF
  pdf.save(`${filename}.pdf`);
}

/**
 * Extracts quiz result data from the DOM element
 */
function extractQuizDataFromDOM(element: HTMLElement): QuizResultData {
  // Title
  const titleElement = element.querySelector('.text-xl') as HTMLElement;
  const quizTitle = (titleElement?.textContent || '').replace('Quiz Results: ', '');
  
  // Score
  const scoreElement = element.querySelector('.text-4xl') as HTMLElement;
  const score = parseInt((scoreElement?.textContent || '0%').replace('%', ''));
  
  // Questions data
  const questionsData = Array.from(element.querySelectorAll('.space-y-4 > .border')).map((card, index) => {
    const questionText = (card.querySelector('.text-sm.font-medium')?.textContent || '')
                         .replace(`Question ${index + 1}: `, '');
    const isCorrect = card.querySelector('.h-4.w-4.text-green-600') !== null;
    const userAnswer = card.querySelector('.pl-9 .text-sm')?.textContent || '';
    const correctAnswer = isCorrect 
      ? userAnswer 
      : card.querySelector('.text-sm.text-green-600')?.textContent || '';
      
    const codeSnippet = card.querySelector('pre')?.textContent || undefined;
    
    return {
      id: index + 1,
      text: questionText,
      isCorrect,
      userAnswer,
      correctAnswer,
      codeSnippet
    };
  });
  
  // Additional data
  const correctAnswersText = element.querySelector('.mt-2.text-gray-500')?.textContent || '';
  const correctAnswers = parseInt(correctAnswersText.match(/(\d+)\s+out\s+of/)?.[1] || '0');
  const totalQuestions = parseInt(correctAnswersText.match(/out\s+of\s+(\d+)/)?.[1] || '0');
  const timeTaken = (element.querySelector('.text-sm.text-gray-500')?.textContent || '')
                   .replace('Time taken: ', '');
  
  return {
    quizTitle,
    score,
    totalQuestions,
    correctAnswers,
    timeTaken,
    questions: questionsData
  };
}

/**
 * Generates a professional PDF report from quiz data
 */
function generateProfessionalPDF(data: QuizResultData) {
  // Initialize PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Define colors - accessible for both print and screen
  const primaryColor = [26, 115, 232]; // Dark blue
  const secondaryColor = [66, 133, 244]; // Light blue
  const successColor = [52, 168, 83]; // Green
  const errorColor = [217, 48, 37]; // Red
  const grayColor = [117, 117, 117]; // Gray
  
  // Add custom fonts if needed
  // pdf.addFont('fonts/your-font.ttf', 'CustomFont', 'normal');
  
  // Helper functions for consistent formatting
  const addHeading = (text: string, y: number, size = 18, color = primaryColor) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(size);
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.text(text, 20, y);
  };
  
  const addText = (text: string, y: number, size = 12, color = [0, 0, 0]) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(size);
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.text(text, 20, y);
  };
  
  const getMessageForScore = (score: number) => {
    if (score >= 90) return "Excellent! You've mastered this topic!";
    if (score >= 70) return "Great job! You have a solid understanding.";
    if (score >= 50) return "Good effort! Keep studying to improve.";
    return "You might need more practice with this topic.";
  };
  
  // Add logo or branding (using a placeholder circle)
  pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.circle(20, 20, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Q', 17, 23);
  
  // Add company/app name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('QuizGenius', 30, 20);
  
  // Add tagline
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  pdf.text('Professional Quiz Assessment Report', 30, 25);
  
  // Add report date
  pdf.setFontSize(10);
  pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 150, 25);
  
  // Add separator line
  pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(20, 30, 190, 30);
  
  // Quiz title
  addHeading(`Quiz Results: ${data.quizTitle}`, 45);
  
  // Score section with visual indicator
  pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 0.1);
  pdf.roundedRect(20, 55, 170, 40, 3, 3, 'F');
  
  // Score circle
  pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 0.9);
  pdf.circle(45, 75, 15, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`${data.score}%`, 38, 80);
  
  // Score message
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text(getMessageForScore(data.score), 70, 70);
  
  // Score details
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  pdf.text(`You answered ${data.correctAnswers} out of ${data.totalQuestions} questions correctly`, 70, 80);
  pdf.text(`Time taken: ${data.timeTaken}`, 70, 90);
  
  // Performance overview title
  addHeading('Performance Overview', 115, 16);
  
  // Performance summary
  pdf.setFillColor(successColor[0], successColor[1], successColor[2], 0.1);
  pdf.roundedRect(20, 125, 75, 30, 3, 3, 'F');
  
  pdf.setFillColor(errorColor[0], errorColor[1], errorColor[2], 0.1);
  pdf.roundedRect(105, 125, 75, 30, 3, 3, 'F');
  
  // Correct answers
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
  pdf.text('Correct Answers', 30, 135);
  pdf.setFontSize(20);
  pdf.text(data.correctAnswers.toString(), 55, 145);
  
  // Incorrect answers
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(errorColor[0], errorColor[1], errorColor[2]);
  pdf.text('Incorrect Answers', 115, 135);
  pdf.setFontSize(20);
  pdf.text((data.totalQuestions - data.correctAnswers).toString(), 142, 145);
  
  // Progress bar
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(230, 230, 230);
  pdf.roundedRect(20, 165, 170, 5, 2, 2, 'F');
  
  pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const progressWidth = Math.min(170 * (data.score / 100), 170);
  pdf.roundedRect(20, 165, progressWidth, 5, 2, 2, 'F');
  
  // Question review title
  addHeading('Question Review', 185, 16);
  
  // Create question review table using jspdf-autotable
  const tableData = data.questions.map((q, idx) => [
    (idx + 1).toString(),
    q.text,
    q.isCorrect ? '✓' : '✗',
    q.userAnswer,
    !q.isCorrect ? q.correctAnswer : ''
  ]);
  
  (pdf as any).autoTable({
    startY: 195,
    head: [['#', 'Question', 'Result', 'Your Answer', 'Correct Answer']],
    body: tableData,
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 45 },
      4: { cellWidth: 40 }
    },
    didDrawCell: (data: any) => {
      // Add custom styling for result column
      if (data.section === 'body' && data.column.index === 2) {
        const cell = data.cell;
        const result = data.cell.raw;
        
        if (result === '✓') {
          pdf.setFillColor(successColor[0], successColor[1], successColor[2], 0.2);
          pdf.roundedRect(cell.x + 2, cell.y + 2, cell.width - 4, cell.height - 4, 2, 2, 'F');
        } else if (result === '✗') {
          pdf.setFillColor(errorColor[0], errorColor[1], errorColor[2], 0.2);
          pdf.roundedRect(cell.x + 2, cell.y + 2, cell.width - 4, cell.height - 4, 2, 2, 'F');
        }
      }
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 5,
      fontSize: 10
    },
    margin: { top: 190, right: 20, bottom: 20, left: 20 }
  });
  
  // Add code snippets section if there are any
  const questionsWithCode = data.questions.filter(q => q.codeSnippet);
  if (questionsWithCode.length > 0) {
    // Add a new page for code snippets
    pdf.addPage();
    
    addHeading('Code Snippets', 30, 16);
    addText('The following questions included code snippets:', 40, 12);
    
    let yPosition = 50;
    
    questionsWithCode.forEach((q, idx) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.setFillColor(245, 247, 250);
      pdf.roundedRect(20, yPosition, 170, 40, 3, 3, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(`Question ${q.id}: ${q.text}`, 25, yPosition + 10);
      
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      
      // Split code snippet into lines to handle long code samples
      const codeLines = q.codeSnippet?.split('\n') || [];
      codeLines.forEach((line, lineIdx) => {
        if (lineIdx < 10) { // Limit to 10 lines for space
          pdf.text(line, 25, yPosition + 20 + (lineIdx * 3.5));
        }
      });
      
      yPosition += 45;
    });
  }
  
  // Add footer with pagination
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    pdf.text(`Page ${i} of ${totalPages}`, 20, 287);
    pdf.text('© QuizGenius', 100, 287);
    
    // Add timestamp
    const timestamp = new Date().toLocaleString();
    pdf.text(timestamp, 170, 287);
  }
  
  return pdf;
}

/**
 * Generates a base64 string of the professional PDF
 * @param element The DOM element with result data
 * @returns Promise that resolves to a base64 string of the PDF
 */
export async function generatePDFBase64(element: HTMLElement): Promise<string> {
  // Extract quiz data
  const quizData = extractQuizDataFromDOM(element);
  
  // Generate PDF
  const pdf = generateProfessionalPDF(quizData);
  
  // Return as base64
  return pdf.output('datauristring').split(',')[1];
}