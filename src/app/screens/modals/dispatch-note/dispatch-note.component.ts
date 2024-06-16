import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../../core/service/pdf.service';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteModelComponent {

  @Input() dispatch: any;

  constructor(public activeModal: NgbActiveModal, private pdfService: PdfService){}

  ngOnInit(){

  }

  downloadPDF() {
    const data = document.getElementById('dispatch-note-content') as HTMLElement;
    this.pdfService.generatePdf(data, 'dispatch-note');
    this.onClose();
  }

  onClose(){
    this.activeModal.close();
  }
}
