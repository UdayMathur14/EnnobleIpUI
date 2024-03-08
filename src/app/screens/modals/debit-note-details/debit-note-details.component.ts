import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-debit-note-details-modal',
  templateUrl: './debit-note-details.component.html',
  styleUrl: './debit-note-details.component.scss'
})
export class DebitNoteDetailsModalComponent {
  constructor(public activeModal: NgbActiveModal){}

}
