declare module 'html2pdf.js' {
  interface HTML2PDFOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    enableLinks?: boolean;
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      [key: string]: any;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: 'portrait' | 'landscape';
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface HTML2PDFResult {
    save: () => Promise<void>;
    toContainer: () => HTML2PDFResult;
    toCanvas: () => Promise<HTML2PDFResult>;
    toPdf: () => HTML2PDFResult;
    outputPdf: () => any;
    outputImg: () => any;
    set: (options: HTML2PDFOptions) => HTML2PDFResult;
    from: (element: HTMLElement | string) => HTML2PDFResult;
    output: (type: string, options?: any) => any;
  }

  function html2pdf(): HTML2PDFResult;
  function html2pdf(element: HTMLElement | string, options?: HTML2PDFOptions): HTML2PDFResult;

  export = html2pdf;
}