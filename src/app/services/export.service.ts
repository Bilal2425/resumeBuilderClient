// Export service for printing/exporting resume to PDF
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  async exportToPdf(element: HTMLElement, fileName: string = 'resume.pdf'): Promise<void> {
    const PRINT_ID = 'resume-print-target';
    element.id = PRINT_ID;

    // Small delay to let layout update
    await new Promise<void>(resolve => setTimeout(resolve, 50));

    window.print();

    // Clean up
    element.id = '';
  }
}
