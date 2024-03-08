import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bilti-process-details-modal',
  templateUrl: './bilti-process-details.component.html',
  styleUrl: './bilti-process-details.component.scss'
})
export class BiltiProcessDetailsModalComponent {
  constructor(public activeModal: NgbActiveModal){}

}
