import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checked-material-team',
  standalone: true,
  imports: [],
  templateUrl: './checked-material-team.component.html',
  styleUrl: './checked-material-team.component.scss'
})
export class CheckedMaterialTeamModalComponent {
  constructor(public activeModal: NgbActiveModal){}
}
