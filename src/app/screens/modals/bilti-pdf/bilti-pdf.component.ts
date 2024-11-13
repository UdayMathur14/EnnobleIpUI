import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../../core/service/pdf.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-bilti-pdf',
  templateUrl: './bilti-pdf.component.html',
  styleUrl: './bilti-pdf.component.scss'
})
export class BiltiPdfModalComponent implements OnInit {

  modalRef!: NgbModalRef;
  @Input() biltiData: any;
  loadSpinner: boolean = false;
  printingDate: string | null = null;

  constructor(private activeModal: NgbActiveModal, private pdfService: PdfService){}

  ngOnInit(): void {
console.log(this.biltiData);

  }

  downloadPDF() {
    this.loadSpinner = true;
    this.printingDate = this.formatCurrentDate();
  
    const downloadButton = document.getElementById('download-button');
    const closeButton = document.getElementById('icon-button');
  
    if (downloadButton) downloadButton.style.display = 'none';
    if (closeButton) closeButton.style.display = 'none';
  
    const data = document.getElementById('bilti-content');
    if (!data) return;
  
    const options = {
      scale: 3,
      useCORS: true,
    };
  
    html2canvas(data, options).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft >= 0) {
          pdf.addPage();
        }
      }
      pdf.setFontSize(10);
      pdf.text('Bilti Printing Date: ' + this.printingDate, 107.6, 83);
  
      pdf.save('bilti');
      this.onClose();
    });
  }

  formatCurrentDate(): string {
    const now = new Date();
const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
};

return now.toLocaleString('en-GB', options).replace(',', '');
  }

  onClose(){
    this.activeModal.close();
    this.loadSpinner = false;
  }

  getUniqueVendorNames(lineItemDetails: any[]): string {
    if (!lineItemDetails || lineItemDetails.length === 0) {
      return '';
    }

    const uniqueVendors = new Map();

    lineItemDetails.forEach(item => {
      if (item && !uniqueVendors.has(item.vendorCode)) {
        uniqueVendors.set(item.vendorCode, item.vendorName);
      }
    });

    return Array.from(uniqueVendors.values()).join(', ');
  }

  calculateTotalPointCharges(): number {
    if (this.biltiData?.lineItemDetail) {
      return this.biltiData.lineItemDetail.reduce((total: number, item: any) => {
        return total + (item.pointCharge || 0);
      }, 0);
    }
    return 0;
  }
}
