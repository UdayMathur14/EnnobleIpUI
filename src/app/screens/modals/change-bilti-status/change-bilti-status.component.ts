import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-bilti-status',
  standalone: true,
  imports: [],
  templateUrl: './change-bilti-status.component.html',
  styleUrl: './change-bilti-status.component.scss'
})
export class ChangeBiltiStatusModalComponent {
  constructor(public activeModal: NgbActiveModal){}
}
