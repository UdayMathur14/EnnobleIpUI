import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approval-material-head',
  standalone: true,
  imports: [],
  templateUrl: './approval-material-head.component.html',
  styleUrl: './approval-material-head.component.scss'
})
export class ApprovalMaterialHeadModalComponent {
  constructor(public activeModal: NgbActiveModal){}
}
