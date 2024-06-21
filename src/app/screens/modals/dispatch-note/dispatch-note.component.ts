import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../../core/service/pdf.service';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteModelComponent {

  @Input() dispatch: any = [];
  parts: any = []

  constructor(public activeModal: NgbActiveModal, private pdfService: PdfService){}

  ngOnInit(){
    this.getActiveParts();
  }

  downloadPDF() {
    const data = document.getElementById('dispatch-note-content') as HTMLElement;
    this.pdfService.generatePdf(data, 'dispatch-note');
    this.onClose();
  }

  getActiveParts(){
    this.parts = this.dispatch.dispatchNotePartItems.filter((item: any)=>{
      return item?.status === "Active"
  })
  }

  onClose(){
    this.activeModal.close();
  }
}
