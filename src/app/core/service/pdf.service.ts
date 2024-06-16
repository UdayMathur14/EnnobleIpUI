import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(data: HTMLElement, filename: string) {
    const downloadButton = document.getElementById('download-button');
    const closeButton = document.getElementById('icon-button');
  
    if (downloadButton) {
      downloadButton.style.display = 'none';
    }
    if (closeButton) {
      closeButton.style.display = 'none';
    }

    const scale = 3;
    html2canvas(data, { scale: scale }).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;

      if (imgHeight > pageHeight) {
        const scale = pageHeight / imgHeight;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight * scale);
      } else {
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      }

      pdf.save(`${filename}.pdf`);

      if (downloadButton) {
        downloadButton.style.display = 'block';
      }
      if (closeButton) {
        closeButton.style.display = 'block';
      }
    });
  }
}
