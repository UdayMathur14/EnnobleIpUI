import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delivery-note-modal',
  templateUrl: './delivery-note.component.html',
  styleUrl: './delivery-note.component.scss'
})
export class DeliveryNoteModalComponent {
  constructor(public activeModal: NgbActiveModal){}

}
