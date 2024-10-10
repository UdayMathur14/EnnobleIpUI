import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-status-confirmation',
  templateUrl: './status-confirmation.component.html',
  styleUrl: './status-confirmation.component.scss'
})
export class StatusConfirmationComponent {

  constructor(public activeModal: NgbActiveModal){

  }

  onPressSubmit(){
    this.activeModal.close(); 
  }

}
