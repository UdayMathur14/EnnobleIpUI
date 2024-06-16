import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bilti-pdf',
  templateUrl: './bilti-pdf.component.html',
  styleUrl: './bilti-pdf.component.scss'
})
export class BiltiPdfModalComponent implements OnInit {

  modalRef!: NgbModalRef;
  @Input() biltiData: any;

  constructor(private activeModal: NgbActiveModal){}

  ngOnInit(): void {

  }

  downloadPDF() {
    const downloadButton = document.getElementById('download-button');
    const closeButton = document.getElementById('icon-button');
    const data = document.getElementById('bilti-content') as HTMLElement;
  
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
  
      pdf.save('bilti.pdf');
  
      if (downloadButton) {
        downloadButton.style.display = 'block';
      }
      if (closeButton) {
        closeButton.style.display = 'block';
      }
      this.onClose();
    });
  }

  onClose(){
    this.activeModal.close();
  }

  
}
