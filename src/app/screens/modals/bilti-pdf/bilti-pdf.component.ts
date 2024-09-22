import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../../core/service/pdf.service';

@Component({
  selector: 'app-bilti-pdf',
  templateUrl: './bilti-pdf.component.html',
  styleUrl: './bilti-pdf.component.scss'
})
export class BiltiPdfModalComponent implements OnInit {

  modalRef!: NgbModalRef;
  @Input() biltiData: any;

  constructor(private activeModal: NgbActiveModal, private pdfService: PdfService){}

  ngOnInit(): void {
console.log(this.biltiData);

  }

  downloadPDF() {
    const data = document.getElementById('bilti-content') as HTMLElement;
    this.pdfService.generatePdf(data, 'bilti');
    this.onClose();
  }

  onClose(){
    this.activeModal.close();
  }

  getUniqueVendorNames(lineItemDetails: any[]): string {
    if (!lineItemDetails || lineItemDetails.length === 0) {
      return '';
    }

    const uniqueVendors = new Map();

    lineItemDetails.forEach(item => {
      if (item.vendor && !uniqueVendors.has(item.vendor.vendorCode)) {
        uniqueVendors.set(item.vendor.vendorCode, item.vendor.vendorName);
      }
    });

    return Array.from(uniqueVendors.values()).join(', ');
  }
  
  
}
