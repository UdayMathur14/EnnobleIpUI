import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../../core/service/pdf.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteModelComponent {

  @Input() dispatch: any = [];
  parts: any = [];
  loadSpinner: boolean = false;

  constructor(public activeModal: NgbActiveModal, private pdfService: PdfService){}

  ngOnInit(){
    this.getActiveParts();
    console.log(this.dispatch);
    
  }

  downloadPDF() {
    this.loadSpinner =true;
    const downloadButton = document.getElementById('download-button');
    const closeButton = document.getElementById('icon-button');
  
    if (downloadButton) {
      downloadButton.style.display = 'none';
    }
    if (closeButton) {
      closeButton.style.display = 'none';
    }
    const data = document.getElementById('dispatch-note-content');

    if (!data) {
      return;
    }

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
  
      pdf.save('dispatch-note');
      this.onClose();
    })
  }

  getActiveParts(){
    this.parts = this.dispatch.dispatchNotePartItems.filter((item: any)=>{
      return item?.status === "Active"
  })
  }

  onClose(){
    this.activeModal.close();
    this.loadSpinner = false;
  }

  getDateTime(creationDate: string): string {
    const dateObj = new Date(creationDate);
    dateObj.setMinutes(dateObj.getMinutes() + 30);
    return dateObj.toISOString();
  }
}
