import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Generates a PDF from a DOM element and downloads it
 * @param element The DOM element to capture
 * @param filename The filename for the PDF (without extension)
 */
export async function downloadPDF(element: HTMLElement, filename: string): Promise<void> {
  // Capture the element as a canvas
  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    logging: false,
    useCORS: true,
    allowTaint: false,
    backgroundColor: document.documentElement.classList.contains('dark') ? '#1e1e1e' : '#ffffff',
  });
  
  // Calculate the appropriate dimensions for the PDF
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  let position = 0;
  
  // If the content is longer than a single page, create multiple pages
  if (imgHeight > 297) { // 297mm is A4 height
    let heightLeft = imgHeight;
    let pageHeight = 297;
    
    while (heightLeft > 0) {
      const renderedHeight = Math.min(pageHeight, heightLeft);
      
      // Add image to the PDF
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        renderedHeight,
        undefined,
        'FAST'
      );
      
      heightLeft -= pageHeight;
      position -= pageHeight;
      
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }
  } else {
    // Content fits on a single page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  }
  
  // Download the PDF
  pdf.save(`${filename}.pdf`);
}

/**
 * Generates a base64 string of the PDF from a DOM element
 * @param element The DOM element to capture
 * @returns Promise that resolves to a base64 string of the PDF
 */
export async function generatePDFBase64(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
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
  return pdf.output('datauristring').split(',')[1];
}