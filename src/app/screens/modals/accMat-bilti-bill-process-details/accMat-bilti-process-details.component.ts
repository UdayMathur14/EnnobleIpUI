import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accMat-bilti-process-details-modal',
  templateUrl: './accMat-bilti-process-details.component.html',
  styleUrl: './accMat-bilti-process-details.component.scss'
})
export class AccountMaterialBiltiProcessDetailsModalComponent {
  constructor(public activeModal: NgbActiveModal){}

}
