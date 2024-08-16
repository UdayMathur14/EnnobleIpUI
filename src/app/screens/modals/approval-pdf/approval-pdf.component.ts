import { Component } from '@angular/core';
import { PdfService } from '../../../core/service/pdf.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approval-pdf',
  templateUrl: './approval-pdf.component.html',
  styleUrl: './approval-pdf.component.scss'
})
export class ApprovalPdfComponent {

  constructor( private pdfService: PdfService, private activeModal: NgbActiveModal){}

  downloadPDF() {
    const data = document.getElementById('approval-content') as HTMLElement;
    this.pdfService.generatePdf(data, 'approval');
    this.onClose();
  }

  onClose(){
    this.activeModal.close();
  }
}
