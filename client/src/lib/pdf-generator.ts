import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Generates a PDF from a DOM element
 * @param element The DOM element to generate a PDF from
 * @param fileName The name of the PDF file (without extension)
 * @returns Promise resolving to the PDF as a Blob
 */
export async function generatePDF(element: HTMLElement, fileName: string = 'download'): Promise<Blob> {
  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true, // Allow loading cross-origin images
      allowTaint: false,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#1e1e1e' : '#ffffff',
    });

    // Calculate optimal PDF dimensions
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm (210mm × 297mm)
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add subsequent pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Return PDF as blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

/**
 * Downloads a PDF from a DOM element
 * @param element The DOM element to generate a PDF from
 * @param fileName The name of the PDF file (without extension)
 */
export async function downloadPDF(element: HTMLElement, fileName: string = 'download'): Promise<void> {
  try {
    const pdfBlob = await generatePDF(element, fileName);
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
}